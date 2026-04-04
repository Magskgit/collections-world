import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { trackOrder } from '../services/api';

// ── Order Success ─────────────────────────────────────────
export function OrderSuccessPage() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  return (
    <div className="order-success">
      <div className="order-success__icon">🎉</div>
      <h1 style={{fontSize:'2rem',fontWeight:900,color:'#1A1A2E',marginBottom:8}}>Order Placed Successfully!</h1>
      <p style={{color:'#718096',fontSize:'1.05rem',marginBottom:16}}>
        Thank you for shopping with Collections World!<br/>Your order is confirmed.
      </p>
      <div className="order-success__number">{orderNumber}</div>
      <p style={{color:'#718096',marginBottom:32}}>Save this order number to track your order.</p>
      <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
        <button className="btn btn-primary" onClick={() => navigate(`/track?order=${orderNumber}`)}>
          📦 Track Order
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/products')}>
          🛍️ Continue Shopping
        </button>
      </div>
      <div style={{marginTop:48,background:'#F7F8FC',borderRadius:16,padding:24,maxWidth:500,margin:'48px auto 0'}}>
        <h3 style={{fontWeight:800,marginBottom:12}}>📍 Visit Our Store</h3>
        <p style={{color:'#4A5568',lineHeight:1.8}}>
          No.9A, Chokkanathar Street<br/>
          Karthikeyan Nagar, Maduravoyal<br/>
          Chennai – 600095<br/>
          📞 044 – 4548 0165 | 📱 9994090118
        </p>
      </div>
    </div>
  );
}

// ── Order Tracking ────────────────────────────────────────
const STATUS_STEPS = ['pending','confirmed','shipped','delivered'];
const STATUS_LABELS = { pending:'Order Placed',confirmed:'Confirmed',shipped:'Shipped',delivered:'Delivered',cancelled:'Cancelled' };
const STATUS_ICONS  = { pending:'⏳',confirmed:'✅',shipped:'🚚',delivered:'🎉',cancelled:'❌' };

export function TrackOrderPage() {
  const [searchParams] = [new URLSearchParams(window.location.search)];
  const defaultOrder = searchParams.get('order') || '';
  const [orderNum, setOrderNum] = useState(defaultOrder);
  const [order, setOrder]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleTrack = async (num) => {
    const n = (num || orderNum).trim();
    if (!n) return;
    setLoading(true); setError(''); setOrder(null);
    try {
      setOrder(await trackOrder(n));
    } catch {
      setError('Order not found. Please check your order number and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (defaultOrder) handleTrack(defaultOrder); }, []); // eslint-disable-line

  const stepIdx = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div style={{maxWidth:700,margin:'0 auto',padding:'48px 24px'}}>
      <h1 className="section-title">📦 Track Your Order</h1>
      <p className="section-subtitle">Enter your order number to see its status</p>

      <div style={{display:'flex',gap:12,marginBottom:40}}>
        <input
          value={orderNum}
          onChange={e => setOrderNum(e.target.value)}
          placeholder="e.g. CW-A1B2C3D4"
          onKeyDown={e => e.key==='Enter' && handleTrack()}
          style={{flex:1,padding:'14px 20px',border:'2px solid #e2e8f0',borderRadius:50,fontFamily:'Nunito',fontSize:'0.95rem',outline:'none'}}
        />
        <button className="btn btn-primary" onClick={() => handleTrack()} disabled={loading}>
          {loading ? '⏳' : 'Track →'}
        </button>
      </div>

      {error && (
        <div style={{background:'#FEE2E2',color:'#991B1B',borderRadius:12,padding:16,marginBottom:24,fontWeight:600}}>{error}</div>
      )}

      {order && (
        <div style={{background:'#fff',borderRadius:16,padding:28,boxShadow:'0 4px 24px rgba(0,0,0,0.07)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24,flexWrap:'wrap',gap:12}}>
            <div>
              <div style={{fontSize:'0.85rem',color:'#718096',marginBottom:4}}>Order Number</div>
              <div style={{fontWeight:900,fontSize:'1.2rem',color:'#FF6B35'}}>{order.order_number}</div>
            </div>
            <span className={`status-badge status-${order.status}`} style={{fontSize:'0.9rem'}}>
              {STATUS_ICONS[order.status]} {STATUS_LABELS[order.status] || order.status}
            </span>
          </div>

          {/* Progress bar */}
          {order.status !== 'cancelled' && (
            <div style={{marginBottom:28}}>
              <div style={{display:'flex',justifyContent:'space-between',position:'relative',marginBottom:8}}>
                {STATUS_STEPS.map((s, i) => (
                  <div key={s} style={{display:'flex',flexDirection:'column',alignItems:'center',flex:1,position:'relative'}}>
                    <div style={{
                      width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
                      background: i <= stepIdx ? '#FF6B35' : '#e2e8f0',
                      color: i <= stepIdx ? '#fff' : '#718096',
                      fontWeight:700,fontSize:'1.1rem',position:'relative',zIndex:1
                    }}>
                      {STATUS_ICONS[s]}
                    </div>
                    <div style={{fontSize:'0.72rem',fontWeight:700,marginTop:6,textAlign:'center',color: i<=stepIdx?'#FF6B35':'#718096'}}>
                      {STATUS_LABELS[s]}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{height:4,background:'#e2e8f0',borderRadius:2,margin:'0 18px',position:'relative',top:-42,zIndex:0}}>
                <div style={{height:'100%',background:'#FF6B35',borderRadius:2,width:`${stepIdx>=0?(stepIdx/(STATUS_STEPS.length-1))*100:0}%`,transition:'width 0.5s'}} />
              </div>
            </div>
          )}

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
            {[
              ['👤 Customer',  order.customer_name],
              ['📞 Phone',     order.customer_phone],
              ['📅 Ordered',   new Date(order.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})],
              ['💳 Payment',   order.payment_method === 'cod' ? 'Cash on Delivery' : 'UPI'],
            ].map(([label,value]) => (
              <div key={label} style={{background:'#F7F8FC',borderRadius:10,padding:'12px 16px'}}>
                <div style={{fontSize:'0.78rem',color:'#718096',fontWeight:700,marginBottom:2}}>{label}</div>
                <div style={{fontWeight:700,fontSize:'0.9rem'}}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{background:'#F7F8FC',borderRadius:10,padding:16,marginBottom:20}}>
            <div style={{fontSize:'0.78rem',color:'#718096',fontWeight:700,marginBottom:4}}>📍 Delivery Address</div>
            <div style={{fontWeight:600,fontSize:'0.9rem'}}>{order.shipping_address}</div>
          </div>

          <h3 style={{fontWeight:800,marginBottom:12}}>🛍️ Items Ordered</h3>
          {order.items.map(item => (
            <div key={item.id} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #f5f5f5',fontSize:'0.9rem'}}>
              <span style={{fontWeight:600}}>{item.product?.name || `Product #${item.product_id}`} × {item.quantity}</span>
              <span style={{fontWeight:700,color:'#FF6B35'}}>₹{(item.unit_price*item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{display:'flex',justifyContent:'space-between',marginTop:12,fontWeight:900,fontSize:'1.05rem'}}>
            <span>Total Paid</span>
            <span style={{color:'#FF6B35'}}>₹{order.total_amount.toFixed(2)}</span>
          </div>
          {order.discount_amount > 0 && (
            <div style={{color:'#10B981',fontWeight:700,textAlign:'right',fontSize:'0.85rem',marginTop:4}}>
              You saved ₹{order.discount_amount.toFixed(2)} 🎉
            </div>
          )}
        </div>
      )}
    </div>
  );
}
