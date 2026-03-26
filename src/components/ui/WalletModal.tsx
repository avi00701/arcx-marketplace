"use client";

import { useWallet } from "@/context/WalletContext";
import { useEffect, useState } from "react";

export default function WalletModal() {
  const { isModalOpen, setIsModalOpen, connectWallet, isConnecting } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [detected, setDetected] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setMounted(true);
    // Detect installed wallets
    if (typeof window !== "undefined") {
      setDetected({
        metamask: !!(window.ethereum?.isMetaMask),
        okx: !!(window as any).okxwallet,
        brave: !!(window.ethereum as any)?.isBraveWallet,
      });
    }
  }, [isModalOpen]);

  if (!mounted || !isModalOpen) return null;

  const wallets = [
    {
      name: "MetaMask",
      icon: "/images/wallets/metamask.svg",
      id: "metamask"
    },
    {
      name: "OKX Wallet",
      icon: "/images/wallets/okx.svg",
      id: "okx"
    },
    {
      name: "Base Wallet",
      icon: "/images/wallets/base.svg",
      id: "base"
    },
    {
      name: "WalletConnect",
      icon: "/images/wallets/walletconnect.svg",
      id: "walletconnect"
    }
  ];

  const handleMoreOptions = () => {
    alert("Advanced wallet discovery coming soon!");
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={() => setIsModalOpen(false)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[400px] bg-[#121212] border border-white/10 rounded-[28px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 pt-12 space-y-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent shadow-xl shadow-accent/10 border border-accent/20">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
               </svg>
             </div>
             <h2 className="text-2xl font-bold text-white tracking-tight">Connect with <span className="text-accent">ArcX</span></h2>
             
             <button 
               onClick={() => setIsModalOpen(false)}
               className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-muted transition-colors"
             >
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
          </div>

          {/* Wallet List */}
          <div className="space-y-1 rounded-2xl overflow-hidden">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => connectWallet(wallet.id)}
                disabled={isConnecting}
                className="w-full flex items-center justify-between p-4 px-5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 flex items-center justify-center p-1 rounded-lg bg-black/20 group-hover:scale-110 transition-transform">
                    <img src={wallet.icon} alt={wallet.name} className="w-full h-full object-contain" />
                  </div>
                  <h3 className="font-bold text-white text-md tracking-tight">{wallet.name}</h3>
                </div>
                
                {detected[wallet.id] && (
                  <span className="px-2.5 py-1 rounded-md bg-white/5 text-[9px] font-bold text-muted/60 uppercase tracking-widest border border-white/5">
                    Installed
                  </span>
                )}
              </button>
            ))}
            <button 
              onClick={handleMoreOptions}
              className="w-full p-4 px-6 text-left hover:text-accent transition-all group"
            >
                <span className="text-[13px] font-bold text-muted group-hover:text-accent tracking-tight">More Wallet Options</span>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center pb-2">
             <button className="text-xs font-bold text-accent/60 tracking-tight hover:text-accent hover:underline decoration-accent/30 underline-offset-4">
               What is a digital wallet?
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
