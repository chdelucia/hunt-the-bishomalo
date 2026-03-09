import { Component, effect, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Achievement } from '@hunt-the-bishomalo/data';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/core/services';

interface ToastData {
  id: number;
  achievement: Achievement;
  icon: string;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  private readonly service = inject(ACHIEVEMENT_SERVICE);
  private idCounter = 0;
  toasts = signal<ToastData[]>([]);

  constructor() {
    effect(() => {
      const achievement = (this.service as any).completed();
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
      icon: achievement.svgIcon,
    };

    this.toasts.update((prev) => [...prev, toast]);

    setTimeout(() => {
      this.toasts.update((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }
}
