import { Component, effect, input, signal, inject, DestroyRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { ASSETS_BASE_URL, Achievement } from '@hunt-the-bishomalo/shared-data';
import { TranslocoModule } from '@jsverse/transloco';

interface ToastData {
  id: number;
  achievement: Achievement;
  icon: string;
}

@Component({
  selector: 'lib-toast',
  standalone: true,
  imports: [NgClass, TranslocoModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  protected readonly ASSETS_BASE_URL = ASSETS_BASE_URL;
  achievement = input<Achievement | undefined>();

  private idCounter = 0;
  readonly toasts = signal<(ToastData & { broken?: boolean })[]>([]);
  private readonly toastTimeouts = new Map<number, ReturnType<typeof setTimeout>>();
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const achievement = this.achievement();
      if (achievement) {
        this.addToast(achievement);
      }
    });

    this.destroyRef.onDestroy(() => {
      this.toastTimeouts.forEach((timeout) => clearTimeout(timeout));
      this.toastTimeouts.clear();
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
}
