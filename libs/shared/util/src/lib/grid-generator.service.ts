import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GridGeneratorService {
  createGrid<T = unknown>(size: number): { x: number; y: number; visited: boolean; content?: T }[][] {
    return Array.from({ length: size }, (_, x) =>
      Array.from({ length: size }, (_, y) => ({
        x,
        y,
        visited: false,
      }))
    );
  }
}
