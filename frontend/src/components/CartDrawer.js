import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CATEGORY_ICONS = {
  'baby-dresses': '👶', fancy: '💍', gifts: '🎁',
  bags: '👜', toys: '🧸', stationery: '✏️', 'sweet-escape': '🍦',
};

export default function CartDrawer({ onClose }) {
  const { items, removeFromCart, updateQty, totalPrice } = useCart();
  const navigate = useNavigate();

  const goCheckout = () => { onClose(); navigate('/checkout'); };

  return (
    <div className="cart-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cart-drawer">
        <div className="cart-drawer__header">
          <span className="cart-drawer__title">🛒 Your Cart ({items.length})</span>
          <button className="cart-drawer__close" onClick={onClose}>✕</button>
        </div>

        <div className="cart-drawer__items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty__icon">🛍️</div>
              <p>Your cart is empty</p>
              <p style={{fontSize:'0.85rem',marginTop:8}}>Add some products to get started!</p>
            </div>
          ) : (
            items.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item__emoji">
                  {CATEGORY_ICONS[item.category?.slug] || '📦'}
                </div>
                <div className="cart-item__info">
                  <div className="cart-item__name">{item.name}</div>
                  <div className="cart-item__price">₹{(item.price * item.quantity).toFixed(2)}</div>
                  <div className="cart-item__qty">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="cart-item__remove" onClick={() => removeFromCart(item.id)}>🗑️</button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-total">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary" style={{width:'100%', justifyContent:'center'}} onClick={goCheckout}>
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
