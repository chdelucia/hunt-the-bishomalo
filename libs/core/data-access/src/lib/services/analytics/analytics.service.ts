import { Injectable, isDevMode, inject, effect } from '@angular/core';
import { IAnalyticsService } from '@hunt-the-bishomalo/core/api';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd } from '@angular/router';

declare global {
  var dataLayer: Record<string, unknown>[];
  var gtag: (...args: unknown[]) => void;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService implements IAnalyticsService {
  private readonly router = inject(Router);
  private readonly routerEventsSignal = toSignal(this.router.events);

  constructor() {
    this.trackPageViews();
  }

  private trackPageViews(): void {
    effect(() => {
      const event = this.routerEventsSignal();
      if (event instanceof NavigationEnd) {
        if (typeof gtag === 'function') {
          gtag('event', 'page_view', {
            page_path: event.urlAfterRedirects,
            page_location: globalThis.location.href,
            page_title: document.title,
          });
        }
      }
    });
  }

  public sendEvent(eventName: string, params?: Record<string, unknown>): void {
    if (typeof gtag !== 'function') return;
    gtag('event', eventName, params || {});
  }

  public trackAchievementUnlocked(id: string, title: string): void {
    this.sendEvent('achievement_unlocked', {
      achievement_id: id,
      achievement_name: title,
      category: 'achievements',
      debug_mode: isDevMode(),
    });
  }
}
