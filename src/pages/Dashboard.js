import React, { useEffect, useState } from "react";


import { getProducts, getCustomers, getOrders } from "../api";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getProducts().then((r) => setProducts(r.data)).catch(() => {});
    getCustomers().then((r) => setCustomers(r.data)).catch(() => {});
    getOrders().then((r) => setOrders(r.data)).catch(() => {});
  }, []);

  const revenue = orders.reduce((s, o) => s + o.total_price, 0);

  const lowStock = products.filter((p) => p.stock < 5);

  return (
    <div>
      <div className="dashboard-hero">
        <div>
          <h1 className="hero-title">Operations Dashboard</h1>
          <p className="hero-subtitle">
            Real-time inventory and business overview
          </p>
        </div>
      </div>

      <div className="premium-grid">
        <div className="premium-card">
          <div className="card-icon purple">
            <FiDollarSign />
          </div>

          <div>
            <div className="card-title">Total Revenue</div>
            <div className="card-number">
              ₹{revenue.toLocaleString()}
            </div>
            <div className="card-desc">
              Total revenue generated
            </div>
          </div>
        </div>

        <div className="premium-card">
          <div className="card-icon blue">
            <FiBox />
          </div>

          <div>
            <div className="card-title">Products</div>
            <div className="card-number">
              {products.length}
            </div>
            <div className="card-desc">
              Active inventory items
            </div>
          </div>
        </div>

        <div className="premium-card">
          <div className="card-icon green">
            <FiUsers />
          </div>

          <div>
            <div className="card-title">Customers</div>
            <div className="card-number">
              {customers.length}
            </div>
            <div className="card-desc">
              Registered customers
            </div>
          </div>
        </div>

        <div className="premium-card">
          <div className="card-icon cyan">
            <FiShoppingCart />
          </div>

          <div>
            <div className="card-title">Orders</div>
            <div className="card-number">
              {orders.length}
            </div>
            <div className="card-desc">
              Orders processed
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="glass-panel">
          <h3>Quick Actions</h3>

          <button className="action-btn">
            <FiPlusCircle />
            Add Product
          </button>

          <button className="action-btn">
            <FiPlusCircle />
            Add Customer
          </button>

          <button className="action-btn">
            <FiPlusCircle />
            Create Order
          </button>
        </div>

        <div className="glass-panel">
          <h3>
            <FiAlertTriangle />
            Low Stock Alerts ({lowStock.length})
          </h3>

          {lowStock.length === 0 ? (
            <div className="alert-empty">
              All products are sufficiently stocked.
            </div>
          ) : (
            lowStock.map((p) => (
              <div
                key={p.id}
                className="stock-alert-item"
              >
                {p.name}
                <span>{p.stock} left</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="glass-panel">
        <h3>Recent Orders</h3>

        {orders.length === 0 ? (
          <div className="alert-empty">
            No orders available
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders
                  .slice(-10)
                  .reverse()
                  .map((o) => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>
                        {o.product?.name ||
                          o.product_id}
                      </td>
                      <td>
                        {o.customer?.name ||
                          o.customer_id}
                      </td>
                      <td>{o.quantity}</td>
                      <td>
                        ₹
                        {o.total_price.toLocaleString()}
                      </td>
                      <td>
                        <span className="badge badge-green">
                          {o.status}
                        </span>
                      </td>
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