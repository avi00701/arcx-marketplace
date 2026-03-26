"use client";

import Image from "next/image";
import Link from "next/link";
import { Collection } from "@/data/sampleNFTs";
import VerifiedBadge from "./VerifiedBadge";

interface CollectionCardProps {
  collection: Collection;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link
      href={`/collection/${collection.id}`}
      className="group relative block rounded-[40px] bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-700 hover:border-accent/40 hover:-translate-y-4 hover:shadow-[0_40px_80px_-20px_rgba(129,236,255,0.2)] glass-cosmic animate-slide-up"
    >
      {/* Banner/Image Area */}
      <div className="relative aspect-[16/9] overflow-hidden bg-black/40">
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
        />
        
        {/* Floor Price Overlay */}
        <div className="absolute bottom-4 left-4">
           <div className="px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
              <p className="text-[10px] text-muted font-black uppercase tracking-[0.2em] mb-0.5 opacity-60">Floor</p>
              <p className="text-sm font-black text-white tracking-tighter">{collection.floor} ETH</p>
           </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
             <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter truncate group-hover:text-accent transition-colors">
                  {collection.name}
                </h3>
                {collection.verified && <VerifiedBadge className="w-4 h-4" />}
             </div>
             <p className="text-xs text-muted font-bold uppercase tracking-widest opacity-40">{collection.items.toLocaleString()} Items</p>
          </div>
          
          <div className="text-right">
             <p className={`text-sm font-black tracking-tight ${collection.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
               {collection.change}
             </p>
             <p className="text-[9px] text-muted font-black uppercase tracking-widest opacity-40">24H</p>
          </div>
        </div>

        {/* Stats Matrix */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
           <div className="space-y-1">
              <p className="text-[9px] text-muted font-black uppercase tracking-[0.2em] opacity-40">Volume</p>
              <p className="text-sm font-black text-white tracking-widest">{collection.volume} ETH</p>
           </div>
           <div className="space-y-1 text-right">
              <p className="text-[9px] text-muted font-black uppercase tracking-[0.2em] opacity-40">Network</p>
              <p className="text-sm font-black text-accent tracking-widest uppercase">ARC</p>
           </div>
        </div>
      </div>
    </Link>
  );
}
