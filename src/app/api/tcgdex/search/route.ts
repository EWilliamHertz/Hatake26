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
      params.append('q', `name:${query}`);
    }

    if (setId) {
      params.append('q', `set.id:${setId}`);
    }

    params.append('pageSize', '50');

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

    // Transform TCGDex response to our format
    const cards = (data.data || []).map((card: TCGDexCard) => ({
      id: card.id,
      name: card.name,
      imageUrl: card.image?.normal || card.image?.small || '',
      setCode: card.set?.id || '',
      setName: card.set?.name || '',
      cardNumber: card.number || '',
      rarity: card.rarity || '',
      tcgdexId: card.id,
    }));

    return NextResponse.json({
      success: true,
      cards,
      total: data.data?.length || 0,
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
