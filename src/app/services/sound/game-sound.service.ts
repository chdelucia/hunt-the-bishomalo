import { Injectable } from '@angular/core';
import { GameSound } from 'src/app/models';


const SOUND_PATHS: Record<GameSound, string> = {
  [GameSound.WUMPUS]: 'sounds/monster.mp3',
  [GameSound.GOLD]: 'sounds/gold.mp3',
  [GameSound.WIND]: 'sounds/wind.mp3',
  [GameSound.SCREAM]: 'sounds/scream.mp3',
  [GameSound.PAIN]: 'sounds/pain.mp3',
  [GameSound.WRAT] : 'sounds/winrat.mp3',
  [GameSound.WHONOR] : 'sounds/win.mp3',
  [GameSound.ARROWS] : 'sounds/winwitharrows.mp3',
  [GameSound.NOARROWS] : 'sounds/winwithoutarrows.mp3',
  [GameSound.SHOOT] : 'sounds/bow-release.mp3',
  [GameSound.HITWALL] : 'sounds/wallhit.mp3',
  [GameSound.BLACKOUT] : 'sounds/blackout.mp3',
  [GameSound.PICKUP] : 'sounds/coincollect.mp3',
  [GameSound.WALK] : 'sounds/step.mp3',
  [GameSound.FF7] : 'sounds/ff7.mp3',
};

@Injectable({
  providedIn: 'root',
})
export class GameSoundService {
  private audioMap: Record<GameSound, HTMLAudioElement> = {} as Record<GameSound, HTMLAudioElement>;

  constructor() {
    for (const key of Object.values(GameSound)) {
      this.preload(key, SOUND_PATHS[key]);
    }
  }

  private preload(key: GameSound, path: string) {
    const audio = new Audio(path);
    audio.volume = 0.6;
    audio.loop = true;
    this.audioMap[key] = audio;
  }

  private play(key: GameSound, loop = true): void {
    const audio = this.audioMap[key];
    if (!audio) return;
    audio.loop = loop;
    audio.currentTime = 0;
    audio.play();
  }

  private stopAll(): void {
    for (const audio of Object.values(this.audioMap)) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  stopWumpus(): void {
    this.audioMap[GameSound.WUMPUS]?.pause();
  }

  playSound(sound: GameSound, loop = true): void {
    this.play(sound, loop);
  }

  stop(): void {
    this.stopAll();
  }
}
