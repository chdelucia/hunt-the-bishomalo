import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components';
import { filter } from 'rxjs';

declare let gtag: (...args: any[]) => void;

@Component({
  imports: [
    RouterModule,
    CommonModule,
    ToastComponent
],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent implements OnInit {
  title = 'hunt-the-bishomalo';
    constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        gtag('config', 'G-298LKLF45E', {
          page_path: event.urlAfterRedirects,
        });
      });
  }
}
