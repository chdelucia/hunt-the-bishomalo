import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Achievement } from 'src/app/models';
import { AchievementService } from 'src/app/services/achievement/achievement.service';



@Component({
  selector: 'app-achievements',
  imports: [CommonModule, RouterModule],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss',
})
export class AchievementsComponent implements OnInit {
  achieveService = inject(AchievementService);
  filter: 'all' | 'unlocked' | 'locked' = 'all';
  achievements: Achievement[] = this.achieveService.achievements;
  filteredAchievements: Achievement[] = [];
  
  rarityColors = {
    common: 'bg-gray-500',
    uncommon: 'bg-green-500',
    rare: 'bg-blue-500',
    epic: 'bg-purple-500',
    legendary: 'bg-yellow-500',
  };

  rarityNames = {
    common: 'Común',
    uncommon: 'Poco común',
    rare: 'Raro',
    epic: 'Épico',
    legendary: 'Legendario',
  };

  unlockedCount = 0;
  percentage = 0;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.updateFilteredAchievements();
    this.calculateProgress();
  }


  updateFilteredAchievements(): void {
    this.filteredAchievements = this.achievements.filter((achievement) => {
      if (this.filter === 'all') return true;
      if (this.filter === 'unlocked') return achievement.unlocked;
      if (this.filter === 'locked') return !achievement.unlocked;
      return true;
    });
  }

  calculateProgress(): void {
    this.unlockedCount = this.achievements.filter(a => a.unlocked).length;
    this.percentage = Math.round((this.unlockedCount / this.achievements.length) * 100);
  }

  setFilter(newFilter: 'all' | 'unlocked' | 'locked'): void {
    this.filter = newFilter;
    this.updateFilteredAchievements();
  }

  getSanitizedSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  getRarityColor(rarity: string): string {
    return this.rarityColors[rarity as keyof typeof this.rarityColors];
  }

  getRarityName(rarity: string): string {
    return this.rarityNames[rarity as keyof typeof this.rarityNames];
  }
}
