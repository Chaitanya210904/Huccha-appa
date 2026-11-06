import { ENTITY_FILES } from '../config/paths.js';
import { jsonStore } from '../storage/jsonStore.js';
import { cache } from '../storage/cache.js';
import { generateId } from '@purohit-manager/shared';

const FILE = ENTITY_FILES.expenses;

export const expensesRepo = {
  async getAll() {
    let items = cache.get('expenses');
    if (!items) {
      items = jsonStore.read(FILE, []);
      cache.set('expenses', items);
    }
    return items;
  },

  async create(data) {
    const items = await this.getAll();
    const newItem = {
      ...data,
      id: data.id || generateId('e'),
      createdAt: new Date().toISOString()
    };
    items.unshift(newItem);
    await jsonStore.write(FILE, items);
    cache.set('expenses', items);
    return newItem;
  },

  async delete(id) {
    const items = await this.getAll();
    const filtered = items.filter(e => e.id !== id);
    if (filtered.length === items.length) return false;
    await jsonStore.write(FILE, filtered);
    cache.set('expenses', filtered);
    return true;
  }
};

