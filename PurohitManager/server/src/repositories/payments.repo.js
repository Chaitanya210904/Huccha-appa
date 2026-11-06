import { ENTITY_FILES } from '../config/paths.js';
import { jsonStore } from '../storage/jsonStore.js';
import { cache } from '../storage/cache.js';
import { generateId, generateReceiptNumber } from '@purohit-manager/shared';

const FILE = ENTITY_FILES.payments;

export const paymentsRepo = {
  async getAll() {
    let items = cache.get('payments');
    if (!items) {
      items = jsonStore.read(FILE, []);
      cache.set('payments', items);
    }
    return items;
  },

  async getById(id) {
    const items = await this.getAll();
    return items.find(p => p.id === id) || null;
  },

  async getByBookingId(bookingId) {
    const items = await this.getAll();
    return items.filter(p => p.bookingId === bookingId);
  },

  async create(data) {
    const items = await this.getAll();
    const newItem = {
      ...data,
      id: data.id || generateId('p'),
      receiptNumber: data.receiptNumber || generateReceiptNumber(items.length + 1),
      createdAt: data.createdAt || new Date().toISOString()
    };
    items.unshift(newItem);
    await jsonStore.write(FILE, items);
    cache.set('payments', items);
    return newItem;
  },

  async delete(id) {
    const items = await this.getAll();
    const filtered = items.filter(p => p.id !== id);
    if (filtered.length === items.length) return false;
    await jsonStore.write(FILE, filtered);
    cache.set('payments', filtered);
    return true;
  }
};

