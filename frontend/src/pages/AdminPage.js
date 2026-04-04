import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminLogin, adminDashboard, adminOrders,
  adminUpdateStatus, adminCreateProduct,
  adminUpdateProduct, adminDeleteProduct,
  adminUploadImage,
  getCategories, getProducts,
} from '../services/api';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
import toast from 'react-hot-toast';

const TOKEN_KEY = 'cw_admin_token';

export default function AdminPage() {
  const [token,   setToken]   = useState(localStorage.getItem(TOKEN_KEY) || '');
  const [tab,     setTab]     = useState('dashboard');
  const [stats,   setStats]   = useState(null);
  const [orders,  setOrders]  = useState([]);
  const [products,setProducts]= useState([]);
  const [cats,    setCats]    = useState([]);
  const [login,   setLogin]   = useState({ username:'', password:'' });
  const navigate = useNavigate();

  const logout = () => { localStorage.removeItem(TOKEN_KEY); setToken(''); };

  const doLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await adminLogin(login);
      localStorage.setItem(TOKEN_KEY, data.access_token);
      setToken(data.access_token);
      toast.success('Welcome back! 👋');
    } catch { toast.error('Invalid credentials'); }
  };

  useEffect(() => {
    if (!token) return;
    if (tab === 'dashboard') adminDashboard().then(setStats).catch(logout);
    if (tab === 'orders')    adminOrders({ limit:50 }).then(setOrders).catch(logout);
    if (tab === 'products')  {
      getProducts({ limit:100 }).then(setProducts);
      getCategories().then(setCats);
    }
  }, [token, tab]); // eslint-disable-line

  // ── Login screen ────────────────────────────────────────
  if (!token) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#F7F8FC'}}>
      <div style={{background:'#fff',borderRadius:20,padding:40,width:380,boxShadow:'0 8px 40px rgba(0,0,0,0.12)'}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:'2.5rem',marginBottom:8}}>🔐</div>
          <h2 style={{fontWeight:900}}>Admin Login</h2>
          <p style={{color:'#718096',fontSize:'0.9rem'}}>Collections World Dashboard</p>
        </div>
        <form onSubmit={doLogin}>
          <div className="form-group">
            <label>Username</label>
            <input value={login.username} onChange={e=>setLogin(l=>({...l,username:e.target.value}))} placeholder="admin" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={login.password} onChange={e=>setLogin(l=>({...l,password:e.target.value}))} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}}>Login →</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">🌍 Collections World<br/><span style={{fontSize:'0.75rem',fontWeight:400,opacity:0.6}}>Admin Panel</span></div>
        {[
          { key:'dashboard', icon:'📊', label:'Dashboard' },
          { key:'orders',    icon:'📦', label:'Orders' },
          { key:'products',  icon:'🏷️', label:'Products' },
        ].map(item => (
          <div key={item.key} className={`admin-nav-item ${tab===item.key?'active':''}`} onClick={()=>setTab(item.key)}>
            <span>{item.icon}</span><span>{item.label}</span>
          </div>
        ))}
        <div className="admin-nav-item" onClick={logout} style={{marginTop:'auto',color:'#fc8181'}}>
          <span>🚪</span><span>Logout</span>
        </div>
      </aside>

      {/* Content */}
      <main className="admin-content">
        {/* ── Dashboard ──────────────────────────────── */}
        {tab === 'dashboard' && stats && (
          <>
            <h1 style={{fontWeight:900,marginBottom:24}}>📊 Dashboard</h1>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:20,marginBottom:32}}>
              {[
                {label:'Total Orders',   value:stats.total_orders,   icon:'📦'},
                {label:'Total Revenue',  value:`₹${stats.total_revenue.toLocaleString('en-IN')}`, icon:'💰'},
                {label:'Active Products',value:stats.total_products, icon:'🏷️'},
                {label:'Pending Orders', value:stats.pending_orders, icon:'⏳'},
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{fontSize:'2rem',marginBottom:8}}>{s.icon}</div>
                  <div className="stat-card__value">{s.value}</div>
                  <div className="stat-card__label">{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{background:'#fff',borderRadius:16,padding:28,boxShadow:'0 4px 24px rgba(0,0,0,0.07)'}}>
              <h2 style={{fontWeight:800,marginBottom:16}}>Quick Actions</h2>
              <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                <button className="btn btn-primary" onClick={()=>setTab('orders')}>View Orders 📦</button>
                <button className="btn btn-secondary" onClick={()=>setTab('products')}>Manage Products 🏷️</button>
                <button className="btn btn-outline" onClick={()=>navigate('/')}>View Store 🌐</button>
              </div>
            </div>
          </>
        )}

        {/* ── Orders ─────────────────────────────────── */}
        {tab === 'orders' && (
          <>
            <h1 style={{fontWeight:900,marginBottom:24}}>📦 Orders</h1>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th><th>Customer</th><th>Phone</th>
                  <th>Total</th><th>Status</th><th>Date</th><th>Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td style={{fontWeight:700,color:'#FF6B35'}}>{o.order_number}</td>
                    <td style={{fontWeight:600}}>{o.customer_name}</td>
                    <td>{o.customer_phone}</td>
                    <td style={{fontWeight:700}}>₹{o.total_amount}</td>
                    <td><span className={`status-badge status-${o.status}`}>{o.status}</span></td>
                    <td style={{fontSize:'0.85rem',color:'#718096'}}>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={async e => {
                          try {
                            await adminUpdateStatus(o.id, e.target.value);
                            setOrders(prev => prev.map(x => x.id===o.id ? {...x,status:e.target.value} : x));
                            toast.success('Status updated!');
                          } catch { toast.error('Failed'); }
                        }}
                        style={{padding:'6px 10px',border:'2px solid #e2e8f0',borderRadius:8,fontFamily:'Nunito',cursor:'pointer'}}
                      >
                        {['pending','confirmed','shipped','delivered','cancelled'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ── Products ───────────────────────────────── */}
        {tab === 'products' && (
          <>
            <h1 style={{fontWeight:900,marginBottom:24}}>🏷️ Products</h1>
            <AddProductForm cats={cats} onAdd={() => getProducts({limit:100}).then(setProducts)} />
            <table className="admin-table" style={{marginTop:32}}>
              <thead>
                <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    {/* ── Image cell with upload ── */}
                    <td style={{width:80}}>
                      <div style={{position:'relative',width:56,height:56}}>
                        {p.image_url ? (
                          <img
                            src={p.image_url.startsWith('http') ? p.image_url : `${API_BASE}${p.image_url}`}
                            alt={p.name}
                            style={{width:56,height:56,objectFit:'cover',borderRadius:10,border:'2px solid #f0f0f0'}}
                            onError={e=>e.target.style.display='none'}
                          />
                        ) : (
                          <div style={{width:56,height:56,background:'#f7f8fc',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',border:'2px dashed #e2e8f0'}}>
                            📦
                          </div>
                        )}
                        {/* Upload button overlay */}
                        <label
                          title="Upload image"
                          style={{position:'absolute',bottom:-4,right:-4,background:'#FF6B35',borderRadius:'50%',width:22,height:22,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:'0 2px 6px rgba(0,0,0,0.2)'}}
                        >
                          <span style={{color:'#fff',fontSize:'0.7rem',fontWeight:700}}>📷</span>
                          <input
                            type="file"
                            accept="image/*"
                            style={{display:'none'}}
                            onChange={async(e)=>{
                              const file = e.target.files[0];
                              if(!file) return;
                              const fd = new FormData();
                              fd.append('file', file);
                              try {
                                const res = await adminUploadImage(p.id, fd);
                                setProducts(prev=>prev.map(x=>x.id===p.id?{...x,image_url:res.image_url}:x));
                                toast.success('Image uploaded! 🖼️');
                              } catch { toast.error('Upload failed'); }
                            }}
                          />
                        </label>
                      </div>
                    </td>
                    <td style={{fontWeight:600,maxWidth:180}}>{p.name}</td>
                    <td>{p.category?.name || '—'}</td>
                    <td style={{fontWeight:700,color:'#FF6B35'}}>₹{p.price}</td>
                    <td>
                      <span style={{fontWeight:700,color:p.stock>10?'#10B981':p.stock>0?'#F59E0B':'#EF4444'}}>{p.stock}</span>
                    </td>
                    <td>
                      <button
                        onClick={async()=>{
                          await adminUpdateProduct(p.id,{is_featured:!p.is_featured});
                          setProducts(prev=>prev.map(x=>x.id===p.id?{...x,is_featured:!x.is_featured}:x));
                        }}
                        style={{background:'none',border:'none',fontSize:'1.2rem',cursor:'pointer'}}
                      >{p.is_featured?'⭐':'☆'}</button>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline"
                        style={{padding:'6px 14px',fontSize:'0.8rem'}}
                        onClick={async()=>{
                          if(!window.confirm(`Delete "${p.name}"?`)) return;
                          await adminDeleteProduct(p.id);
                          setProducts(prev=>prev.filter(x=>x.id!==p.id));
                          toast.success('Product deleted');
                        }}
                      >Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  );
}

function AddProductForm({ cats, onAdd }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name:'', price:'', original_price:'', stock:'', category_id:'', description:'', is_featured:false });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await adminCreateProduct({
        ...form, price:+form.price, original_price:form.original_price?+form.original_price:null,
        stock:+form.stock, category_id:+form.category_id,
      });
      toast.success('Product added! 🎉');
      onAdd(); setOpen(false);
      setForm({ name:'', price:'', original_price:'', stock:'', category_id:'', description:'', is_featured:false });
    } catch(err) { toast.error(err.response?.data?.detail || 'Failed'); }
  };

  if (!open) return (
    <button className="btn btn-primary" onClick={()=>setOpen(true)}>+ Add New Product</button>
  );

  const f = (key) => ({ value:form[key], onChange:e=>setForm(p=>({...p,[key]:e.target.value})) });

  return (
    <form onSubmit={submit} style={{background:'#fff',borderRadius:16,padding:24,boxShadow:'0 4px 24px rgba(0,0,0,0.07)'}}>
      <h3 style={{fontWeight:800,marginBottom:16}}>➕ Add New Product</h3>
      <div className="form-row">
        <div className="form-group"><label>Name *</label><input {...f('name')} required /></div>
        <div className="form-group">
          <label>Category *</label>
          <select {...f('category_id')} required>
            <option value="">Select…</option>
            {cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>Price (₹) *</label><input type="number" {...f('price')} required /></div>
        <div className="form-group"><label>Original Price (₹)</label><input type="number" {...f('original_price')} /></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>Stock *</label><input type="number" {...f('stock')} required /></div>
        <div className="form-group" style={{display:'flex',alignItems:'flex-end',paddingBottom:4}}>
          <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}}>
            <input type="checkbox" checked={form.is_featured} onChange={e=>setForm(p=>({...p,is_featured:e.target.checked}))} style={{width:18,height:18}} />
            <span>Mark as Featured ⭐</span>
          </label>
        </div>
      </div>
      <div className="form-group"><label>Description</label><textarea {...f('description')} rows={2} /></div>
      <div style={{display:'flex',gap:12}}>
        <button type="submit" className="btn btn-primary">Save Product</button>
        <button type="button" className="btn btn-outline" onClick={()=>setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}
