import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const exists = state.items.find(i => i.id === action.product.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.product, quantity: 1 }] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'UPDATE_QTY':
      if (action.qty <= 0) return { ...state, items: state.items.filter(i => i.id !== action.id) };
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, quantity: action.qty } : i
        ),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
};

const loadCart = () => {
  try { return JSON.parse(localStorage.getItem('cw_cart')) || { items: [] }; }
  catch { return { items: [] }; }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    localStorage.setItem('cw_cart', JSON.stringify(state));
  }, [state]);

  const addToCart     = (product) => dispatch({ type: 'ADD', product });
  const removeFromCart = (id)     => dispatch({ type: 'REMOVE', id });
  const updateQty     = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty });
  const clearCart     = ()        => dispatch({ type: 'CLEAR' });

  const totalItems  = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice  = state.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items: state.items, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
