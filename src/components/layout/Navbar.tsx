"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "../ui/ThemeToggle";
import { useAdmin } from "@/context/AdminContext";
import { useWallet } from "@/context/WalletContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isWL, role } = useAdmin();
  const { isConnected, isConnecting, setIsModalOpen, disconnectWallet, account } = useWallet();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const menuItems = [
    { name: "Explore", href: "/explore", icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )},
    { name: "Profile", href: "/profile", icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { name: "Favorites", href: "/favorites", icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )},
    { name: "Creator Studio", href: "/studio", icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )},
    { name: "Stats", href: "/stats", icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    ...(isWL ? [{ name: "Admin Panel", href: "/admin", icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 17.242a2 2 0 112.828 2.828m3.939-5.172a2 2 0 11-2.828-2.828M15 11l-3 3-3-3m0 0v-4" />
      </svg>
    )}] : []),
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled
          ? "bg-black/60 backdrop-blur-2xl border-b border-white/10 py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          
          {/* LEFT: Logo + Theme Toggle */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-white shadow-xl shadow-accent/20 group-hover:scale-110 transition-all duration-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                Arc<span className="text-accent underline decoration-4 underline-offset-4">X</span>
              </span>
            </Link>
            
            <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block" />
            
            <ThemeToggle />
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-4">
            {!isConnected ? (
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isConnecting}
                className="group relative px-8 py-3 rounded-2xl bg-accent text-black font-black uppercase tracking-widest text-xs hover:scale-105 transition-all duration-500 shadow-2xl shadow-accent/20 disabled:opacity-50"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-black/20 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-500 shadow-xl ${
                    isMenuOpen 
                      ? "bg-accent border-accent text-black scale-95 shadow-accent/20" 
                      : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 shadow-black/20"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full animate-pulse ${isMenuOpen ? "bg-black" : "bg-accent"}`} />
                  <span className="text-sm font-black tracking-widest uppercase">
                    {truncateAddress(account || "")}
                  </span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-500 ${isMenuOpen ? "rotate-180" : ""}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* DROPDOWN MENU */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-4 w-72 rounded-[32px] bg-black/80 backdrop-blur-3xl border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 origin-top-right z-50">
                    <div className="p-6 border-b border-white/5 bg-white/5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                           </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black uppercase text-accent tracking-widest">{role}</p>
                          <p className="text-sm font-bold text-white truncate">{truncateAddress(account || "")}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      {menuItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold text-muted hover:bg-white/5 hover:text-white transition-all group"
                        >
                          <span className="text-muted group-hover:text-accent transition-colors">
                            {item.icon}
                          </span>
                          {item.name}
                        </Link>
                      ))}
                    </div>

                    <div className="p-3 bg-white/[0.02]">
                      <button
                        onClick={() => {
                          disconnectWallet();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
