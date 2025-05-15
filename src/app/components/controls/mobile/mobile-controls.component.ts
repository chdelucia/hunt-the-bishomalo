import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from 'src/app/services';


@Component({
  selector: 'app-mobile-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-controls.component.html',
  styleUrl: './mobile-controls.component.scss',
})
export class MobileControlsComponent {
  private readonly game = inject(GameEngineService);

  moveForward(): void {
    this.game.moveForward();
  }

  turnRight(): void {
    this.game.turnRight();
  }

  shootArrow(): void {
    this.game.shootArrow();
  }
}
