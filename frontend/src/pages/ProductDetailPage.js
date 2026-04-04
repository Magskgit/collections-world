import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const CAT_ICONS = { 'baby-dresses':'👶', fancy:'💍', gifts:'🎁', bags:'👜', toys:'🧸', stationery:'✏️', 'sweet-escape':'🍦' };

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(id).then(setProduct).catch(() => navigate('/products')).finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div style={{textAlign:'center',padding:'120px',fontSize:'1.2rem',color:'#718096'}}>Loading…</div>;
  if (!product) return null;

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : null;
  const imgSrc = product.image_url?.startsWith('http') ? product.image_url
    : product.image_url ? `${API_BASE}${product.image_url}` : null;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    toast.success(`${qty}x ${product.name} added! 🛒`);
  };

  return (
    <div style={{maxWidth:1100,margin:'0 auto',padding:'48px 24px'}}>
      <button onClick={() => navigate(-1)} style={{background:'none',border:'none',color:'#718096',fontWeight:600,marginBottom:24,fontSize:'0.95rem',cursor:'pointer'}}>
        ← Back
      </button>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'start'}}>
        {/* Image */}
        <div style={{background:'#F7F8FC',borderRadius:20,display:'flex',alignItems:'center',justifyContent:'center',minHeight:380,overflow:'hidden'}}>
          {imgSrc
            ? <img src={imgSrc} alt={product.name} style={{width:'100%',height:380,objectFit:'cover'}} />
            : <span style={{fontSize:'8rem'}}>{CAT_ICONS[product.category?.slug] || '📦'}</span>
          }
        </div>

        {/* Info */}
        <div>
          <div style={{fontSize:'0.85rem',fontWeight:700,color:'#A855F7',marginBottom:8,textTransform:'uppercase'}}>
            {product.category?.icon} {product.category?.name}
          </div>
          <h1 style={{fontSize:'1.8rem',fontWeight:900,color:'#1A1A2E',marginBottom:16,lineHeight:1.2}}>{product.name}</h1>

          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:16}}>
            <span style={{fontSize:'2rem',fontWeight:900,color:'#FF6B35'}}>₹{product.price}</span>
            {product.original_price && <>
              <span style={{fontSize:'1.2rem',color:'#718096',textDecoration:'line-through'}}>₹{product.original_price}</span>
              <span style={{background:'#FFF0EB',color:'#FF6B35',padding:'4px 12px',borderRadius:20,fontWeight:700}}>{discount}% OFF</span>
            </>}
          </div>

          {product.description && (
            <p style={{color:'#4A5568',lineHeight:1.8,marginBottom:24}}>{product.description}</p>
          )}

          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <span style={{fontWeight:600,color:'#718096'}}>Availability:</span>
            <span style={{fontWeight:700,color: product.stock > 0 ? '#10B981' : '#EF4444'}}>
              {product.stock > 10 ? '✅ In Stock' : product.stock > 0 ? `⚠️ Only ${product.stock} left!` : '❌ Out of Stock'}
            </span>
          </div>

          {product.sku && <div style={{color:'#718096',fontSize:'0.85rem',marginBottom:24}}>SKU: {product.sku}</div>}

          {/* Quantity */}
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24}}>
            <span style={{fontWeight:600}}>Qty:</span>
            <div style={{display:'flex',alignItems:'center',gap:12,background:'#F7F8FC',borderRadius:50,padding:'4px 8px'}}>
              <button onClick={() => setQty(q => Math.max(1, q-1))} style={{background:'#fff',border:'none',width:32,height:32,borderRadius:'50%',fontWeight:700,fontSize:'1.1rem',boxShadow:'0 2px 8px rgba(0,0,0,0.1)',cursor:'pointer'}}>−</button>
              <span style={{fontWeight:700,minWidth:24,textAlign:'center'}}>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q+1))} style={{background:'#fff',border:'none',width:32,height:32,borderRadius:'50%',fontWeight:700,fontSize:'1.1rem',boxShadow:'0 2px 8px rgba(0,0,0,0.1)',cursor:'pointer'}}>+</button>
            </div>
          </div>

          <div style={{display:'flex',gap:12}}>
            <button className="btn btn-primary" style={{flex:1,justifyContent:'center'}} onClick={handleAdd} disabled={product.stock===0}>
              🛒 Add to Cart
            </button>
            <button className="btn btn-secondary" style={{flex:1,justifyContent:'center'}} onClick={() => { handleAdd(); navigate('/checkout'); }}>
              ⚡ Buy Now
            </button>
          </div>

          <div style={{marginTop:24,background:'#F7F8FC',borderRadius:12,padding:16}}>
            {['🚚 Cash on Delivery available','⭐ Extra 5% OFF for existing customers','📍 In-store pickup at Maduravoyal, Chennai'].map(t => (
              <div key={t} style={{fontSize:'0.88rem',color:'#4A5568',padding:'4px 0',fontWeight:600}}>{t}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
