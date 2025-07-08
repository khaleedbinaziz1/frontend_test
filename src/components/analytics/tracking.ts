let sessionId: string | null = null;

function getSessionId() {
  if (typeof window === 'undefined') return '';
  if (sessionId) return sessionId;
  sessionId = localStorage.getItem('swish_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now();
    localStorage.setItem('swish_session_id', sessionId);
  }
  return sessionId;
}

export async function trackEvent({ event, productId, orderId, details }: {
  event: string;
  productId?: string;
  orderId?: string;
  details?: any;
}) {
  const userId = getSessionId();
  const payload = {
    event,
    userId,
    productId,
    orderId,
    details,
    timestamp: Date.now(),
  };
  try {
    await fetch('http://localhost:500/track-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    // Optionally log error
  }
} 