"use client";

import Image from "next/image";
import Link from "next/link";
import { Creator } from "@/data/sampleCreators";
import { useAdmin } from "@/context/AdminContext";
import VerifiedBadge from "./VerifiedBadge";

interface CreatorCardProps {
  creator: Creator;
  rank?: number;
}

export default function CreatorCard({ creator, rank }: CreatorCardProps) {
  const { isCreatorVerified } = useAdmin();
  const verified = creator.verified || isCreatorVerified(creator.name);

  return (
    <Link
      href={`/creator/${creator.handle}`}
      className="group relative flex items-center gap-5 p-5 rounded-[32px] bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-500 hover:border-accent/40 hover:shadow-[0_24px_48px_-12px_rgba(129,236,255,0.15)] hover:-translate-y-2 glass-cosmic animate-slide-up"
    >
      {/* Rank Indicator - Stylized */}
      {rank && (
        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-black text-xs font-black shadow-lg shadow-accent/20 z-10 group-hover:scale-110 transition-transform duration-500">
          {rank}
        </div>
      )}

      {/* Avatar with Premium Border */}
      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover:scale-105 transition-all duration-700 shadow-2xl">
        <Image
          src={creator.avatar}
          alt={creator.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Info Cluster */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-black text-white truncate group-hover:text-accent transition-colors duration-300 tracking-tight">
            {creator.name}
          </h3>
          {verified && <VerifiedBadge className="w-4 h-4" />}
        </div>
        <div className="flex flex-col gap-0.5">
           <p className="text-[10px] text-muted font-black uppercase tracking-widest opacity-60">@{creator.handle}</p>
           <p className="text-xs font-bold text-accent tracking-tight">{creator.totalVolume} Total Volume</p>
        </div>
      </div>

      {/* Premium Action Indicator */}
      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 group-hover:bg-accent group-hover:text-black shadow-xl">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </Link>
  );
}
