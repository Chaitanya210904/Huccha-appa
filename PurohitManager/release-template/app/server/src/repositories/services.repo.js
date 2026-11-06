import { ENTITY_FILES } from '../config/paths.js';
import { jsonStore } from '../storage/jsonStore.js';
import { cache } from '../storage/cache.js';
import { pujaSamagriRepo } from './pujaSamagri.repo.js';

const FILE = ENTITY_FILES.services;

export const servicesRepo = {
  async getAll() {
    let items = jsonStore.read(FILE, []);

    // Merge all pujas from pujaSamagriRepo to ensure any newly added puja appears in booking
    try {
      const pujas = await pujaSamagriRepo.getAll();
      const existingIds = new Set(items.map(s => s.id));

      for (const p of pujas) {
        if (!existingIds.has(p.id)) {
          items.push({
            id: p.id,
            name: p.name || p.kannadaName,
            kannadaName: p.kannadaName,
            category: p.category,
            defaultDakshina: p.defaultDakshina || 3500,
            durationHours: p.durationHours || 2.5
          });
        } else {
          const existing = items.find(s => s.id === p.id);
          if (existing) {
            if (p.kannadaName) existing.kannadaName = p.kannadaName;
            if (p.category) existing.category = p.category;
            if (p.defaultDakshina && !existing.defaultDakshina) existing.defaultDakshina = p.defaultDakshina;
          }
        }
      }
    } catch (e) {
      console.error('Error merging pujas into services:', e);
    }

    return items;
  },

  async getById(id) {
    const items = await this.getAll();
    return items.find(s => s.id === id) || null;
  },

  async create(data) {
    const items = await this.getAll();
    const newItem = {
      ...data,
      id: data.id || data.name.toLowerCase().replace(/[^a-z0-9]/g, '_')
    };
    items.push(newItem);
    await jsonStore.write(FILE, items);
    cache.set('services', items);
    return newItem;
  },

  async update(id, updates) {
    const items = await this.getAll();
    const index = items.findIndex(s => s.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates };
    await jsonStore.write(FILE, items);
    cache.set('services', items);
    return items[index];
  }
};

