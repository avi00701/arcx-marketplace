"use client";

import Image from "next/image";
import Link from "next/link";
import { NFT } from "@/data/sampleNFTs";
import { useState } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { useAdmin } from "@/context/AdminContext";
import VerifiedBadge from "./VerifiedBadge";

interface NFTCardProps {
  nft: NFT;
}

export default function NFTCard({ nft }: NFTCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isCreatorVerified } = useAdmin();
  const [imageLoaded, setImageLoaded] = useState(false);
  const liked = isFavorite(nft.id);

  return (
    <Link
      href={`/nft/${nft.id}`}
      className="group block rounded-[40px] bg-white/5 backdrop-blur-2xl border border-white/10 overflow-hidden transition-all duration-700 hover:border-accent/40 hover:-translate-y-4 hover:shadow-[0_32px_64px_-16px_rgba(129,236,255,0.25)] glass-cosmic animate-slide-up"
      id={`nft-card-${nft.id}`}
    >
      {/* Image Container with Premium Parallax/Scale */}
      <div className="relative aspect-[4/5] overflow-hidden bg-black/40">
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}
        <Image
          src={nft.image}
          alt={nft.name}
          fill
          className={`object-cover transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-115 group-hover:rotate-2 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Status Badge Overlay - Floating Style */}
        <div className="absolute top-6 left-6">
           <div className="px-4 py-2 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/15 text-[10px] font-black text-white uppercase tracking-[0.25em] shadow-2xl flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {nft.id.includes('tmp') ? 'Genesis' : 'Direct'}
           </div>
        </div>

        {/* Action Button - Enhanced Glassmorphism */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(nft.id);
          }}
          className={`absolute top-6 right-6 w-11 h-11 rounded-2xl backdrop-blur-xl border border-white/15 transition-all duration-500 cursor-pointer flex items-center justify-center shadow-2xl group/btn ${
            liked 
              ? "bg-accent text-black opacity-100 scale-110" 
              : "bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-accent hover:text-black hover:scale-110 hover:-rotate-12"
          }`}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-500 ${
              liked ? "scale-110" : "group-hover/btn:scale-125"
            }`}
            fill={liked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* Premium Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      </div>

      {/* Content Area - Premium Grid Spacing */}
      <div className="p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] text-accent font-black uppercase tracking-[0.35em] leading-none">
              {nft.collection}
            </span>
            {isCreatorVerified(nft.creator) && <VerifiedBadge className="w-3.5 h-3.5" />}
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter truncate leading-tight group-hover:text-accent transition-colors duration-500">
            {nft.name}
          </h3>
        </div>

        {/* Value Matrix - Redesigned for visual weight */}
        <div className="flex items-end justify-between pt-6 border-t border-white/5">
          <div className="space-y-2">
            <p className="text-[9px] text-muted font-black uppercase tracking-[0.4em] opacity-60">Value Index</p>
            <div className="flex items-baseline gap-1.5">
               <p className="text-2xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform origin-left duration-500">
                 {nft.price}
               </p>
               <span className="text-[10px] text-accent font-black uppercase tracking-widest">{nft.currency}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2 text-right">
             <div className="flex -space-x-2.5 group-hover:-space-x-1.5 transition-all duration-500">
                {[1, 2, 3].map((i) => (
                   <div key={i} className="w-8 h-8 rounded-2xl border-2 border-[#1a1919] bg-gray-800 bg-cover shadow-xl" style={{ backgroundImage: `url(https://picsum.photos/50/50?random=${nft.id}-${i})` }} />
                ))}
             </div>
             <p className="text-[10px] text-muted font-black uppercase tracking-[0.1em] opacity-40">Featured</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
