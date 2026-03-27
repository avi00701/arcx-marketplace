'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Trophy, TrendingUp, BarChart3, ChevronRight, Copy, Check, Info } from 'lucide-react';

interface WalletEntry {
  rank: number;
  wallet_address: string;
  wins: number;
  total_trades: number;
  win_rate: number;
}

export default function LeaderboardPage() {
  const [time, setTime] = useState('7d');
  const [category, setCategory] = useState('All');
  const [data, setData] = useState<WalletEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/leaderboard?time=${time}&category=${category.toLowerCase()}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setTimeout(() => setLoading(false), 400); // Small delay for smooth transition
      }
    };
    fetchData();
  }, [time, category]);

  const copyToClipboard = (e: React.MouseEvent, address: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const timeOptions = ['24h', '2d', '5d', '7d', '15d', '30d', '60d'];
  const categories = ['All', 'Crypto', 'Politics', 'Sports', 'Other'];

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,50,255,0.08),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full w-fit">
              <Trophy className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-300">Live Rankings</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter mb-4 italic">
              POLY<span className="text-purple-500">ALPHA</span>
            </h1>
            <p className="text-zinc-500 max-w-lg font-medium leading-relaxed">
              Tracking the elite 1% of predictions. Verified win-rates, 
              deep-dive analytics, and real-time market intelligence.
            </p>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 p-6 rounded-3xl flex flex-wrap gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Time Horizon</span>
              <div className="flex p-1 bg-black/40 rounded-xl border border-zinc-800/50">
                {timeOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setTime(option)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all duration-300 ${
                      time === option ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Market Scope</span>
              <div className="flex p-1 bg-black/40 rounded-xl border border-zinc-800/50">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all duration-300 ${
                      category === cat ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]' : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Leaderboard Table */}
        <div className="bg-zinc-900/20 backdrop-blur-xl border border-zinc-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl transition-opacity duration-300">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-zinc-900/40">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Rank</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Wallet Intelligence</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Predictions</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Yield Score</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Precision</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {loading ? (
                // Loding Skeleton
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6"><div className="w-8 h-8 bg-zinc-800/50 rounded-lg"></div></td>
                    <td className="px-8 py-6"><div className="w-48 h-5 bg-zinc-800/50 rounded-md"></div></td>
                    <td className="px-8 py-6"><div className="w-12 h-5 bg-zinc-800/50 rounded-md ml-auto"></div></td>
                    <td className="px-8 py-6"><div className="w-16 h-8 bg-zinc-800/50 rounded-full ml-auto"></div></td>
                    <td className="px-8 py-6"><div className="w-32 h-2 bg-zinc-800/50 rounded-full"></div></td>
                    <td className="px-8 py-6"></td>
                  </tr>
                ))
              ) : data.length > 0 ? (
                data.map((entry) => (
                  <tr 
                    key={entry.wallet_address} 
                    className="group/row hover:bg-zinc-800/20 transition-all duration-300 cursor-pointer"
                    onClick={() => window.location.href = `/wallet/${entry.wallet_address}?time=${time}&category=${category.toLowerCase()}`}
                  >
                    <td className="px-8 py-6">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-black transition-transform group-hover/row:scale-110 ${
                        entry.rank === 1 ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 
                        entry.rank === 2 ? 'bg-zinc-300 text-black' : 
                        entry.rank === 3 ? 'bg-orange-400 text-black' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {entry.rank}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 flex items-center justify-center group-hover/row:border-purple-500/50 transition-colors">
                          <BarChart3 className="w-4 h-4 text-zinc-500 group-hover/row:text-purple-400 transition-colors" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-zinc-300 group-hover/row:text-white transition-colors">
                              {entry.wallet_address.slice(0, 6)}...{entry.wallet_address.slice(-4)}
                            </span>
                            <button 
                              onClick={(e) => copyToClipboard(e, entry.wallet_address)}
                              className="p-1 hover:bg-zinc-700/50 rounded-md transition-colors text-zinc-600 hover:text-white"
                            >
                              {copiedAddress === entry.wallet_address ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Strategic Predictor</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right tabular-nums">
                      <span className="text-xl font-black text-zinc-400 group-hover/row:text-white transition-colors">
                        {entry.total_trades}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right italic tabular-nums">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        <span className="text-sm font-black text-emerald-400">{entry.wins}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center px-1">
                          <span className="text-sm font-black text-zinc-300">{entry.win_rate.toFixed(1)}%</span>
                        </div>
                        <div className="w-48 h-1.5 bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-800">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-1000 ease-out"
                            style={{ width: `${entry.win_rate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <ChevronRight className="w-4 h-4 text-zinc-700 group-hover/row:text-white group-hover/row:translate-x-1 transition-all" />
                    </td>
                  </tr>
                ))
              ) : (
                // Improved Empty State
                <tr>
                  <td colSpan={6} className="py-32 text-center">
                    <div className="flex flex-col items-center justify-center opacity-50">
                      <div className="w-20 h-20 bg-zinc-900 rounded-[2rem] border border-dashed border-zinc-800 flex items-center justify-center mb-6">
                        <Info className="w-8 h-8 text-zinc-700" />
                      </div>
                      <h3 className="text-xl font-black tracking-tight mb-2">Analyzing Data Horizons...</h3>
                      <p className="text-zinc-600 max-w-sm text-sm font-medium">
                        Insufficient intel for the <span className="text-white">{category}</span> sector in this timeframe. 
                        Our processing engine is currently syncing new market resolutions.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="flex items-center gap-8 text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em]">
            <span>Secured by Polychain Analytics</span>
            <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
            <span>Updated: {new Date().toLocaleTimeString()}</span>
            <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
            <span>Polymarket Beta Access</span>
          </div>
          <p className="text-zinc-800 text-[8px] font-black tracking-[0.1em] uppercase">Built with deep-intelligence frameworks v3.4.1</p>
        </div>
      </div>
    </main>
  );
}
