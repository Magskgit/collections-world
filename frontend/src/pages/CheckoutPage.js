import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import toast from 'react-hot-toast';

const CAT_ICONS = { 'baby-dresses':'👶', fancy:'💍', gifts:'🎁', bags:'👜', toys:'🧸', stationery:'✏️', 'sweet-escape':'🍦' };

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isExisting, setIsExisting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customer_name: '', customer_email: '', customer_phone: '',
    shipping_address: '', payment_method: 'cod', notes: '',
  });

  if (items.length === 0) {
    return (
      <div style={{textAlign:'center',padding:'100px 24px'}}>
        <div style={{fontSize:'4rem',marginBottom:16}}>🛒</div>
        <h2 style={{marginBottom:16}}>Your cart is empty</h2>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>Start Shopping</button>
      </div>
    );
  }

  const discount  = isExisting ? totalPrice * 0.05 : 0;
  const finalTotal = totalPrice - discount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_name || !form.customer_phone || !form.customer_email || !form.shipping_address) {
      toast.error('Please fill in all required fields'); return;
    }
    const phone = form.customer_phone.replace(/[\s\-+()]/g, '').replace(/^91(?=\d{10}$)/, '');
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit mobile number'); return;
    }
    setSubmitting(true);
    try {
      const order = await createOrder({
        ...form,
        is_existing_customer: isExisting,
        items: items.map(i => ({ product_id: i.id, quantity: i.quantity })),
      });
      clearCart();
      navigate(`/order-success/${order.order_number}`);
    } catch (err) {
      const detail = err.response?.data?.detail;
      toast.error(
        Array.isArray(detail) ? (detail[0]?.msg || '').replace(/^Value error, /, '') || 'Please check your details'
        : detail || 'Failed to place order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: e => setForm(f => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div className="checkout-page">
      <h1 className="section-title" style={{marginBottom:8}}>🛍️ Checkout</h1>
      <p className="section-subtitle">Almost there! Fill in your details below.</p>

      <div style={{display:'grid',gridTemplateColumns:'1fr 400px',gap:40,alignItems:'start'}}>
        {/* ── Form ─────────────────────────────────────── */}
        <form onSubmit={handleSubmit}>
          <div style={{background:'#fff',borderRadius:16,padding:28,boxShadow:'0 4px 24px rgba(0,0,0,0.07)',marginBottom:24}}>
            <h2 style={{fontWeight:800,marginBottom:20,fontSize:'1.15rem'}}>📋 Your Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input {...field('customer_name')} placeholder="Your full name" required />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input {...field('customer_phone')} type="tel" inputMode="numeric" placeholder="10-digit mobile number" required />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input {...field('customer_email')} type="email" placeholder="your@email.com" required />
            </div>
            <div className="form-group">
              <label>Delivery Address *</label>
              <textarea {...field('shipping_address')} rows={3} placeholder="House no, Street, Area, City, Pincode" required />
            </div>
            <div className="form-group">
              <label>Order Notes (optional)</label>
              <textarea {...field('notes')} rows={2} placeholder="Any special instructions?" />
            </div>
          </div>

          <div style={{background:'#fff',borderRadius:16,padding:28,boxShadow:'0 4px 24px rgba(0,0,0,0.07)',marginBottom:24}}>
            <h2 style={{fontWeight:800,marginBottom:20,fontSize:'1.15rem'}}>💳 Payment Method</h2>
            {[
              { value:'cod', label:'💵 Cash on Delivery', desc:'Pay when your order arrives' },
              { value:'upi', label:'📱 UPI / QR Code',   desc:'Pay via Google Pay, PhonePe, Paytm' },
            ].map(opt => (
              <label key={opt.value} style={{display:'flex',alignItems:'center',gap:12,padding:'14px 16px',border:`2px solid ${form.payment_method===opt.value?'#FF6B35':'#e2e8f0'}`,borderRadius:12,marginBottom:12,cursor:'pointer',transition:'border 0.2s'}}>
                <input type="radio" name="payment" value={opt.value} checked={form.payment_method===opt.value} onChange={() => setForm(f=>({...f,payment_method:opt.value}))} />
                <div>
                  <div style={{fontWeight:700}}>{opt.label}</div>
                  <div style={{fontSize:'0.8rem',color:'#718096'}}>{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>

          <div style={{background:'#FFF0EB',borderRadius:16,padding:20,marginBottom:24}}>
            <label style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer'}}>
              <input type="checkbox" checked={isExisting} onChange={e=>setIsExisting(e.target.checked)} style={{width:18,height:18,accentColor:'#FF6B35'}} />
              <div>
                <div style={{fontWeight:700}}>⭐ I am an existing customer</div>
                <div style={{fontSize:'0.85rem',color:'#718096'}}>Get an additional 5% discount on your order!</div>
              </div>
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'16px',fontSize:'1.05rem'}} disabled={submitting}>
            {submitting ? '⏳ Placing Order…' : '✅ Place Order'}
          </button>
        </form>

        {/* ── Order summary ─────────────────────────────── */}
        <div style={{background:'#fff',borderRadius:16,padding:28,boxShadow:'0 4px 24px rgba(0,0,0,0.07)',position:'sticky',top:90}}>
          <h2 style={{fontWeight:800,marginBottom:20,fontSize:'1.15rem'}}>🧾 Order Summary</h2>
          {items.map(item => (
            <div key={item.id} style={{display:'flex',alignItems:'center',gap:12,paddingBottom:12,marginBottom:12,borderBottom:'1px solid #f5f5f5'}}>
              <div style={{width:44,height:44,background:'#F7F8FC',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',flexShrink:0}}>
                {CAT_ICONS[item.category?.slug] || '📦'}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:'0.88rem',lineHeight:1.2}}>{item.name}</div>
                <div style={{color:'#718096',fontSize:'0.8rem'}}>x{item.quantity}</div>
              </div>
              <div style={{fontWeight:700,color:'#FF6B35'}}>₹{(item.price*item.quantity).toFixed(2)}</div>
            </div>
          ))}
          <div style={{borderTop:'2px solid #f5f5f5',paddingTop:16}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,color:'#718096'}}>
              <span>Subtotal</span><span>₹{totalPrice.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,color:'#10B981',fontWeight:700}}>
                <span>⭐ Loyalty Discount (5%)</span><span>−₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div style={{display:'flex',justifyContent:'space-between',fontWeight:900,fontSize:'1.15rem',color:'#FF6B35',marginTop:12}}>
              <span>Total</span><span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
