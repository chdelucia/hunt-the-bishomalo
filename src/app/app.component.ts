import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components';

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

export class AppComponent {
  title = 'hunt-the-bishomalo';
}
