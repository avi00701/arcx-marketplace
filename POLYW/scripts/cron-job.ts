/**
 * Cron Job for PolyAlpha
 * Automated pipeline to fetch, process, and update the wallet leaderboard.
 */

import { fetchResolvedMarkets } from '../lib/data-fetcher';
import { processWalletPerformance, aggregateGlobalStats, WalletStatsUpdate } from '../lib/processor';
import { supabase } from '../lib/supabase';

const TIME_RANGES = ['24h', '2d', '5d', '7d', '15d', '30d', '60d'];

async function runPipeline() {
  console.log(`[${new Date().toISOString()}] --- STARTING DATA PIPELINE ---`);

  try {
    // 1. Fetch Resolved Markets
    // For a real production app, we would fetch markets resolved within the target time ranges.
    // For this implementation, we fetch the most recent 200 resolved markets.
    console.log('Fetching resolved markets from Polymarket...');
    const markets = await fetchResolvedMarkets(200);
    console.log(`Successfully retrieved ${markets.length} resolved markets.`);

    if (markets.length === 0) {
      console.warn('No markets found. Skipping processing.');
      return;
    }

    // 2. Fetch Trades (Placeholder)
    // In a production environment, you would fetch trades for these markets using 
    // the Polymarket CLOB API or a GraphQL Subgraph.
    // Here we'll satisfy the pipeline with the structured processor.
    console.log('Fetching trade activity for markets...');
    const trades: any[] = []; // This would be populated by a trade fetcher
    
    // 3. Process each time range
    for (const timeRange of TIME_RANGES) {
      console.log(`\nProcessing statistics for ${timeRange} range...`);
      
      // Calculate category-specific stats
      const categoryUpdates = processWalletPerformance(markets as any, trades, timeRange);
      
      // Calculate 'All' category stats
      const globalUpdates = aggregateGlobalStats(categoryUpdates, timeRange);
      
      const allUpdates = [...categoryUpdates, ...globalUpdates];
      console.log(`Generated ${allUpdates.length} stat updates for ${timeRange}.`);

      if (allUpdates.length > 0) {
        // 4. Batch Upsert into Supabase
        // The table has a unique constraint on (wallet_address, category, time_range)
        console.log(`Upserting data into Supabase 'wallet_stats'...`);
        
        const { error } = await supabase
          .from('wallet_stats')
          .upsert(allUpdates, { 
            onConflict: 'wallet_address,category,time_range',
            ignoreDuplicates: false 
          });

        if (error) {
          console.error(`Error upserting ${timeRange} stats:`, error.message);
        } else {
          console.log(`Successfully updated ${timeRange} leaderboard stats.`);
        }
      }
    }

    console.log(`\n[${new Date().toISOString()}] --- PIPELINE COMPLETED SUCCESSFULLY ---`);
  } catch (err) {
    console.error(`\n[${new Date().toISOString()}] --- PIPELINE FAILED ---`);
    console.error(err);
  }
}

// EXECUTE
runPipeline()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
