"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Button from "./Button";
import { NFT } from "@/data/sampleNFTs";

interface HeroProps {
  nfts: NFT[];
}

export default function Hero({ nfts }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const nft = nfts[currentIndex];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (nfts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % nfts.length);
    }, 12000); 
    return () => clearInterval(interval);
  }, [nfts.length]);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % nfts.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + nfts.length) % nfts.length);

  // Enhanced Parallax calculations for "Obsidian" depth
  const bgTranslate = Math.min(scrollY * 0.3, 120);
  const contentFade = Math.max(1 - scrollY / 400, 0);
  
  // PRIMARY MOTION: Content moves RIGHT
  const titleX = scrollY * 0.8; 
  
  // SECONDARY MOTION: Decorative bg text moves LEFT
  const bgTextX = -scrollY * 0.5;
  
  // TERTIARY MOTION: Image card moves LEFT
  const statsX = -scrollY * 0.6;

  return (
    <section className="relative w-full h-[420px] flex items-center overflow-hidden rounded-[48px] border border-white/10 shadow-2xl group animate-slide-up">
      {/* 1. Immersive Background Layer */}
      <div 
        className="absolute inset-0 z-0 h-[120%]"
        style={{ transform: `translateY(${bgTranslate}px)` }}
      >
        <div key={nft.id} className="absolute inset-0 transition-all duration-[2s]">
            <Image
            src={nft.image}
            alt={nft.name}
            fill
            className="object-cover scale-110 group-hover:scale-125 transition-transform duration-[10s]"
            priority
            sizes="100vw"
            />
        </div>
        {/* Deep Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20 opacity-40" />
      </div>

      {/* 2. BACKGROUND DECORATIVE TEXT (Moves LEFT) */}
      <div 
        className="absolute inset-0 z-[5] pointer-events-none flex items-center whitespace-nowrap overflow-hidden opacity-5 select-none"
        style={{ transform: `translateX(${bgTextX}px)` }}
      >
        <h2 className="text-[240px] font-black uppercase italic tracking-tighter text-white/20">
          {nft.collection} • {nft.collection} • {nft.collection}
        </h2>
      </div>

      {/* 3. Content Overlay (Distributed) */}
      <div className="relative z-10 w-full h-full px-12 md:px-24 flex items-center">
        
        {/* LEFT: Identity & Action Group (Moves RIGHT) */}
        <div 
          key={`id-${nft.id}`}
          className="flex flex-col gap-8 transition-transform duration-100 ease-out z-10"
          style={{ opacity: contentFade, transform: `translateX(${titleX}px)` }}
        >
          <div className="space-y-2">
            <h1 className="text-5xl md:text-[80px] font-black text-white/90 tracking-tighter uppercase italic drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)] leading-none">
              {nft.collection}
            </h1>
            <div className="flex items-center gap-3">
                <p className="text-2xl md:text-3xl font-light text-white/60 lowercase tracking-wide drop-shadow-lg">
                    by {nft.creator}
                </p>
                {nft.verified && (
                    <div className="w-6 h-6 rounded-full bg-[#1da1f2] flex items-center justify-center shadow-lg">
                       <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.3 1.241.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                       </svg>
                    </div>
                )}
            </div>
          </div>

          <Link href={`/nft/${nft.id}`}>
            <button className="px-10 py-5 rounded-[24px] text-lg font-black uppercase tracking-[0.2em] shadow-2xl bg-[#71f4ff] text-black hover:scale-110 hover:shadow-[0_0_40px_rgba(113,244,255,0.4)] transition-all duration-300">
                Explore
            </button>
          </Link>
        </div>

        {/* RIGHT: Floating Media Group (Moves LEFT) */}
        <div 
          key={`media-${nft.id}`}
          className="absolute left-[72%] -translate-x-1/2 flex items-center justify-center z-[15]"
          style={{ opacity: contentFade, transform: `translateX(${statsX}px) translateY(${-scrollY * 0.1}px)` }}
        >
           <div className="relative w-[300px] h-[300px] md:w-[360px] md:h-[360px] rounded-[32px] overflow-hidden border border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] glass-cosmic p-1 animate-float transition-all duration-700">
              <Image
                src={nft.image}
                alt={nft.name}
                fill
                className="object-cover rounded-[28px]"
                sizes="(max-width: 768px) 300px, 360px"
              />
           </div>
        </div>
      </div>

      {/* 3. Navigation Controls (Edges) */}
      <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={handlePrev}
          className="w-14 h-14 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white hover:bg-black/60 hover:text-accent transition-all active:scale-95 pointer-events-auto backdrop-blur-md"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          onClick={handleNext}
          className="w-14 h-14 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white hover:bg-black/60 hover:text-accent transition-all active:scale-95 pointer-events-auto backdrop-blur-md"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Progress Indicators (Bottom Center) - 50% Size Reduction */}
      {nfts.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 p-1.5 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl">
           {nfts.map((_, i) => (
               <button 
                   key={i}
                   onClick={() => setCurrentIndex(i)}
                   className="group/dot relative p-1"
                   aria-label={`Go to slide ${i + 1}`}
               >
                   <div className={`h-1 rounded-full transition-all duration-500 ${i === currentIndex ? "w-5 bg-[#71f4ff] shadow-[0_0_10px_rgba(113,244,255,0.8)]" : "w-1 bg-white/20 group-hover/dot:bg-white/40 group-hover/dot:w-2"}`} />
               </button>
           ))}
        </div>
      )}
    </section>
  );
}
