"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { trendingCollections, sampleNFTs } from "@/data/sampleNFTs";
import NFTCard from "@/components/ui/NFTCard";
import Button from "@/components/ui/Button";

export default function CollectionPage() {
  const { id } = useParams();
  const collection = trendingCollections.find((c) => c.id === id) || trendingCollections[0];
  const nfts = sampleNFTs.filter((n) => n.collection === collection.name);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* 1. Immersive Banner Section */}
      <section className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          className="object-cover blur-[2px] scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </section>

      {/* 2. Collection Profile Area */}
      <section className="container mx-auto px-4 md:px-6 -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row items-end gap-8 md:gap-12">
          {/* Avatar */}
          <div className="relative w-40 h-40 rounded-[32px] overflow-hidden border-4 border-background bg-surface shadow-2xl">
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Info & Badges */}
          <div className="flex-1 space-y-6 pb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                {collection.name}
              </h1>
              {collection.verified && (
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-black shadow-[0_0_20px_rgba(129,236,255,0.6)] shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-muted max-w-2xl font-medium leading-relaxed text-lg">
              Experience the core of the digital renaissance with <span className="text-white font-bold">{collection.name}</span>. A curated odyssey through the obsidian nebula, pushing the boundaries of generative art on Arc Testnet.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pb-4">
             <Button variant="outline" size="lg" className="rounded-2xl border-white/10 hover:bg-white/5 w-14 h-14 p-0 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
             </Button>
             <Button size="lg" className="rounded-2xl px-12 font-black uppercase tracking-widest text-sm shadow-2xl shadow-accent/20">
                Purchase Collection
             </Button>
          </div>
        </div>

        {/* 3. Glassmorphic Stats Row */}
        <div className="mt-16 p-10 rounded-[48px] glass-cosmic grid grid-cols-2 md:grid-cols-4 gap-12 shadow-3xl">
           <div className="space-y-2">
              <p className="text-[10px] text-muted font-black uppercase tracking-[0.3em]">Floor Price</p>
              <div className="flex items-baseline gap-2">
                 <p className="text-3xl md:text-5xl font-black text-white tracking-tighter">{collection.floor}</p>
                 <p className="text-sm font-black text-accent uppercase">ETH</p>
              </div>
           </div>
           <div className="space-y-2">
              <p className="text-[10px] text-muted font-black uppercase tracking-[0.3em]">Total Volume</p>
              <div className="flex items-baseline gap-2">
                 <p className="text-3xl md:text-5xl font-black text-white tracking-tighter">{collection.volume}</p>
                 <p className="text-sm font-black text-accent uppercase">ETH</p>
              </div>
           </div>
           <div className="space-y-2">
              <p className="text-[10px] text-muted font-black uppercase tracking-[0.3em]">Items</p>
              <p className="text-3xl md:text-5xl font-black text-white tracking-tighter">{collection.items.toLocaleString()}</p>
           </div>
           <div className="space-y-2">
              <p className="text-[10px] text-muted font-black uppercase tracking-[0.3em]">Owners</p>
              <p className="text-3xl md:text-5xl font-black text-white tracking-tighter">2.4K</p>
           </div>
        </div>
      </section>

      {/* 4. Filter & Grid Section */}
      <section className="container mx-auto px-4 md:px-6 mt-24 space-y-12">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2 md:pb-0">
               <button className="px-8 py-3 rounded-2xl bg-accent text-black font-black text-xs uppercase tracking-[0.2em] whitespace-nowrap shadow-lg shadow-accent/20 transition-all active:scale-95">
                  Collection
               </button>
               <button className="px-8 py-3 rounded-2xl hover:bg-white/5 text-muted hover:text-white font-black text-xs uppercase tracking-[0.2em] transition-all whitespace-nowrap">
                  Activity
               </button>
               <button className="px-8 py-3 rounded-2xl hover:bg-white/5 text-muted hover:text-white font-black text-xs uppercase tracking-[0.2em] transition-all whitespace-nowrap">
                  Analytics
               </button>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="relative group flex-1 md:flex-none">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                     </svg>
                  </span>
                  <input 
                     type="text" 
                     placeholder="Search ID or Type..." 
                     className="bg-surface rounded-2xl py-4 pl-14 pr-8 border border-white/5 focus:border-accent/40 outline-none w-full md:w-80 text-sm font-black uppercase tracking-widest transition-all placeholder:text-muted/40"
                  />
               </div>
               <select className="bg-surface rounded-2xl py-4 px-8 border border-white/5 focus:border-accent/40 outline-none text-xs font-black uppercase tracking-widest transition-all cursor-pointer appearance-none hover:bg-white/5">
                  <option>Recent Drops</option>
                  <option>Price: Floor to Sky</option>
                  <option>Price: Sky to Floor</option>
               </select>
            </div>
         </div>

         {/* NFT Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {nfts.map((nft) => (
               <NFTCard key={nft.id} nft={nft} />
            ))}
            {/* If no NFTs are found in sample, show some default cards */}
            {nfts.length === 0 && Array(8).fill(0).map((_, i) => (
               <NFTCard 
                  key={i} 
                  nft={{
                     ...sampleNFTs[0],
                     id: `tmp-${i}`,
                     name: `${collection.name} #${i + 101}`,
                     collection: collection.name,
                     image: `https://picsum.photos/seed/${collection.id}-${i}/600/800`
                  }} 
               />
            ))}
         </div>
      </section>
    </div>
  );
}
