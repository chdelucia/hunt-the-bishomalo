import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementService } from 'src/app/services/achievement/achievement.service';
import { Achievement } from 'src/app/models';

interface ToastData {
  id: number;
  achievement: Achievement;
  icon: string;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  private readonly service = inject(AchievementService);
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
      icon: achievement.svgIcon,
    };

    this.toasts.update((prev) => [...prev, toast]);

    setTimeout(() => {
      this.toasts.update((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }
}
