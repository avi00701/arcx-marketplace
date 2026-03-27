import { NextResponse } from 'next/server';
import { fetchResolvedMarkets } from '@/lib/data-fetcher';
import { processWalletPerformance, aggregateGlobalStats } from '@/lib/processor';
import { supabase } from '@/lib/supabase';

// This is the Vercel Cron handler
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  // Basic security check (Optional: Set CRON_SECRET in Vercel env)
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  console.log('--- STARTING VERCEL CRON ---');

  try {
    const markets = await fetchResolvedMarkets(100);
    const trades: any[] = []; // Placeholder for real trade fetching
    
    const timeRanges = ['24h', '7d', '30d'];
    
    for (const timeRange of timeRanges) {
      const categoryUpdates = processWalletPerformance(markets as any, trades, timeRange);
      const globalUpdates = aggregateGlobalStats(categoryUpdates, timeRange);
      const allUpdates = [...categoryUpdates, ...globalUpdates];

      if (allUpdates.length > 0) {
        await supabase
          .from('wallet_stats')
          .upsert(allUpdates, { 
            onConflict: 'wallet_address,category,time_range'
          });
      }
    }

    return NextResponse.json({ success: true, message: 'Stats updated successfully' });
  } catch (error: any) {
    console.error('Cron failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
