"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";

import { CHAIN_ID, ARC_TESTNET_CONFIG, CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import { Contract, ethers } from "ethers";

interface WalletContextType {
  account: string | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  isConnected: boolean;
  isConnecting: boolean;
  isCorrectNetwork: boolean;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  connectWallet: (walletId?: string, silent?: boolean) => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<void>;
  getContract: () => Contract | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const checkNetwork = useCallback(async (p: BrowserProvider) => {
    const network = await p.getNetwork();
    const correct = Number(network.chainId) === CHAIN_ID;
    setIsCorrectNetwork(correct);
    return correct;
  }, []);

  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ARC_TESTNET_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [ARC_TESTNET_CONFIG],
          });
        } catch (addError) {
          console.error("Failed to add network:", addError);
        }
      }
    }
  }, []);

  const connectWallet = useCallback(async (walletId?: string, silent = false) => {
    if (typeof window === "undefined") return;

    let targetProvider = window.ethereum;

    console.log("Connect attempt:", { walletId, hasMetamask: !!window.ethereum?.isMetaMask, hasOkx: !!(window as any).okxwallet });

    // Handle specific providers
    if (walletId === "okx" && (window as any).okxwallet) {
      targetProvider = (window as any).okxwallet;
    } else if (walletId === "metamask" && window.ethereum?.isMetaMask) {
      targetProvider = window.ethereum;
    }

    if (!targetProvider) {
      if (!silent) alert(`Please install the ${walletId || "Web3"} wallet extension to connect.`);
      return;
    }

    setIsConnecting(true);
    try {
      const browserProvider = new BrowserProvider(targetProvider);
      
      // Try eth_accounts (silent) or eth_requestAccounts (manual)
      const accounts = (silent 
        ? await targetProvider.request({ method: "eth_accounts" })
        : await targetProvider.request({ method: "eth_requestAccounts" })) as string[];

      if (accounts && Array.isArray(accounts) && accounts.length > 0) {
        const walletSigner = await browserProvider.getSigner();
        setProvider(browserProvider);
        setSigner(walletSigner);
        setAccount(accounts[0]);
        await checkNetwork(browserProvider);
        localStorage.setItem("arcx_should_reconnect", "true");
        setIsModalOpen(false); // Close modal on success
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      if (!silent) alert("Connection failed. Please check your wallet extension and try again.");
    } finally {
      setIsConnecting(false);
    }
  }, [checkNetwork]);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setIsCorrectNetwork(false);
    localStorage.removeItem("arcx_should_reconnect");
  }, []);

  // Auto-reconnect on mount
  useEffect(() => {
    const shouldReconnect = localStorage.getItem("arcx_should_reconnect");
    if (shouldReconnect === "true") {
      connectWallet(undefined, true);
    }
  }, [connectWallet]);

  const getContract = useCallback(() => {
    if (!signer) return null;
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }, [signer]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (accounts: any) => {
      if (Array.isArray(accounts) && accounts.length === 0) {
        disconnectWallet();
      } else if (Array.isArray(accounts)) {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [disconnectWallet]);

  return (
    <WalletContext.Provider
      value={{
        account,
        provider,
        signer,
        isConnected: !!account,
        isConnecting,
        isCorrectNetwork,
        isModalOpen,
        setIsModalOpen,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        getContract,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
