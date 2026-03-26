"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Hero from "@/components/ui/Hero";
import NFTCard from "@/components/ui/NFTCard";
import CreatorCard from "@/components/ui/CreatorCard";
import { sampleNFTs, trendingCollections } from "@/data/sampleNFTs";
import { sampleCreators } from "@/data/sampleCreators";
import { useAdmin } from "@/context/AdminContext";
import CollectionCard from "@/components/ui/CollectionCard";
import SkeletonGrid from "@/components/ui/SkeletonGrid";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { nftStatuses } = useAdmin();

  useEffect(() => {
    // Simulate premium loading delay for skeleton demo
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Data processing
  const visibleNFTs = sampleNFTs.filter(n => !nftStatuses[n.id]?.hidden);
  const featuredNFTs = visibleNFTs.filter(n => nftStatuses[n.id]?.featured || n.featured);

  // If no featured NFTs, use a default selection
  const heroNFTs = featuredNFTs.length > 0 ? featuredNFTs : [visibleNFTs[4] || sampleNFTs[4]];
  
  const topMinted = [...visibleNFTs].sort((a, b) => b.mintCount - a.mintCount).slice(0, 3);
  const newNFTs = [...visibleNFTs].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);
  const topCreators = sampleCreators.slice(0, 4);
  const trending = trendingCollections.slice(0, 3);

  return (
    <div className="flex flex-col gap-32 pb-32">
      {/* 1. Pinned Section (Hero Carousel) - Entry Motion */}
      <section className="container mx-auto px-4 md:px-8 pt-12 md:pt-20 animate-slide-up">
        <Hero nfts={heroNFTs} />
      </section>

      {/* 2. Trending Collections - Glassmorphic Grid */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
              Trending Collections
            </h2>
            <p className="text-muted font-bold uppercase tracking-[0.3em] text-[10px] opacity-60">Top performers in the last 24 hours</p>
          </div>
          <Link href="/explore">
             <Button variant="outline" className="rounded-2xl px-8 border-white/10 hover:bg-white/5">
                Explore All
             </Button>
          </Link>
        </div>
        
        {loading ? (
          <SkeletonGrid type="collection" count={3} gridClass="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trending.map((col) => (
              <CollectionCard key={col.id} collection={col} />
            ))}
          </div>
        )}
      </section>

      {/* 3. New NFT Drop - Grid with Skeletons */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
              Latest Mints
            </h2>
            <p className="text-muted font-bold uppercase tracking-[0.3em] text-[10px] opacity-60">Freshly created on the ARC network</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
             <button className="w-12 h-12 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center text-muted hover:text-accent hover:border-accent/40 transition-all duration-500 shadow-xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
             </button>
             <button className="w-12 h-12 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center text-muted hover:text-accent hover:border-accent/40 transition-all duration-500 shadow-xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
             </button>
          </div>
        </div>

        {loading ? (
          <SkeletonGrid type="nft" count={4} gridClass="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newNFTs.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Top Creators Section - Premium Sizing */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
              Top Verified Creators
            </h2>
            <p className="text-muted font-bold uppercase tracking-[0.3em] text-[10px] opacity-60">Certified artists shaping the digital frontier</p>
          </div>
          <Link href="/explore">
             <button className="text-[11px] font-black uppercase tracking-[0.2em] text-accent hover:text-white transition-colors duration-300">
               View Rankings →
             </button>
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid type="creator" count={4} gridClass="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCreators.map((creator, idx) => (
              <CreatorCard key={creator.id} creator={creator} rank={idx + 1} />
            ))}
          </div>
        )}
      </section>

      {/* Enhanced Trust Bar */}
      <section className="container mx-auto px-4 md:px-8 py-20 border-t border-white/5">
        <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-20 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
           <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Logo.svg/1200px-MetaMask_Logo.svg.png" alt="MetaMask" className="h-10 object-contain" />
           <img src="https://ethereum.org/static/a110735dadebd51d1027170a049d5bf1/305e2/eth-diamond-purple.png" alt="Ethereum" className="h-10 object-contain" />
           {/* Replaced OpenSea logo with stable SVG source to avoid CORS/403 issues */}
           <img src="https://opensea.io/static/images/logos/opensea.svg" alt="OpenSea" className="h-10 object-contain" />
           <img src="https://cryptologos.cc/logos/walletconnect-wct-logo.png" alt="WalletConnect" className="h-10 object-contain" />
        </div>
      </section>
    </div>
  );
}
