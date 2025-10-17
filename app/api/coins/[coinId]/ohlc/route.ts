import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export async function GET(
  request: NextRequest,
  { params }: { params: { coinId: string } }
) {
  const coinId = params.coinId;
  const { searchParams } = new URL(request.url);
  const days = searchParams.get('days') || '7';
  const currency = searchParams.get('currency') || 'usd';

  const url = `${API_BASE_URL}/coins/${coinId}/ohlc?vs_currency=${currency}&days=${days}`;

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
