"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import { ethers } from "ethers";
import Image from "next/image";
import Button from "@/components/ui/Button";

export default function LaunchNFT() {
  const { isConnected, getContract, isCorrectNetwork, switchNetwork } = useWallet();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    price: "",
    supplyType: "unlimited", // unlimited | limited
    maxSupply: "",
    launchType: "now", // now | schedule
    launchDate: "",
    launchTime: "",
  });

  const [previewUrl, setPreviewUrl] = useState("");

  const isValidUrl = (url: string) => {
    if (!url) return false;
    if (url.startsWith("/")) return true;
    if (url.startsWith("data:")) return true;
    return url.startsWith("http") && url.length > 10;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "image") {
      setPreviewUrl(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;
    if (!isCorrectNetwork) {
      await switchNetwork();
      return;
    }

    setLoading(true);
    try {
      const contract = getContract();
      if (!contract) throw new Error("Contract not initialized");

      // Validate inputs
      const priceWei = ethers.parseEther(formData.price || "0");
      if (priceWei <= BigInt(0)) throw new Error("Price must be greater than 0");

      let finalMaxSupply = 0;
      if (formData.supplyType === "limited") {
        finalMaxSupply = parseInt(formData.maxSupply);
        if (isNaN(finalMaxSupply) || finalMaxSupply <= 0) {
          throw new Error("Invalid max supply");
        }
      }

      let finalLaunchTime = Math.floor(Date.now() / 1000); // Default to now
      if (formData.launchType === "schedule") {
        const scheduledDate = new Date(`${formData.launchDate}T${formData.launchTime}`);
        finalLaunchTime = Math.floor(scheduledDate.getTime() / 1000);
        if (finalLaunchTime <= Math.floor(Date.now() / 1000)) {
          throw new Error("Launch time must be in the future");
        }
      }

      // Handle Supply Update if needed (Owner only)
      // Note: The contract's maxSupply is global. If the user wants "Limited", 
      // they might be wanting to set the global supply.
      if (formData.supplyType === "limited") {
        try {
           const tx = await contract.updateMaxSupply(finalMaxSupply);
           await tx.wait();
        } catch (e) {
           console.warn("Could not update global max supply (might not be owner):", e);
        }
      }

      // Metadata JSON
      const metadata = JSON.stringify({
        name: formData.title,
        description: formData.description,
        image: formData.image,
      });

      // Call mintNFT(string memory tokenURI, uint256 price, uint256 _launchTime)
      const mintTx = await contract.mintNFT(metadata, priceWei, finalLaunchTime);
      await mintTx.wait();

      alert("NFT Launched Successfully! 🚀");
      router.push("/studio");
    } catch (error: any) {
      console.error("Launch failed:", error);
      alert(`Launch failed: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-bold mb-4">Connect Wallet to Launch</h1>
        <p className="text-muted mb-8">You need to connect your wallet to mint and list NFTs in your studio.</p>
        <Button onClick={() => router.push("/studio")}>Back to Studio</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-20 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        
        {/* Left: Preview */}
        <div className="lg:w-2/5 space-y-10">
          <div className="space-y-4">
             <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Real-time Visualization</h2>
             <p className="text-3xl font-black text-white tracking-tighter uppercase">Asset Preview</p>
          </div>

          <div className="glass-cosmic rounded-[48px] overflow-hidden border border-white/10 shadow-3xl group">
             <div className="relative aspect-square bg-surface">
                {isValidUrl(previewUrl) ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted font-black uppercase tracking-widest text-xs">
                    awaiting transmission...
                  </div>
                )}
                <div className="absolute top-6 right-6 bg-background/80 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-xl">
                  {formData.supplyType === "unlimited" ? "∞ Open Edition" : `${formData.maxSupply || "0"} Units`}
                </div>
             </div>
             <div className="p-10 space-y-8">
                <div className="space-y-2">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tight truncate leading-none">{formData.title || "Unknown Entity"}</h3>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">ArcX Origins</p>
                   </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Listing Price</p>
                      <div className="flex items-baseline gap-1">
                         <p className="text-2xl font-black text-accent tracking-tighter">{formData.price || "0.00"}</p>
                         <p className="text-[10px] font-black text-accent uppercase">USDC</p>
                      </div>
                   </div>
                   <div className="text-right space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Drop Vector</p>
                      <p className="text-sm font-black text-white uppercase tracking-widest">{formData.launchType === "now" ? "Instant" : "Scheduled"}</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:w-3/5 space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">Assemble <span className="text-accent">Asset</span></h1>
            <p className="text-muted text-lg font-medium max-w-lg">Configure your digital masterpiece. All tokens are minted directly on the Arc Testnet for maximum security.</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-cosmic p-10 md:p-14 rounded-[64px] border border-white/10 space-y-12 shadow-3xl">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Transmission URL</label>
                  <input 
                    name="image"
                    type="text" 
                    placeholder="https://ipfs.io/..."
                    className="w-full px-6 py-4 rounded-2xl bg-surface/50 border border-white/5 focus:border-accent/40 outline-none transition-all font-medium text-sm text-white placeholder:text-muted/20"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                  />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Designation Title</label>
                  <input 
                    name="title"
                    type="text" 
                    placeholder="e.g. Obsidian Shard #01"
                    className="w-full px-6 py-4 rounded-2xl bg-surface/50 border border-white/5 focus:border-accent/40 outline-none transition-all font-black uppercase tracking-widest text-sm text-white placeholder:text-muted/20"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
               </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Lore & Metadata</label>
              <textarea 
                name="description"
                placeholder="Describe the essence of this creation..."
                rows={3}
                className="w-full px-6 py-4 rounded-2xl bg-surface/50 border border-white/5 focus:border-accent/40 outline-none transition-all resize-none font-medium text-sm text-white placeholder:text-muted/20"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Price & Supply */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Price (USDC)</label>
                  <input 
                    name="price"
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-6 py-4 rounded-2xl bg-surface/50 border border-white/5 focus:border-accent/40 outline-none transition-all font-black text-accent tracking-widest text-sm"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Supply Matrix</label>
                  <select 
                    name="supplyType"
                    className="w-full px-6 py-4 rounded-2xl bg-surface/50 border border-white/5 focus:border-accent/40 outline-none transition-all appearance-none font-black uppercase tracking-widest text-[10px] text-white cursor-pointer hover:bg-white/5"
                    value={formData.supplyType}
                    onChange={handleInputChange}
                  >
                    <option value="unlimited">Deep Unlimited</option>
                    <option value="limited">Limited Edition</option>
                  </select>
               </div>
               {formData.supplyType === "limited" && (
                 <div className="space-y-4 animate-in fade-in slide-in-from-left-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Max Capacity</label>
                    <input 
                      name="maxSupply"
                      type="number" 
                      placeholder="100"
                      className="w-full px-6 py-4 rounded-2xl bg-surface/50 border border-white/5 focus:border-accent/40 outline-none transition-all font-black text-white tracking-widest text-sm"
                      value={formData.maxSupply}
                      onChange={handleInputChange}
                      required
                    />
                 </div>
               )}
            </div>

            {/* Scheduling */}
            <div className="space-y-10 pt-10 border-t border-white/5">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Deployment Window</h3>
                  <div className="flex bg-surface/50 p-1.5 rounded-2xl border border-white/5">
                     <button 
                        type="button"
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${formData.launchType === "now" ? "bg-accent text-black shadow-lg shadow-accent/20" : "text-muted hover:text-white"}`}
                        onClick={() => setFormData({...formData, launchType: "now"})}
                     >
                        Immediate
                     </button>
                     <button 
                        type="button"
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${formData.launchType === "schedule" ? "bg-accent text-black shadow-lg shadow-accent/20" : "text-muted hover:text-white"}`}
                        onClick={() => setFormData({...formData, launchType: "schedule"})}
                     >
                        Scheduled
                     </button>
                  </div>
               </div>

               {formData.launchType === "schedule" && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted text-center block">Drop Date</label>
                       <input 
                         name="launchDate"
                         type="date" 
                         className="w-full px-6 py-4 rounded-2xl bg-surface/50 border border-white/5 focus:border-accent/40 outline-none text-white font-black uppercase tracking-widest text-xs"
                         value={formData.launchDate}
                         onChange={handleInputChange}
                         required
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted text-center block">Drop Time (UTC)</label>
                       <input 
                         name="launchTime"
                         type="time" 
                         className="w-full px-6 py-4 rounded-2xl bg-surface/50 border border-white/5 focus:border-accent/40 outline-none text-white font-black uppercase tracking-widest text-xs"
                         value={formData.launchTime}
                         onChange={handleInputChange}
                         required
                       />
                    </div>
                 </div>
               )}
            </div>

            <Button 
                type="submit" 
                size="lg" 
                className="w-full py-6 rounded-[28px] text-xs font-black uppercase tracking-[0.4em] shadow-3xl shadow-accent/20 transition-all hover:scale-[1.02] active:scale-95"
                disabled={loading}
            >
              {loading ? "Syncing with Blockchain..." : "Initialize Transmission"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
