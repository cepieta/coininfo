import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/list?include_platform=false&locale=${locale}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch from CoinGecko: ${res.statusText}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(error instanceof Error ? error.message : 'Internal Server Error', { status: 500 });
  }
}
