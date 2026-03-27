import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Wallet, TrendingUp, BarChart3, Clock, Tag, ExternalLink, Calendar, Trophy } from 'lucide-react';

interface WalletStats {
  wallet_address: string;
  category: string;
  time_range: string;
  wins: number;
  total_trades: number;
  win_rate: number;
  updated_at: string;
}

export default async function WalletPage({
  params,
  searchParams,
}: {
  params: { address: string };
  searchParams: { time?: string; category?: string };
}) {
  const address = params.address;
  const time = searchParams.time || '7d';
  const category = searchParams.category || 'all';

  // Fetch stats from Supabase
  let query = supabase
    .from('wallet_stats')
    .select('*')
    .eq('wallet_address', address)
    .eq('time_range', time);

  if (category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query.single();
  const stats = data as WalletStats | null;

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Navigation */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Leaderboard</span>
        </Link>

        {/* Header section */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800">
              <Wallet className="w-8 h-8 text-purple-500" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight mb-1">Wallet Profile</h1>
              <p className="font-mono text-zinc-500 text-sm break-all">{address}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
              <Clock className="w-3.5 h-3.5" /> {time} Range
            </div>
            <div className="px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
              <Tag className="w-3.5 h-3.5" /> {category} Category
            </div>
          </div>
        </header>

        {/* Content Area */}
        {!stats ? (
          <div className="bg-zinc-900/30 border border-dashed border-zinc-800 rounded-[2rem] py-20 text-center">
            <div className="inline-block p-4 bg-zinc-900 rounded-full mb-4">
              <BarChart3 className="w-10 h-10 text-zinc-700" />
            </div>
            <h2 className="text-xl font-bold text-zinc-300 mb-2">No data recorded for this view</h2>
            <p className="text-zinc-500 max-w-xs mx-auto text-sm">
              We haven't processed trade activity for this wallet in the <span className="text-white font-bold">{category}</span> category within the <span className="text-white font-bold">{time}</span> timeframe yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Wins Card */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2rem] group hover:border-emerald-500/30 transition-colors">
              <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">Predictions Won</p>
              <div className="flex items-end justify-between">
                <span className="text-5xl font-black text-emerald-400 tabular-nums leading-none">{stats.wins}</span>
                <Trophy className="w-6 h-6 text-zinc-800 group-hover:text-emerald-500/50 transition-colors" />
              </div>
            </div>

            {/* Total Trades Card */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2rem] group hover:border-blue-500/30 transition-colors">
              <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">Total Predictions</p>
              <div className="flex items-end justify-between">
                <span className="text-5xl font-black text-white tabular-nums leading-none">{stats.total_trades}</span>
                <TrendingUp className="w-6 h-6 text-zinc-800 group-hover:text-blue-500/50 transition-colors" />
              </div>
            </div>

            {/* Win Rate Card */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2rem] group hover:border-purple-500/30 transition-colors">
              <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">Precision Rate</p>
              <div className="flex items-end justify-between">
                <span className="text-5xl font-black text-purple-400 tabular-nums leading-none">{stats.win_rate.toFixed(1)}%</span>
                <div className="w-6 h-6 rounded-full border-4 border-zinc-800 border-t-purple-500"></div>
              </div>
            </div>

            {/* Timeline info */}
            <div className="md:col-span-3 bg-zinc-900/20 border border-zinc-800/50 p-6 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3 text-zinc-500">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Data Last Synced:</span>
                <span className="text-zinc-400 text-sm">{new Date(stats.updated_at).toLocaleString()}</span>
              </div>
              <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                View on Polymarket <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <footer className="mt-24 text-center">
            <p className="text-zinc-700 text-xs font-bold uppercase tracking-[0.3em]">PolyAlpha Intelligence Engine v1.0</p>
        </footer>
      </div>
    </main>
  );
}
