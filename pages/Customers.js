import React, { useEffect, useState } from "react";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../api";

const empty = { name: "", email: "", phone: "", address: "" };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const load = () => getCustomers().then(r => setCustomers(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(empty); setEditing(null); setError(""); setModal(true); };
  const openEdit = (c) => { setForm(c); setEditing(c.id); setError(""); setModal(true); };

  const handleSubmit = async () => {
    setError("");
    try {
      if (editing) await updateCustomer(editing, form);
      else await createCustomer(form);
      setModal(false);
      load();
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete customer?")) return;
    await deleteCustomer(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <p className="page-subtitle">Manage customer records</p>
      </div>
      <div className="card">
        <div className="toolbar">
          <span style={{fontSize:14, color:"var(--muted)"}}>{customers.length} customers</span>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Customer</button>
        </div>
        {customers.length === 0 ? (
          <div className="empty"><div className="empty-icon">◉</div><div>No customers yet</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Actions</th></tr></thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td style={{color:"var(--accent2)"}}>{c.email}</td>
                    <td style={{color:"var(--muted)"}}>{c.phone}</td>
                    <td style={{color:"var(--muted)"}}>{c.address}</td>
                    <td style={{display:"flex", gap:8}}>
                      <button className="btn btn-sm btn-ghost" onClick={() => openEdit(c)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
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
            <div className="modal-title">{editing ? "Edit Customer" : "Add Customer"}</div>
            {error && <div className="alert alert-error">{error}</div>}
            {[["name","Name"],["email","Email"],["phone","Phone"],["address","Address"]].map(([k,l]) => (
              <div className="form-group" key={k}>
                <label>{l}</label>
                <input value={form[k]} onChange={e => setForm({...form, [k]: e.target.value})} />
              </div>
            ))}
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
