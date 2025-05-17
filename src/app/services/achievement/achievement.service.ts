import { effect, Injectable, signal } from '@angular/core';
import { Achievement, AchieveTypes, Cell, GameSound } from 'src/app/models';
import {
  AnalyticsService,
  GameSoundService,
  GameStoreService,
  LocalstorageService,
} from 'src/app/services';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  achievements = [
    {
      id: 'kill_wumpus',
      title: 'Has matado al bisho malo',
      description: 'Eliminaste a un Wumpus con una flecha bien dirigida',
      unlocked: false,
      rarity: 'uncommon',
      date: '12 May, 2025',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#e53e3e" />
          <path d="M6 8 L 10 12 M 10 8 L 6 12" stroke="white" stroke-width="1.5" />
          <path d="M14 8 L 18 12 M 18 8 L 14 12" stroke="white" stroke-width="1.5" />
          <path d="M8 16 C 12 12, 16 16, 16 16" stroke="white" stroke-width="1.5" />
          <path d="M12 2 L 12 22" stroke="yellow" stroke-width="1.5" />
          <path d="M8 18 L 12 22 L 16 18" stroke="yellow" stroke-width="1.5" />
        </svg>`,
    },
    {
      id: 'escape_rat',
      title: 'Has escapado como una rata',
      description: 'Escapaste de la cueva sin matar a ningún Wumpus',
      unlocked: false,
      rarity: 'common',
      date: '10 May, 2025',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="2" fill="#047857" />
          <rect x="6" y="6" width="12" height="12" rx="1" fill="#10b981" />
          <path d="M8 12 L 12 16 L 16 12" stroke="white" stroke-width="2" stroke-linecap="round" />
          <path d="M12 16 L 12 8" stroke="white" stroke-width="2" stroke-linecap="round" />
          <circle cx="18" cy="6" r="3" fill="#f6e05e" />
        </svg>`,
    },
    {
      id: 'collect_arrow',
      title: 'Has recogido una flecha caída',
      description: 'Encontraste una flecha adicional durante tu aventura',
      unlocked: false,
      rarity: 'uncommon',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="4" y1="12" x2="20" y2="12" stroke="#fbbf24" stroke-width="2" />
          <polygon points="20,12 15,8 15,16" fill="#fbbf24" />
          <polygon points="4,12 9,8 9,16" fill="#fbbf24" />
        </svg>`,
    },
    {
      id: 'hero_escape',
      title: 'Héroe: escapaste matando al bisho malo',
      description: 'Mataste al Wumpus y escapaste con el oro',
      unlocked: false,
      rarity: 'epic',
      date: '11 May, 2025',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#8b5cf6" />
          <polygon points="12,4 14,10 20,10 15,14 17,20 12,16 7,20 9,14 4,10 10,10" fill="#fbbf24" />
          <circle cx="12" cy="12" r="3" fill="#f6e05e" />
        </svg>`,
    },
    {
      id: 'survive_blackout',
      title: 'Has vivido un apagón',
      description: 'Experimentaste un apagón! Vaya ni que estuvieses en ESPAÑA',
      unlocked: false,
      rarity: 'rare',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="2" fill="#1e293b" />
          <path d="M12 5 L12 12" stroke="#f6e05e" stroke-width="2" stroke-linecap="round" />
          <path d="M12 12 L16 16" stroke="#f6e05e" stroke-width="2" stroke-linecap="round" />
          <circle cx="12" cy="12" r="2" fill="#f6e05e" />
        </svg>`,
    },
    {
      id: 'survive_blackout_complete',
      title: 'Has sobrevivido a un apagón',
      description: 'Sobreviviste a un apagón y continuaste tu aventura',
      unlocked: false,
      rarity: 'legendary',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="2" fill="#1e293b" />
          <path d="M12 5 L12 12" stroke="#f6e05e" stroke-width="2" stroke-linecap="round" />
          <path d="M12 12 L16 16" stroke="#f6e05e" stroke-width="2" stroke-linecap="round" />
          <circle cx="12" cy="12" r="2" fill="#f6e05e" />
          <path d="M5 19 L19 19" stroke="#10b981" stroke-width="2" stroke-linecap="round" />
          <path d="M9 15 L15 15" stroke="#10b981" stroke-width="2" stroke-linecap="round" />
        </svg>`,
    },
    {
      id: 'death_by_wumpus',
      title: 'Muerte por bisho malo',
      description: 'Fuiste devorado por un Wumpus',
      unlocked: false,
      rarity: 'common',
      date: '9 May, 2025',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#e53e3e" />
          <circle cx="8" cy="10" r="2" fill="white" />
          <circle cx="16" cy="10" r="2" fill="white" />
          <circle cx="8" cy="10" r="1" fill="black" />
          <circle cx="16" cy="10" r="1" fill="black" />
          <path d="M8 16 C 12 20, 16 16, 16 16" stroke="white" stroke-width="1.5" />
          <path d="M7 4 L 10 8" stroke="black" stroke-width="2" />
          <path d="M17 4 L 14 8" stroke="black" stroke-width="2" />
        </svg>`,
    },
    {
      id: 'death_by_pit',
      title: 'Te ahogaste en un pozito',
      description: 'Caíste en un pozo y no pudiste salir',
      unlocked: false,
      rarity: 'common',
      date: '8 May, 2025',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#1a202c" />
          <circle cx="12" cy="12" r="8" fill="#2d3748" />
          <circle cx="12" cy="12" r="6" fill="#1a202c" />
          <circle cx="12" cy="12" r="4" fill="#000000" />
          <circle cx="9" cy="9" r="1" fill="#4a5568" />
          <circle cx="15" cy="8" r="1" fill="#4a5568" />
        </svg>`,
    },
    {
      id: 'collect_gold',
      title: 'Has recogido moneda',
      description: 'Encontraste el oro en la cueva',
      unlocked: false,
      rarity: 'uncommon',
      date: '11 May, 2025',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#fbbf24" />
          <circle cx="12" cy="12" r="6" fill="#f59e0b" />
          <path d="M8 12 L 12 8 L 16 12 L 12 16 Z" fill="#fcd34d" />
        </svg>`,
    },
    {
      id: 'death_during_blackout',
      title: 'Muerte durante el apagón',
      description: 'Fuiste víctima de la oscuridad durante un apagón',
      unlocked: false,
      rarity: 'rare',
      date: '13 May, 2025',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="2" fill="#1e293b" />
          <path d="M12 5 L12 12" stroke="#f6e05e" stroke-width="2" stroke-linecap="round" />
          <path d="M12 12 L16 16" stroke="#f6e05e" stroke-width="2" stroke-linecap="round" />
          <circle cx="12" cy="12" r="2" fill="#f6e05e" />
          <path d="M7 7 L 17 17" stroke="#e53e3e" stroke-width="2" stroke-linecap="round" />
          <path d="M17 7 L 7 17" stroke="#e53e3e" stroke-width="2" stroke-linecap="round" />
        </svg>`,
    },
    {
      id: 'hard_head',
      title: 'Cabeza dura',
      description: 'Has chocado contra muros repetidamente',
      unlocked: false,
      rarity: 'common',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="10" r="8" fill="#f6ad55" />
          <path d="M4 10 L 2 10" stroke="#718096" stroke-width="2" stroke-linecap="round" />
          <path d="M20 10 L 22 10" stroke="#718096" stroke-width="2" stroke-linecap="round" />
          <path d="M12 2 L 12 4" stroke="#718096" stroke-width="2" stroke-linecap="round" />
          <circle cx="9" cy="8" r="1.5" fill="#4a5568" />
          <circle cx="15" cy="8" r="1.5" fill="#4a5568" />
          <path d="M9 12 C 10 14, 14 14, 15 12" stroke="#4a5568" stroke-width="1.5" stroke-linecap="round" />
          <path d="M4 18 L 20 18" stroke="#718096" stroke-width="4" stroke-linecap="round" />
          <path d="M7 22 L 17 22" stroke="#718096" stroke-width="2" stroke-linecap="round" />
        </svg>`,
    },
    {
      id: 'large_map_completion',
      title: 'Explorador de grandes cavernas',
      description: 'Completaste un mapa de más de 12x12',
      unlocked: false,
      rarity: 'epic',
      date: '14 May, 2025',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="2" fill="#4c1d95" />
          <path d="M5 5 L 19 5" stroke="#c4b5fd" stroke-width="1" stroke-linecap="round" />
          <path d="M5 8 L 19 8" stroke="#c4b5fd" stroke-width="1" stroke-linecap="round" />
          <path d="M5 11 L 19 11" stroke="#c4b5fd" stroke-width="1" stroke-linecap="round" />
          <path d="M5 14 L 19 14" stroke="#c4b5fd" stroke-width="1" stroke-linecap="round" />
          <path d="M5 17 L 19 17" stroke="#c4b5fd" stroke-width="1" stroke-linecap="round" />
          <path d="M5 5 L 5 19" stroke="#c4b5fd" stroke-width="1" stroke-linecap="round" />
          <path d="M8 5 L 8 19" stroke="#c4b5fd" stroke-width="1" stroke-linecap="round" />
          <path d="M11 5 L 11 19" stroke="#c4b5fd" stroke-width="1" stroke-linecap="round" />
          <path d="M14 5 L 14 19" stroke="#c4b5fd" stroke-width="1" stroke-linecap="round" />
          <path d="M17 5 L 17 19" stroke="#c4b5fd" stroke-width="1" stroke-linecap="round" />
          <circle cx="12" cy="12" r="3" fill="#8b5cf6" />
          <path d="M12 9 L 12 15" stroke="#c4b5fd" stroke-width="1" stroke-linecap="round" />
          <path d="M9 12 L 15 12" stroke="#c4b5fd" stroke-width="1" stroke-linecap="round" />
        </svg>`,
    },
    {
      id: 'missed_last_arrow',
      title: 'Fallaste tu última bala',
      description: 'Disparaste tu última flecha y fallaste el tiro',
      unlocked: false,
      rarity: 'common',
      date: '10 May, 2025',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="4" y1="12" x2="20" y2="12" stroke="#fbbf24" stroke-width="2" />
          <polygon points="20,12 15,8 15,16" fill="#fbbf24" />
          <polygon points="4,12 9,8 9,16" fill="#fbbf24" />
          <path d="M7 7 L 17 17" stroke="#e53e3e" stroke-width="2" stroke-linecap="round" />
          <path d="M17 7 L 7 17" stroke="#e53e3e" stroke-width="2" stroke-linecap="round" />
        </svg>`,
    },
    {
      id: 'wasted_arrows',
      title: 'Desastre',
      description: 'Acabaste la partida con más de una bala y no mataste al bicho',
      unlocked: false,
      rarity: 'uncommon',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#e53e3e" />
          <line x1="8" y1="8" x2="16" y2="16" stroke="white" stroke-width="2" stroke-linecap="round" />
          <line x1="16" y1="8" x2="8" y2="16" stroke="white" stroke-width="2" stroke-linecap="round" />
          <line x1="6" y1="18" x2="10" y2="18" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" />
          <polygon points="10,18 8,16 8,20" fill="#fbbf24" />
          <line x1="14" y1="18" x2="18" y2="18" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" />
          <polygon points="14,18 16,16 16,20" fill="#fbbf24" />
        </svg>`,
    },
    {
      id: 'speedrunner',
      title: 'Speedrunner',
      description: 'Completaste una partida en menos de 10 segundos',
      unlocked: false,
      rarity: 'legendary',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#8b5cf6" />
    <circle cx="12" cy="12" r="7" fill="#7c3aed" />
    <path d="M12 5 L 12 7" stroke="white" stroke-width="1.5" stroke-linecap="round" />
    <path d="M12 17 L 12 19" stroke="white" stroke-width="1.5" stroke-linecap="round" />
    <path d="M5 12 L 7 12" stroke="white" stroke-width="1.5" stroke-linecap="round" />
    <path d="M17 12 L 19 12" stroke="white" stroke-width="1.5" stroke-linecap="round" />
    <path d="M12 12 L 16 12" stroke="white" stroke-width="2" stroke-linecap="round" />
    <path d="M12 12 L 12 8" stroke="white" stroke-width="2" stroke-linecap="round" />
    <circle cx="12" cy="12" r="1" fill="white" />
  </svg>`,
    },
    {
      id: 'true_gamer',
      title: 'True Gamer',
      description: 'Eres un OG WASD son tus keys',
      unlocked: false,
      rarity: 'common',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="16" rx="2" fill="#4a5568" />
    <rect x="4" y="4" width="4" height="4" rx="1" fill="#a0aec0" />
    <rect x="9" y="4" width="4" height="4" rx="1" fill="#a0aec0" />
    <rect x="14" y="4" width="4" height="4" rx="1" fill="#a0aec0" />
    <rect x="4" y="9" width="4" height="4" rx="1" fill="#a0aec0" />
    <rect x="9" y="9" width="4" height="4" rx="1" fill="#a0aec0" />
    <rect x="14" y="9" width="4" height="4" rx="1" fill="#a0aec0" />
    <rect x="6" y="18" width="12" height="4" rx="1" fill="#4a5568" />
    <text x="5.5" y="7" font-family="sans-serif" font-size="3" font-weight="bold" fill="#1a202c">W</text>
    <text x="5.5" y="12" font-family="sans-serif" font-size="3" font-weight="bold" fill="#1a202c">A</text>
    <text x="10.5" y="12" font-family="sans-serif" font-size="3" font-weight="bold" fill="#1a202c">S</text>
    <text x="15.5" y="12" font-family="sans-serif" font-size="3" font-weight="bold" fill="#1a202c">D</text>
    <path d="M19 6 L 21 4" stroke="#f6e05e" stroke-width="1" stroke-linecap="round" />
    <path d="M19 4 L 21 6" stroke="#f6e05e" stroke-width="1" stroke-linecap="round" />
    <path d="M19 11 L 21 9" stroke="#f6e05e" stroke-width="1" stroke-linecap="round" />
    <path d="M19 9 L 21 11" stroke="#f6e05e" stroke-width="1" stroke-linecap="round" />
  </svg>`,
    },
    {
      id: 'sniper',
      title: 'Francotirador',
      description: 'Mataste al Wumpus con un disparo desde más de 5 casillas de distancia',
      unlocked: false,
      rarity: 'epic',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#8b5cf6" />
    <circle cx="6" cy="6" r="2" fill="#f6e05e" />
    <circle cx="18" cy="18" r="3" fill="#e53e3e" />
    <path d="M7.5 7.5 L 16.5 16.5" stroke="#f6e05e" stroke-width="1" stroke-dasharray="2 1" />
    <path d="M8 6 L 10 6" stroke="#f6e05e" stroke-width="1.5" stroke-linecap="round" />
    <path d="M6 8 L 6 10" stroke="#f6e05e" stroke-width="1.5" stroke-linecap="round" />
    <path d="M18 15 L 18 17" stroke="#e53e3e" stroke-width="1.5" stroke-linecap="round" />
    <path d="M15 18 L 17 18" stroke="#e53e3e" stroke-width="1.5" stroke-linecap="round" />
    <path d="M19 18 L 21 18" stroke="#e53e3e" stroke-width="1.5" stroke-linecap="round" />
    <path d="M18 19 L 18 21" stroke="#e53e3e" stroke-width="1.5" stroke-linecap="round" />
    <path d="M7 7 L 17 17" stroke="#f6e05e" stroke-width="1" />
  </svg>`,
    },
    {
      id: 'death_duel',
      title: 'Duelo a Muerte',
      description: 'Mataste al Wumpus estando en una casilla adyacente',
      unlocked: false,
      rarity: 'legendary',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#ecc94b" />
    <circle cx="8" cy="10" r="3" fill="#f6e05e" />
    <circle cx="16" cy="10" r="3" fill="#e53e3e" />
    <path d="M8 10 L 16 10" stroke="#fbbf24" stroke-width="2" stroke-dasharray="1 1" />
    <path d="M6 8 L 10 12" stroke="#f6e05e" stroke-width="1.5" stroke-linecap="round" />
    <path d="M10 8 L 6 12" stroke="#f6e05e" stroke-width="1.5" stroke-linecap="round" />
    <path d="M14 8 L 18 12" stroke="#e53e3e" stroke-width="1.5" stroke-linecap="round" />
    <path d="M18 8 L 14 12" stroke="#e53e3e" stroke-width="1.5" stroke-linecap="round" />
    <path d="M8 16 L 16 16" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" />
    <path d="M10 14 L 14 18" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round" />
    <path d="M14 14 L 10 18" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round" />
  </svg>`,
    },
    {
      id: 'novice_cartographer',
      title: 'Cartógrafo Novato',
      description: 'Exploraste el 50% de una cueva',
      unlocked: false,
      rarity: 'common',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="2" fill="#718096" />
    <path d="M7 7 L 17 7" stroke="#e2e8f0" stroke-width="1" stroke-linecap="round" />
    <path d="M7 10 L 17 10" stroke="#e2e8f0" stroke-width="1" stroke-linecap="round" />
    <path d="M7 13 L 17 13" stroke="#e2e8f0" stroke-width="1" stroke-linecap="round" />
    <path d="M7 16 L 17 16" stroke="#e2e8f0" stroke-width="1" stroke-linecap="round" />
    <path d="M7 7 L 7 17" stroke="#e2e8f0" stroke-width="1" stroke-linecap="round" />
    <path d="M10 7 L 10 17" stroke="#e2e8f0" stroke-width="1" stroke-linecap="round" />
    <path d="M13 7 L 13 17" stroke="#e2e8f0" stroke-width="1" stroke-linecap="round" />
    <path d="M16 7 L 16 17" stroke="#e2e8f0" stroke-width="1" stroke-linecap="round" />
    <rect x="7" y="7" width="3" height="3" fill="#3182ce" />
    <rect x="10" y="7" width="3" height="3" fill="#3182ce" />
    <rect x="7" y="10" width="3" height="3" fill="#3182ce" />
    <rect x="13" y="10" width="3" height="3" fill="#3182ce" />
    <rect x="10" y="13" width="3" height="3" fill="#3182ce" />
  </svg>`,
    },
    {
      id: 'expert_cartographer',
      title: 'Cartógrafo Experto',
      description: 'Exploraste el 100% de una cueva',
      unlocked: false,
      rarity: 'legendary',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="2" fill="#4299e1" />
    <path d="M7 7 L 17 7" stroke="#e2e8f0" stroke-width="1" stroke-linecap="round" />
    <path d="M7 10 L 17 10" stroke="#e2e8f0" stroke-width="1" stroke-linecap="round" />
    <path d="M7 13 L 17 13" stroke="#e2e8f0" stroke-width="1" stroke-linecap="round" />
    <path d="M7 16 L 17 16" stroke="#e2e8f0" stroke-width="1" stroke-linecap="round" />
    <path d="M7 7 L 7 17" stroke="#e2e8f0" stroke-width="1" stroke-linecap="round" />
    <path d="M10 7 L 10 17" stroke="#e2e8f0" stroke-width="1" stroke-linecap="round" />
    <path d="M13 7 L 13 17" stroke="#e2e8f0" stroke-width="1" stroke-linecap="round" />
    <path d="M16 7 L 16 17" stroke="#e2e8f0" stroke-width="1" stroke-linecap="round" />
    <rect x="7" y="7" width="3" height="3" fill="#3182ce" />
    <rect x="10" y="7" width="3" height="3" fill="#3182ce" />
    <rect x="13" y="7" width="3" height="3" fill="#3182ce" />
    <rect x="16" y="7" width="1" height="3" fill="#3182ce" />
    <rect x="7" y="10" width="3" height="3" fill="#3182ce" />
    <rect x="10" y="10" width="3" height="3" fill="#3182ce" />
    <rect x="13" y="10" width="3" height="3" fill="#3182ce" />
    <rect x="16" y="10" width="1" height="3" fill="#3182ce" />
    <rect x="7" y="13" width="3" height="3" fill="#3182ce" />
    <rect x="10" y="13" width="3" height="3" fill="#3182ce" />
    <rect x="13" y="13" width="3" height="3" fill="#3182ce" />
    <rect x="16" y="13" width="1" height="3" fill="#3182ce" />
    <rect x="7" y="16" width="3" height="1" fill="#3182ce" />
    <rect x="10" y="16" width="3" height="1" fill="#3182ce" />
    <rect x="13" y="16" width="3" height="1" fill="#3182ce" />
    <rect x="16" y="16" width="1" height="1" fill="#3182ce" />
  </svg>`,
    },
    {
      id: 'blind_shot',
      title: 'Disparo a Ciegas',
      description: 'Mataste al Wumpus durante un apagón',
      unlocked: false,
      rarity: 'epic',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#1e293b" />
    <line x1="6" y1="12" x2="18" y2="12" stroke="#f6e05e" stroke-width="2" />
    <polygon points="18,12 14,10 14,14" fill="#f6e05e" />
    <polygon points="6,12 10,10 10,14" fill="#f6e05e" />
    <circle cx="18" cy="12" r="3" fill="#e53e3e" />
    <path d="M16 10 L 20 14" stroke="#f6e05e" stroke-width="1.5" stroke-linecap="round" />
    <path d="M20 10 L 16 14" stroke="#f6e05e" stroke-width="1.5" stroke-linecap="round" />
    <path d="M12 5 L 12 8" stroke="#f6e05e" stroke-width="1" stroke-linecap="round" />
    <path d="M12 16 L 12 19" stroke="#f6e05e" stroke-width="1" stroke-linecap="round" />
  </svg>`,
    },
    {
      id: 'last_breath',
      title: 'Último Aliento',
      description: 'Mataste al Wumpus y moriste en el intento',
      unlocked: false,
      rarity: 'rare',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#4299e1" />
    <circle cx="8" cy="10" r="3" fill="#f6e05e" />
    <circle cx="16" cy="10" r="3" fill="#e53e3e" />
    <path d="M6 8 L 10 12" stroke="#f6e05e" stroke-width="1.5" stroke-linecap="round" />
    <path d="M10 8 L 6 12" stroke="#f6e05e" stroke-width="1.5" stroke-linecap="round" />
    <path d="M14 8 L 18 12" stroke="#e53e3e" stroke-width="1.5" stroke-linecap="round" />
    <path d="M18 8 L 14 12" stroke="#e53e3e" stroke-width="1.5" stroke-linecap="round" />
    <path d="M8 16 L 16 16" stroke="#f6e05e" stroke-width="2" stroke-linecap="round" />
    <path d="M10 14 L 14 18" stroke="#f6e05e" stroke-width="1.5" stroke-linecap="round" />
    <path d="M14 14 L 10 18" stroke="#f6e05e" stroke-width="1.5" stroke-linecap="round" />
  </svg>`,
    },
    {
      id: 'secret',
      title: 'Secreto oculto 8x8',
      description: 'Encontraste al Jedi, que la fuerza te acompañe!',
      unlocked: false,
      rarity: 'legendary',
      hidden: true,
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#000000" />
    <path d="M7 7 C 7 5, 17 5, 17 7" stroke="#000000" stroke-width="2" fill="#1a1a1a" />
    <path d="M5 9 C 5 6, 19 6, 19 9 L 19 12 C 19 16, 17 18, 12 20 C 7 18, 5 16, 5 12 Z" fill="#1a1a1a" />
    <path d="M8 9 L 8 14" stroke="#444444" stroke-width="1" />
    <path d="M16 9 L 16 14" stroke="#444444" stroke-width="1" />
    <path d="M7.5 10 C 7.5 8, 16.5 8, 16.5 10" stroke="#444444" stroke-width="0.75" fill="none" />
    <path d="M9 12 L 15 12" stroke="#444444" stroke-width="0.75" />
    <path d="M9 14 L 15 14" stroke="#444444" stroke-width="0.75" />
    <path d="M10 16 L 14 16" stroke="#444444" stroke-width="0.75" />
    <path d="M7 7 L 7 9" stroke="#000000" stroke-width="1" />
    <path d="M17 7 L 17 9" stroke="#000000" stroke-width="1" />
    <path d="M9 7 L 9 8" stroke="#000000" stroke-width="1" />
    <path d="M15 7 L 15 8" stroke="#000000" stroke-width="1" />
    <path d="M12 7 L 12 9" stroke="#000000" stroke-width="1" />
    <path d="M8 10 C 10 12, 14 12, 16 10" stroke="#444444" stroke-width="0.5" fill="none" />
    <path d="M10 18 C 11 17.5, 13 17.5, 14 18" stroke="#444444" stroke-width="0.5" />
    <circle cx="8" cy="11" r="1" fill="#444444" />
    <circle cx="16" cy="11" r="1" fill="#444444" />
    <path d="M5 12 L 4 14 L 5 16 L 7 17" stroke="#1a1a1a" stroke-width="1" fill="none" />
    <path d="M19 12 L 20 14 L 19 16 L 17 17" stroke="#1a1a1a" stroke-width="1" fill="none" />
    <path d="M7 17 C 8 19, 16 19, 17 17" stroke="#1a1a1a" stroke-width="1" fill="none" />
  </svg>`,
    },
    {
      id: 'completionist',
      title: 'Coleccionista',
      description: 'Has ganado una partida teniendo todos los logros del juego. ¡Eres una leyenda!',
      unlocked: false,
      rarity: 'legendary',
      svgIcon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#ecc94b" />
    <circle cx="12" cy="12" r="8" fill="#f6e05e" />
    <path d="M12 4 L 13 6 L 15 6.5 L 14 8.5 L 14.5 10.5 L 12 10 L 9.5 10.5 L 10 8.5 L 9 6.5 L 11 6 Z" fill="#faf089" />
    <path d="M7 11 L 8 13 L 7 15 L 9 14.5 L 11 15.5 L 10.5 13.5 L 11.5 11.5 L 9.5 11.5 Z" fill="#faf089" />
    <path d="M17 11 L 16 13 L 17 15 L 15 14.5 L 13 15.5 L 13.5 13.5 L 12.5 11.5 L 14.5 11.5 Z" fill="#faf089" />
    <path d="M12 16 L 11 18 L 12 20 L 13 18 L 12 16 Z" fill="#faf089" />
    <circle cx="12" cy="12" r="3" fill="#faf089" />
    <circle cx="12" cy="12" r="2" fill="#f6e05e" />
    <path d="M9 6 C 10 5, 14 5, 15 6" stroke="#b7791f" stroke-width="0.5" />
    <path d="M6 10 C 5 11, 5 13, 6 14" stroke="#b7791f" stroke-width="0.5" />
    <path d="M18 10 C 19 11, 19 13, 18 14" stroke="#b7791f" stroke-width="0.5" />
    <path d="M9 18 C 10 19, 14 19, 15 18" stroke="#b7791f" stroke-width="0.5" />
    <path d="M12 2 L 12 4" stroke="#b7791f" stroke-width="1" />
    <path d="M12 20 L 12 22" stroke="#b7791f" stroke-width="1" />
    <path d="M2 12 L 4 12" stroke="#b7791f" stroke-width="1" />
    <path d="M20 12 L 22 12" stroke="#b7791f" stroke-width="1" />
    <text x="9" y="13" font-family="sans-serif" font-size="3" font-weight="bold" fill="#b7791f">100%</text>
  </svg>`,
    },
  ];

  private readonly storageKey = 'hunt_the_bishomalo_achievements';

  constructor(
    private readonly gameStore: GameStoreService,
    private readonly gameSound: GameSoundService,
    private readonly analytics: AnalyticsService,
    private readonly localStoreService: LocalstorageService,
  ) {
    this.syncAchievementsWithStorage();
    effect(() => {
      const hunter = this.gameStore.hunter();
      if (!hunter.alive) {
        if (this.gameStore.settings().blackout) {
          this.activeAchievement(AchieveTypes.DEATHBYBLACKOUT);
        } else if (hunter.wumpusKilled) {
          this.activeAchievement(AchieveTypes.LASTBREATH);
        }
      }
    });
  }

  completed = signal<Achievement | undefined>(undefined);

  private updateLocalStorageWithNewId(id: string): void {
    const storedIds = this.getStoredAchievementIds();
    const updatedIds = [...storedIds, id];
    this.localStoreService.setValue<string[]>(this.storageKey, updatedIds);
  }

  private syncAchievementsWithStorage(): void {
    const storedIds = this.getStoredAchievementIds();
    this.achievements.forEach((achieve) => {
      achieve.unlocked = storedIds.includes(achieve.id);
    });
  }

  private getStoredAchievementIds(): string[] {
    return this.localStoreService.getValue<string[]>(this.storageKey) || [];
  }

  activeAchievement(id: AchieveTypes): void {
    const achieve = this.achievements.find((item) => item.id === id);
    if (achieve && !achieve.unlocked) {
      achieve.unlocked = true;
      this.completed.set(achieve);

      this.updateLocalStorageWithNewId(id);
      this.analytics.trackAchievementUnlocked(id, achieve.title);
    }
  }

  caclVictoryAchieve(seconds: number): void {
    const { arrows, wumpusKilled } = this.gameStore.hunter();
    const { blackout, size } = this.gameStore.settings();

    if (blackout) this.activeAchievement(AchieveTypes.WINBLACKWOUT);

    if (arrows > 1 && !wumpusKilled) this.activeAchievement(AchieveTypes.WASTEDARROWS);
    else {
      if (size >= 12) this.activeAchievement(AchieveTypes.WINLARGEMAP);
      if (seconds <= 10) this.activeAchievement(AchieveTypes.SPEEDRUNNER);
      if (!wumpusKilled) this.activeAchievement(AchieveTypes.WRAT);
      if (wumpusKilled) this.activeAchievement(AchieveTypes.WINHERO);
      this.cartographyAchieve();
    }

    this.isAllCompleted();
  }

  handleWumpusKillAchieve(cell: Cell): void {
    const { blackout } = this.gameStore.settings();
    const distance = this.calcDistance(cell);

    if (blackout) this.activeAchievement(AchieveTypes.BLINDWUMPUSKILLED);
    else if (distance > 3) this.activeAchievement(AchieveTypes.SNIPER);
    else if (distance === 1) this.activeAchievement(AchieveTypes.DEATHDUEL);
    else this.activeAchievement(AchieveTypes.WUMPUSKILLED);
  }

  private calcDistance(cell: Cell): number {
    const { x, y } = this.gameStore.hunter();

    if (x === cell.x) return Math.abs(y - cell.y);
    else if (y === cell.y) return Math.abs(x - cell.x);
    return 0;
  }

  private countVisitedCells(): number {
    const board = this.gameStore.board();
    let count = 0;

    for (const row of board) {
      for (const cell of row) {
        if (cell.visited) {
          count++;
        }
      }
    }

    return count;
  }

  private cartographyAchieve(): void {
    const visited = this.countVisitedCells();
    const { size, pits } = this.gameStore.settings();

    if (size * size - pits === visited) {
      this.activeAchievement(AchieveTypes.EXPERTCARTO);
    }

    if (visited > size * size * 0.5) {
      this.activeAchievement(AchieveTypes.NOVICECARTO);
    }
  }

  private isAllCompleted(): void {
    const victory = this.achievements.filter((x) => x.unlocked);

    if (this.achievements.length - victory.length <= 1) {
      this.activeAchievement(AchieveTypes.FINAL);
      this.gameSound.stop();
      this.gameSound.playSound(GameSound.FF7, false);
    }
  }
}
