import { Direction, RouteTypes, AchieveTypes } from './index';

describe('shared-data', () => {
  it('should export enums', () => {
    expect(Direction.UP).toBe(0);
    expect(RouteTypes.HOME).toBe('home');
    expect(AchieveTypes.WUMPUSKILLED).toBe('kill_wumpus');
  });
});
