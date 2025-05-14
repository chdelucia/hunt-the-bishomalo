/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, isDevMode } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {

  constructor(private readonly router: Router) {
    this.trackPageViews();
  }

  private trackPageViews(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        window.gtag('event', 'page_view', {
          page_path: event.urlAfterRedirects,
          page_location: window.location.href,
          page_title: document.title
        });
      });
  }

  public sendEvent(eventName: string, params?: { [key: string]: any }): void {
    if (!window.gtag) return;
    window.gtag('event', eventName, params || {});
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
