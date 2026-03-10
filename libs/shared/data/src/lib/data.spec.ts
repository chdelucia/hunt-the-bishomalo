import { Direction, RouteTypes } from './index';

describe('shared-data', () => {
  it('should export enums', () => {
    expect(Direction.UP).toBe(0);
    expect(RouteTypes.HOME).toBe('home');
  });
});
