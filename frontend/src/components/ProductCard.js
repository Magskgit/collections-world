import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const CATEGORY_ICONS = {
  'baby-dresses': '👶', fancy: '💍', gifts: '🎁',
  bags: '👜', toys: '🧸', stationery: '✏️', 'sweet-escape': '🍦',
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const imgSrc = product.image_url?.startsWith('http')
    ? product.image_url
    : product.image_url
    ? `${API_BASE}${product.image_url}`
    : null;

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart! 🛒`, { duration: 2000 });
  };

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.id}`)}>
      {product.is_featured && (
        <span style={{ position:'absolute', top:12, left:12, background:'#A855F7', color:'#fff', padding:'3px 10px', borderRadius:20, fontSize:'0.7rem', fontWeight:700, zIndex:1 }}>
          ⭐ Featured
        </span>
      )}

      <div className="product-card__image">
        {imgSrc ? (
          <img src={imgSrc} alt={product.name} style={{width:'100%',height:'200px',objectFit:'cover'}} onError={e => e.target.style.display='none'} />
        ) : (
          <span style={{fontSize:'4rem'}}>{CATEGORY_ICONS[product.category?.slug] || '📦'}</span>
        )}
      </div>

      <div className="product-card__body">
        <div className="product-card__category">{product.category?.name || ''}</div>
        <div className="product-card__name">{product.name}</div>
        <div className="product-card__price">
          <span className="product-card__price-current">₹{product.price}</span>
          {product.original_price && (
            <span className="product-card__price-original">₹{product.original_price}</span>
          )}
          {discount && <span className="product-card__discount">{discount}% OFF</span>}
        </div>
        <button
          className="btn btn-primary"
          style={{width:'100%', justifyContent:'center', padding:'10px'}}
          onClick={handleAdd}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : '+ Add to Cart'}
        </button>
      </div>
    </div>
  );
}
