"use client";

import { useWallet } from "@/context/WalletContext";
import { useAdmin } from "@/context/AdminContext";
import { sampleNFTs } from "@/data/sampleNFTs";
import { sampleCreators } from "@/data/sampleCreators";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { isConnected, account } = useWallet();
  const { 
    role, 
    isWL, 
    isAdmin, 
    isOwner, 
    adminWallets, 
    wlWallets, 
    addAdmin, 
    removeAdmin, 
    addWL, 
    removeWL, 
    togglePin, 
    toggleHide, 
    getNFTStatus 
  } = useAdmin();
  const router = useRouter();

  const [newAdmin, setNewAdmin] = useState("");
  const [newWL, setNewWL] = useState("");
  const [activeView, setActiveView] = useState<"NFTs" | "Roles" | "Creators">("NFTs");
  const [searchQuery, setSearchQuery] = useState("");

  const { 
    verifiedCreators,
    toggleCreatorVerification,
    isCreatorVerified
  } = useAdmin();

  // Protection
  useEffect(() => {
    if (!isWL && isConnected) {
      router.push("/");
    }
  }, [isWL, isConnected, router]);

  const filteredNFTs = sampleNFTs.filter(nft => 
    nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nft.id.toString().includes(searchQuery)
  );

  // Get unique creators from NFTs and sampleCreators
  const allUniqueCreators = Array.from(new Set([
    ...sampleNFTs.map(n => n.creator),
    ...sampleCreators.map(c => c.name) // Using name as identifier for simplicity in this mock
  ])).map(name => {
    const creatorInfo = sampleCreators.find(c => c.name === name);
    const nftInfo = sampleNFTs.find(n => n.creator === name);
    return {
      name,
      avatar: creatorInfo?.avatar || nftInfo?.creatorAvatar || `https://picsum.photos/seed/${name}/100/100`,
      handle: creatorInfo?.handle || name.toLowerCase().replace(/\s+/g, ''),
      isVerified: isCreatorVerified(name) || creatorInfo?.verified || false
    };
  });

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-black text-white uppercase mb-4">Access Denied</h1>
        <p className="text-muted mb-8">Please connect an authorized wallet to access the Admin Panel.</p>
      </div>
    );
  }

  if (!isWL) return null;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-2">Admin Panel</h1>
          <p className="text-muted font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            Session: <span className="text-accent">{account}</span> 
            <span className="px-2 py-0.5 rounded bg-accent/20 text-accent border border-accent/30">{role}</span>
          </p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          <button 
            onClick={() => setActiveView("NFTs")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === "NFTs" ? "bg-accent text-black shadow-lg shadow-accent/20" : "text-muted hover:text-white"}`}
          >
            Manage NFTs
          </button>
          <button 
            onClick={() => setActiveView("Creators")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === "Creators" ? "bg-accent text-black shadow-lg shadow-accent/20" : "text-muted hover:text-white"}`}
          >
            Manage Creators
          </button>
          <button 
            onClick={() => setActiveView("Roles")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === "Roles" ? "bg-accent text-black shadow-lg shadow-accent/20" : "text-muted hover:text-white"}`}
          >
            Manage Roles
          </button>
        </div>
      </div>

      {activeView === "NFTs" && (
        <div className="space-y-8 animate-in fade-in duration-500">
           {/* Search Bar */}
           <div className="relative max-w-md">
             <input
               type="text"
               placeholder="Search NFTs by name or ID..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-accent focus:outline-none transition-all placeholder:text-muted/50"
             />
             <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
             </div>
           </div>

           <div className="bg-surface/30 backdrop-blur-3xl rounded-[32px] border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted/60">
                          <th className="p-6">Asset</th>
                          <th className="p-6">Collection</th>
                          <th className="p-6">Status</th>
                          <th className="p-6 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {filteredNFTs.map((nft) => {
                         const status = getNFTStatus(nft.id);
                         return (
                           <tr key={nft.id} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="p-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                                       <img src={nft.image} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="space-y-0.5">
                                       <p className="text-sm font-bold text-white uppercase tracking-tight">{nft.name}</p>
                                       <p className="text-[10px] text-muted font-black">ID: {nft.id}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-6 text-xs text-muted font-bold uppercase">{nft.collection}</td>
                              <td className="p-6">
                                 <div className="flex gap-2">
                                    {status.featured && <span className="px-2 py-0.5 rounded-md bg-accent/20 text-accent text-[9px] font-black uppercase border border-accent/20">Featured</span>}
                                    {status.hidden && <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 text-[9px] font-black uppercase border border-rose-500/20">Hidden</span>}
                                    {!status.featured && !status.hidden && <span className="text-[9px] text-muted/40 font-black uppercase">Standard</span>}
                                 </div>
                              </td>
                              <td className="p-6 text-right">
                                 <div className="flex justify-end gap-3">
                                    <button 
                                      onClick={() => togglePin(nft.id)}
                                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${status.featured ? "bg-accent text-black border-accent" : "border-white/10 text-muted hover:border-white/30 hover:text-white"}`}
                                    >
                                      {status.featured ? "Unpin" : "Pin"}
                                    </button>
                                    <button 
                                      onClick={() => toggleHide(nft.id)}
                                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${status.hidden ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20" : "border-white/10 text-muted hover:border-white/30 hover:text-white"}`}
                                    >
                                      {status.hidden ? "Unhide" : "Hide"}
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         );
                       })}
                       {filteredNFTs.length === 0 && (
                         <tr>
                           <td colSpan={4} className="p-12 text-center text-muted text-sm italic">
                             No NFTs found matching "{searchQuery}"
                           </td>
                         </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {activeView === "Creators" && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allUniqueCreators.map((creator) => (
                <div key={creator.name} className="bg-surface/30 p-6 rounded-[32px] border border-white/10 flex items-center justify-between gap-4 group hover:border-accent/30 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10">
                         <img src={creator.avatar} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="space-y-0.5">
                         <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-white uppercase tracking-tight">{creator.name}</p>
                            {creator.isVerified && (
                               <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                               </svg>
                            )}
                         </div>
                         <p className="text-[10px] text-muted font-black tracking-widest">@{creator.handle}</p>
                      </div>
                   </div>
                   
                   <button 
                     onClick={() => toggleCreatorVerification(creator.name)}
                     className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${creator.isVerified ? "bg-accent/20 text-accent border-accent/20 hover:bg-accent hover:text-black" : "border-white/10 text-muted hover:border-white/30 hover:text-white"}`}
                   >
                     {creator.isVerified ? "Verified" : "Verify"}
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeView === "Roles" && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {!isOwner && (
            <div className="p-12 text-center bg-white/5 rounded-[32px] border border-white/10">
              <h3 className="text-2xl font-black text-white uppercase mb-2">Owner Access Required</h3>
              <p className="text-muted">Only the System Owner can manage Admin and WL roles.</p>
            </div>
          )}

          {isOwner && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* ADMIN Wallets */}
               <div className="space-y-6 bg-surface/30 p-8 rounded-[32px] border border-white/10">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Admin Wallets</h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add Wallet Address"
                      value={newAdmin}
                      onChange={(e) => setNewAdmin(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:border-accent focus:outline-none transition-all"
                    />
                    <button 
                      onClick={() => { addAdmin(newAdmin); setNewAdmin(""); }}
                      className="bg-accent text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-3 pt-4">
                    {adminWallets.map(w => (
                      <div key={w} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group">
                        <span className="text-xs font-mono text-muted group-hover:text-white transition-colors">{w}</span>
                        <button onClick={() => removeAdmin(w)} className="text-rose-400 hover:text-rose-300 text-[10px] font-black uppercase tracking-widest">Remove</button>
                      </div>
                    ))}
                    {adminWallets.length === 0 && <p className="text-muted/40 text-[10px] text-center italic">No admin wallets added.</p>}
                  </div>
               </div>

               {/* WL Wallets */}
               <div className="space-y-6 bg-surface/30 p-8 rounded-[32px] border border-white/10">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">WL Wallets</h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add Whitelist Address"
                      value={newWL}
                      onChange={(e) => setNewWL(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:border-accent focus:outline-none transition-all"
                    />
                    <button 
                      onClick={() => { addWL(newWL); setNewWL(""); }}
                      className="bg-accent text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-3 pt-4">
                    {wlWallets.map(w => (
                      <div key={w} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group">
                        <span className="text-xs font-mono text-muted group-hover:text-white transition-colors">{w}</span>
                        <button onClick={() => removeWL(w)} className="text-rose-400 hover:text-rose-300 text-[10px] font-black uppercase tracking-widest">Remove</button>
                      </div>
                    ))}
                    {wlWallets.length === 0 && <p className="text-muted/40 text-[10px] text-center italic">No whitelisted wallets added.</p>}
                  </div>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
