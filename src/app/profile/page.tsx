"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWallet } from "@/context/WalletContext";
import { sampleNFTs } from "@/data/sampleNFTs";
import NFTCard from "@/components/ui/NFTCard";
import SkeletonGrid from "@/components/ui/SkeletonGrid";
import EmptyState from "@/components/ui/EmptyState";

export default function ProfilePage() {
  const { account, isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState<"owned" | "listings">("owned");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  const ownedNFTs = sampleNFTs.filter(
    (nft) => nft.owner?.toLowerCase() === account?.toLowerCase()
  );
  
  const listingNFTs = ownedNFTs.filter((nft) => nft.isListed);

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-40 pb-20 px-4">
        <EmptyState 
          title="Connect Your Wallet"
          description="Access your personal collection, view your active listings, and manage your digital legacy. Please connect your wallet to proceed."
          icon={
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 6v3" />
            </svg>
          }
          action={
            <button className="px-10 py-4 rounded-2xl bg-accent text-black font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">
               In-App Connection
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-32 px-4 md:px-8 space-y-20">
      <div className="container mx-auto max-w-7xl">
        
        {/* 1. Profile Dashboard Header - Premium Glassmorphism */}
        <div className="relative mb-20 p-10 md:p-16 rounded-[64px] bg-white/5 border border-white/10 overflow-hidden glass-cosmic animate-slide-up">
           {/* Dynamic Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="relative group">
               <div className="w-40 h-40 md:w-52 md:h-52 rounded-[48px] bg-white/5 border border-white/10 p-2.5 group-hover:scale-105 transition-all duration-700 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.5)]">
                  <div className="w-full h-full rounded-[40px] overflow-hidden relative border border-white/5">
                     <Image 
                       src={`https://picsum.photos/seed/${account}/500/500`}
                       alt="Profile Avatar"
                       fill
                       className="object-cover transition-transform duration-1000 group-hover:scale-110"
                     />
                  </div>
               </div>
               <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-[20px] bg-accent flex items-center justify-center text-black border-4 border-[#1a1919] shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
               </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-8">
              <div className="space-y-3">
                 <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none italic">
                   Collection <span className="text-accent not-italic">Operator</span>
                 </h1>
                 <div className="flex items-center justify-center md:justify-start gap-3">
                    <p className="text-lg font-bold text-muted font-mono tracking-tight opacity-60">
                      {truncateAddress(account || "")}
                    </p>
                    <button className="p-2 rounded-xl bg-white/5 text-muted hover:text-accent hover:bg-white/10 transition-all duration-300">
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                    </button>
                 </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-10">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted font-black uppercase tracking-[0.3em] opacity-40">Assets Secured</p>
                    <div className="flex items-baseline gap-2">
                       <span className="text-3xl font-black text-white tracking-tighter">{ownedNFTs.length}</span>
                       <span className="text-xs font-bold text-accent">Items</span>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-white/5 hidden md:block" />
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted font-black uppercase tracking-[0.3em] opacity-40">Market Presence</p>
                    <div className="flex items-baseline gap-2">
                       <span className="text-3xl font-black text-white tracking-tighter">{listingNFTs.length}</span>
                       <span className="text-xs font-bold text-accent">Listings</span>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Strategy Cluster - Navigation Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 px-4">
          <div className="flex items-center gap-3 p-2 rounded-[28px] bg-white/5 border border-white/5 w-fit">
            <button
              onClick={() => setActiveTab("owned")}
              className={`px-10 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700 active:scale-95 whitespace-nowrap ${
                activeTab === "owned"
                  ? "bg-accent text-black shadow-2xl shadow-accent/40 scale-105"
                  : "text-muted hover:text-white"
              }`}
            >
              Secured Assets ({ownedNFTs.length})
            </button>
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-10 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700 active:scale-95 whitespace-nowrap ${
                activeTab === "listings"
                  ? "bg-accent text-black shadow-2xl shadow-accent/40 scale-105"
                  : "text-muted hover:text-white"
              }`}
            >
              Active Listings ({listingNFTs.length})
            </button>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-muted hover:text-white transition-all">
                Edit Bio
             </button>
             <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-muted hover:text-white transition-all">
                Settings
             </button>
          </div>
        </div>

        {/* 3. Assets Array - Skeletons & Transitions */}
        <div className="min-h-[400px]">
          {loading ? (
             <SkeletonGrid type="nft" count={4} gridClass="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10" />
          ) : activeTab === "owned" ? (
            ownedNFTs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {ownedNFTs.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="Vault is Empty"
                description="Our diagnostics show no digital fragments secured in your personal vault. Head to the discovery hub to start your collection."
                action={
                  <Link href="/explore">
                    <button className="px-10 py-4 rounded-2xl bg-accent text-black font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">
                      Scan Discovery Hub
                    </button>
                  </Link>
                }
              />
            )
          ) : (
            listingNFTs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {listingNFTs.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No Market Frequency"
                description="You currently have no active signals on the marketplace. List one of your secured assets to gain market presence."
                icon={
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                }
                action={
                  <button 
                    onClick={() => setActiveTab("owned")}
                    className="px-10 py-4 rounded-2xl bg-accent text-black font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform"
                  >
                    View Owned Assets
                  </button>
                }
              />
            )
          )}
        </div>
      </div>
      
      {/* Dynamic Floor Layer */}
      <div className="fixed bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-accent/[0.04] via-transparent to-transparent pointer-events-none -z-10" />
    </div>
  );
}
