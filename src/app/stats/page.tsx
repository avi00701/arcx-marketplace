"use client";

import { trendingCollections, sampleNFTs } from "@/data/sampleNFTs";
import { sampleCreators } from "@/data/sampleCreators";

export default function StatsPage() {
  const topCollections = [...trendingCollections].sort((a, b) => parseFloat(b.volume.replace(',', '')) - parseFloat(a.volume.replace(',', ''))).slice(0, 10);
  
  return (
    <div className="container mx-auto px-4 py-20 space-y-20">
      {/* Header */}
      <div className="text-center space-y-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">
          Market <span className="text-accent underline decoration-white/10 underline-offset-8">Stats</span>
        </h1>
        <p className="text-muted text-lg md:text-xl font-medium">
          Comprehensive real-time analytics for the ArcX ecosystem. Tracking the digital renaissance one block at a time.
        </p>
      </div>

      {/* High Level Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
         <div className="p-10 rounded-[48px] glass-cosmic space-y-4 shadow-3xl">
            <p className="text-[10px] text-muted font-black uppercase tracking-[0.3em]">Total Ecosystem Volume</p>
            <p className="text-5xl font-black text-white tracking-tighter">124.5K <span className="text-xl text-accent">ETH</span></p>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5H7z"/></svg>
               +12.4% vs last week
            </div>
         </div>
         <div className="p-10 rounded-[48px] glass-cosmic space-y-4 shadow-3xl">
            <p className="text-[10px] text-muted font-black uppercase tracking-[0.3em]">Total Assets Minted</p>
            <p className="text-5xl font-black text-white tracking-tighter">2.1M <span className="text-xl text-accent">NFTs</span></p>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5H7z"/></svg>
               +6.8% active growth
            </div>
         </div>
         <div className="p-10 rounded-[48px] glass-cosmic space-y-4 shadow-3xl">
            <p className="text-[10px] text-muted font-black uppercase tracking-[0.3em]">Protocol Revenue</p>
            <p className="text-5xl font-black text-white tracking-tighter">3.2M <span className="text-xl text-accent">USDC</span></p>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5H7z"/></svg>
               -2.1% volatility
            </div>
         </div>
      </div>

      {/* Collections Table */}
      <div className="space-y-10">
         <div className="flex items-center justify-between px-6">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">Top Collections</h2>
            <div className="flex gap-4">
               <button className="px-6 py-2 rounded-xl bg-accent text-black font-black uppercase tracking-widest text-[10px]">24h</button>
               <button className="px-6 py-2 rounded-xl bg-surface border border-white/5 text-muted font-black uppercase tracking-widest text-[10px] hover:text-white transition-all">7d</button>
            </div>
         </div>

         <div className="rounded-[48px] overflow-hidden glass-cosmic border border-white/5 shadow-3xl">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted">Rank</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted">Collection</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted text-right">Floor</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted text-right">Volume</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted text-right">Change</th>
                  </tr>
               </thead>
               <tbody>
                  {topCollections.map((col, i) => (
                     <tr key={col.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                        <td className="px-10 py-8 text-xl font-black text-white opacity-40">{i + 1}</td>
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-xl group-hover:scale-110 transition-transform">
                                 <img src={col.image} alt={col.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-xl font-black text-white uppercase tracking-tight group-hover:text-accent transition-colors">{col.name}</span>
                              {col.verified && (
                                 <svg className="w-5 h-5 text-accent shadow-accent" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                 </svg>
                              )}
                           </div>
                        </td>
                        <td className="px-10 py-8 text-right text-lg font-black text-white">{col.floor} ETH</td>
                        <td className="px-10 py-8 text-right text-lg font-black text-white">{col.volume} ETH</td>
                        <td className={`px-10 py-8 text-right text-lg font-black ${col.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                           {col.change}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Decorative Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-grid-white/5" />
      <div className="fixed top-1/4 -right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none -z-10" />
    </div>
  );
}
