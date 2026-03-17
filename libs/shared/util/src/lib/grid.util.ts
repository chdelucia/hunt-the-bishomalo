import { Point } from '@hunt-the-bishomalo/data';

/**
 * Checks if a position is within the bounds of a square grid.
 */
export function isInBounds(pos: Point, size: number): boolean {
  return pos.x >= 0 && pos.y >= 0 && pos.x < size && pos.y < size;
}

/**
 * Returns the adjacent positions for a given point.
 */
export function getAdjacentPositions(pos: Point, size: number): Point[] {
  const directions = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
  ];

  return directions
    .map((dir) => ({ x: pos.x + dir.x, y: pos.y + dir.y }))
    .filter((p) => isInBounds(p, size));
}

/**
 * Generates a random coordinate within the given size.
 */
export function getRandomCoordinate(size: number): number {
  /**
   * Security Hotspot Justification:
   * Math.random() is used here for game mechanics (random coordinate generation).
   * It does not involve any security-sensitive operations.
   */
  return Math.floor(Math.random() * size);
}

/**
 * Generates a random position within the given size.
 */
export function getRandomPosition(size: number): Point {
  return {
    x: getRandomCoordinate(size),
    y: getRandomCoordinate(size),
  };
}

/**
 * Checks if two points are equal.
 */
export function arePositionsEqual(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}
