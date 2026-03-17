import * as index from '../index';

describe('shared-util index', () => {
  it('should export expected utilities', () => {
    expect(index.getTranslocoTestingModule).toBeDefined();
    expect(index.isInBounds).toBeDefined();
    expect(index.getAdjacentPositions).toBeDefined();
    expect(index.getRandomPosition).toBeDefined();
  });
});
