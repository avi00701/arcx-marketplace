export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner: string;
  bio: string;
  totalVolume: string;
  verified: boolean;
  followers: number;
}

export const sampleCreators: Creator[] = [
  {
    id: "1",
    name: "Digital Alchemist",
    handle: "alchemist",
    avatar: "https://picsum.photos/seed/c1/200/200",
    banner: "https://picsum.photos/seed/b1/800/200",
    bio: "Transmuting code into digital gold.",
    totalVolume: "1,245 ETH",
    verified: true,
    followers: 12500,
  },
  {
    id: "2",
    name: "Neon Prophet",
    handle: "neonprophet",
    avatar: "https://picsum.photos/seed/c2/200/200",
    banner: "https://picsum.photos/seed/b2/800/200",
    bio: "Visualizing the future of the metaverse.",
    totalVolume: "892 ETH",
    verified: true,
    followers: 8900,
  },
  {
    id: "3",
    name: "Abstract Queen",
    handle: "abstractq",
    avatar: "https://picsum.photos/seed/c3/200/200",
    banner: "https://picsum.photos/seed/b3/800/200",
    bio: "Exploring the intersections of math and art.",
    totalVolume: "3,102 ETH",
    verified: true,
    followers: 45200,
  },
  {
    id: "4",
    name: "Cyber Knight",
    handle: "cyberknight",
    avatar: "https://picsum.photos/seed/c4/200/200",
    banner: "https://picsum.photos/seed/b4/800/200",
    bio: "Guarding the decentralized creative frontier.",
    totalVolume: "2,567 ETH",
    verified: false,
    followers: 5600,
  },
];
