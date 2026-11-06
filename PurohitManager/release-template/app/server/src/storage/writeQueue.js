/**
 * WriteQueue: Mutex per file path so writes never collide or interleave
 */

class WriteQueue {
  constructor() {
    this.queues = new Map();
  }

  async enqueue(key, task) {
    if (!this.queues.has(key)) {
      this.queues.set(key, Promise.resolve());
    }

    const currentPromise = this.queues.get(key);
    const nextPromise = currentPromise
      .then(() => task())
      .catch((err) => {
        // Still allow subsequent writes to continue
        throw err;
      });

    this.queues.set(key, nextPromise.catch(() => {}));
    return nextPromise;
  }
}

export const writeQueue = new WriteQueue();

