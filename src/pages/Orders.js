import React, { useEffect, useState } from "react";
import { getOrders, getProducts, getCustomers, createOrder, deleteOrder } from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ product_id: "", customer_id: "", quantity: "" });
  const [error, setError] = useState("");

  const load = () => {
    getOrders().then(r => setOrders(r.data));
    getProducts().then(r => setProducts(r.data));
    getCustomers().then(r => setCustomers(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    setError("");
    try {
      await createOrder({ product_id: parseInt(form.product_id), customer_id: parseInt(form.customer_id), quantity: parseInt(form.quantity) });
      setModal(false);
      setForm({ product_id: "", customer_id: "", quantity: "" });
      load();
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel order?")) return;
    await deleteOrder(id);
    load();
  };

  const selectedProduct = products.find(p => p.id === parseInt(form.product_id));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <p className="page-subtitle">Track and manage orders</p>
      </div>
      <div className="card">
        <div className="toolbar">
          <span style={{fontSize:14, color:"var(--muted)"}}>{orders.length} orders</span>
          <button className="btn btn-primary" onClick={() => { setError(""); setModal(true); }}>+ New Order</button>
        </div>
        {orders.length === 0 ? (
          <div className="empty"><div className="empty-icon">◎</div><div>No orders yet</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Product</th><th>Customer</th><th>Qty</th><th>Total</th><th>Status</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td style={{color:"var(--muted)"}}>#{o.id}</td>
                    <td><strong>{o.product?.name || "-"}</strong></td>
                    <td>{o.customer?.name || "-"}</td>
                    <td>{o.quantity}</td>
                    <td style={{color:"var(--success)"}}>₹{o.total_price.toFixed(2)}</td>
                    <td><span className="badge badge-green">{o.status}</span></td>
                    <td style={{color:"var(--muted)", fontSize:12}}>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(o.id)}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">New Order</div>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label>Product</label>
              <select value={form.product_id} onChange={e => setForm({...form, product_id: e.target.value})}>
                <option value="">Select product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}
              </select>
            </div>
            {selectedProduct && (
              <div style={{fontSize:12, color:"var(--muted)", marginBottom:12, marginTop:-8}}>
                Price: ₹{selectedProduct.price} · Available: {selectedProduct.stock} units
              </div>
            )}
            <div className="form-group">
              <label>Customer</label>
              <select value={form.customer_id} onChange={e => setForm({...form, customer_id: e.target.value})}>
                <option value="">Select customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" min="1" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
            </div>
            {form.product_id && form.quantity && selectedProduct && (
              <div style={{fontSize:14, color:"var(--success)", marginBottom:8}}>
                Total: ₹{(selectedProduct.price * parseInt(form.quantity || 0)).toFixed(2)}
              </div>
            )}
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>Place Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
