import { isInBounds, getAdjacentPositions, getRandomPosition } from './grid.util';

describe('gridUtils', () => {
  describe('isInBounds', () => {
    it('should return true if coordinates are within bounds', () => {
      expect(isInBounds(0, 0, 5)).toBe(true);
      expect(isInBounds(4, 4, 5)).toBe(true);
      expect(isInBounds(2, 2, 5)).toBe(true);
    });

    it('should return false if coordinates are out of bounds', () => {
      expect(isInBounds(-1, 0, 5)).toBe(false);
      expect(isInBounds(0, -1, 5)).toBe(false);
      expect(isInBounds(5, 0, 5)).toBe(false);
      expect(isInBounds(0, 5, 5)).toBe(false);
      expect(isInBounds(5, 5, 5)).toBe(false);
    });
  });

  describe('getAdjacentPositions', () => {
    it('should return adjacent positions for a middle cell', () => {
      const adj = getAdjacentPositions(1, 1, 3);
      expect(adj).toHaveLength(4);
      expect(adj).toContainEqual({ x: 0, y: 1 });
      expect(adj).toContainEqual({ x: 2, y: 1 });
      expect(adj).toContainEqual({ x: 1, y: 0 });
      expect(adj).toContainEqual({ x: 1, y: 2 });
    });

    it('should return fewer adjacent positions for a corner cell', () => {
      const adj = getAdjacentPositions(0, 0, 3);
      expect(adj).toHaveLength(2);
      expect(adj).toContainEqual({ x: 1, y: 0 });
      expect(adj).toContainEqual({ x: 0, y: 1 });
    });

    it('should return 3 adjacent positions for an edge cell', () => {
      const adj = getAdjacentPositions(0, 1, 3);
      expect(adj).toHaveLength(3);
      expect(adj).toContainEqual({ x: 0, y: 0 });
      expect(adj).toContainEqual({ x: 0, y: 2 });
      expect(adj).toContainEqual({ x: 1, y: 1 });
    });
  });

  describe('getRandomPosition', () => {
    it('should return a position within bounds', () => {
      const size = 5;
      const pos = getRandomPosition(size);
      expect(pos.x).toBeGreaterThanOrEqual(0);
      expect(pos.x).toBeLessThan(size);
      expect(pos.y).toBeGreaterThanOrEqual(0);
      expect(pos.y).toBeLessThan(size);
    });

    it('should eventually return different positions', () => {
      const size = 10;
      const positions = new Set<string>();
      for (let i = 0; i < 100; i++) {
        const { x, y } = getRandomPosition(size);
        positions.add(`${x},${y}`);
      }
      expect(positions.size).toBeGreaterThan(1);
    });
  });
});
