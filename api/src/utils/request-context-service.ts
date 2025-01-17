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

  hasActiveContext(): boolean {
    return this.storage.getStore() !== undefined;
  }

  /**
   * Gets the current user from context, creating a new context if necessary
   * @param required If true, throws an error when no user is found
   * @returns The current user or null if not found and not required
   */
  async getDataWithContext<T = any>(key: string): Promise<T | null> {
    let data: T | null | undefined = null;

    // First try to get user from existing context
    if (this.hasActiveContext()) {
      try {
        data = this.get<T>(key);
        if (data) return data;
      } catch (error) {
        console.error('Failed to get user from active context:', error);
      }
    }

    // If no user found, try creating a new context
    if (!data) {
      try {
        await this.run({}, () => {
          try {
            data = this.get<T>(key);
          } catch (error) {
            console.error('Failed to get user in new context:', error);
            return null;
          }
        });
      } catch (error) {
        console.error('Failed to create new context for user:', error);
      }
    }

    // Handle required flag
    if (!data) {
      throw new Error(key + ' not found in context');
    }

    return data;
  }
}
