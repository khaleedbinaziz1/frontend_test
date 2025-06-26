'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Lock, Truck, Shield, X, Phone, Mail, MapPin, User, Users, ShoppingCart, Package, AlertCircle, CheckCircle, Search, ShieldCheck } from 'lucide-react';

interface CartItem {
  _id?: string;
  cartId: string;
  name: string;
  price: number;
  salePrice: number;
  quantity: number;
  images: string[];
  color?: string;
  size?: string;
    brand?: string; // <-- Add this line
    sku?: string; // <-- Add this line
}

interface CourierData {
  [key: string]: [number, number]; // [total, fraud]
}

interface FraudCheckResult {
  courierData: CourierData;
  riskScore: number | string; // Can be number or "NA"
  recommendation: string;
  apiStatus: 'success' | 'failed' | 'timeout';
}

export default function EnhancedBengaliCheckout() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    area: '',
    note: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    // Get cart data from localStorage or use demo data
    const cartDetailsString = localStorage.getItem('cartDetails');
    if (cartDetailsString) {
      try {
        const cartDetails = JSON.parse(cartDetailsString);
        setCartItems(cartDetails.items || []);
        setTotalPrice(parseFloat(cartDetails.total) || 0);
      } catch (error) {
        console.error('Error parsing cart details:', error);
        // Set demo data if localStorage parsing fails
        setDemoData();
      }
    } else {
      // Set demo data if no localStorage data
      setDemoData();
    }
  }, []);

  const setDemoData = () => {
    const demoItems: CartItem[] = [
      {
        _id: '64f123abc456def789012345', // Sample MongoDB ObjectId
        cartId: 'demo-1',
        name: 'Wireless Bluetooth Headphones',
        price: 2500,
        salePrice: 1800,
        quantity: 1,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center'],
        color: 'Black',
        size: 'Medium',
      
  
       
      },
      {
        _id: '64f123abc456def789012346',
        cartId: 'demo-2', 
        name: 'Smart Phone Case',
        price: 800,
        salePrice: 600,
        quantity: 2,
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop&crop=center'],
        color: 'Blue',
        size: 'Large',
       
      }
    ];
    setCartItems(demoItems);
    setTotalPrice(3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const removeItem = (cartId: string) => {
    const updatedItems = cartItems.filter(item => item.cartId !== cartId);
    setCartItems(updatedItems);
    
    // Recalculate total
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
    setTotalPrice(newTotal);
    
    // Update localStorage
    localStorage.setItem('cartDetails', JSON.stringify({ 
      items: updatedItems, 
      total: newTotal.toFixed(0) 
    }));
  };

  // Background fraud check function with fallback handling
  const performBackgroundFraudCheck = async (mobile: string): Promise<FraudCheckResult> => {
    try {
      // Set a timeout for the API call (5 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `https://api.fraudguard.pro/api-fraud-check/fraud-check?number=${mobile}&api_key=ff3b5c2cafacd95a97c75f3f79950ac8`,
        { 
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        return {
          courierData: data.courierData || {},
          riskScore: data.riskScore || 0,
          recommendation: data.recommendation || '',
          apiStatus: 'success'
        };
      } else {
        // API returned an error status
        console.warn(`Fraud API returned status ${response.status}`);
        return {
          courierData: {},
          riskScore: 'NA',
          recommendation: 'API unavailable',
          apiStatus: 'failed'
        };
      }
    } catch (error) {
      console.error("Background fraud check error:", error);
      
      // Determine if it was a timeout or other error
      let apiStatus: 'timeout' | 'failed' = 'failed';
      if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'AbortError') {
        apiStatus = 'timeout';
      }

      return {
        courierData: {},
        riskScore: 'NA',
        recommendation: 'API unavailable',
        apiStatus
      };
    }
  };

  const handlePlaceOrder = async () => {
    // Basic validation
    if (!formData.name || !formData.mobile || !formData.address || !formData.area) {
      alert('সকল প্রয়োজনীয় তথ্য পূরণ করুন');
      return;
    }

    setOrderLoading(true);

    try {
      // Perform background fraud check with fallback
      const fraudCheckData = await performBackgroundFraudCheck(formData.mobile);
      
      // Store complete product information with all necessary details
      const completeItems = cartItems.map(item => ({
  productId: item._id || item.cartId,
  name: item.name,
  salePrice: item.salePrice,
  quantity: item.quantity,
  itemTotal: item.salePrice * item.quantity,
  color: item.color || null,
  size: item.size || null,
  primaryImage: item.images?.[0] || null
}));

      // Calculate comprehensive order totals
      const itemsSubtotal = completeItems.reduce((sum, item) => sum + item.itemTotal, 0);
      // Removed totalDiscount calculation as 'discount' does not exist on item
      const deliveryCharge = formData.area === 'dhaka-inside' ? 60 : 120;
      const finalTotal = itemsSubtotal + deliveryCharge;

     const orderData = {
  customerInfo: {
    name: formData.name.trim(),
    mobile: formData.mobile.trim(),
    address: formData.address.trim(),
    area: formData.area,
    areaName: formData.area === 'dhaka-inside' ? 'ঢাকার ভিতরে' : 'ঢাকার বাহিরে',
    note: formData.note ? formData.note.trim() : null
  },
  items: completeItems,
  totalAmount: itemsSubtotal,
  totalQuantity: completeItems.reduce((sum, item) => sum + item.quantity, 0),
  deliveryCharge: deliveryCharge,
  finalTotal: finalTotal,
  paymentMethod: paymentMethod,
  paymentMethodName: paymentMethod === 'cod' ? 'Cash On Delivery' : 'Bkash',
  paymentStatus: 'pending',
  fraudCheckData: {
    riskScore: fraudCheckData.riskScore,
    recommendation: fraudCheckData.recommendation,
    courierData: fraudCheckData.courierData,
    apiStatus: fraudCheckData.apiStatus,
    checkedAt: new Date().toISOString()
  },
  status: 'pending',
  statusHistory: [
    {
      status: 'pending',
      timestamp: new Date().toISOString(),
      note: 'Order placed successfully'
    }
  ],
  orderDate: new Date().toISOString(),
  metadata: {
    source: 'web_checkout',
    userAgent: navigator.userAgent,
    platform: 'web',
    version: '1.0'
  }
};


      console.log('Complete Order Data:', orderData); // For debugging

      const response = await fetch('https://swish-server.vercel.app/addorders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Order placement failed');
      }

      const result = await response.json();
      
      // Success message
      let successMessage = `অর্ডার সফলভাবে সম্পন্ন হয়েছে!\nঅর্ডার ID: ${result.orderId}`;
      
      // Optional: Add fraud check status for debugging
      if (fraudCheckData.apiStatus !== 'success') {
        console.log(`Fraud check API ${fraudCheckData.apiStatus} - Score: ${fraudCheckData.riskScore}`);
      }
      
      alert(successMessage);
      
      // Clear cart and form
      localStorage.removeItem('cartDetails');
      setCartItems([]);
      setTotalPrice(0);
      setFormData({
        name: '',
        mobile: '',
        address: '',
        area: '',
        note: '',
      });
      
    } catch (error) {
      console.error('Order placement error:', error);
      alert('অর্ডার প্লেস করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setOrderLoading(false);
    }
  };

  const subtotal = totalPrice;
  const deliveryCharge = formData.area === 'dhaka-inside' ? 60 : 120;
  const total = subtotal + deliveryCharge;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">চেকআউট</h1>
          <p className="text-gray-600">আপনার অর্ডার কনফার্ম করুন</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Billing Details */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-primary mb-6 border-b border-slate-200 pb-3 flex items-center gap-2">
              <User className="w-6 h-6" />
              বিলিং ডিটেইল
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-slate-700 font-medium mb-2">
                  আপনার নাম লিখুন <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                />
              </div>
              
              <div>
                <label className="block text-slate-700 font-medium mb-2">
                  আপনার মোবাইল নাম্বার লিখুন <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="০১XXXXXXXXX"
                />
              </div>
              
              <div>
                <label className="block text-slate-700 font-medium mb-2">
                  সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  rows={3}
                  placeholder="বাড়ির নাম্বার, রাস্তার নাম, এলাকা"
                />
              </div>
              
              <div>
                <label className="block text-slate-700 font-medium mb-2">
                  এলাকা সিলেক্ট করুন <span className="text-red-500">*</span>
                </label>
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                >
                  <option value="">এলাকা সিলেক্ট করুন</option>
                  <option value="dhaka-inside">ঢাকার ভিতরে (৬০ টাকা)</option>
                  <option value="dhaka-outside">ঢাকার বাহিরে (১২০ টাকা)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-slate-700 font-medium mb-2">
                  নোট (অপশনাল)
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  rows={2}
                  placeholder="অতিরিক্ত কোনো তথ্য থাকলে লিখুন"
                />
              </div>
            </div>
          </div>
          
          {/* Product Details & Order Summary */}
          <div className="space-y-6">
            {/* Product Details */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-primary mb-4 border-b border-slate-200 pb-3 flex items-center gap-2">
                <Package className="w-5 h-5" />
                প্রোডাক্ট ডিটেইল
              </h2>
              
              <div className="space-y-4">
                {cartItems.length > 0 ? (
                  cartItems.map(item => (
                    <div key={item.cartId} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex space-x-4">
                        <img 
                          src={item.images && item.images[0] ? item.images[0] : 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop&crop=center'} 
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 text-sm leading-tight mb-2">
                            {item.name}
                          </h3>
                          <div className="text-xs text-slate-600 mb-2 space-y-1">
                            <div>পরিমাণ: {item.quantity}</div>
                            {item.color && <div>রঙ: {item.color}</div>}
                            {item.size && <div>সাইজ: {item.size}</div>}
                            {item.brand && <div>ব্র্যান্ড: {item.brand}</div>}
                            {item.sku && <div>SKU: {item.sku}</div>}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <span className="text-primary font-bold">৳{(item.salePrice * item.quantity).toFixed(0)}</span>
                              {item.price > item.salePrice && (
                                <span className="text-gray-400 line-through ml-2">৳{(item.price * item.quantity).toFixed(0)}</span>
                              )}
                            </div>
                            <button 
                              onClick={() => removeItem(item.cartId)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Package size={48} className="mx-auto mb-4 text-slate-300" />
                    <p>কার্টে কোনো পণ্য নেই</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">সাব-টোটাল</span>
                  <span className="font-bold text-slate-800">৳{subtotal}</span>
                </div>
                {formData.area && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">ডেলিভারি চার্জ</span>
                    <span className="font-bold text-slate-800">৳{deliveryCharge}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg font-bold text-primary pt-2 border-t border-slate-200">
                  <span>মোট টাকা</span>
                  <span>৳{formData.area ? total : subtotal}</span>
                </div>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                পেমেন্ট মেথড
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary focus:ring-blue-500"
                  />
                  <Truck className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700 font-medium">Cash On Delivery</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="bkash"
                    checked={paymentMethod === 'bkash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary focus:ring-blue-500"
                  />
                  <Phone className="w-5 h-5 text-pink-600" />
                  <span className="text-slate-700 font-medium">Bkash</span>
                </label>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0 || orderLoading}
                className="w-full mt-6 py-4 bg-gradient-to-r from-primary to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {orderLoading ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    অর্ডার প্রসেস হচ্ছে...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    অর্ডার টি কনফার্ম করুন ৳{formData.area ? total : subtotal}
                  </>
                )}
              </button>
              
              <div className="mt-4 text-center text-sm text-slate-500">
                <Lock className="w-4 h-4 inline mr-1" />
                আপনার তথ্য সুরক্ষিত
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}