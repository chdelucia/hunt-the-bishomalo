import { TestBed } from '@angular/core/testing';

import { GameSoundService } from './game-sound.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GameSound } from 'src/app/models';

describe('GameSoundService', () => {
  let service: GameSoundService;

  beforeEach(() => {
    jest.spyOn(window as any, 'Audio').mockImplementation(() => {
      return {
        play: jest.fn(),
        pause: jest.fn(),
        currentTime: 0,
        loop: false,
        volume: 1
      } as unknown as HTMLAudioElement;
    });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA]
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
    const audio = (service as any).audioMap['wumpus'];
    jest.spyOn(audio, 'play').mockImplementation(() => Promise.resolve());
    service.playSound(GameSound.WUMPUS);
    expect(audio.play).toHaveBeenCalled();
  });

  it('should play wind sound', () => {
    const audio = (service as any).audioMap['wind'];
    jest.spyOn(audio, 'play').mockImplementation(() => Promise.resolve());
    service.playSound(GameSound.WIND);
    expect(audio.play).toHaveBeenCalled();
  });

  it('should play gold sound', () => {
    const audio = (service as any).audioMap['gold'];
    jest.spyOn(audio, 'play').mockImplementation(() => Promise.resolve());
    service.playSound(GameSound.GOLD);
    expect(audio.play).toHaveBeenCalled();
  });

  it('should play scream sound', () => {
    const audio = (service as any).audioMap['scream'];
    jest.spyOn(audio, 'play').mockImplementation(() => Promise.resolve());
    service.playSound(GameSound.SCREAM);
    expect(audio.play).toHaveBeenCalled();
  });

  it('should play pain sound', () => {
    const audio = (service as any).audioMap['pain'];
    jest.spyOn(audio, 'play').mockImplementation(() => Promise.resolve());
    service.playSound(GameSound.PAIN);
    expect(audio.play).toHaveBeenCalled();
  });

  it('should stop wumpus sound', () => {
    const audio = (service as any).audioMap['wumpus'];
    jest.spyOn(audio, 'pause');
    service.stopWumpus();
    expect(audio.pause).toHaveBeenCalled();
  });


});
