import { ENTITY_FILES } from '../config/paths.js';
import { jsonStore } from '../storage/jsonStore.js';
import { cache } from '../storage/cache.js';
import { generateId } from '@purohit-manager/shared';

const FILE = ENTITY_FILES.familyMembers;

export const familyMembersRepo = {
  async getAll() {
    let items = cache.get('familyMembers');
    if (!items) {
      items = jsonStore.read(FILE, []);
      cache.set('familyMembers', items);
    }
    return items;
  },

  async getByClientId(clientId) {
    const items = await this.getAll();
    return items.filter(f => f.clientId === clientId);
  },

  async create(data) {
    const items = await this.getAll();
    const newItem = {
      ...data,
      id: data.id || generateId('fm'),
      createdAt: new Date().toISOString()
    };
    items.push(newItem);
    await jsonStore.write(FILE, items);
    cache.set('familyMembers', items);
    return newItem;
  },

  async delete(id) {
    const items = await this.getAll();
    const filtered = items.filter(f => f.id !== id);
    if (filtered.length === items.length) return false;
    await jsonStore.write(FILE, filtered);
    cache.set('familyMembers', filtered);
    return true;
  }
};

