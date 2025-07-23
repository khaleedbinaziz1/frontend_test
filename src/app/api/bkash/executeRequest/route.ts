import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BKASH_USERNAME = 'sandboxTokenizedUser02';
const BKASH_PASSWORD = 'sandboxTokenizedUser02@12345';
const BKASH_APP_KEY = '4f60cjiki2rnf34kfddallieqq';
const BKASH_APP_SECRET = '2is7hdktrekvbrljjh44ll3d9ltjo4pasmjvs5vl5q3fug4b';

export async function POST(req: NextRequest) {
  const { paymentID } = await req.json();
  try {
    // Get token (classic endpoint)
    const tokenRes = await axios.post(
      'https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/token/grant',
      { app_key: BKASH_APP_KEY, app_secret: BKASH_APP_SECRET },
      { headers: { username: BKASH_USERNAME, password: BKASH_PASSWORD, 'Content-Type': 'application/json' } }
    );
    const token = tokenRes.data.id_token;

    // Execute payment (classic endpoint)
    const executeRes = await axios.post(
      `https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/execute/${paymentID}`,
      {},
      { headers: { 'x-app-key': BKASH_APP_KEY, authorization: token, 'Content-Type': 'application/json' } }
    );
    return NextResponse.json(executeRes.data);
  } catch (err: any) {
    return NextResponse.json({ error: err.response?.data || err.message }, { status: 500 });
  }
} 