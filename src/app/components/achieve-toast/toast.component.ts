import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementService } from 'src/app/services/achievement/achievement.service';
import { Achievement } from 'src/app/models';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface ToastData {
  id: number;
  achievement: Achievement;
  icon: SafeHtml;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  private service = inject(AchievementService);
  private sanitizer = inject(DomSanitizer);
  private idCounter = 0;
  toasts = signal<ToastData[]>([]);

  constructor() {
    effect(() => {
      const achievement = this.service.completed();
      if (achievement) {
        this.addToast(achievement);
      }
    });
  }

  private addToast(achievement: Achievement) {
    const id = this.idCounter++;
    const toast: ToastData = {
      id,
      achievement,
      icon: this.sanitizer.bypassSecurityTrustHtml(achievement.svgIcon),
    };

    this.toasts.update((prev) => [...prev, toast]);

    setTimeout(() => {
      this.toasts.update((prev) => prev.filter(t => t.id !== id));
    }, 3000);
  }
}
