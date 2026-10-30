import { Injectable, isDevMode, inject, effect } from '@angular/core';
import { IAnalyticsService } from '@hunt-the-bishomalo/core/api';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

declare global {
  var dataLayer: Record<string, unknown>[];
  var gtag: (...args: unknown[]) => void;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService implements IAnalyticsService {
  private readonly router = inject(Router);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
  );

  constructor() {
    effect(() => {
      const url = this.currentUrl();
      if (url && typeof gtag === 'function') {
        gtag('event', 'page_view', {
          page_path: url,
          page_location: globalThis.location.href,
          page_title: document.title,
        });
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
