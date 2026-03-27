/**
 * Processor for PolyAlpha
 * Responsibilities:
 * - Determine win/loss for each trade
 * - Aggregate stats per wallet
 * - Compute win rate
 * - Return structured data for Supabase
 */

export interface MarketResult {
  id: string;
  category: string;
  resolutionTime: string;
  outcome: string; // Winning outcome (e.g., 'YES' or 'NO')
}

export interface TradeActivity {
  wallet_address: string;
  market_id: string;
  position: string; // User's bet (e.g., 'YES' or 'NO')
}

export interface WalletStatsUpdate {
  wallet_address: string;
  category: string;
  time_range: string;
  wins: number;
  total_trades: number;
  win_rate: number;
}

/**
 * Processes market and trade data to compute wallet performance
 */
export function processWalletPerformance(
  markets: MarketResult[],
  trades: TradeActivity[],
  timeRange: string
): WalletStatsUpdate[] {
  const statsMap = new Map<string, { wins: number; total: number; category: string }>();

  // Use a map for O(1) market lookups
  const marketMap = new Map(markets.map(m => [m.id, m]));

  for (const trade of trades) {
    const market = marketMap.get(trade.market_id);
    if (!market) continue;

    // Unique key per wallet and category
    const key = `${trade.wallet_address}_${market.category}`;
    
    if (!statsMap.has(key)) {
      statsMap.set(key, { wins: 0, total: 0, category: market.category });
    }

    const current = statsMap.get(key)!;
    current.total += 1;

    // Check if the user won: position == outcome
    if (trade.position === market.outcome) {
      current.wins += 1;
    }
  }

  // Convert map to array of structured objects
  const results: WalletStatsUpdate[] = [];

  statsMap.forEach((stats, key) => {
    const walletAddress = key.split('_')[0];
    const winRate = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;

    results.push({
      wallet_address: walletAddress,
      category: stats.category,
      time_range: timeRange,
      wins: stats.wins,
      total_trades: stats.total,
      win_rate: winRate
    });
  });

  return results;
}

/**
 * Helper to aggregate 'All' category stats from specific categories
 */
export function aggregateGlobalStats(updates: WalletStatsUpdate[], timeRange: string): WalletStatsUpdate[] {
  const globalStats = new Map<string, { wins: number; total: number }>();

  for (const update of updates) {
    if (!globalStats.has(update.wallet_address)) {
      globalStats.set(update.wallet_address, { wins: 0, total: 0 });
    }
    const current = globalStats.get(update.wallet_address)!;
    current.wins += update.wins;
    current.total += update.total_trades;
  }

  const globalResults: WalletStatsUpdate[] = [];
  globalStats.forEach((stats, wallet) => {
    globalResults.push({
      wallet_address: wallet,
      category: 'All',
      time_range: timeRange,
      wins: stats.wins,
      total_trades: stats.total,
      win_rate: stats.total > 0 ? (stats.wins / stats.total) * 100 : 0
    });
  });

  return globalResults;
}
