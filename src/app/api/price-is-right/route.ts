import { NextRequest, NextResponse } from 'next/server';
import { getShowPrices, setShowPrices } from '@/lib/priceIsRightStore';

export async function GET() {
  return NextResponse.json({ showPrices: getShowPrices() });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { showPrices } = body as { showPrices: boolean };

    if (typeof showPrices !== 'boolean') {
      return NextResponse.json({ error: 'Invalid value' }, { status: 400 });
    }

    const result = setShowPrices(showPrices);
    return NextResponse.json({ showPrices: result });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
