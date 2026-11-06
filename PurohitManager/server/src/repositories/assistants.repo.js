import { ENTITY_FILES } from '../config/paths.js';
import { jsonStore } from '../storage/jsonStore.js';
import { cache } from '../storage/cache.js';
import { generateId } from '@purohit-manager/shared';

const FILE = ENTITY_FILES.assistants;

export const assistantsRepo = {
  async getAll() {
    let items = cache.get('assistants');
    if (!items) {
      items = jsonStore.read(FILE, []);
      cache.set('assistants', items);
    }
    return items;
  },

  async getById(id) {
    const items = await this.getAll();
    return items.find(a => a.id === id) || null;
  },

  async create(data) {
    const items = await this.getAll();
    const newItem = {
      ...data,
      id: data.id || generateId('a'),
      dailyRemuneration: Number(data.dailyRemuneration) || 0
    };
    items.push(newItem);
    await jsonStore.write(FILE, items);
    cache.set('assistants', items);
    return newItem;
  },

  async update(id, updates) {
    const items = await this.getAll();
    const index = items.findIndex(a => a.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates };
    await jsonStore.write(FILE, items);
    cache.set('assistants', items);
    return items[index];
  },

  async delete(id) {
    const items = await this.getAll();
    const filtered = items.filter(a => a.id !== id);
    if (filtered.length === items.length) return false;
    await jsonStore.write(FILE, filtered);
    cache.set('assistants', filtered);
    return true;
  }
};

