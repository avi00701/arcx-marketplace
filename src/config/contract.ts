export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.testnet.arc.network";
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 5042002;

export const ARC_TESTNET_CONFIG = {
  chainId: `0x${CHAIN_ID.toString(16)}`,
  chainName: "Arc Testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  rpcUrls: [RPC_URL],
  blockExplorerUrls: ["https://testnet.arcscan.app"],
};

export const CONTRACT_ABI = [
  "function mintNFT(string memory tokenURI, uint256 price, uint256 _launchTime) public payable returns (uint256)",
  "function buyNFT(uint256 tokenId) public payable",
  "function mintedCount() public view returns (uint256)",
  "function maxSupply() public view returns (uint256)",
  "function idToNFT(uint256) public view returns (uint256 tokenId, address seller, address owner, uint256 price, bool sold, uint256 launchTime)",
  "event NFTMinted(uint256 indexed tokenId, address indexed seller, address indexed owner, uint256 price, string tokenURI, uint256 launchTime)",
  "event NFTSold(uint256 indexed tokenId, address seller, address buyer, uint256 price)",
  "function updateMaxSupply(uint256 _newMaxSupply) public"
];
