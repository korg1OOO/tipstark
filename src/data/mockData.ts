import { Creator, Tip } from '../types';

export const mockCreators: Creator[] = [
  {
    id: '1',
    address: '0x1234...5678',
    name: 'Alice Builder',
    avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    bio: 'Full-stack developer building the future of DeFi on Starknet',
    category: 'Developer',
    totalTips: 2450,
    tipCount: 89,
    verified: true,
    social: {
      twitter: '@alice_builds',
      github: 'alice-builder',
      website: 'https://alice.dev'
    }
  },
  {
    id: '2',
    address: '0x2345...6789',
    name: 'Bob Designer',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    bio: 'UI/UX designer crafting beautiful experiences for Web3',
    category: 'Designer',
    totalTips: 1820,
    tipCount: 67,
    verified: true,
    social: {
      twitter: '@bob_designs',
      website: 'https://bobdesigns.io'
    }
  },
  {
    id: '3',
    address: '0x3456...7890',
    name: 'Carol Creator',
    avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    bio: 'Content creator and educator making Starknet accessible to everyone',
    category: 'Creator',
    totalTips: 3200,
    tipCount: 134,
    verified: true,
    social: {
      twitter: '@carol_creates',
      website: 'https://carolcreates.com'
    }
  },
  {
    id: '4',
    address: '0x4567...8901',
    name: 'David Researcher',
    avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    bio: 'Zero-knowledge researcher pushing the boundaries of privacy',
    category: 'Researcher',
    totalTips: 1680,
    tipCount: 45,
    verified: true,
    social: {
      twitter: '@david_research',
      github: 'david-zk'
    }
  },
  {
    id: '5',
    address: '0x5678...9012',
    name: 'Eve Advocate',
    avatar: 'https://images.pexels.com/photos/3768894/pexels-photo-3768894.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    bio: 'Community advocate building bridges between developers and users',
    category: 'Advocate',
    totalTips: 980,
    tipCount: 28,
    verified: false,
    social: {
      twitter: '@eve_advocates'
    }
  },
  {
    id: '6',
    address: '0x6789...0123',
    name: 'Frank Protocol',
    avatar: 'https://images.pexels.com/photos/3760778/pexels-photo-3760778.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    bio: 'Protocol developer building infrastructure for the next generation',
    category: 'Developer',
    totalTips: 4100,
    tipCount: 156,
    verified: true,
    social: {
      github: 'frank-protocol',
      website: 'https://frankprotocol.xyz'
    }
  }
];

export const mockTips: Tip[] = [
  {
    id: '1',
    sender: '0x9876...5432',
    recipient: '0x1234...5678',
    amount: 50,
    timestamp: Date.now() - 3600000,
    message: 'Great work on the new DeFi protocol!',
    txHash: '0xabc123...def456'
  },
  {
    id: '2',
    sender: '0x8765...4321',
    recipient: '0x3456...7890',
    amount: 25,
    timestamp: Date.now() - 7200000,
    message: 'Love your educational content!',
    txHash: '0xdef456...ghi789'
  },
  {
    id: '3',
    sender: '0x7654...3210',
    recipient: '0x2345...6789',
    amount: 100,
    timestamp: Date.now() - 10800000,
    message: 'Amazing UI design!',
    txHash: '0xghi789...jkl012'
  }
];