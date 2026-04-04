import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  const categorySlug = searchParams.get('category') || '';
  const searchQuery  = searchParams.get('search')   || '';
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [priceRange,  setPriceRange]  = useState({ min: '', max: '' });

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { limit: 100 };
    if (categorySlug) params.category_slug = categorySlug;
    if (searchQuery)  params.search = searchQuery;
    if (priceRange.min) params.min_price = priceRange.min;
    if (priceRange.max) params.max_price = priceRange.max;
    getProducts(params)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [categorySlug, searchQuery, priceRange]);

  useEffect(() => { getCategories().then(setCategories); }, []);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams(searchParams);
    if (localSearch.trim()) p.set('search', localSearch.trim());
    else p.delete('search');
    setSearchParams(p);
  };

  const setCategory = (slug) => {
    const p = new URLSearchParams(searchParams);
    if (slug) p.set('category', slug);
    else p.delete('category');
    setSearchParams(p);
  };

  const activeCat = categories.find(c => c.slug === categorySlug);

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <h1 className="section-title">
            {activeCat ? `${activeCat.icon} ${activeCat.name}` : searchQuery ? `Search: "${searchQuery}"` : '🛍️ All Products'}
          </h1>
          <p className="section-subtitle">{products.length} products found</p>
        </div>

        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          {/* ── Sidebar filters ─────────────────────────── */}
          <aside style={{ width: 240, flexShrink: 0 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800, marginBottom: 16 }}>🗂️ Categories</h3>
              <div
                className={`category-chip ${!categorySlug ? 'active' : ''}`}
                style={{ flexDirection: 'row', minWidth: 'unset', marginBottom: 8 }}
                onClick={() => setCategory('')}
              >
                <span>🌐</span><span style={{ fontSize: '0.85rem' }}>All Products</span>
              </div>
              {categories.map(cat => (
                <div
                  key={cat.id}
                  className={`category-chip ${categorySlug === cat.slug ? 'active' : ''}`}
                  style={{ flexDirection: 'row', minWidth: 'unset', marginBottom: 8 }}
                  onClick={() => setCategory(cat.slug)}
                >
                  <span>{cat.icon}</span>
                  <span style={{ fontSize: '0.85rem' }}>{cat.name}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
              <h3 style={{ fontWeight: 800, marginBottom: 16 }}>💰 Price Range (₹)</h3>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input
                  type="number" placeholder="Min"
                  value={priceRange.min}
                  onChange={e => setPriceRange(p => ({ ...p, min: e.target.value }))}
                  style={{ width: '100%', padding: '8px 12px', border: '2px solid #e2e8f0', borderRadius: 8, fontFamily: 'Nunito' }}
                />
                <input
                  type="number" placeholder="Max"
                  value={priceRange.max}
                  onChange={e => setPriceRange(p => ({ ...p, max: e.target.value }))}
                  style={{ width: '100%', padding: '8px 12px', border: '2px solid #e2e8f0', borderRadius: 8, fontFamily: 'Nunito' }}
                />
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '9px' }} onClick={fetchProducts}>
                Apply
              </button>
            </div>
          </aside>

          {/* ── Product grid ───────────────────────────── */}
          <div style={{ flex: 1 }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <input
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                placeholder="Search products…"
                style={{ flex: 1, padding: '12px 20px', border: '2px solid #e2e8f0', borderRadius: 50, fontFamily: 'Nunito', fontSize: '0.95rem', outline: 'none' }}
              />
              <button type="submit" className="btn btn-primary">Search 🔍</button>
            </form>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px', color: '#718096', fontSize: '1.1rem' }}>
                ⏳ Loading products…
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px', color: '#718096' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>😔</div>
                <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>No products found</p>
                <p style={{ marginTop: 8 }}>Try a different search or category</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
