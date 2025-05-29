import { CellContentType, CELL_CONTENTS } from 'src/app/models';

export function calculatePitsForLevel(size: number, luck: number): number {
  return Math.floor(size * Math.max(1, (size / Math.max(1, luck)) * 0.7));
}

export function calculateWumpusForLevel(size: number, luck: number): number {
  return Math.floor(Math.max(1, size / Math.max(1, luck * 0.7)));
}

export function shouldApplyBlackoutOnLevelChange(): boolean {
  return Math.random() < 0.1;
}

export function determineRandomItemDrop(luck: number): CellContentType | undefined {
  const dropChance = Math.random() / Math.max(1, luck);
  if (dropChance < 0.1) {
    const items: CellContentType[] = ['arrow', 'heart']; 
    return items[Math.floor(Math.random() * items.length)];
  }
  return undefined;
}

export function calculateEventChance(
  baseChance: number,
  maxChance: number,
  currentLevelSize: number,
  difficultyMaxLevels: number,
  levelSizeOffset: number = 4
): number {
  const levelFactor = (currentLevelSize - levelSizeOffset) / (difficultyMaxLevels - levelSizeOffset);
  return baseChance + (maxChance - baseChance) * levelFactor;
}
