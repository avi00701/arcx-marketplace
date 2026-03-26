"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import NFTCard from "@/components/ui/NFTCard";

interface CreatorProfile {
  name: string;
  bio: string;
  avatar: string;
  banner: string;
  twitter: string;
}

export default function CreatorStudio() {
  const { isConnected, account, getContract, provider } = useWallet();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [myNFTs, setMyNFTs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isValidUrl = (url: string) => {
    if (!url) return false;
    return url.startsWith("http") || url.startsWith("/") || url.startsWith("data:");
  };

  // Form State
  const [formData, setFormData] = useState<CreatorProfile>({
    name: "",
    bio: "",
    avatar: "",
    banner: "",
    twitter: "",
  });

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem("arcx_creator_profile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
      setFormData(parsed);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchMyCreations = async () => {
      if (!isConnected || !account) return;
      
      const contract = getContract();
      if (!contract || !provider) return;

      try {
        const filter = contract.filters.NFTMinted(null, account);
        const events = await contract.queryFilter(filter, -1000);
        
        const items = await Promise.all(events.map(async (event: any) => {
          const { tokenId, tokenURI, price } = event.args;
          let metadata = { name: `NFT #${tokenId}`, image: "" };
          try { metadata = JSON.parse(tokenURI); } catch (e) {}

          return {
            id: String(tokenId),
            name: metadata.name || `ArcX NFT #${tokenId}`,
            collection: "ArcX Origins",
            price: ethers.formatEther(price),
            image: metadata.image || `https://picsum.photos/seed/${tokenId}/800/800`,
            currentBid: "0",
            category: "Art",
            seller: account
          };
        }));

        setMyNFTs(items);
      } catch (error) {
        console.error("Error fetching my creations:", error);
      }
    };

    if (isConnected && profile) {
      fetchMyCreations();
    }
  }, [isConnected, account, getContract, provider, profile]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("arcx_creator_profile", JSON.stringify(formData));
    setProfile(formData);
    setIsEditing(false);
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="w-20 h-20 bg-surface rounded-3xl flex items-center justify-center mx-auto text-accent border border-border">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Wallet Connection Required</h1>
          <p className="text-muted">Please connect your wallet to access your professional Creator Studio and manage your digital legacy.</p>
        </div>
      </div>
    );
  }

  if (!profile || isEditing) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold">{isEditing ? "Update Profile" : "Initialize Creator Studio"}</h1>
            <p className="text-muted">Set up your professional identity on the ArcX marketplace.</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-8 glass p-8 md:p-12 rounded-[32px] border border-border">
            {/* Banner Preview/Upload */}
            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-wider text-muted">Banner Image</label>
              <div className="relative aspect-[4/1] rounded-2xl overflow-hidden bg-surface border border-dashed border-border group">
                {isValidUrl(formData.banner) ? (
                  <img src={formData.banner} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted">
                    No banner selected
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-bold">Change Banner</span>
                </div>
              </div>
              <input 
                type="text" 
                placeholder="Banner URL (e.g. Unsplash link)"
                className="w-full px-5 py-3 rounded-xl bg-surface border border-border focus:border-accent outline-none transition-colors"
                value={formData.banner}
                onChange={(e) => setFormData({...formData, banner: e.target.value})}
                required
              />
            </div>

            {/* Avatar & Name */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="space-y-4">
                <label className="text-sm font-bold uppercase tracking-wider text-muted">Profile Photo</label>
                <div className="relative w-32 h-32 rounded-3xl overflow-hidden bg-surface border border-dashed border-border group shrink-0">
                  {isValidUrl(formData.avatar) ? (
                    <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted text-xs">
                      No photo
                    </div>
                  )}
                </div>
                <input 
                  type="text" 
                  placeholder="Avatar URL"
                  className="w-full px-5 py-3 rounded-xl bg-surface border border-border focus:border-accent outline-none transition-colors"
                  value={formData.avatar}
                  onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                  required
                />
              </div>

              <div className="flex-1 space-y-4">
                <label className="text-sm font-bold uppercase tracking-wider text-muted">Creator Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Digital Alchemist"
                  className="w-full px-5 py-3 rounded-xl bg-surface border border-border focus:border-accent outline-none transition-colors text-lg font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                
                <label className="text-sm font-bold uppercase tracking-wider text-muted block pt-2">X (Twitter) Handle</label>
                <div className="flex items-center gap-2">
                   <div className="bg-surface border border-border px-4 py-3 rounded-xl text-muted">@</div>
                   <input 
                    type="text" 
                    placeholder="username"
                    className="flex-1 px-5 py-3 rounded-xl bg-surface border border-border focus:border-accent outline-none transition-colors"
                    value={formData.twitter}
                    onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-wider text-muted">Bio</label>
              <textarea 
                placeholder="Tell the world about your creative journey..."
                rows={4}
                className="w-full px-5 py-3 rounded-xl bg-surface border border-border focus:border-accent outline-none transition-colors resize-none"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" size="lg" className="flex-1 py-4">
                {isEditing ? "Save Changes" : "Start Creating"}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" size="lg" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header / Banner Area */}
      <div className="relative h-64 md:h-[400px] w-full overflow-hidden">
        {isValidUrl(profile.banner) && <img src={profile.banner} alt="Banner" className="w-full h-full object-cover blur-[1px]" />}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row items-end gap-10 mb-20">
          <div className="relative w-48 h-48 rounded-[48px] overflow-hidden border-8 border-background bg-surface shadow-3xl">
            {isValidUrl(profile.avatar) && <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />}
          </div>
          <div className="flex-1 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">{profile.name}</h1>
              <div className="flex flex-wrap items-center gap-6">
                <Link href={`https://twitter.com/${profile.twitter}`} target="_blank" className="flex items-center gap-2 text-accent font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-transform">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  @{profile.twitter}
                </Link>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                   {myNFTs.length} Assets Launched
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="lg" className="rounded-2xl border-white/10 hover:bg-white/5 font-black uppercase tracking-widest text-xs" onClick={() => setIsEditing(true)}>
                Settings
              </Button>
              <Link href="/studio/create">
                 <Button size="lg" className="rounded-2xl px-10 font-black uppercase tracking-widest text-xs shadow-2xl shadow-accent/20">Launch Drop</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* Bio Side Panel */}
          <div className="lg:col-span-1 space-y-10">
            <div className="glass-cosmic p-8 rounded-[40px] space-y-6 shadow-2xl">
              <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-accent">Artist Statement</h3>
              <p className="text-muted leading-relaxed font-medium">
                {profile.bio}
              </p>
            </div>
            
            <div className="space-y-4">
               <div className="p-6 rounded-[32px] bg-surface/40 border border-white/5 flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Wallet Identity</span>
                  <span className="text-sm font-black text-accent tracking-widest">{account?.slice(0, 8)}...{account?.slice(-6)}</span>
               </div>
            </div>
          </div>

          {/* Main Dashboard Panel */}
          <div className="lg:col-span-3 space-y-16">
            <div className="flex items-center justify-between border-b border-white/5 pb-10">
               <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">Catalog</h2>
               <div className="px-4 py-2 rounded-xl bg-surface border border-white/5 font-black uppercase tracking-widest text-[10px] text-muted">
                  {myNFTs.length} Collected Items
               </div>
            </div>

            {myNFTs.length === 0 ? (
              <div className="p-24 rounded-[64px] glass-cosmic border border-dashed border-white/10 text-center space-y-10 shadow-3xl group">
                <div className="w-24 h-24 bg-accent/10 rounded-[32px] flex items-center justify-center mx-auto text-accent border border-accent/20 group-hover:scale-110 transition-transform duration-700">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white tracking-tight uppercase">No assets found</h3>
                  <p className="text-muted max-w-sm mx-auto text-lg leading-relaxed">Your creative odyssey starts here. Mint your first digital masterpiece on Arc Testnet.</p>
                </div>
                <Link href="/studio/create" className="inline-block">
                  <Button variant="outline" size="lg" className="rounded-2xl px-12 border-white/10 hover:bg-white/10 font-black uppercase tracking-widest text-xs">Begin Creation</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {myNFTs.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
