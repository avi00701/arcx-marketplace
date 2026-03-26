"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useWallet } from "./WalletContext";

export type UserRole = "OWNER" | "ADMIN" | "WL" | "USER";

interface NFTStatus {
  featured: boolean;
  hidden: boolean;
}

interface AdminContextType {
  role: UserRole;
  adminWallets: string[];
  wlWallets: string[];
  ownerWallet: string | null;
  nftStatuses: Record<string, NFTStatus>;
  verifiedCreators: string[];
  isAdmin: boolean;
  isWL: boolean;
  isOwner: boolean;
  addAdmin: (address: string) => void;
  removeAdmin: (address: string) => void;
  addWL: (address: string) => void;
  removeWL: (address: string) => void;
  togglePin: (tokenId: string) => void;
  toggleHide: (tokenId: string) => void;
  getNFTStatus: (tokenId: string) => NFTStatus;
  toggleCreatorVerification: (address: string) => void;
  isCreatorVerified: (address: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Initial Owner - for demonstration, we'll set it to the first wallet that connects if none exists
// In production, this would be a hardcoded address or fetched from the contract
const INITIAL_OWNER = "0x900887c1c35fdcf17e80c35ccc0d53695577b183";

export function AdminProvider({ children }: { children: ReactNode }) {
  const { account } = useWallet();
  const [ownerWallet, setOwnerWallet] = useState<string | null>(null);
  const [adminWallets, setAdminWallets] = useState<string[]>([]);
  const [wlWallets, setWlWallets] = useState<string[]>([]);
  const [nftStatuses, setNftStatuses] = useState<Record<string, NFTStatus>>({});
  const [verifiedCreators, setVerifiedCreators] = useState<string[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedOwner = localStorage.getItem("arcx_owner_wallet");
    const savedAdmins = localStorage.getItem("arcx_admin_wallets");
    const savedWLs = localStorage.getItem("arcx_wl_wallets");
    const savedNFTs = localStorage.getItem("arcx_nft_statuses");
    const savedCreators = localStorage.getItem("arcx_verified_creators");

    // Migration: If the saved owner is the old placeholder, update it
    if (savedOwner === "0x9008...b183" || !savedOwner) {
        setOwnerWallet(INITIAL_OWNER);
        localStorage.setItem("arcx_owner_wallet", INITIAL_OWNER);
    } else {
        setOwnerWallet(savedOwner);
    }
    
    if (savedAdmins) setAdminWallets(JSON.parse(savedAdmins));
    if (savedWLs) setWlWallets(JSON.parse(savedWLs));
    if (savedNFTs) setNftStatuses(JSON.parse(savedNFTs));
    if (savedCreators) setVerifiedCreators(JSON.parse(savedCreators));
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (adminWallets.length > 0) localStorage.setItem("arcx_admin_wallets", JSON.stringify(adminWallets));
  }, [adminWallets]);

  useEffect(() => {
    if (wlWallets.length > 0) localStorage.setItem("arcx_wl_wallets", JSON.stringify(wlWallets));
  }, [wlWallets]);

  useEffect(() => {
    localStorage.setItem("arcx_nft_statuses", JSON.stringify(nftStatuses));
  }, [nftStatuses]);

  useEffect(() => {
    localStorage.setItem("arcx_verified_creators", JSON.stringify(verifiedCreators));
  }, [verifiedCreators]);

  const currentAccount = account?.toLowerCase();

  const isOwnerStatus = currentAccount === ownerWallet?.toLowerCase();
  const isAdminStatus = adminWallets.some(w => w.toLowerCase() === currentAccount);
  const isWLStatus = wlWallets.some(w => w.toLowerCase() === currentAccount);

  let role: UserRole = "USER";
  if (isOwnerStatus) role = "OWNER";
  else if (isAdminStatus) role = "ADMIN";
  else if (isWLStatus) role = "WL";

  const addAdmin = (address: string) => {
    if (!isOwnerStatus) return;
    if (!adminWallets.some(w => w.toLowerCase() === address.toLowerCase())) {
      setAdminWallets(prev => [...prev, address]);
    }
  };

  const removeAdmin = (address: string) => {
    if (!isOwnerStatus) return;
    setAdminWallets(prev => prev.filter(a => a.toLowerCase() !== address.toLowerCase()));
  };

  const addWL = (address: string) => {
    if (!isOwnerStatus) return;
    if (!wlWallets.some(w => w.toLowerCase() === address.toLowerCase())) {
      setWlWallets(prev => [...prev, address]);
    }
  };

  const removeWL = (address: string) => {
    if (!isOwnerStatus) return;
    setWlWallets(prev => prev.filter(w => w.toLowerCase() !== address.toLowerCase()));
  };

  const togglePin = (tokenId: string) => {
    if (role === "USER") return;
    setNftStatuses(prev => ({
      ...prev,
      [tokenId]: {
        ...prev[tokenId],
        featured: !prev[tokenId]?.featured,
        hidden: prev[tokenId]?.hidden || false
      }
    }));
  };

  const toggleHide = (tokenId: string) => {
    if (role === "USER") return;
    setNftStatuses(prev => ({
      ...prev,
      [tokenId]: {
        ...prev[tokenId],
        featured: prev[tokenId]?.featured || false,
        hidden: !prev[tokenId]?.hidden
      }
    }));
  };

  const getNFTStatus = (tokenId: string): NFTStatus => {
    return nftStatuses[tokenId] || { featured: false, hidden: false };
  };

  const toggleCreatorVerification = (address: string) => {
    if (role === "USER") return;
    setVerifiedCreators(prev => 
      prev.includes(address.toLowerCase()) 
        ? prev.filter(a => a !== address.toLowerCase()) 
        : [...prev, address.toLowerCase()]
    );
  };

  const isCreatorVerified = (address: string) => {
    // In a real app, some might be verified from sample data (mock)
    // Here we check both our local list and common sense mock logic
    return verifiedCreators.includes(address.toLowerCase());
  };

  return (
    <AdminContext.Provider
      value={{
        role,
        adminWallets,
        wlWallets,
        ownerWallet,
        nftStatuses,
        verifiedCreators,
        isAdmin: isAdminStatus || isOwnerStatus,
        isWL: isWLStatus || isAdminStatus || isOwnerStatus,
        isOwner: isOwnerStatus,
        addAdmin,
        removeAdmin,
        addWL,
        removeWL,
        togglePin,
        toggleHide,
        getNFTStatus,
        toggleCreatorVerification,
        isCreatorVerified,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
