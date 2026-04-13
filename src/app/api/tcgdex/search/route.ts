
import { NextRequest, NextResponse } from 'next/server';

interface TCGDexCard {
  id: string;
  name: string;
  image: {
    small: string;
    normal: string;
  };
  set: {
    id: string;
    name: string;
  };
  number: string;
  rarity?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const setId = searchParams.get('setId');

    if (!query && !setId) {
      return NextResponse.json(
        { error: 'Query or setId parameter required' },
        { status: 400 }
      );
    }

    // Build TCGDex API URL
    let url = 'https://api.tcgdex.net/v2/en/cards';
    const params = new URLSearchParams();

    if (query) {
      params.append('name', query); // TCGDex uses direct field mapping
    }

    if (setId) {
      params.append('set', setId);
    }

    const tcgdexUrl = `${url}?${params.toString()}`;
    
    console.log('Fetching from TCGDex:', tcgdexUrl);

    const response = await fetch(tcgdexUrl, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`TCGDex API error: ${response.status}`);
    }

    const data = await response.json();

    // Fix 1: TCGDex returns a direct array for lists, not a { data: [] } object.
    const rawCards = Array.isArray(data) ? data : (data.data || []);

    // Transform TCGDex response to our format
    const cards = rawCards.map((card: any) => ({
      id: card.id,
      name: card.name,
      // Fix 2: TCGDex image fields are base URLs. We must append the file extension
      imageUrl: card.image ? `${card.image}/high.webp` : '',
      // Fix 3: List endpoints return "brief" cards without nested set objects. 
      // We parse the ID (e.g. "base1-1") to extract the set code and number.
      setCode: card.id.split('-')[0] || '',
      setName: card.id.split('-')[0] || '', 
      cardNumber: card.localId || card.id.split('-')[1] || '',
      rarity: '',
      tcgdexId: card.id,
    }));

    return NextResponse.json({
      success: true,
      cards,
      total: cards.length,
    });
  } catch (error) {
    console.error('TCGDex search error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to search TCGDex',
        success: false 
      },
      { status: 500 }
    );
  }
}
