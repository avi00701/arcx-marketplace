"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { sampleNFTs } from "@/data/sampleNFTs";
import NFTCard from "@/components/ui/NFTCard";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  
  // Filter sampleNFTs by favorite status
  // In a real app, you would fetch these from the contract/API by ID
  const favoriteNFTs = sampleNFTs.filter((nft) => favorites.includes(nft.id));

  return (
    <div className="container mx-auto px-4 py-20 min-h-[70vh]">
      <div className="space-y-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-3 animate-in fade-in duration-700">
            <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest">
              Personal Gallery
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none animate-in fade-in slide-in-from-bottom-8 duration-700">
            My <span className="text-accent italic">Favorites</span>
          </h1>
          <p className="text-muted text-lg md:text-xl font-medium max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            A curated collection of your most coveted digital assets. Secured in your local vessel.
          </p>
        </div>

        {favoriteNFTs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favoriteNFTs.map((nft) => (
              <div key={nft.id} className="animate-in fade-in zoom-in duration-700">
                <NFTCard nft={nft} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 space-y-8 glass-cosmic rounded-[64px] border border-dashed border-white/10 animate-in fade-in zoom-in duration-1000">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-muted">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Your vault is empty</h2>
              <p className="text-muted font-medium">Explore the marketplace to discover and favorite emerging assets.</p>
            </div>
            <Link 
              href="/explore" 
              className="px-8 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-accent hover:text-black transition-all active:scale-95"
            >
              Discover Assets
            </Link>
          </div>
        )}
      </div>

      {/* Background Decor */}
      <div className="fixed top-1/4 -right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none -z-10" />
    </div>
  );
}
