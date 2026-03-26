export interface NFT {
  id: string;
  name: string;
  image: string;
  price: string;
  currency: string;
  collection: string;
  creator: string;
  creatorAvatar: string;
  owner?: string;
  isListed?: boolean;
  category?: string;
  likes: number;
  lastSale?: string;
  mintCount: number;
  createdAt: number;
  // Collection stats for Hero
  floorPrice?: string;
  itemsCount?: string;
  totalVolume?: string;
  percentListed?: string;
  verified?: boolean;
  featured?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  image: string;
  floor: string;
  volume: string;
  change: string;
  items: number;
  verified: boolean;
}

export const sampleNFTs: NFT[] = [
  {
    id: "1",
    name: "Demon Mountain #001",
    image: "https://picsum.photos/seed/nft1/600/600",
    price: "2.45",
    currency: "ETH",
    collection: "DEMON MOUNTAIN",
    creator: "Demon Rider",
    creatorAvatar: "https://picsum.photos/seed/avatar1/100/100",
    owner: "0x900887C1C35FDCF17E80C35CCC0D53695577B183",
    isListed: true,
    likes: 245,
    lastSale: "2.10",
    mintCount: 156,
    createdAt: Date.now() - 86400000 * 2,
    floorPrice: "0.85",
    itemsCount: "10,000",
    totalVolume: "1,245.50",
    percentListed: "12.5%",
    verified: true,
    featured: true,
  },
  {
    id: "2",
    name: "Neon Genesis #042",
    image: "https://picsum.photos/seed/nft2/600/600",
    price: "1.80",
    currency: "ETH",
    collection: "Neon Genesis",
    creator: "0xCreator42",
    creatorAvatar: "https://picsum.photos/seed/avatar2/100/100",
    owner: "0x900887C1C35FDCF17E80C35CCC0D53695577B183",
    isListed: false,
    likes: 189,
    lastSale: "1.55",
    mintCount: 89,
    createdAt: Date.now() - 86400000 * 5,
    verified: true,
  },
  {
    id: "3",
    name: "Inferno Ridge #117",
    image: "https://picsum.photos/seed/nft3/600/600",
    price: "5.20",
    currency: "ETH",
    collection: "INFERNO RIDGE",
    creator: "Demon Rider",
    creatorAvatar: "https://picsum.photos/seed/avatar3/100/100",
    owner: "0x900887C1C35FDCF17E80C35CCC0D53695577B183",
    isListed: true,
    likes: 421,
    lastSale: "4.80",
    mintCount: 234,
    createdAt: Date.now() - 86400000 * 1,
    verified: true,
    featured: true,
  },
  {
    id: "4",
    name: "Digital Flora #009",
    image: "https://picsum.photos/seed/nft4/600/600",
    price: "0.95",
    currency: "ETH",
    collection: "Digital Flora",
    creator: "0xBotanist",
    creatorAvatar: "https://picsum.photos/seed/avatar4/100/100",
    owner: "0x900887C1C35FDCF17E80C35CCC0D53695577B183",
    isListed: true,
    likes: 133,
    mintCount: 45,
    createdAt: Date.now() - 3600000 * 5,
    verified: true,
  },
  {
    id: "5",
    name: "Cyber Punk #256",
    image: "https://picsum.photos/seed/nft5/600/600",
    price: "3.10",
    currency: "ETH",
    collection: "CYBER PUNKS",
    creator: "Demon Rider",
    creatorAvatar: "https://picsum.photos/seed/avatar5/100/100",
    likes: 367,
    lastSale: "2.85",
    mintCount: 312,
    createdAt: Date.now() - 3600000 * 12,
    verified: true,
    featured: true,
  },
  {
    id: "6",
    name: "Ethereal Waves #033",
    image: "https://picsum.photos/seed/nft6/600/600",
    price: "1.25",
    currency: "ETH",
    collection: "Ethereal Waves",
    creator: "0xWaveArtist",
    creatorAvatar: "https://picsum.photos/seed/avatar6/100/100",
    likes: 198,
    lastSale: "1.00",
    mintCount: 78,
    createdAt: Date.now() - 3600000 * 24,
    verified: true,
  },
  {
    id: "7",
    name: "Galactic Core #088",
    image: "https://picsum.photos/seed/nft7/600/600",
    price: "8.50",
    currency: "ETH",
    collection: "GALACTIC CORES",
    creator: "Demon Rider",
    creatorAvatar: "https://picsum.photos/seed/avatar7/100/100",
    likes: 512,
    lastSale: "7.90",
    mintCount: 12,
    createdAt: Date.now() - 3600000 * 1,
    verified: true,
    featured: true,
  },
  {
    id: "8",
    name: "Pixel Dreams #444",
    image: "https://picsum.photos/seed/nft8/600/600",
    price: "0.65",
    currency: "ETH",
    collection: "PIXEL DREAMS",
    creator: "Demon Rider",
    creatorAvatar: "https://picsum.photos/seed/avatar8/100/100",
    likes: 87,
    mintCount: 560,
    createdAt: Date.now() - 3600000 * 48,
    featured: true,
    verified: true,
  },
];

export const trendingCollections: Collection[] = [
  {
    id: "1",
    name: "Cosmic Dreamers",
    image: "https://picsum.photos/seed/col1/400/400",
    floor: "1.20",
    volume: "1,245",
    change: "+12.5%",
    items: 10000,
    verified: true,
  },
  {
    id: "2",
    name: "Neon Genesis",
    image: "https://picsum.photos/seed/col2/400/400",
    floor: "0.85",
    volume: "892",
    change: "+8.3%",
    items: 5000,
    verified: true,
  },
  {
    id: "3",
    name: "Abstract Realms",
    image: "https://picsum.photos/seed/col3/400/400",
    floor: "3.40",
    volume: "3,102",
    change: "-2.1%",
    items: 3333,
    verified: true,
  },
  {
    id: "4",
    name: "Cyber Punks",
    image: "https://picsum.photos/seed/col4/400/400",
    floor: "2.10",
    volume: "2,567",
    change: "+21.7%",
    items: 8888,
    verified: false,
  },
  {
    id: "5",
    name: "Galactic Cores",
    image: "https://picsum.photos/seed/col5/400/400",
    floor: "5.60",
    volume: "4,890",
    change: "+5.4%",
    items: 2222,
    verified: true,
  },
];

export const stats = {
  totalVolume: "125.4K ETH",
  totalNFTs: "2.1M",
  totalUsers: "890K",
  totalCollections: "45K",
};
