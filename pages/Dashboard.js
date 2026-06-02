import React, { useEffect, useState } from "react";
import { getProducts, getCustomers, getOrders } from "../api";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getProducts().then(r => setProducts(r.data)).catch(() => {});
    getCustomers().then(r => setCustomers(r.data)).catch(() => {});
    getOrders().then(r => setOrders(r.data)).catch(() => {});
  }, []);

  const revenue = orders.reduce((s, o) => s + o.total_price, 0);
  const lowStock = products.filter(p => p.stock < 5);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Inventory & Order Management Overview</p>
      </div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Products</div>
          <div className="stat-value stat-accent">{products.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Customers</div>
          <div className="stat-value stat-cyan">{customers.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Orders</div>
          <div className="stat-value stat-amber">{orders.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Revenue</div>
          <div className="stat-value stat-green">₹{revenue.toFixed(0)}</div>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="card" style={{marginBottom: 24, borderColor: "rgba(245,158,11,0.4)"}}>
          <div style={{fontWeight: 700, marginBottom: 12, color: "var(--accent3)"}}>⚠ Low Stock Alert</div>
          {lowStock.map(p => (
            <div key={p.id} style={{fontSize: 14, color: "var(--muted)", marginBottom: 4}}>
              {p.name} — only <strong style={{color:"var(--text)"}}>{p.stock}</strong> left
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div style={{fontFamily:"var(--font-head)", fontWeight: 700, marginBottom: 16}}>Recent Orders</div>
        {orders.length === 0 ? (
          <div className="empty"><div className="empty-icon">◎</div><div>No orders yet</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Product</th><th>Customer</th><th>Qty</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {orders.slice(-10).reverse().map(o => (
                  <tr key={o.id}>
                    <td style={{color:"var(--muted)"}}>#{o.id}</td>
                    <td>{o.product?.name || o.product_id}</td>
                    <td>{o.customer?.name || o.customer_id}</td>
                    <td>{o.quantity}</td>
                    <td>₹{o.total_price.toFixed(2)}</td>
                    <td><span className="badge badge-green">{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
