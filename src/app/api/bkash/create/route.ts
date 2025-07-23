import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BKASH_USERNAME = 'sandboxTokenizedUser02';
const BKASH_PASSWORD = 'sandboxTokenizedUser02@12345';
const BKASH_APP_KEY = '4f60cjiki2rnf34kfddallieqq';
const BKASH_APP_SECRET = '2is7hdktrekvbrljjh44ll3d9ltjo4pasmjvs5vl5q3fug4b';

export async function POST(req: NextRequest) {
  const { amount, orderId } = await req.json();
  console.log('[bKash Create] Request body:', { amount, orderId });

  try {
    // 1. Get Token
    const tokenRes = await axios.post(
      'https://tokenized.pay.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant',
      {
        app_key: BKASH_APP_KEY,
        app_secret: BKASH_APP_SECRET,
      },
      {
        headers: {
          username: BKASH_USERNAME,
          password: BKASH_PASSWORD,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('[bKash Create] Token response:', tokenRes.data);

    const ID_TOKEN = tokenRes.data.id_token;

    // 2. Create Payment
    const paymentRes = await axios.post(
      'https://tokenized.pay.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/create',
      {
        mode: '0011',
        payerReference: 'user001',
        callbackURL: 'http://localhost:3000/api/bkash/callback',
        amount: amount.toString(),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: 'INV' + orderId,
      },
      {
        headers: {
          Authorization: `Bearer ${ID_TOKEN}`,
          'X-APP-Key': BKASH_APP_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('[bKash Create] Payment response:', paymentRes.data);

    return NextResponse.json({ bkashURL: paymentRes.data.bkashURL });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('[bKash Create] Axios error:', err.response?.data || err.message);
      return NextResponse.json({ error: err.response?.data || err.message }, { status: 500 });
    } else {
      console.error('[bKash Create] Unknown error:', err);
      return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
    }
  }
} 