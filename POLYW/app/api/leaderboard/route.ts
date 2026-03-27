import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 60; // Cache the response for 60 seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const time = searchParams.get('time') || '7d';
    const category = searchParams.get('category') || 'all';

    // Build the base query
    let query = supabase
      .from('wallet_stats')
      .select('wallet_address, wins, total_trades, win_rate, updated_at')
      .eq('time_range', time)
      .gte('total_trades', 20) // Minimum trades filter
      .order('wins', { ascending: false }) // Primary sort
      .limit(100);

    // Apply category filter if not 'all'
    if (category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leaderboard data' },
        { status: 500 }
      );
    }

    // Add rank and return
    const rankedData = data.map((item, index) => ({
      rank: index + 1,
      ...item,
    }));

    return NextResponse.json(rankedData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
