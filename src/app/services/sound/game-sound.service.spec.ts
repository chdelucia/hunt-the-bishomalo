import { TestBed } from '@angular/core/testing';
import { GameSoundService } from './game-sound.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GameSound } from 'src/app/models';

describe('GameSoundService', () => {
  let service: GameSoundService;
  let mockPlay: jest.Mock;
  let mockPause: jest.Mock;

  beforeEach(() => {
    mockPlay = jest.fn(() => Promise.resolve());
    mockPause = jest.fn();

    jest.spyOn(window as any, 'Audio').mockImplementation(() => {
      return {
        play: mockPlay,
        pause: mockPause,
        currentTime: 0,
        loop: false,
        volume: 1
      } as unknown as HTMLAudioElement;
    });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
    });

    service = TestBed.inject(GameSoundService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should play wumpus sound', () => {
    service.playSound(GameSound.WUMPUS);
    expect(mockPlay).toHaveBeenCalled();
  });

  it('should play wind sound', () => {
    service.playSound(GameSound.WIND);
    expect(mockPlay).toHaveBeenCalled();
  });

  it('should play gold sound', () => {
    service.playSound(GameSound.GOLD);
    expect(mockPlay).toHaveBeenCalled();
  });

  it('should play scream sound', () => {
    service.playSound(GameSound.SCREAM);
    expect(mockPlay).toHaveBeenCalled();
  });

  it('should play pain sound', () => {
    service.playSound(GameSound.PAIN);
    expect(mockPlay).toHaveBeenCalled();
  });

  it('should stop wumpus sound', () => {
    service.playSound(GameSound.WUMPUS); // Necesario para crear el audio
    service.stopWumpus();
    expect(mockPause).toHaveBeenCalled();
  });
});
