import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export async function GET(
  request: Request,
  { params }: any
) {
  const coinId = params.coinId;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';

  const url = new URL(`${API_BASE_URL}/coins/${coinId}`);

  if (locale === 'ko') {
    url.searchParams.append('localization', 'true');
  } else {
    url.searchParams.append('localization', 'false');
  }
  
  url.searchParams.append('tickers', 'false');
  url.searchParams.append('market_data', 'true');
  url.searchParams.append('community_data', 'true');
  url.searchParams.append('developer_data', 'true');
  url.searchParams.append('sparkline', 'false');

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Failed to fetch from CoinGecko: ${res.status} ${res.statusText} - ${errorBody}`);
    }
    const data = await res.json();
    
    // The API sends description as { en: '...', ko: '...' } inside the main object when localization=true
    // but only { en: '...' } when false. Let's normalize this.
    if (locale === 'ko' && data.description.ko) {
      data.description.en = data.description.ko;
    }

    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(error instanceof Error ? error.message : 'Internal Server Error', { status: 500 });
  }
}
