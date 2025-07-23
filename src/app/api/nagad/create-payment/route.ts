import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { amount } = await req.json();
  // TODO: Replace this with real Nagad payment URL generation logic
  // For now, return a placeholder URL for testing
  const payment_url = `https://sandbox.mynagad.com:10060/check-out/FAKE_PAYMENT_ID?amount=${amount}`;
  return NextResponse.json({ payment_url });
} 