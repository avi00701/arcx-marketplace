/**
 * Data Fetcher for PolyAlpha
 * Responsibilities:
 * - Fetch markets from Polymarket Gamma API
 * - Filter resolved markets
 * - Extract metadata for processing
 */

const GAMMA_API_URL = 'https://gamma-api.polymarket.com';

export interface MarketMetadata {
  id: string;
  question: string;
  category: string;
  resolutionTime: string;
  tokens: Array<{ id: string; outcome: string }>;
}

/**
 * Fetches resolved markets from Polymarket
 * @param limit Number of markets to fetch (default: 100)
 */
export async function fetchResolvedMarkets(limit: number = 100): Promise<MarketMetadata[]> {
  try {
    const url = `${GAMMA_API_URL}/markets?closed=true&limit=${limit}&active=false`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch markets: ${response.statusText}`);
    }

    const markets = await response.json();

    // Map and filter for the required fields
    return markets.map((m: any) => ({
      id: m.id,
      question: m.question,
      category: m.category || m.groupItemTitle || 'Other', // Fallback for category
      resolutionTime: m.closed_time || m.end_date_iso,
      tokens: m.clobTokenIds ? JSON.parse(m.clobTokenIds).map((id: string, index: number) => ({
        id,
        outcome: index === 0 ? 'YES' : 'NO' // Simple mapping for binary markets
      })) : []
    }));
  } catch (error) {
    console.error('Error in fetchResolvedMarkets:', error);
    return [];
  }
}

/**
 * Categorizes a market based on its metadata if the category is missing
 */
export function categorizeMarket(market: any): string {
  const title = (market.question || '').toLowerCase();
  
  if (title.includes('crypto') || title.includes('bitcoin') || title.includes('ethereum')) return 'Crypto';
  if (title.includes('election') || title.includes('president') || title.includes('senate')) return 'Politics';
  if (title.includes('nfl') || title.includes('nba') || title.includes('soccer') || title.includes('game')) return 'Sports';
  
  return 'Other';
}
