export type GameEventEffectType =
  | 'revive'
  | 'rewind'
  | 'shield'
  | 'arrow'
  | 'heart'
  | 'detector'
  | 'gold'
  | 'pit'
  | 'wumpus'
  | 'double-gold'
  | 'extraheart'
  | 'lantern'
  | 'extragold';

export type CauseOfDeath = 'pit' | 'wumpus';
