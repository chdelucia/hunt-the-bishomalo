import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GameSound, RouteTypes } from 'src/app/models';
import { GameEngineService, GameSoundService } from 'src/app/services';

@Component({
  selector: 'app-end-credits',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './end-credits.component.html',
  styleUrl: './end-credits.component.scss',
})
export class EndCreditsComponent implements OnInit, OnDestroy {
  readonly scrollPosition = signal(0);
  readonly autoScroll = signal(true);
  readonly MAX_SCROLL_POSITION = 2600;

  readonly roles = signal<string[]>([
    'Programador Principal',
    'Diseñador de Juego',
    'Artista de Pixel Art',
    'Compositor Musical',
    'Diseñador de Niveles',
    'Ingeniero de Sonido',
    'Tester Principal',
    'Especialista en Marketing',
    'Gestor de Comunidad',
    'Narrador',
    'Voz del Bishomalo',
    'Cuidador del Bishomalo',
    'Experto en Pozos',
    'Entrenador de Murciélagos',
    'Fabricante de Flechas',
    'Explorador de Cuevas',
    'Maestro del Tiempo',
    'Guardián del Oro',
    'Contador de Píxeles',
    'Especialista en Errores 404',
    'Redactor de Créditos',
    'Agradecimientos Especiales'
  ]);

  private lastTime = 0;
  private animationFrameId = 0;

  constructor(
    private readonly router: Router,
    private readonly gameEngine: GameEngineService,
    private readonly gameSound: GameSoundService,
  ) { }

  private startAutoScroll(): void {
    const animate = (time: number) => {
      if (this.lastTime === 0) this.lastTime = time;
      const delta = time - this.lastTime;
      this.lastTime = time;

      if (this.autoScroll()) {
        const nextScroll = this.scrollPosition() + delta * 0.05;
        if (nextScroll >= this.MAX_SCROLL_POSITION) {
          this.scrollPosition.set(this.MAX_SCROLL_POSITION);
          this.autoScroll.set(false);
          this.gameSound.stop();
          return;
        } else {
          this.scrollPosition.set(nextScroll);
        }
      }

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  ngOnInit(): void {
    this.gameSound.stop();
    this.gameSound.playSound(GameSound.GOKU, false);
    this.startAutoScroll();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
  }

  newGame(): void {
    this.gameEngine.newGame();
    this.router.navigateByUrl(RouteTypes.HOME);
  }
}
