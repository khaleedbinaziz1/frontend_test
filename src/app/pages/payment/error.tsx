import { useSearchParams } from 'next/navigation';

export default function PaymentError() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'Payment failed or cancelled.';
  return (
    <div style={{textAlign: 'center', marginTop: '100px'}}>
      <h1 style={{color: 'red'}}>❌ Payment Error</h1>
      <p>{message}</p>
      <a href="/">Return to Home</a>
    </div>
  );
} 