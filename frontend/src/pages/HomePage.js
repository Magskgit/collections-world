import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featured,   setFeatured]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getCategories(), getProducts({ featured: true, limit: 8 })])
      .then(([cats, prods]) => { setCategories(cats); setFeatured(prods); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── Hero slider ──────────────────────────────────── */}
      <HeroSlider />

      {/* ── Announcement bar ─────────────────────────────── */}
      <div style={{background:'#FFF0EB', padding:'12px 24px', textAlign:'center', fontSize:'0.95rem', fontWeight:700, color:'#FF6B35'}}>
        🎁 Additional 5% OFF for Existing Customers &nbsp;|&nbsp; 🚚 Cash on Delivery Available &nbsp;|&nbsp; 📞 9994090118
      </div>

      {/* ── Categories ───────────────────────────────────── */}
      <section className="categories-strip">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Browse our wide range of products</p>
          <div className="categories-strip__grid">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="category-chip"
                onClick={() => navigate(`/products?category=${cat.slug}`)}
              >
                <span className="category-chip__icon">{cat.icon}</span>
                <span className="category-chip__name">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────── */}
      <section style={{padding:'40px 0 80px'}}>
        <div className="container">
          <h2 className="section-title">⭐ Featured Products</h2>
          <p className="section-subtitle">Hand-picked bestsellers just for you</p>
          {loading ? (
            <div style={{textAlign:'center', padding:'60px', color:'#718096'}}>Loading products…</div>
          ) : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <div style={{textAlign:'center', marginTop:40}}>
            <button className="btn btn-outline" onClick={() => navigate('/products')}>
              View All Products →
            </button>
          </div>
        </div>
      </section>

      {/* ── Sweet Escape banner ───────────────────────────── */}
      <section style={{background:'linear-gradient(135deg,#FFF0FB,#FFF5F0)', padding:'60px 24px', margin:'0 0 0 0'}}>
        <div className="container" style={{display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:32}}>
          <div>
            <div style={{fontSize:'3rem', marginBottom:12}}>🍦🥤🍿</div>
            <h2 style={{fontSize:'2rem', fontWeight:900, color:'#1A1A2E', marginBottom:8}}>Sweet Escape is Here!</h2>
            <p style={{color:'#718096', fontSize:'1.05rem', marginBottom:24, maxWidth:480}}>
              Sip, Smile, Repeat! Enjoy fresh ice creams, milkshakes, sugarcane juice,
              popcorn & cool soft drinks at our in-store Sweet Escape corner.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/products?category=sweet-escape')}>
              Explore Sweet Escape 🍦
            </button>
          </div>
          <div style={{display:'flex', gap:16, flexWrap:'wrap'}}>
            {['🍦 Soft Serve', '🥤 Milkshakes', '🎋 Sugarcane Juice', '🍿 Popcorn', '🥤 Cold Drinks'].map(item => (
              <div key={item} style={{background:'#fff', borderRadius:12, padding:'12px 20px', fontWeight:700, boxShadow:'0 4px 12px rgba(0,0,0,0.08)', fontSize:'0.9rem'}}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Us ───────────────────────────────────────── */}
      <section style={{padding:'60px 24px'}}>
        <div className="container">
          <h2 className="section-title" style={{textAlign:'center'}}>Why Choose Us?</h2>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:24, marginTop:32}}>
            {[
              {icon:'💰', title:'Up to 50% OFF',   text:'Huge discounts across all categories'},
              {icon:'⭐', title:'Extra 5% for Loyal Customers', text:'Additional discount for existing customers'},
              {icon:'🚚', title:'Cash on Delivery', text:'Pay when your order arrives at your door'},
              {icon:'📍', title:'Visit Our Store',  text:'No.9A, Chokkanathar Street, Maduravoyal, Chennai'},
            ].map(({ icon, title, text }) => (
              <div key={title} style={{background:'#fff', borderRadius:16, padding:'28px 24px', boxShadow:'0 4px 24px rgba(0,0,0,0.07)', textAlign:'center'}}>
                <div style={{fontSize:'2.5rem', marginBottom:12}}>{icon}</div>
                <h3 style={{fontWeight:800, marginBottom:8}}>{title}</h3>
                <p style={{color:'#718096', fontSize:'0.9rem'}}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
