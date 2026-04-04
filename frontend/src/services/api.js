import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: API_BASE });

// Attach admin token when present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cw_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Categories ────────────────────────────────────────────
export const getCategories = () => api.get('/categories').then(r => r.data);

// ── Products ──────────────────────────────────────────────
export const getProducts = (params = {}) => api.get('/products', { params }).then(r => r.data);
export const getProduct  = (id)           => api.get(`/products/${id}`).then(r => r.data);

// ── Orders ────────────────────────────────────────────────
export const createOrder = (data)           => api.post('/orders', data).then(r => r.data);
export const trackOrder  = (orderNumber)    => api.get(`/orders/${orderNumber}`).then(r => r.data);

// ── Admin ─────────────────────────────────────────────────
export const adminLogin         = (creds)           => api.post('/admin/login', creds).then(r => r.data);
export const adminDashboard     = ()                => api.get('/admin/dashboard').then(r => r.data);
export const adminOrders        = (params = {})     => api.get('/admin/orders', { params }).then(r => r.data);
export const adminUpdateStatus  = (id, status)      => api.patch(`/admin/orders/${id}/status`, null, { params: { status } }).then(r => r.data);
export const adminCreateProduct = (data)            => api.post('/admin/products', data).then(r => r.data);
export const adminUpdateProduct = (id, data)        => api.patch(`/admin/products/${id}`, data).then(r => r.data);
export const adminDeleteProduct = (id)              => api.delete(`/admin/products/${id}`).then(r => r.data);
export const adminUploadImage   = (id, formData)    => api.post(`/admin/products/${id}/image`, formData).then(r => r.data);

export default api;
