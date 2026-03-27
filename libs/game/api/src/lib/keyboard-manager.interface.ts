import { InjectionToken } from '@angular/core';

export interface IKeyboardManagerService {
  handleKeyDown(event: KeyboardEvent): void;
}

export const KEYBOARD_MANAGER_TOKEN = new InjectionToken<IKeyboardManagerService>('KEYBOARD_MANAGER_TOKEN');
