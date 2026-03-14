import { Component, OnInit, OnDestroy, ElementRef, viewChild, signal, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AchieveTypes, ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';

@Component({
  selector: 'app-jedi-mind-trick-animation',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './jedi-mind-trick-animation.component.html',
  styleUrls: ['./jedi-mind-trick-animation.component.scss'],
})
export class JediMindTrickAnimationComponent implements OnInit, OnDestroy {
  audioContainer = viewChild<ElementRef>('audioContainer');

  step = signal(1);
  forceWaves = signal<number[]>([]);

  private audioContext: AudioContext | null = null;
  private readonly timers: ReturnType<typeof setTimeout>[] = [];

  private readonly achieveService = inject(ACHIEVEMENT_SERVICE);

  ngOnInit(): void {
    const schedule = [
      { delay: 500, action: () => this.step.set(2) },
      {
        delay: 1000,
        action: () => {
          this.step.set(3);
          this.playForceSound();
          this.createForceWave();
        },
      },
      {
        delay: 1500,
        action: () => {
          this.step.set(4);
          this.createForceWave();
        },
      },
      {
        delay: 2000,
        action: () => {
          this.step.set(5);
          this.createForceWave();
        },
      },
      { delay: 2500, action: () => this.step.set(6) },
    ];

    schedule.forEach((item) => {
      this.timers.push(
        setTimeout(() => {
          item.action();
        }, item.delay),
      );
    });
  }

  ngOnDestroy(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    if (globalThis.speechSynthesis) {
      globalThis.speechSynthesis.cancel();
    }

    this.achieveService.activeAchievement(AchieveTypes.JEDI);
  }

  playForceSound(): void {
    this.audioContext = new (globalThis.AudioContext ||
      (globalThis as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 200;

    const modulator = this.audioContext.createOscillator();
    modulator.type = 'sine';
    modulator.frequency.value = 2.5;

    const modulationGain = this.audioContext.createGain();
    modulationGain.gain.value = 50;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0;

    modulator.connect(modulationGain);
    modulationGain.connect(oscillator.frequency);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 1.5);
    gainNode.gain.linearRampToValueAtTime(0, now + 2.5);

    oscillator.start(now);
    modulator.start(now);
    oscillator.stop(now + 2.5);
    modulator.stop(now + 2.5);

    this.speakWhisper('Contrata a Chris', 0.4, 1000);
    this.speakWhisper('Contrata a Chris', 0.2, 1300);
    this.speakWhisper('Contrata a Chris', 0.1, 1600);
  }

  speakWhisper(text: string, volume: number, delay: number): void {
    this.timers.push(
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.6;
        utterance.pitch = 0.7;
        utterance.volume = volume;
        globalThis.speechSynthesis.speak(utterance);
      }, delay),
    );
  }

  private createForceWave(): void {
    const id = Date.now();
    this.forceWaves.update((waves) => [...waves, id]);

    this.timers.push(
      setTimeout(() => {
        this.forceWaves.update((waves) => waves.filter((w) => w !== id));
      }, 2000),
    );
  }
}
