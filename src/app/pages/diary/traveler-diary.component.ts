import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStoryService } from 'src/app/services/story/game-story.service';
import { LevelStory } from 'src/app/services/story/stories.const';

@Component({
  selector: 'app-traveler-diary',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './traveler-diary.component.html',
  styleUrl: './traveler-diary.component.scss',
})
export class TravelerDiaryComponent implements OnInit {
  private storyService = inject(GameStoryService);

  readonly stories = signal<LevelStory[]>([]);

  ngOnInit(): void {
    this.stories.set(this.storyService.getJournalEntries());
  }

  formatEffect(effect: string): string {
    const effects: Record<string, string> = {
      extraArrow: 'Obtienes una flecha adicional',
      extraLife: 'Recuperas una vida',
      doubleGold: 'Duplicas las monedas obtenidas',
      revealHint: 'Descubres una pista oculta',
      maxLivesUp: 'Tu vida máxima aumenta',
      maxChanceDown: 'Tu probabilidad máxima disminuye',
      maxLivesDown: 'Tu vida máxima disminuye',
      fogOfWar: 'Partes del mapa se ocultan',
      trapIncrease: 'Aumentan las trampas en el nivel',
      bossReveal: 'Se revela el jefe final',
      bossFight: 'Enfrentas al jefe final',
      unlockUltimateWeapon: 'Desbloqueas el arma definitiva',
    };
    return effects[effect] || effect;
  }
}
