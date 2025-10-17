import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  const page = searchParams.get('page') || '1';
  const ids = searchParams.get('ids');
  const currency = 'usd';

  let url;
  if (ids) {
    url = `${API_BASE_URL}/coins/markets?vs_currency=${currency}&ids=${ids}&sparkline=false&locale=${locale}`;
  } else {
    url = `${API_BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=${page}&sparkline=false&locale=${locale}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch from CoinGecko: ${res.statusText}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(error instanceof Error ? error.message : 'Internal Server Error', { status: 500 });
  }
}
