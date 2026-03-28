import { TestBed } from '@angular/core/testing';
import { AchievementsFacade } from './achievements.facade';
import { MiniBusService } from './mini-bus.service';

describe('AchievementsFacade', () => {
  let facade: AchievementsFacade;
  let busMock: any;

  beforeEach(() => {
    busMock = {
      listen: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AchievementsFacade,
        { provide: MiniBusService, useValue: busMock },
      ],
    });

    facade = TestBed.inject(AchievementsFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should listen for ACHIEVEMENTS_CONFIG event and update config signal', () => {
    const mockConfig = { appId: 'test-app' };
    const listenCallback = busMock.listen.mock.calls[0][1];

    listenCallback(mockConfig);

    expect(facade.config()).toEqual(mockConfig);
  });
});
