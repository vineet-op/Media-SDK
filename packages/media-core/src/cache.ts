interface CacheEntry<V> {
  value: V;
  expiresAt: number;
}

export class Cache<V> {
  private store = new Map<string, CacheEntry<V>>();
  private inFlight = new Map<string, Promise<V>>();
  private ttlMs: number;

  constructor(ttlMs = 5 * 60 * 1000) {
    this.ttlMs = ttlMs;
  }

  getOrFetch(key: string, fetcher: () => Promise<V>): Promise<V> {
    // 1. Already resolved and not expired? Return immediately, no network call.
    const entry = this.store.get(key);
    if (entry !== undefined && Date.now() < entry.expiresAt) {
      return Promise.resolve(entry.value);
    }

    // 2. Already being fetched by someone else? Piggyback on that promise
    //    instead of starting a duplicate request.
    const pending = this.inFlight.get(key);
    if (pending) return pending;

    // 3. Neither — kick off the real fetch, and register the promise
    //    BEFORE awaiting it, so any concurrent caller hits branch 2.
    const promise = fetcher()
      .then((value) => {
        this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
        this.inFlight.delete(key);
        return value;
      })
      .catch((err: unknown) => {
        this.inFlight.delete(key); // clear in-flight even on failure
        throw err;                 // but DON'T cache the error
      });

    this.inFlight.set(key, promise);
    return promise;
  }

  delete(key: string): void {
    this.store.delete(key);
    this.inFlight.delete(key);
  }

  clear(): void {
    this.store.clear();
    this.inFlight.clear();
  }
}
