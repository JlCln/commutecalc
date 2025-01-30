export interface UserStats {
  totalCommutes: number;
  avgDuration: number;
  totalDuration: number;
  mostFrequentRoute: {
    startStop: string;
    endStop: string;
    count: number;
  };
}
