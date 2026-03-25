import { Component, effect, input, OnDestroy, signal } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { Achievement } from '@hunt-the-bishomalo/shared-data';

interface ToastData {
  id: number;
  achievement: Achievement;
  icon: string;
}

@Component({
  selector: 'lib-toast',
  standalone: true,
  imports: [NgOptimizedImage, NgClass],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent implements OnDestroy {
  achievement = input<Achievement | undefined>();

  private idCounter = 0;
  readonly toasts = signal<(ToastData & { broken?: boolean })[]>([]);
  private readonly toastTimeouts = new Map<number, ReturnType<typeof setTimeout>>();

  constructor() {
    effect(() => {
      const achievement = this.achievement();
      if (achievement) {
        this.addToast(achievement);
      }
    });
  }

  onImageError(id: number): void {
    this.toasts.update((prev) => prev.map((t) => (t.id === id ? { ...t, broken: true } : t)));
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
