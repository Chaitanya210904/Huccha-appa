import { ENTITY_FILES } from '../config/paths.js';
import { jsonStore } from '../storage/jsonStore.js';
import { cache } from '../storage/cache.js';

const FILE = ENTITY_FILES.settings;

export const settingsRepo = {
  async get() {
    let settings = cache.get('settings');
    if (!settings) {
      settings = jsonStore.read(FILE, {
        purohitName: "Pandit Venkatesha Sharma",
        title: "Vedic Purohit",
        phone: "",
        email: "",
        upiId: "",
        cityId: "blr",
        cityName: "Bengaluru",
        latitude: 12.9716,
        longitude: 77.5946,
        timezone: "Asia/Kolkata",
        sampradaya: "Smartha",
        ayanamsa: "Lahiri",
        calendarSystem: "Amanta",
        language: "en"
      });
      cache.set('settings', settings);
    }
    return settings;
  },

  async update(updates) {
    const current = await this.get();
    const updated = { ...current, ...updates };
    await jsonStore.write(FILE, updated);
    cache.set('settings', updated);
    return updated;
  }
};

