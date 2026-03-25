import { TestBed } from '@angular/core/testing';
import { GameSoundService } from './game-sound.service';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { GameSound } from '@hunt-the-bishomalo/shared-data';
import { signal } from '@angular/core';

describe('GameSoundService', () => {
  let service: GameSoundService;
  let gameStoreMock: any;
  let audioMock: any;

  beforeEach(() => {
    audioMock = {
      play: jest.fn().mockResolvedValue(undefined),
      pause: jest.fn(),
      currentTime: 0,
      loop: false,
      volume: 0.5,
    };

    global.Audio = jest.fn().mockImplementation(() => audioMock) as any;

    gameStoreMock = {
      lives: signal(3),
      soundEnabled: signal(true),
    };

    TestBed.configureTestingModule({
      providers: [
        GameSoundService,
        { provide: GAME_STORE_TOKEN, useValue: gameStoreMock },
      ],
    });

    service = TestBed.inject(GameSoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should play sound', () => {
    service.playSound(GameSound.GOLD, false);
    expect(global.Audio).toHaveBeenCalledWith('sounds/gold.mp3');
    expect(audioMock.play).toHaveBeenCalled();
  });

  it('should reuse audio element if already created', () => {
    service.playSound(GameSound.GOLD, false);
    service.playSound(GameSound.GOLD, false);
    expect(global.Audio).toHaveBeenCalledTimes(1);
  });

  it('should stop all sounds', () => {
    service.playSound(GameSound.GOLD, false);
    service.playSound(GameSound.SHOOT, false);
    service.stop();
    expect(audioMock.pause).toHaveBeenCalledTimes(2);
    expect(audioMock.currentTime).toBe(0);
  });

  it('should stop wumpus sound', () => {
    service.playSound(GameSound.WUMPUS, true);
    service.stopWumpus();
    expect(audioMock.pause).toHaveBeenCalled();
  });

  it('should log error when audio play fails', async () => {
    const consoleSpy = jest.spyOn(console, 'info').mockImplementation();
    audioMock.play.mockRejectedValue(new Error('Play error'));

    service.playSound(GameSound.GOLD, false);

    // Wait for the promise rejection
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(consoleSpy).toHaveBeenCalledWith('Audio play failed:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should play GAMEOVER sound when lives reaches 0', () => {
    const playSpy = jest.spyOn(service, 'playSound');
    gameStoreMock.lives.set(0);

    // Trigger effect
    TestBed.flushEffects();

    expect(playSpy).toHaveBeenCalledWith(GameSound.GAMEOVER, false);
  });

  it('should not play sound if sound is disabled', () => {
    gameStoreMock.soundEnabled.set(false);
    service.playSound(GameSound.GOLD, false);
    expect(audioMock.play).not.toHaveBeenCalled();
  });

  it('should play sound if sound is enabled', () => {
    gameStoreMock.soundEnabled.set(true);
    service.playSound(GameSound.GOLD, false);
    expect(audioMock.play).toHaveBeenCalled();
  });

  it('should not play GAMEOVER sound when lives reaches 0 and sound is disabled', () => {
    gameStoreMock.soundEnabled.set(false);
    gameStoreMock.lives.set(0);

    // Trigger effect
    TestBed.flushEffects();

    expect(audioMock.play).not.toHaveBeenCalled();
  });

  it('should stop all sounds when soundEnabled is set to false', () => {
    service.playSound(GameSound.WUMPUS, true);
    expect(audioMock.play).toHaveBeenCalled();

    gameStoreMock.soundEnabled.set(false);

    // Trigger effect
    TestBed.flushEffects();

    expect(audioMock.pause).toHaveBeenCalled();
  });
});
