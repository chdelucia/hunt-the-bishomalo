import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameConfigComponent } from '../../components/config/game-config.component';
import { TitleComponent } from '../../components/title/title.component';

@Component({
  selector: 'app-config',
  imports: [CommonModule, GameConfigComponent, TitleComponent],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
})
export class ConfigComponent {}
