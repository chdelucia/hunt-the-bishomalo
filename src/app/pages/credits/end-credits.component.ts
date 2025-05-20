import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GameSound, RouteTypes } from 'src/app/models';
import { GameEngineService, GameSoundService } from 'src/app/services';

@Component({
  selector: 'app-end-credits',
  imports: [CommonModule, RouterModule],
  templateUrl: './end-credits.component.html',
  styleUrl: './end-credits.component.scss',
})
export class EndCreditsComponent implements OnInit, OnDestroy {
  scrollPosition = signal(0);
  autoScroll = signal(true);

  roles = signal<string[]>([
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
    'Diseñador de Trampas',
    'Alquimista de Pociones',
    'Maestro del Tiempo',
    'Guardián del Oro',
    'Portador de la Suerte',
    'Ojo que Todo lo Ve',
    'Maestro del Teletransporte',
    'Señor de la Congelación',
    'Experto en Miniaturización',
    'Criador de Mascotas Misteriosas',
    'Catador de Café',
    'Repartidor de Pizza',
    'Contador de Píxeles',
    'Especialista en Errores 404',
    'Redactor de Créditos',
    'Agradecimientos Especiales',
  ]);

  private lastTime = 0;
  private animationFrameId = 0;

  constructor(
    private readonly router: Router,
    private readonly gameEngine: GameEngineService,
    private readonly gameSound: GameSoundService,
  ) {
    this.startAutoScroll();
  }

  private startAutoScroll(): void {
    const animate = (time: number) => {
      if (this.lastTime === 0) this.lastTime = time;
      const delta = time - this.lastTime;
      this.lastTime = time;

      if (this.autoScroll()) {
        this.scrollPosition.update((p) => p + delta * 0.05);
      }

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  ngOnInit(): void {
    this.gameSound.playSound(GameSound.GOKU, false);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
  }

  toggleAutoScroll(): void {
    this.autoScroll.set(!this.autoScroll());
    this.gameSound.stop();
  }

  resetScroll(): void {
    this.scrollPosition.set(0);
    this.autoScroll.set(true);
    this.gameSound.playSound(GameSound.GOKU, false);
  }

  newGame(): void {
    this.gameEngine.newGame();
    this.router.navigateByUrl(RouteTypes.HOME);
  }
}
