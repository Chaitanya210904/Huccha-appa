import { ENTITY_FILES } from '../config/paths.js';
import { jsonStore } from '../storage/jsonStore.js';
import { cache } from '../storage/cache.js';
import { generateId } from '@purohit-manager/shared';

const FILE = ENTITY_FILES.inventory;

export const inventoryRepo = {
  async getAll() {
    let items = cache.get('inventory');
    if (!items) {
      items = jsonStore.read(FILE, []);
      cache.set('inventory', items);
    }
    return items;
  },

  async getById(id) {
    const items = await this.getAll();
    return items.find(i => i.id === id) || null;
  },

  async create(data) {
    const items = await this.getAll();
    const newItem = {
      ...data,
      id: data.id || generateId('inv'),
      quantity: Number(data.quantity) || 0,
      minThreshold: Number(data.minThreshold) || 1
    };
    items.push(newItem);
    await jsonStore.write(FILE, items);
    cache.set('inventory', items);
    return newItem;
  },

  async update(id, updates) {
    const items = await this.getAll();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates };
    await jsonStore.write(FILE, items);
    cache.set('inventory', items);
    return items[index];
  },

  async delete(id) {
    const items = await this.getAll();
    const filtered = items.filter(i => i.id !== id);
    if (filtered.length === items.length) return false;
    await jsonStore.write(FILE, filtered);
    cache.set('inventory', filtered);
    return true;
  }
};

