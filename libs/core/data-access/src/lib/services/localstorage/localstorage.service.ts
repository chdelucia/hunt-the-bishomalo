import { Injectable, isDevMode } from '@angular/core';
import { ILocalstorageService } from '@hunt-the-bishomalo/core/api';
import { prototypePollutionReviver } from '@hunt-the-bishomalo/shared-util';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService implements ILocalstorageService {
  getValue<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }

    try {
      return JSON.parse(item, prototypePollutionReviver);
    } catch (e) {
      if (isDevMode()) console.log(e);
      return null;
    }
  }

  setValue<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  clearValue(key: string): void {
    localStorage.removeItem(key);
  }

  clearAll(): void {
    localStorage.clear();
  }
}
