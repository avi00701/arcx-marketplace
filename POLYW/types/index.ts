export interface WalletStats {
  walletAddress: string;
  category: string;
  timeRange: string;
  wins: number;
  totalTrades: number;
  winRate: number;
  updatedAt: string;
}

export interface LeaderboardResponse {
  time: string;
  category: string;
  data: Array<{
    rank: number;
    wallet: string;
    wins: number;
    total: number;
    winRate: number;
  }>;
}
