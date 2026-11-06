/**
 * In-memory cache and indexing for lightning-fast reads
 */

class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.indexes = new Map();
  }

  set(entityName, items) {
    this.cache.set(entityName, Array.isArray(items) ? [...items] : { ...items });
    
    // Index items by ID if array
    if (Array.isArray(items)) {
      const byId = new Map();
      for (const item of items) {
        if (item.id) byId.set(item.id, item);
      }
      this.indexes.set(`${entityName}:byId`, byId);
    }
  }

  get(entityName) {
    return this.cache.get(entityName) || null;
  }

  getById(entityName, id) {
    const idx = this.indexes.get(`${entityName}:byId`);
    return idx ? idx.get(id) || null : null;
  }

  invalidate(entityName) {
    this.cache.delete(entityName);
    this.indexes.delete(`${entityName}:byId`);
  }

  clear() {
    this.cache.clear();
    this.indexes.clear();
  }
}

export const cache = new MemoryCache();

