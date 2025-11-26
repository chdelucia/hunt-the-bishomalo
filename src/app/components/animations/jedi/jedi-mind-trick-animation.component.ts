import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  NgZone,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AchieveTypes } from 'src/app/models';
import { AchievementService } from 'src/app/services/achievement/achievement.service';

@Component({
  selector: 'app-jedi-mind-trick-animation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './jedi-mind-trick-animation.component.html',
  styleUrls: ['./jedi-mind-trick-animation.component.scss'],
})
export class JediMindTrickAnimationComponent implements OnInit, OnDestroy {
  @ViewChild('audioContainer') audioContainer!: ElementRef;

  step = 1;
  forceWaves: number[] = [];

  private audioContext: AudioContext | null = null;
  private readonly timers: any[] = [];
  private echoTimeout: any = null;

  private readonly ngZone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly achieveService = inject(AchievementService);

  ngOnInit(): void {
    const schedule = [
      { delay: 500, action: () => (this.step = 2) },
      {
        delay: 1000,
        action: () => {
          this.step = 3;
          this.playForceSound();
          this.createForceWave();
        },
      },
      {
        delay: 1500,
        action: () => {
          this.step = 4;
          this.createForceWave();
        },
      },
      {
        delay: 2000,
        action: () => {
          this.step = 5;
          this.createForceWave();
        },
      },
      { delay: 2500, action: () => (this.step = 6) },
    ];

    schedule.forEach((item) => {
      this.timers.push(
        setTimeout(() => {
          this.ngZone.run(() => {
            item.action();
            this.cdr.detectChanges();
          });
        }, item.delay),
      );
    });
  }

  ngOnDestroy(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    if (this.echoTimeout) clearTimeout(this.echoTimeout);
    if (this.audioContext && this.audioContext.state !== 'closed') {
      window.speechSynthesis.cancel();
    }

    this.achieveService.activeAchievement(AchieveTypes.JEDI);
  }

  playForceSound(): void {
    this.ngZone.runOutsideAngular(() => {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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
    });
  }

  speakWhisper(text: string, volume: number, delay: number): void {
    this.echoTimeout = setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.6;
      utterance.pitch = 0.7;
      utterance.volume = volume;
      window.speechSynthesis.speak(utterance);
    }, delay);
  }

  private createForceWave(): void {
    const id = Date.now();
    this.forceWaves.push(id);
    this.cdr.detectChanges();

    setTimeout(() => {
      this.ngZone.run(() => {
        this.forceWaves = this.forceWaves.filter((w) => w !== id);
        this.cdr.detectChanges();
      });
    }, 2000);
  }
}
