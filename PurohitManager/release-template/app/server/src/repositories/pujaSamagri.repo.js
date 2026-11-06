import { ENTITY_FILES } from '../config/paths.js';
import { jsonStore } from '../storage/jsonStore.js';
import { cache } from '../storage/cache.js';
import path from 'path';
import fs from 'fs';
import { DATA_DIR } from '../config/paths.js';

const FILE = ENTITY_FILES.pujaSamagri || path.resolve(DATA_DIR, 'pujaSamagri.json');

export const pujaSamagriRepo = {
  async getAll() {
    let items = cache.get('pujaSamagri');
    if (!items) {
      items = jsonStore.read(FILE, []);
      cache.set('pujaSamagri', items);
    }
    return items;
  },

  async getById(id) {
    const items = await this.getAll();
    return items.find(p => p.id === id) || null;
  },

  async createPuja(data) {
    const items = await this.getAll();
    const id = data.id || `puja_${Date.now()}`;
    const newPuja = {
      id,
      name: data.name || data.kannadaName || 'Custom Puja',
      kannadaName: data.kannadaName || data.name || 'ಪೂಜೆ',
      category: data.category || 'ವ್ರತ / ಪೂಜೆ',
      defaultDakshina: Number(data.defaultDakshina) || 3500,
      durationHours: Number(data.durationHours) || 2.5,
      description: data.description || '',
      items: Array.isArray(data.items) ? data.items : []
    };
    items.push(newPuja);
    await jsonStore.write(FILE, items);
    cache.set('pujaSamagri', items);

    // Also sync to services.json so it is immediately available for bookings
    try {
      const services = jsonStore.read(ENTITY_FILES.services, []);
      if (!services.some(s => s.id === id)) {
        services.push({
          id,
          name: newPuja.name,
          kannadaName: newPuja.kannadaName,
          defaultDakshina: newPuja.defaultDakshina,
          durationHours: newPuja.durationHours,
          category: newPuja.category
        });
        await jsonStore.write(ENTITY_FILES.services, services);
        cache.del('services');
      }
    } catch (e) {
      console.error("Error syncing new puja to services:", e);
    }

    return newPuja;
  },

  async updatePuja(id, updates) {
    const items = await this.getAll();
    const index = items.findIndex(p => p.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates };
    await jsonStore.write(FILE, items);
    cache.set('pujaSamagri', items);

    // Sync to services.json
    try {
      const services = jsonStore.read(ENTITY_FILES.services, []);
      const sIdx = services.findIndex(s => s.id === id);
      if (sIdx !== -1) {
        if (updates.name) services[sIdx].name = updates.name;
        if (updates.kannadaName) services[sIdx].kannadaName = updates.kannadaName;
        if (updates.category) services[sIdx].category = updates.category;
        if (updates.defaultDakshina) services[sIdx].defaultDakshina = Number(updates.defaultDakshina);
        await jsonStore.write(ENTITY_FILES.services, services);
        cache.del('services');
      }
    } catch (e) {
      console.error("Error syncing updated puja to services:", e);
    }

    return items[index];
  },

  async deletePuja(id) {
    let items = await this.getAll();
    items = items.filter(p => p.id !== id);
    await jsonStore.write(FILE, items);
    cache.set('pujaSamagri', items);

    // Sync to services.json
    try {
      let services = jsonStore.read(ENTITY_FILES.services, []);
      services = services.filter(s => s.id !== id);
      await jsonStore.write(ENTITY_FILES.services, services);
      cache.del('services');
    } catch (e) {
      console.error("Error syncing deleted puja from services:", e);
    }

    return true;
  },

  async addItem(pujaId, itemData) {
    const items = await this.getAll();
    const puja = items.find(p => p.id === pujaId);
    if (!puja) return null;
    
    const newItem = {
      id: itemData.id || `it_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      item: itemData.item || '',
      kannada: itemData.kannada || '',
      qty: itemData.qty || '',
      category: itemData.category || 'ಪೂಜಾ ದ್ರವ್ಯಗಳು',
      essential: itemData.essential !== false
    };

    if (!Array.isArray(puja.items)) puja.items = [];
    puja.items.push(newItem);

    await jsonStore.write(FILE, items);
    cache.set('pujaSamagri', items);
    return newItem;
  },

  async updateItem(pujaId, itemId, updates) {
    const items = await this.getAll();
    const puja = items.find(p => p.id === pujaId);
    if (!puja || !Array.isArray(puja.items)) return null;

    const itemIndex = puja.items.findIndex(it => it.id === itemId);
    if (itemIndex === -1) return null;

    puja.items[itemIndex] = { ...puja.items[itemIndex], ...updates };
    await jsonStore.write(FILE, items);
    cache.set('pujaSamagri', items);
    return puja.items[itemIndex];
  },

  async deleteItem(pujaId, itemId) {
    const items = await this.getAll();
    const puja = items.find(p => p.id === pujaId);
    if (!puja || !Array.isArray(puja.items)) return false;

    puja.items = puja.items.filter(it => it.id !== itemId);
    await jsonStore.write(FILE, items);
    cache.set('pujaSamagri', items);
    return true;
  }
};

