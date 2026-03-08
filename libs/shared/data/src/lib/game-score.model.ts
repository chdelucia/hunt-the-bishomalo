export interface ScoreEntry {
  playerName: string;
  date: Date;
  timeInSeconds: number;
  steps: number;
  blackout: boolean;
  wumpusKilled: number;
  level: number;
  deads: number;
}
