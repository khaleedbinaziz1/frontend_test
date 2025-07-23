import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BKASH_USERNAME = 'sandboxTokenizedUser02';
const BKASH_PASSWORD = 'sandboxTokenizedUser02@12345';
const BKASH_APP_KEY = '4f60cjiki2rnf34kfddallieqq';
const BKASH_APP_SECRET = '2is7hdktrekvbrljjh44ll3d9ltjo4pasmjvs5vl5q3fug4b';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentID = searchParams.get('paymentID');
  const status = searchParams.get('status');

  console.log('[bKash Callback] Query params:', { paymentID, status });

  if (!paymentID || !status) {
    console.error('[bKash Callback] Missing params');
    return NextResponse.redirect('http://localhost:3000/payment/error?message=missing_params');
  }

  if (status === 'cancel' || status === 'failure') {
    console.log('[bKash Callback] Payment cancelled or failed:', status);
    return NextResponse.redirect(`http://localhost:3000/payment/error?message=${status}`);
  }

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
    console.log('[bKash Callback] Token response:', tokenRes.data);
    const ID_TOKEN = tokenRes.data.id_token;

    // 2. Execute Payment
    const executeRes = await axios.post(
      'https://tokenized.pay.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/execute',
      { paymentID },
      {
        headers: {
          Authorization: `Bearer ${ID_TOKEN}`,
          'X-APP-Key': BKASH_APP_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('[bKash Callback] Execute response:', executeRes.data);
    if (executeRes.data && executeRes.data.statusCode === '0000') {
      return NextResponse.redirect('http://localhost:3000/payment/success');
    } else {
      return NextResponse.redirect(`http://localhost:3000/payment/error?message=${executeRes.data.statusMessage || 'execute_failed'}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[bKash Callback] Axios error:', error.response?.data || error.message);
      return NextResponse.redirect(`http://localhost:3000/payment/error?message=${error.response?.data?.message || error.message}`);
    } else {
      console.error('[bKash Callback] Unknown error:', error);
      return NextResponse.redirect('http://localhost:3000/payment/error?message=unknown_error');
    }
  }
} 