import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export async function GET(
  request: Request,
  { params }: { params: { coinId: string } }
) {
  const coinId = params.coinId;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';

  let url = `${API_BASE_URL}/coins/${coinId}`;
  const queryParams = new URLSearchParams();

  if (locale === 'ko') {
    queryParams.append('localization', 'true');
  } else {
    queryParams.append('localization', 'false');
  }
  // Add other necessary params for detail page that might have been default
  queryParams.append('tickers', 'false');
  queryParams.append('market_data', 'true');
  queryParams.append('community_data', 'true');
  queryParams.append('developer_data', 'true');
  queryParams.append('sparkline', 'false');

  const queryString = queryParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  try {
    const res = await fetch(url);
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
