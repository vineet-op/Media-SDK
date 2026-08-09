type Listener<T> = (payload: T) => void;

export class EventEmitter<EventMap extends Record<string, unknown>> {
  private listeners = new Map<string, Listener<unknown>[]>();

  on<K extends keyof EventMap>(
    event: K,
    listener: Listener<EventMap[K]>,
  ): () => void {
    const key = String(event);
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key)!.push(listener as Listener<unknown>);
    return () => this.off(event, listener);
  }

  off<K extends keyof EventMap>(
    event: K,
    listener: Listener<EventMap[K]>,
  ): void {
    const key = String(event);
    const existing = this.listeners.get(key) ?? [];
    this.listeners.set(
      key,
      existing.filter((l) => l !== listener),
    );
  }

  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    const key = String(event);
    this.listeners.get(key)?.forEach((l) => l(payload));
  }
}
