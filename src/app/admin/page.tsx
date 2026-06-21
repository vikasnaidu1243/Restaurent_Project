'use client';

import React, { useState, useEffect } from 'react';
import { Order, Reservation, MenuItem } from '@/lib/db';
import { SpinnerIcon, PencilIcon, TrashIcon, PlusIcon, XIcon, CheckIcon } from '@/components/SVGIcons';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'menu'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Menu Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState<'appetizers' | 'mains' | 'desserts' | 'drinks' | 'specials'>('appetizers');
  const [formImage, setFormImage] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formAvailable, setFormAvailable] = useState(true);

  // Load dashboard data
  const fetchData = async () => {
    try {
      const [ordersRes, resRes, menuRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/reservations'),
        fetch('/api/menu'),
      ]);

      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (resRes.ok) setReservations(await resRes.json());
      if (menuRes.ok) setMenu(await menuRes.json());
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll updates every 10 seconds for real-time order/reservation flow
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
      }
    } catch (err) {
      console.error('Failed to update order status', err);
    }
  };

  // Update reservation status
  const handleUpdateReservationStatus = async (resId: string, status: Reservation['status']) => {
    try {
      const res = await fetch(`/api/reservations/${resId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setReservations(reservations.map((r) => (r.id === resId ? { ...r, status } : r)));
      }
    } catch (err) {
      console.error('Failed to update reservation status', err);
    }
  };

  // Delete menu item
  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMenu(menu.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  // Open modal for Adding
  const openAddModal = () => {
    setModalMode('add');
    setSelectedItemId(null);
    setFormName('');
    setFormDesc('');
    setFormPrice('');
    setFormCategory('appetizers');
    setFormImage('');
    setFormTags('');
    setFormAvailable(true);
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const openEditModal = (item: MenuItem) => {
    setModalMode('edit');
    setSelectedItemId(item.id);
    setFormName(item.name);
    setFormDesc(item.description);
    setFormPrice(String(item.price));
    setFormCategory(item.category);
    setFormImage(item.image);
    setFormTags(item.tags.join(', '));
    setFormAvailable(item.available);
    setIsModalOpen(true);
  };

  // Handle Form Submit (Add or Edit item)
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      name: formName,
      description: formDesc,
      price: Number(formPrice),
      category: formCategory,
      image: formImage,
      tags: tagArray,
      available: formAvailable,
    };

    try {
      if (modalMode === 'add') {
        const res = await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const newItem = await res.json();
          setMenu([...menu, newItem]);
        }
      } else if (modalMode === 'edit' && selectedItemId) {
        const res = await fetch(`/api/menu/${selectedItemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updatedItem = await res.json();
          setMenu(menu.map((m) => (m.id === selectedItemId ? updatedItem : m)));
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save menu item', err);
    }
  };

  const getOrderStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'preparing': return 'badge-gold';
      case 'ready': return 'badge-info';
      case 'completed': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      default: return '';
    }
  };

  const getResStatusBadgeClass = (status: Reservation['status']) => {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'confirmed': return 'badge-gold';
      case 'completed': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      default: return '';
    }
  };

  return (
    <div className="admin-page container animate-fade-in">
      <div className="page-header flex-header-layout">
        <div>
          <span className="section-subtitle">MANAGEMENT CONSOLE</span>
          <h1 className="section-title">NitheeshRestuarent Administrative Panel</h1>
        </div>
        {activeTab === 'menu' && (
          <button onClick={openAddModal} className="btn btn-primary btn-add-menu-item">
            <PlusIcon size={14} style={{ marginRight: '6px' }} />
            Add Menu Item
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders ({orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length} Active)
        </button>
        <button
          className={`admin-tab ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          Bookings ({reservations.filter(r => r.status === 'pending' || r.status === 'confirmed').length} Active)
        </button>
        <button
          className={`admin-tab ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          Menu Inventory ({menu.length} Items)
        </button>
      </div>

      {loading ? (
        <div className="menu-loading flex-center">
          <SpinnerIcon size={40} />
          <span className="loading-text">Loading management console data...</span>
        </div>
      ) : (
        <>
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="table-container animate-fade-in">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Details</th>
                    <th>Type</th>
                    <th>Ordered Dishes</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center">No orders placed yet.</td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td className="gold-highlight font-mono">{order.id}</td>
                        <td>
                          <div className="customer-cell-details">
                            <strong>{order.customerName}</strong>
                            <span>{order.customerPhone}</span>
                            <span className="email">{order.customerEmail}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-gold">{order.type}</span>
                        </td>
                        <td>
                          <div className="dishes-cell-list">
                            {order.items.map((i, idx) => (
                              <div key={idx} className="dish-summary-row">
                                <span className="dish-qty">{i.quantity}x</span>
                                <span className="dish-name">{i.name}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td><strong>${(order.totalAmount + order.totalAmount * 0.1 + (order.type === 'delivery' ? 5 : 0)).toFixed(2)}</strong></td>
                        <td>
                          <span className={`badge ${getOrderStatusBadgeClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons-flex">
                            {order.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                                className="btn btn-outline btn-sm action-btn-gold"
                              >
                                Accept
                              </button>
                            )}
                            {order.status === 'preparing' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                                className="btn btn-outline btn-sm action-btn-gold"
                              >
                                Mark Ready
                              </button>
                            )}
                            {order.status === 'ready' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                className="btn btn-outline btn-sm action-btn-gold"
                              >
                                Complete
                              </button>
                            )}
                            {order.status !== 'completed' && order.status !== 'cancelled' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                className="btn btn-sm btn-danger-action"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* RESERVATIONS TAB */}
          {activeTab === 'reservations' && (
            <div className="table-container animate-fade-in">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer Name</th>
                    <th>Contact Info</th>
                    <th>Guests</th>
                    <th>Date & Time</th>
                    <th>Special Requests</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center">No table reservations requested yet.</td>
                    </tr>
                  ) : (
                    reservations.map((res) => (
                      <tr key={res.id}>
                        <td className="gold-highlight font-mono">{res.id}</td>
                        <td><strong>{res.customerName}</strong></td>
                        <td>
                          <div className="customer-cell-details">
                            <span>{res.customerPhone}</span>
                            <span className="email">{res.customerEmail}</span>
                          </div>
                        </td>
                        <td><strong>{res.guests} Persons</strong></td>
                        <td>
                          <div className="date-time-cell">
                            <strong>{res.date}</strong>
                            <span className="time-badge">{res.time}</span>
                          </div>
                        </td>
                        <td>
                          <p className="special-req-text">{res.specialRequests || 'None'}</p>
                        </td>
                        <td>
                          <span className={`badge ${getResStatusBadgeClass(res.status)}`}>
                            {res.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons-flex">
                            {res.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateReservationStatus(res.id, 'confirmed')}
                                className="btn btn-outline btn-sm action-btn-gold"
                              >
                                Confirm
                              </button>
                            )}
                            {res.status === 'confirmed' && (
                              <button
                                onClick={() => handleUpdateReservationStatus(res.id, 'completed')}
                                className="btn btn-outline btn-sm action-btn-gold"
                              >
                                Seated/Completed
                              </button>
                            )}
                            {res.status !== 'completed' && res.status !== 'cancelled' && (
                              <button
                                onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')}
                                className="btn btn-sm btn-danger-action"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* MENU TAB */}
          {activeTab === 'menu' && (
            <div className="table-container animate-fade-in">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Dish</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Tags</th>
                    <th>Availability</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menu.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center">No menu items found. Add one to get started.</td>
                    </tr>
                  ) : (
                    menu.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="admin-menu-thumb-wrapper">
                            <img src={item.image} alt={item.name} className="admin-menu-thumb" />
                          </div>
                        </td>
                        <td>
                          <div className="admin-dish-name-cell">
                            <strong>{item.name}</strong>
                            <p className="desc">{item.description}</p>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>
                            {item.category}
                          </span>
                        </td>
                        <td><strong>${item.price.toFixed(2)}</strong></td>
                        <td>
                          <div className="admin-dish-tags">
                            {item.tags.map((tag) => (
                              <span key={tag} className="badge badge-gold" style={{ fontSize: '0.55rem', padding: '2px 6px' }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${item.available ? 'badge-success' : 'badge-danger'}`}>
                            {item.available ? 'Available' : 'Out of Stock'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons-flex">
                            <button
                              onClick={() => openEditModal(item)}
                              className="admin-action-icon-btn"
                              aria-label="Edit dish"
                            >
                              <PencilIcon size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item.id)}
                              className="admin-action-icon-btn danger"
                              aria-label="Delete dish"
                            >
                              <TrashIcon size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* FORM DIALOG MODAL (Create/Edit Menu Item) */}
      {isModalOpen && (
        <div className="admin-modal-backdrop flex-center animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal card-luxury" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title-serif">
                {modalMode === 'add' ? 'Add New Menu Item' : 'Edit Menu Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn" aria-label="Close modal">
                <XIcon size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="modal-body-form">
              <div className="form-group">
                <label className="form-label">Dish Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Lobster Bisque"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div className="form-grid-modal">
                <div className="form-group">
                  <label className="form-label">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="form-control"
                    placeholder="e.g. 24.50"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-control"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                  >
                    <option value="appetizers">Appetizers</option>
                    <option value="mains">Mains</option>
                    <option value="desserts">Desserts</option>
                    <option value="drinks">Drinks</option>
                    <option value="specials">Specials</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  placeholder="Describe the dish ingredients and preparation..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Vegetarian, Gluten-Free, Chef's Special"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                />
              </div>

              <div className="form-group checkbox-form-group">
                <input
                  type="checkbox"
                  id="modal-available"
                  className="checkbox-control"
                  checked={formAvailable}
                  onChange={(e) => setFormAvailable(e.target.checked)}
                />
                <label htmlFor="modal-available" className="checkbox-label">
                  Available in Stock
                </label>
              </div>

              <div className="modal-actions-bar">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === 'add' ? 'Create Item' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .flex-header-layout {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 60px;
          margin-bottom: 48px;
        }

        .btn-add-menu-item {
          padding: 10px 20px;
          font-size: 0.7rem;
        }

        /* Tabs styling */
        .admin-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-color);
          gap: 8px;
          margin-bottom: 24px;
        }

        .admin-tab {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--text-secondary);
          padding: 12px 24px;
          border: 1px solid transparent;
          border-bottom: none;
          transition: var(--transition-fast);
        }

        .admin-tab:hover {
          color: var(--text-primary);
          background-color: var(--bg-secondary);
        }

        .admin-tab.active {
          color: var(--accent-gold);
          border-color: var(--border-color);
          background-color: var(--bg-secondary);
          font-weight: 600;
        }

        /* Cells inside tables details styling */
        .customer-cell-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .customer-cell-details span {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .customer-cell-details span.email {
          font-size: 0.75rem;
          color: var(--accent-gold);
          font-family: var(--font-sans);
        }

        .dishes-cell-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .dish-summary-row {
          display: flex;
          gap: 8px;
          font-size: 0.85rem;
        }

        .dish-qty {
          color: var(--accent-gold);
          font-weight: 600;
        }

        .dish-name {
          color: var(--text-primary);
        }

        .date-time-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .time-badge {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--accent-gold);
          font-size: 0.75rem;
          padding: 2px 6px;
          width: fit-content;
          font-family: var(--font-sans);
        }

        .special-req-text {
          font-size: 0.8rem;
          color: var(--text-secondary);
          white-space: pre-wrap;
          max-width: 250px;
          line-height: 1.5;
        }

        /* Action elements in cells */
        .action-buttons-flex {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .action-btn-gold {
          padding: 6px 12px;
          font-size: 0.65rem;
          letter-spacing: 1px;
        }

        .action-btn-gold:hover {
          background-color: var(--accent-gold);
          color: var(--bg-primary);
        }

        .btn-danger-action {
          padding: 6px 12px;
          font-size: 0.65rem;
          letter-spacing: 1px;
          color: var(--error);
          border: 1px solid rgba(244, 143, 177, 0.2);
          transition: var(--transition-fast);
        }

        .btn-danger-action:hover {
          background-color: rgba(244, 143, 177, 0.1);
          border-color: var(--error);
        }

        /* Menu cells specific */
        .admin-menu-thumb-wrapper {
          width: 50px;
          height: 50px;
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        .admin-menu-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .admin-dish-name-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 320px;
        }

        .admin-dish-name-cell p.desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-dish-tags {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          max-width: 180px;
        }

        .admin-action-icon-btn {
          color: var(--text-secondary);
          padding: 8px;
          border-radius: var(--radius-full);
          transition: var(--transition-fast);
          border: 1px solid transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-action-icon-btn:hover {
          color: var(--accent-gold);
          background-color: var(--bg-tertiary);
          border-color: var(--border-color);
        }

        .admin-action-icon-btn.danger:hover {
          color: var(--error);
        }

        /* Form Modal backdrop and contents */
        .admin-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(5px);
          z-index: 1000;
        }

        .admin-modal {
          width: 90%;
          max-width: 540px;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-lg);
        }

        .modal-header {
          padding: 24px 32px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-title-serif {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--accent-gold);
          font-weight: 500;
        }

        .modal-close-btn {
          color: var(--text-secondary);
          padding: 4px;
          transition: var(--transition-fast);
        }

        .modal-close-btn:hover {
          color: var(--accent-gold);
        }

        .modal-body-form {
          padding: 32px;
          display: flex;
          flex-direction: column;
        }

        .form-grid-modal {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .checkbox-form-group {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .checkbox-control {
          accent-color: var(--accent-gold);
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .checkbox-label {
          font-size: 0.85rem;
          color: var(--text-primary);
          cursor: pointer;
        }

        .modal-actions-bar {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          border-top: 1px solid var(--border-color);
          padding-top: 24px;
        }

        @media (max-width: 768px) {
          .flex-header-layout {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .admin-tabs {
            flex-direction: column;
            border-bottom: none;
            gap: 4px;
          }
          .admin-tab {
            border: 1px solid var(--border-color);
            text-align: left;
          }
          .form-grid-modal {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
}
