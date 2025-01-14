import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class RequestContextService {
  private readonly storage = new AsyncLocalStorage<Record<string, any>>();

  run(context: Record<string, any>, callback: () => void) {
    this.storage.run(context, callback);
  }

  get<T = any>(key: string): T | undefined {
    const store = this.storage.getStore();
    return store?.[key];
  }

  set(key: string, value: any): void {
    const store = this.storage.getStore();
    if (store) {
      store[key] = value;
    }
  }
}
