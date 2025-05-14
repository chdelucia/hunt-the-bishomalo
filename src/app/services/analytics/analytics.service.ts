/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, isDevMode } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare let gtag: (...args: any[]) => void;

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {

  constructor(private router: Router) {
    this.trackPageViews();
  }

  private trackPageViews(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        gtag('event', 'page_view', {
          page_path: event.urlAfterRedirects,
          page_location: window.location.href,
          page_title: document.title
        });
      });
  }

  public sendEvent(eventName: string, params?: { [key: string]: any }): void {
    if (!gtag) return;
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
