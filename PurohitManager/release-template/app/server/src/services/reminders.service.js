import { deceasedRepo } from '../repositories/deceased.repo.js';
import { clientsRepo } from '../repositories/clients.repo.js';
import { settingsRepo } from '../repositories/settings.repo.js';
import { calculateAnnualShraddhaDate, daysBetween, formatDate } from '@purohit-manager/shared';
import fs from 'fs';
import path from 'path';
import { RESOURCES_DIR } from '../config/paths.js';

let messageTemplates = {};
try {
  const file = path.resolve(RESOURCES_DIR, 'templates/messages.json');
  if (fs.existsSync(file)) {
    messageTemplates = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
} catch (e) {}

export const remindersService = {
  /**
   * Finds all upcoming annual shraddhas in the next `daysAhead` days
   * @param {number} daysAhead Default 30
   * @returns {Promise<Array>}
   */
  async getUpcomingShraddhas(daysAhead = 30) {
    const deceasedList = await deceasedRepo.getAll();
    const clients = await clientsRepo.getAll();
    const settings = await settingsRepo.get();

    const clientMap = new Map(clients.map(c => [c.id, c]));
    const place = { lat: settings.latitude, lon: settings.longitude, name: settings.cityName };

    const today = new Date();
    const targetYear = today.getFullYear();
    const upcoming = [];

    for (const d of deceasedList) {
      const client = clientMap.get(d.clientId) || { name: d.clientName || 'Yajamana', phone: '' };

      // Calculate annual date for this year
      let annual = calculateAnnualShraddhaDate(d, targetYear, place, {
        sampradaya: settings.sampradaya,
        ayanamsa: settings.ayanamsa
      });

      // If already passed this year, check next year
      if (annual.recommendedDate && daysBetween(today, new Date(annual.recommendedDate)) < 0) {
        annual = calculateAnnualShraddhaDate(d, targetYear + 1, place, {
          sampradaya: settings.sampradaya,
          ayanamsa: settings.ayanamsa
        });
      }

      if (annual.recommendedDate) {
        const daysLeft = daysBetween(today, new Date(annual.recommendedDate));
        if (daysLeft >= 0 && daysLeft <= daysAhead) {
          upcoming.push({
            deceasedId: d.id,
            deceasedName: d.name,
            relation: d.relation,
            gotra: d.gotra,
            masa: d.masa,
            tithiName: d.tithiName,
            clientId: d.clientId,
            clientName: client.name,
            clientPhone: client.phone,
            scheduledDate: annual.recommendedDate,
            daysLeft,
            details: annual.recommendedDetails,
            candidates: annual.candidates,
            explanation: annual.explanation
          });
        }
      }
    }

    // Sort by soonest first
    return upcoming.sort((a, b) => a.daysLeft - b.daysLeft);
  },

  /**
   * Generates localized WhatsApp / SMS message for a Shraddha or booking
   * Automatically merges the Poojari / Purohit's name and contact from saved Settings
   * @param {string} type 'shraddhaReminder' | 'bookingConfirmation' | 'bookingReminder' | 'paymentReceipt'
   * @param {object} params 
   * @param {string} [lang='kn'] 'en' | 'kn' | 'hi'
   * @returns {Promise<string>}
   */
  async generateMessage(type, params = {}, lang = 'kn') {
    const settings = await settingsRepo.get();
    const template = messageTemplates[type]?.[lang] || messageTemplates[type]?.['en'] || '';
    if (!template) return '';

    const mergedParams = {
      purohitName: settings?.purohitName || 'ಪುರೋಹಿತರು',
      phone: settings?.phone || '',
      email: settings?.email || '',
      cityName: settings?.cityName || '',
      ...params
    };

    // If params has empty/blank string for purohitName or phone, fallback to settings
    if (!mergedParams.purohitName && settings?.purohitName) {
      mergedParams.purohitName = settings.purohitName;
    }
    if (!mergedParams.phone && settings?.phone) {
      mergedParams.phone = settings.phone;
    }

    let text = template;
    for (const [key, val] of Object.entries(mergedParams)) {
      text = text.replace(new RegExp(`{${key}}`, 'g'), val || '');
    }
    return text;
  }
};

