'use client';
import { useEffect } from 'react';

export default function BkashSandboxWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://scripts.sandbox.bka.sh/versions/1.2.0-beta/checkout/bKash-checkout-sandbox.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      if (window.bKash) {
        // @ts-ignore
        window.bKash.init({
          paymentMode: 'checkout',
          paymentRequest: {
            amount: '100.50',
            intent: 'sale',
            currency: 'BDT',
            merchantInvoiceNumber: 'INV' + Date.now()
          },
          createRequest: function (request: any) {
            fetch('/api/bkash/createRequest', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(request)
            })
              .then(res => res.json())
              .then(data => {
                if (data && data.paymentID) {
                  // @ts-ignore
                  window.bKash.create().onSuccess(data);
                } else {
                  // @ts-ignore
                  window.bKash.create().onError();
                }
              })
              .catch(() => {
                // @ts-ignore
                window.bKash.create().onError();
              });
          },
          executeRequestOnAuthorization: function (_: any) {
            // @ts-ignore
            const paymentID = window.bKash?.paymentID;
            fetch('/api/bkash/executeRequest', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentID })
            })
              .then(res => res.json())
              .then(data => {
                if (data && data.paymentID) {
                  alert('Payment Success!');
                } else {
                  // @ts-ignore
                  window.bKash.execute().onError();
                }
              })
              .catch(() => {
                // @ts-ignore
                window.bKash.execute().onError();
              });
          }
        });
        document.getElementById('bKash_button')?.click();
      }
    };
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <button id="bKash_button" style={{ display: 'none' }}>Pay With bKash</button>
    </div>
  );
} 