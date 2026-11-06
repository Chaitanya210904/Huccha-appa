import { ENTITY_FILES } from '../config/paths.js';
import { jsonStore } from '../storage/jsonStore.js';
import { cache } from '../storage/cache.js';
import { generateId } from '@purohit-manager/shared';

const FILE = ENTITY_FILES.bookings;

export const bookingsRepo = {
  async getAll() {
    let items = cache.get('bookings');
    if (!items) {
      items = jsonStore.read(FILE, []);
      cache.set('bookings', items);
    }
    return items;
  },

  async getById(id) {
    const items = await this.getAll();
    return items.find(b => b.id === id) || null;
  },

  async getByClientId(clientId) {
    const items = await this.getAll();
    return items.filter(b => b.clientId === clientId);
  },

  async create(data) {
    const items = await this.getAll();
    const newItem = {
      ...data,
      id: data.id || generateId('b'),
      status: data.status || 'scheduled',
      paidAmount: data.paidAmount || 0,
      createdAt: data.createdAt || new Date().toISOString()
    };
    items.unshift(newItem);
    await jsonStore.write(FILE, items);
    cache.set('bookings', items);
    return newItem;
  },

  async update(id, updates) {
    const items = await this.getAll();
    const index = items.findIndex(b => b.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    await jsonStore.write(FILE, items);
    cache.set('bookings', items);
    return items[index];
  },

  async delete(id) {
    const items = await this.getAll();
    const filtered = items.filter(b => b.id !== id);
    if (filtered.length === items.length) return false;
    await jsonStore.write(FILE, filtered);
    cache.set('bookings', filtered);
    return true;
  }
};

