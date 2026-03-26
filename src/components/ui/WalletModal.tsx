"use client";

import { useWallet } from "@/context/WalletContext";
import { useEffect, useState } from "react";

export default function WalletModal() {
  const { isModalOpen, setIsModalOpen, connectWallet, isConnecting } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isModalOpen) return null;

  const wallets = [
    {
      name: "MetaMask",
      icon: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Logo.svg",
      description: "Connect to your MetaMask Wallet",
      id: "metamask"
    },
    {
      name: "OKX Wallet",
      icon: "https://static.okx.com/cdn/assets/imgs/221/9E9A5A5C7F5B4B2A.png",
      description: "Connect to your OKX Wallet",
      id: "okx"
    },
    {
      name: "Browser Wallet",
      icon: "https://raw.githubusercontent.com/ethereum/ethereum-org-website/master/src/assets/wallets/brave.png",
      description: "In-browser EIP-1193 provider",
      id: "browser"
    }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsModalOpen(false)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-surface/90 backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-2xl overflow-hidden glass-cosmic animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Connect <span className="text-accent italic">Wallet</span></h2>
              <p className="text-xs text-muted font-medium">Select your preferred gateway to the ArcX network.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded-xl bg-white/5 text-muted hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Wallet List */}
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => connectWallet()}
                disabled={isConnecting}
                className="w-full flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-accent/5 transition-all group disabled:opacity-50 text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden p-2 group-hover:scale-110 transition-transform">
                  <img src={wallet.icon} alt={wallet.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white group-hover:text-accent transition-colors">{wallet.name}</h3>
                  <p className="text-[10px] text-muted uppercase tracking-widest font-black">{wallet.description}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-all">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                   </svg>
                </div>
              </button>
            ))}
          </div>

          {/* Footer Footer */}
          <div className="flex flex-col items-center gap-4 pt-4 border-t border-white/5">
             <p className="text-[10px] text-muted font-medium text-center">
               By connecting, you agree to the ArcX Protocol Terms of Service and Privacy Policy.
             </p>
             <button className="text-[10px] text-accent font-black uppercase tracking-widest hover:underline">
               What is a digital wallet?
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
