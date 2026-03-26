"use client";

import { useWallet } from "@/context/WalletContext";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { sampleNFTs } from "@/data/sampleNFTs";
import { useFavorites } from "@/context/FavoritesContext";
import { useAdmin } from "@/context/AdminContext";
import VerifiedBadge from "@/components/ui/VerifiedBadge";

// Simple SVG Price Graph Component
const PriceGraph = () => {
  const points = "0,80 40,60 80,70 120,40 160,50 200,20 240,30 280,10 320,40 360,20 400,30";
  return (
    <div className="w-full h-40 relative group">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M ${points} L 400,100 L 0,100 Z`}
          fill="url(#lineGradient)"
          className="transition-all duration-700"
        />
        <polyline
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="shadow-3xl"
        />
      </svg>
    </div>
  );
};

export default function NFTDetail() {
  const { id } = useParams();
  const { isConnected, isCorrectNetwork, switchNetwork, getContract, account } = useWallet();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isCreatorVerified } = useAdmin();
  const router = useRouter();
  
  const [nft, setNft] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState({ minted: 0, max: 0, isUnlimited: true });
  const [buying, setBuying] = useState(false);
  const isLiked = isFavorite(id as string);
  const [expandedSection, setExpandedSection] = useState<string | null>("Traits");
  const [activeTab, setActiveTab] = useState("Details");

  useEffect(() => {
    const fetchNFT = async () => {
      if (!id) return;
      
      const contract = getContract();
      
      // Fetch Global Supply Stats
      if (contract) {
        try {
          const m = await contract.mintedCount().catch(() => null);
          const ms = await contract.maxSupply().catch(() => null);
          
          if (m !== null && ms !== null) {
            setGlobalStats({
              minted: Number(m),
              max: Number(ms),
              isUnlimited: Number(ms) === 0
            });
          }
        } catch (e) {
          console.warn("Silent ignore failed stats.");
        }
      }

      const mockNft = sampleNFTs.find((n) => n.id === id) || sampleNFTs[0];
      const baseNft = {
        ...mockNft,
        description: "This unique digital collectible is part of the legendary ArcX Origins collection. Verified on the Arc Testnet.",
        seller: "0x6339000C190D48970891000B1a0B18000C190D48",
        owner: "0x0000000000000000000000000000000000000000",
        sold: false,
        traits: [
          { type: "Background", value: "Cosmic Obsidian", rarity: "12%", floor: "4.2 ETH" },
          { type: "Atmosphere", value: "Nebula", rarity: "8%", floor: "5.1 ETH" },
          { type: "Core", value: "Fragment", rarity: "25%", floor: "3.8 ETH" },
          { type: "Rarity", value: "Legendary", rarity: "2%", floor: "12.5 ETH" }
        ],
        activity: [
          { event: "Sale", price: "4.033 ETH", from: "0x882...12b", to: "0x294...a20", date: "2 days ago" },
          { event: "Transfer", price: "--", from: "0x112...f33", to: "0x882...12b", date: "5 days ago" },
          { event: "Minted", price: "--", from: "null", to: "0x112...f33", date: "1 week ago" }
        ],
        offers: [
          { price: "4.09 WETH", floorDifference: "1.2% below", expiration: "in 2 days", from: "0x771...bc2" },
          { price: "3.95 WETH", floorDifference: "4.5% below", expiration: "in 5 days", from: "0xac1...99e" }
        ]
      };

      if (!contract) {
        setNft(baseNft);
        setLoading(false);
        return;
      }

      try {
        const tokenId = Number(id);
        const data = await contract.idToNFT(tokenId).catch(() => null);
        if (!data) throw new Error("Not found");

        const tokenURI = await contract.tokenURI(tokenId).catch(() => "");
        let metadata = { name: `NFT #${id}`, description: "", image: "" };
        if (tokenURI) {
          try { metadata = JSON.parse(tokenURI); } catch (e) {}
        }

        setNft({
          ...baseNft,
          id: tokenId,
          name: metadata.name || `ArcX NFT #${tokenId}`,
          description: metadata.description || baseNft.description,
          image: metadata.image || baseNft.image,
          price: ethers.formatEther(data.price),
          seller: data.seller,
          owner: data.owner,
          sold: data.sold,
        });
      } catch (error) {
        setNft(baseNft);
      } finally {
        setLoading(false);
      }
    };

    fetchNFT();
  }, [id, getContract]);

  const handleBuy = async () => {
    if (!isConnected) { alert("Please connect wallet."); return; }
    if (!isCorrectNetwork) { await switchNetwork(); return; }
    setBuying(true);
    try {
      const contract = getContract();
      if (!contract) return;
      const tx = await contract.buyNFT(id, { value: ethers.parseEther(nft.price) });
      await tx.wait();
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setBuying(false);
    }
  };

  if (loading || !nft) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="text-muted text-xl font-bold uppercase tracking-widest">Accessing Blockchain...</p>
      </div>
    );
  }

  const isOwner = account?.toLowerCase() === nft.owner?.toLowerCase();
  const isSold = nft.sold || (!globalStats.isUnlimited && globalStats.minted >= globalStats.max);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-inter">

      <div className="container mx-auto px-4 lg:px-8 py-10 xl:py-16 flex flex-col lg:flex-row gap-12 xl:gap-20">
        {/* Left Column: Visual Assets */}
        <div className="w-full lg:w-[45%] space-y-8 animate-in fade-in duration-1000">
          <div className="relative aspect-square rounded-[32px] overflow-hidden border border-white/10 bg-surface/30 p-2 shadow-2xl">
             <Image src={nft.image} alt={nft.name} fill className="object-cover rounded-[24px]" priority />
             
             {/* Interaction Controls */}
             <div className="absolute top-6 right-6 flex flex-col gap-3">
                <button 
                  onClick={() => toggleFavorite(id as string)}
                  className={`p-4 rounded-3xl backdrop-blur-2xl border border-white/10 shadow-xl transition-all hover:scale-110 ${isLiked ? "bg-accent text-black" : "bg-black/40 text-white"}`}
                >
                  <svg className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
             </div>
          </div>

          {/* Collapsible Info Stack */}
          <div className="space-y-4">
             {/* Traits Accordion */}
             <div className="rounded-3xl border border-white/10 overflow-hidden bg-surface/10">
                <button 
                  onClick={() => setExpandedSection(expandedSection === "Traits" ? null : "Traits")}
                  className="w-full p-6 flex justify-between items-center group"
                >
                   <span className="text-xs font-black uppercase tracking-widest text-muted group-hover:text-white transition-colors">Traits</span>
                   <svg className={`w-5 h-5 transition-transform ${expandedSection === "Traits" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" /></svg>
                </button>
                {expandedSection === "Traits" && (
                   <div className="p-6 grid grid-cols-2 gap-4 border-t border-white/5 animate-in slide-in-from-top-2">
                     {nft.traits.map((t: any, i: number) => (
                       <div key={i} className="bg-accent/5 border border-accent/10 rounded-2xl p-4 text-center group hover:bg-accent/10 transition-all cursor-default">
                          <p className="text-[10px] text-accent font-black uppercase tracking-tighter mb-1">{t.type}</p>
                          <p className="text-sm font-bold text-white mb-2">{t.value}</p>
                          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-tight text-muted">
                            <span>{t.rarity} rarity</span>
                            <span>Floor: {t.floor}</span>
                          </div>
                       </div>
                     ))}
                   </div>
                )}
             </div>

             {/* Price History Accordion */}
             <div className="rounded-3xl border border-white/10 overflow-hidden bg-surface/10">
                <button 
                  onClick={() => setExpandedSection(expandedSection === "Graph" ? null : "Graph")}
                  className="w-full p-6 flex justify-between items-center group"
                >
                   <span className="text-xs font-black uppercase tracking-widest text-muted group-hover:text-white transition-colors">Price history</span>
                   <svg className={`w-5 h-5 transition-transform ${expandedSection === "Graph" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" /></svg>
                </button>
                {expandedSection === "Graph" && (
                   <div className="p-8 border-t border-white/5 animate-in slide-in-from-top-2">
                     <PriceGraph />
                     <div className="flex justify-between mt-4 text-[10px] font-bold text-muted uppercase tracking-widest">
                       <span>Feb 25</span>
                       <span>Current</span>
                     </div>
                   </div>
                )}
             </div>
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="flex-1 space-y-10 animate-in fade-in duration-1000">
           <div className="space-y-6">
             {/* Header Metadata */}
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <Link href="/explore" className="text-accent font-black text-xs hover:underline flex items-center gap-1">
                   {nft.collection}
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                 </Link>
                 <span className="text-muted text-xs">• Created by <span className="text-white">{nft.creator}</span></span>
                 {isCreatorVerified(nft.creator) && <VerifiedBadge className="w-3.5 h-3.5" />}
               </div>
               <div className="flex gap-2">
                 {[
                   <path key="x" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>,
                   <path key="discord" d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01a13.921 13.921 0 0 0 10.222 0a.074.074 0 0 1 .077.01c.124.097.248.195.372.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.947 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z"/>,
                   <path key="share" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                 ].map((icon, idx) => (
                   <button key={idx} className="p-2 rounded-xl bg-white/5 text-muted hover:text-white hover:bg-white/10 transition-all">
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">{icon}</svg>
                   </button>
                 ))}
               </div>
             </div>

             <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-[0.9]">
               {nft.name}
               <span className="block text-accent text-2xl font-black mt-2">#{nft.id}</span>
             </h1>
           </div>

           {/* Purchase Block */}
           <div className="p-10 rounded-[40px] glass-cosmic border-accent/20 space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/20 transition-all duration-1000" />
              
              <div className="space-y-4">
                 <p className="text-xs font-black uppercase tracking-widest text-muted">Buy for</p>
                 <div className="flex items-baseline gap-4">
                   <span className="text-8xl font-black text-white">{nft.price} {nft.currency}</span>
                   <span className="text-muted text-xl font-bold tracking-tight">($9,059)</span>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleBuy}
                  disabled={buying || isSold}
                  className="flex-1 py-6 rounded-[24px] bg-accent text-black font-black uppercase tracking-widest text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-accent/20 disabled:opacity-40"
                >
                  {buying ? "Transmitting..." : isSold ? "Sold Out" : "Buy Now"}
                </button>
                <button className="flex-1 py-6 rounded-[24px] bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-lg hover:bg-white/10 transition-all">
                  List for sale
                </button>
              </div>

              {/* Scarcity / Timeline */}
              <div className="pt-6 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted">
                <div className="flex gap-2">
                   <span className="text-accent">Sale ends in</span>
                   <span className="text-white">5 hours 12 mins</span>
                </div>
                <span>Volume: 12.4k ETH</span>
              </div>
           </div>

           {/* Comprehensive Details Tabs */}
           <div className="space-y-6">
              <div className="flex gap-10 border-b border-white/10 overflow-x-auto no-scrollbar">
                {["Details", "Offers", "Activity"].map((tab) => (
                   <button 
                     key={tab} 
                     onClick={() => setActiveTab(tab)}
                     className={`pb-4 text-xs font-black uppercase tracking-widest relative transition-all whitespace-nowrap ${activeTab === tab ? "text-white" : "text-muted hover:text-white"}`}
                   >
                     {tab}
                     {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-accent rounded-full shadow-[0_0_10px_var(--accent)]" />}
                   </button>
                ))}
              </div>

              <div className="min-h-[250px] animate-in fade-in duration-500">
                 {activeTab === "Details" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Provenance</h4>
                          <p className="text-sm font-medium leading-relaxed text-muted/80">{nft.description}</p>
                       </div>
                       <div className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/5">
                          {[
                            { label: "Contract", value: "0xDefi...Market", color: "text-accent font-mono" },
                            { label: "Token ID", value: nft.id, color: "text-white" },
                            { label: "Standard", value: "ERC-721", color: "text-white" },
                            { label: "Chain", value: "Arc Testnet", color: "text-white" },
                            { label: "Royalty", value: "5%", color: "text-white" }
                          ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                               <span className="text-[10px] font-black uppercase tracking-widest text-muted/60">{item.label}</span>
                               <span className={`text-xs font-bold ${item.color}`}>{item.value}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 )}

                 {activeTab === "Offers" && (
                    <div className="overflow-hidden rounded-3xl border border-white/10 overflow-x-auto">
                       <table className="w-full text-left border-collapse">
                          <thead>
                             <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted">
                                <th className="p-4 px-6">Price</th>
                                <th className="p-4 px-6 text-center">Floor Diff</th>
                                <th className="p-4 px-6">From</th>
                                <th className="p-4 px-6">Expires</th>
                             </tr>
                          </thead>
                          <tbody>
                             {nft.offers.map((offer: any, i: number) => (
                               <tr key={i} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                                  <td className="p-6 font-bold text-white text-sm">{offer.price}</td>
                                  <td className="p-6 text-center text-xs text-rose-400 font-bold">{offer.floorDifference}</td>
                                  <td className="p-6 text-accent text-xs font-mono">{offer.from}</td>
                                  <td className="p-6 text-muted text-xs font-bold uppercase">{offer.expiration}</td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 )}

                 {activeTab === "Activity" && (
                    <div className="overflow-hidden rounded-3xl border border-white/10 overflow-x-auto">
                       <table className="w-full text-left border-collapse">
                          <thead>
                             <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted">
                                <th className="p-4 px-6">Event</th>
                                <th className="p-4 px-6">Price</th>
                                <th className="p-4 px-6">From</th>
                                <th className="p-4 px-6">To</th>
                                <th className="p-4 px-6">Time</th>
                             </tr>
                          </thead>
                          <tbody>
                             {nft.activity.map((act: any, i: number) => (
                               <tr key={i} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors text-xs font-medium">
                                  <td className="p-6 flex items-center gap-3">
                                     <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                     <span className="font-bold text-white uppercase tracking-widest text-[10px]">{act.event}</span>
                                  </td>
                                  <td className="p-6 text-white font-bold">{act.price}</td>
                                  <td className="p-6 text-muted font-mono">{act.from}</td>
                                  <td className="p-6 text-muted font-mono">{act.to}</td>
                                  <td className="p-6 text-muted/60">{act.date}</td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
