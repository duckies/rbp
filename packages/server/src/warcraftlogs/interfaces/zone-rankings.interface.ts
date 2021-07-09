export interface ZoneRankings {
  bestPerformanceAverage: number;
  medianPerformanceAverage: number;
  difficulty: 4;
  metric: 'dps' | 'hps';
  partition: number;
  zone: number;
}
