import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import { OrderSuccessPage, TrackOrderPage } from './pages/OrderPages';
import AdminPage from './pages/AdminPage';
import './index.css';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '60vh' }}>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'Nunito', fontWeight: 600 },
            success: { iconTheme: { primary: '#FF6B35', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public routes with Navbar + Footer */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
          <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
          <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
          <Route path="/order-success/:orderNumber" element={<Layout><OrderSuccessPage /></Layout>} />
          <Route path="/track" element={<Layout><TrackOrderPage /></Layout>} />

          {/* Admin — full screen, no shared layout */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
