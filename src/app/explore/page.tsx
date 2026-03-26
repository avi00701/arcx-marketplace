"use client";

import { useWallet } from "@/context/WalletContext";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import NFTCard from "@/components/ui/NFTCard";
import SearchBar from "@/components/ui/SearchBar";
import { sampleNFTs } from "@/data/sampleNFTs";
import { useAdmin } from "@/context/AdminContext";
import SkeletonGrid from "@/components/ui/SkeletonGrid";
import EmptyState from "@/components/ui/EmptyState";

export default function Explore() {
  const { isConnected, getContract, provider } = useWallet();
  const { nftStatuses } = useAdmin();
  const [nfts, setNfts] = useState(sampleNFTs.filter(n => !nftStatuses[n.id]?.hidden));
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchNFTs = async () => {
      const contract = getContract();
      if (!contract || !provider) return;

      setLoading(true);
      // Extra delay for premium skeleton feel
      await new Promise(r => setTimeout(r, 1000));
      
      try {
        const filter = contract.filters.NFTMinted();
        const events = await contract.queryFilter(filter, -1000); 
        
        const items = (await Promise.all(events.map(async (event: any) => {
          const { tokenId, tokenURI, price, launchTime } = event.args;

          if (Number(launchTime) > Math.floor(Date.now() / 1000)) {
            return null;
          }

          let metadata = { name: `NFT #${tokenId}`, description: "", image: "" };
          try {
            metadata = JSON.parse(tokenURI);
          } catch (e) {
            console.warn("Failed to parse metadata for", tokenId);
          }

          return {
            id: String(tokenId),
            name: metadata.name || `ArcX NFT #${tokenId}`,
            collection: "ArcX Origins",
            price: ethers.formatEther(price),
            image: metadata.image || `https://picsum.photos/seed/${tokenId}/800/800`,
            currentBid: "0",
            category: "Art",
          };
        }))).filter(item => item !== null);

        if (items.length > 0) {
          setNfts(items as any);
        }
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isConnected) {
      fetchNFTs();
    }
  }, [isConnected, getContract, provider]);

  const categories = ["All", "Art", "Gaming", "Photography", "Music", "Virtual Worlds"];
  const filteredNFTs = activeCategory === "All" 
    ? nfts 
    : nfts.filter(nft => nft.category === activeCategory);

  return (
    <div className="container mx-auto px-4 md:px-8 py-24 space-y-24">
      {/* 1. Discovery Header - Premium Typography */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-16 animate-slide-up">
        <div className="space-y-6 text-center md:text-left max-w-2xl">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] italic">
            Discovery <br />
            <span className="text-accent not-italic">Fragment</span>
          </h1>
          <p className="text-muted text-lg font-bold uppercase tracking-[0.2em] leading-relaxed opacity-60">
            Sift through the obsidian nebula. Thousands of unique digital fragments, each with its own story on the Arc Network.
          </p>
        </div>
        <div className="w-full md:w-auto md:min-w-[500px]">
          <SearchBar />
        </div>
      </div>

      {/* 2. Strategy Cluster (Filters & Sort) */}
      <div className="space-y-16">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 border-b border-white/5 pb-10">
          <div className="flex items-center gap-4 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap transition-all duration-500 active:scale-95 ${
                  activeCategory === category
                    ? "bg-accent text-black shadow-2xl shadow-accent/40"
                    : "bg-white/5 border border-white/5 text-muted hover:border-accent/40 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="h-14 px-8 rounded-[20px] bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:border-accent/40 hover:bg-white/10 transition-all duration-500 flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M3 10h18M3 16h18" />
              </svg>
              Quick Filter
            </button>
            <div className="hidden sm:block w-px h-10 bg-white/5 mx-2" />
            <div className="relative group">
              <select className="bg-white/5 h-14 rounded-[20px] px-8 border border-white/10 focus:border-accent/40 outline-none text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer appearance-none pr-14 hover:bg-white/10">
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Recently Transmitted</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-muted group-hover:text-accent transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Assets Matrix - Skeletons & Empty States */}
        {loading ? (
          <SkeletonGrid type="nft" count={8} gridClass="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10" />
        ) : filteredNFTs.length === 0 ? (
          <EmptyState 
            title="No Fragments Detected" 
            description="Our scanners couldn't find any digital assets matching your current filtering parameters in this sector."
            action={
              <button 
                onClick={() => setActiveCategory("All")}
                className="px-10 py-4 rounded-2xl bg-accent text-black font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform"
              >
                Reset Scanners
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredNFTs.map((nft) => (
              <NFTCard key={nft.id} nft={nft as any} />
            ))}
          </div>
        )}

        {/* 4. Persistence Controls */}
        {!loading && filteredNFTs.length > 0 && (
          <div className="flex justify-center pt-20">
            <button className="h-16 px-16 rounded-[24px] bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.4em] text-white hover:border-accent/40 hover:bg-white/10 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-700 active:scale-95">
              Query Next Batch
            </button>
          </div>
        )}
      </div>

      {/* Atmospheric Element */}
      <div className="fixed bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-accent/[0.03] to-transparent pointer-events-none -z-10" />
    </div>
  );
}
