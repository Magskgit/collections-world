import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <h2>Collections World 🌍</h2>
          <p style={{fontSize:'0.9rem', lineHeight:1.7}}>
            Your one-stop shop for baby dresses, toys, gifts, bags, fancy accessories,
            stationery & Sweet Escape treats — now bigger & better!
          </p>
          <div style={{marginTop:16, display:'flex', gap:12}}>
            <span style={{fontSize:'1.5rem'}}>👶</span>
            <span style={{fontSize:'1.5rem'}}>🎁</span>
            <span style={{fontSize:'1.5rem'}}>🧸</span>
            <span style={{fontSize:'1.5rem'}}>🍦</span>
          </div>
        </div>

        <div>
          <div className="footer__heading">Quick Links</div>
          <ul className="footer__links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products?category=baby-dresses">Baby Dresses</Link></li>
            <li><Link to="/products?category=toys">Toys</Link></li>
            <li><Link to="/products?category=sweet-escape">Sweet Escape</Link></li>
          </ul>
        </div>

        <div>
          <div className="footer__heading">Contact Us</div>
          <div style={{fontSize:'0.9rem', lineHeight:2}}>
            <div>📍 No.9A, Chokkanathar Street</div>
            <div>Karthikeyan Nagar, Maduravoyal</div>
            <div>Chennai – 600095</div>
            <div>📞 044 – 4548 0165</div>
            <div>📱 9994090118</div>
          </div>
        </div>

        <div>
          <div className="footer__heading">Offers</div>
          <div style={{fontSize:'0.9rem', lineHeight:2}}>
            <div>🎉 Up to 50% OFF</div>
            <div>⭐ Extra 5% for Existing Customers</div>
            <div>🚚 Cash on Delivery</div>
            <div>🔄 Easy Returns</div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <span style={{fontSize:'0.85rem'}}>© 2024 Collections World. All rights reserved.</span>
        <Link to="/admin" style={{color:'rgba(255,255,255,0.4)', fontSize:'0.8rem'}}>Admin</Link>
      </div>
    </footer>
  );
}
