import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

const LOGO_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/static/images/logo.jpeg`;

export default function Navbar() {
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch]     = useState('');
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  const isActive = (path) => location.pathname === path ? 'navbar__link active' : 'navbar__link';

  return (
    <>
      <div className="rainbow-bar" />
      <nav className="navbar">
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo">
            <img src={LOGO_URL} alt="Collections World" onError={e => { e.target.style.display='none'; }} />
          </Link>

          <div className="navbar__nav">
            <Link to="/"         className={isActive('/')}>Home</Link>
            <Link to="/products" className={isActive('/products')}>All Products</Link>
            <Link to="/track"    className={isActive('/track')}>Track Order</Link>

            <form className="navbar__search" onSubmit={handleSearch}>
              <span>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products…"
              />
            </form>

            <button className="navbar__cart-btn" onClick={() => setCartOpen(true)}>
              🛒 Cart
              {totalItems > 0 && <span className="navbar__cart-count">{totalItems}</span>}
            </button>
          </div>
        </div>
      </nav>

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </>
  );
}
