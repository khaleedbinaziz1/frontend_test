"use client";
import { useEffect, useState } from 'react';

interface Event {
  event: string;
  userId: string;
  productId?: string;
  orderId?: string;
  details?: any;
  timestamp: string;
}

export default function AnalyticsOverview() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch('http://localhost:500/tracking-events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load analytics");
        setLoading(false);
      });
  }, []);

  // Funnel stats
  const addToCart = events.filter(e => e.event === 'add_to_cart').length;
  const beginCheckout = events.filter(e => e.event === 'begin_checkout').length;
  const purchase = events.filter(e => e.event === 'purchase').length;

  // Abandoned users: those who added to cart or began checkout but did not purchase
  const purchasedUsers = new Set(events.filter(e => e.event === 'purchase').map(e => e.userId));
  const abandoned = events.filter(e =>
    (e.event === 'add_to_cart' || e.event === 'begin_checkout') && !purchasedUsers.has(e.userId)
  );
  const uniqueAbandoned = Array.from(new Map(abandoned.map(e => [e.userId, e])).values());

  // Export CSV
  function exportCSV() {
    const rows = [
      ['User ID', 'Last Event', 'Product ID', 'Timestamp'],
      ...uniqueAbandoned.map(e => [e.userId, e.event, e.productId || '', e.timestamp])
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'abandoned_users.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg max-w-3xl mx-auto mt-10 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center">Analytics Overview</h2>
      {loading ? <div>Loading...</div> : error ? <div className="text-red-600">{error}</div> : (
        <>
          <div className="mb-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-3xl font-bold">{addToCart}</div>
              <div className="text-sm text-gray-600">Add to Cart</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-3xl font-bold">{beginCheckout}</div>
              <div className="text-sm text-gray-600">Begin Checkout</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-3xl font-bold">{purchase}</div>
              <div className="text-sm text-gray-600">Purchase</div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Abandoned Users</h3>
            <button onClick={exportCSV} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Export CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-1 border">User ID</th>
                  <th className="px-2 py-1 border">Last Event</th>
                  <th className="px-2 py-1 border">Product ID</th>
                  <th className="px-2 py-1 border">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {uniqueAbandoned.map(e => (
                  <tr key={e.userId}>
                    <td className="px-2 py-1 border font-mono">{e.userId}</td>
                    <td className="px-2 py-1 border">{e.event}</td>
                    <td className="px-2 py-1 border">{e.productId || '-'}</td>
                    <td className="px-2 py-1 border">{new Date(e.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
} 