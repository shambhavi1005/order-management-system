import React, { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api";

const empty = { name: "", sku: "", price: "", stock: "", description: "" };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const load = () => getProducts().then(r => setProducts(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(empty); setEditing(null); setError(""); setModal(true); };
  const openEdit = (p) => { setForm({...p, price: String(p.price), stock: String(p.stock)}); setEditing(p.id); setError(""); setModal(true); };

  const handleSubmit = async () => {
    setError("");
    try {
      const data = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
      if (editing) await updateProduct(editing, data);
      else await createProduct(data);
      setModal(false);
      load();
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await deleteProduct(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <p className="page-subtitle">Manage your product catalog & inventory</p>
      </div>
      <div className="card">
        <div className="toolbar">
          <span style={{fontSize:14, color:"var(--muted)"}}>{products.length} products</span>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
        </div>
        {products.length === 0 ? (
          <div className="empty"><div className="empty-icon">▦</div><div>No products yet</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Description</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td style={{fontFamily:"monospace", color:"var(--accent)"}}>{p.sku}</td>
                    <td>₹{p.price.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${p.stock < 5 ? "badge-amber" : "badge-green"}`}>{p.stock}</span>
                    </td>
                    <td style={{color:"var(--muted)", maxWidth: 200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{p.description}</td>
                    <td style={{display:"flex", gap:8}}>
                      <button className="btn btn-sm btn-ghost" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
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
            <div className="modal-title">{editing ? "Edit Product" : "Add Product"}</div>
            {error && <div className="alert alert-error">{error}</div>}
            {[["name","Name","text"],["sku","SKU","text"],["price","Price","number"],["stock","Stock","number"]].map(([k,l,t]) => (
              <div className="form-group" key={k}>
                <label>{l}</label>
                <input type={t} value={form[k]} onChange={e => setForm({...form, [k]: e.target.value})} />
              </div>
            ))}
            <div className="form-group">
              <label>Description</label>
              <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
