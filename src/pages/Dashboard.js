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

  const revenue = orders.reduce(
    (sum, order) => sum + Number(order.total_price || 0),
    0
  );

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Inventory & Order Management Overview
        </p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Products</div>
          <div className="stat-value stat-accent">
            {products.length}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Customers</div>
          <div className="stat-value stat-cyan">
            {customers.length}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Orders</div>
          <div className="stat-value stat-amber">
            {orders.length}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Revenue</div>
          <div className="stat-value stat-green">
            ₹{revenue.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "20px" }}>
          Recent Orders
        </h3>

        {orders.length === 0 ? (
          <div className="empty">
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
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>
                      {order.product?.name ||
                        order.product_id}
                    </td>
                    <td>
                      {order.customer?.name ||
                        order.customer_id}
                    </td>
                    <td>{order.quantity}</td>
                    <td>
                      ₹
                      {Number(
                        order.total_price || 0
                      ).toLocaleString()}
                    </td>
                    <td>
                      <span className="badge badge-green">
                        {order.status || "pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}