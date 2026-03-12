import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ACHIEVEMENT_SERVICE, Achievement } from '@hunt-the-bishomalo/achievements/api';

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
export class ToastComponent implements OnDestroy {
  private readonly service = inject(ACHIEVEMENT_SERVICE);
  private idCounter = 0;
  toasts = signal<ToastData[]>([]);
  private readonly toastTimeouts = new Map<number, ReturnType<typeof setTimeout>>();

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
      icon: achievement.svgIcon,
    };

    this.toasts.update((prev) => [...prev, toast]);

    const timeout = setTimeout(() => {
      this.toasts.update((prev) => prev.filter((t) => t.id !== id));
      this.toastTimeouts.delete(id);
    }, 3000);

    this.toastTimeouts.set(id, timeout);
  }

  ngOnDestroy(): void {
    this.toastTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.toastTimeouts.clear();
  }
}
