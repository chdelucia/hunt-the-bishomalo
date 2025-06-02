import { effect, inject, Injectable } from '@angular/core';
import { GameSound } from 'src/app/models';
import { GameStore } from 'src/app/store';

const SOUND_PATHS: Record<GameSound, string> = {
  [GameSound.WUMPUS]: 'sounds/monster.mp3',
  [GameSound.GOLD]: 'sounds/gold.mp3',
  [GameSound.WIND]: 'sounds/wind.mp3',
  [GameSound.SCREAM]: 'sounds/scream.mp3',
  [GameSound.PAIN]: 'sounds/pain.mp3',
  [GameSound.WRAT]: 'sounds/winrat.mp3',
  [GameSound.WHONOR]: 'sounds/win.mp3',
  [GameSound.ARROWS]: 'sounds/winwitharrows.mp3',
  [GameSound.NOARROWS]: 'sounds/winwithoutarrows.mp3',
  [GameSound.SHOOT]: 'sounds/bow-release.mp3',
  [GameSound.HITWALL]: 'sounds/wallhit.mp3',
  [GameSound.BLACKOUT]: 'sounds/blackout.mp3',
  [GameSound.PICKUP]: 'sounds/coincollect.mp3',
  [GameSound.WALK]: 'sounds/step.mp3',
  [GameSound.FF7]: 'sounds/ff7.mp3',
  [GameSound.PITDIE]: 'sounds/pitdie.mp3',
  [GameSound.DEFAULT]: '',
  [GameSound.LARA]: 'sounds/tombraiderintro.mp3',
  [GameSound.LINK]: 'sounds/zeldaintro.mp3',
  [GameSound.LEGOLAS]: 'sounds/legolasintro.mp3',
  [GameSound.PENTA]: 'sounds/pentakill.mp3',
  [GameSound.FINISH]: 'sounds/ending.mp3',
  [GameSound.REWIND]: 'sounds/rewind.mp3',
  [GameSound.SHIELD]: 'sounds/shield.mp3',
  [GameSound.GOKU]: 'sounds/goku.mp3',
  [GameSound.BATTLE]: 'sounds/battle.mp3',
  [GameSound.SUCCESS]: 'sounds/success.mp3',
  [GameSound.GAMEOVER]: 'sounds/gameover.mp3',
};

@Injectable({
  providedIn: 'root',
})
export class GameSoundService {
  private audioMap: Record<GameSound, HTMLAudioElement> = {} as Record<GameSound, HTMLAudioElement>;
  private readonly gameStore = inject(GameStore);
  constructor() {
    effect(() => this.gameOver());
  }

  private gameOver(): void {
    if (!this.gameStore.lives()) {
      this.stopAll();
      this.playSound(GameSound.GAMEOVER, false);
    }
  }
  private getOrCreateAudio(key: GameSound): HTMLAudioElement {
    if (!this.audioMap[key]) {
      const path = SOUND_PATHS[key];
      const audio = new Audio(path);
      audio.volume = 0.5;
      this.audioMap[key] = audio;
    }
    return this.audioMap[key];
  }

  private play(key: GameSound, loop = true): void {
    const audio = this.getOrCreateAudio(key);
    audio.loop = loop;
    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.info('Audio play failed:', err);
    });
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
