import { ENTITY_FILES } from '../config/paths.js';
import { jsonStore } from '../storage/jsonStore.js';
import { cache } from '../storage/cache.js';
import { generateId } from '@purohit-manager/shared';

const FILE = ENTITY_FILES.clients;

export const clientsRepo = {
  async getAll() {
    let items = cache.get('clients');
    if (!items) {
      items = jsonStore.read(FILE, []);
      cache.set('clients', items);
    }
    return items;
  },

  async getById(id) {
    const items = await this.getAll();
    return items.find(c => c.id === id) || null;
  },

  async create(data) {
    const items = await this.getAll();
    const newItem = {
      ...data,
      id: data.id || generateId('c'),
      createdAt: data.createdAt || new Date().toISOString()
    };
    items.unshift(newItem);
    await jsonStore.write(FILE, items);
    cache.set('clients', items);
    return newItem;
  },

  async update(id, updates) {
    const items = await this.getAll();
    const index = items.findIndex(c => c.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    await jsonStore.write(FILE, items);
    cache.set('clients', items);
    return items[index];
  },

  async delete(id) {
    const items = await this.getAll();
    const filtered = items.filter(c => c.id !== id);
    if (filtered.length === items.length) return false;
    await jsonStore.write(FILE, filtered);
    cache.set('clients', filtered);
    return true;
  }
};

