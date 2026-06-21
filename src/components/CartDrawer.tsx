'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './CartContext';
import { XIcon, PlusIcon, MinusIcon, TrashIcon, SpinnerIcon } from './SVGIcons';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
  } = useCart();

  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isCartOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName || !customerEmail || !customerPhone) {
      setError('Please fill in all contact details.');
      return;
    }

    if (orderType === 'delivery' && !address) {
      setError('Delivery address is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          address: orderType === 'delivery' ? address : '',
          type: orderType,
          items: cart,
          totalAmount: cartTotal,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to place order');
      }

      const order = await response.json();
      
      // Success! Clear the cart, close the drawer, and route to tracker
      clearCart();
      setIsCartOpen(false);
      
      // Navigate to order tracker page
      router.push(`/track/${order.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while placing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cart-backdrop animate-fade-in" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3 className="drawer-title">Your Order</h3>
          <button onClick={() => setIsCartOpen(false)} className="drawer-close-btn" aria-label="Close cart">
            <XIcon size={24} />
          </button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart-message">
              <p>Your cart is empty.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setIsCartOpen(false);
                  router.push('/menu');
                }}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="cart-items-list">
                {cart.map((item) => (
                  <div key={item.menuItemId} className="cart-item">
                    <div className="cart-item-details">
                      <span className="cart-item-name">{item.name}</span>
                      <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                          className="quantity-btn"
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon size={14} />
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                          className="quantity-btn"
                          aria-label="Increase quantity"
                        >
                          <PlusIcon size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.menuItemId)}
                        className="item-delete-btn"
                        aria-label="Remove item"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleSubmit} className="checkout-form">
                <h4 className="checkout-section-title">Order Method</h4>
                <div className="order-type-tabs">
                  <button
                    type="button"
                    className={`order-type-tab ${orderType === 'pickup' ? 'active' : ''}`}
                    onClick={() => setOrderType('pickup')}
                  >
                    Pickup
                  </button>
                  <button
                    type="button"
                    className={`order-type-tab ${orderType === 'delivery' ? 'active' : ''}`}
                    onClick={() => setOrderType('delivery')}
                  >
                    Delivery
                  </button>
                </div>

                <h4 className="checkout-section-title">Contact & Delivery</h4>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="name@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    required
                    className="form-control"
                    placeholder="+1 (555) 000-0000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>

                {orderType === 'delivery' && (
                  <div className="form-group">
                    <label className="form-label">Delivery Address</label>
                    <textarea
                      required
                      className="form-control"
                      placeholder="Street address, Apartment/Suite, Zip code"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                )}

                {error && <div className="checkout-error-msg">{error}</div>}

                {/* Subtotal & Action */}
                <div className="order-summary-box">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (10%)</span>
                    <span>${(cartTotal * 0.1).toFixed(2)}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="summary-row">
                      <span>Delivery Fee</span>
                      <span>$5.00</span>
                    </div>
                  )}
                  <div className="summary-row total-row">
                    <span>Total Amount</span>
                    <span>
                      ${(cartTotal + cartTotal * 0.1 + (orderType === 'delivery' ? 5 : 0)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-checkout">
                  {isSubmitting ? <SpinnerIcon size={18} /> : 'Place Your Order'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        .cart-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(5px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
        }

        .cart-drawer {
          width: 100%;
          max-width: 480px;
          height: 100%;
          background-color: var(--bg-secondary);
          border-left: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-lg);
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .drawer-header {
          padding: 24px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .drawer-title {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--text-primary);
          letter-spacing: 1px;
        }

        .drawer-close-btn {
          color: var(--text-secondary);
          padding: 4px;
          transition: var(--transition-fast);
        }

        .drawer-close-btn:hover {
          color: var(--accent-gold);
        }

        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }

        .empty-cart-message {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          color: var(--text-secondary);
          text-align: center;
        }

        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 30px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
        }

        .cart-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          padding: 16px;
        }

        .cart-item-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cart-item-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .cart-item-price {
          font-size: 0.85rem;
          color: var(--accent-gold);
        }

        .cart-item-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
        }

        .quantity-btn {
          padding: 6px 10px;
          color: var(--text-secondary);
          transition: var(--transition-fast);
        }

        .quantity-btn:hover {
          color: var(--accent-gold);
          background-color: var(--bg-tertiary);
        }

        .quantity-value {
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0 8px;
          min-width: 24px;
          text-align: center;
        }

        .item-delete-btn {
          color: var(--text-muted);
          padding: 6px;
          transition: var(--transition-fast);
        }

        .item-delete-btn:hover {
          color: var(--error);
        }

        .checkout-form {
          display: flex;
          flex-direction: column;
        }

        .checkout-section-title {
          font-size: 0.85rem;
          color: var(--accent-gold);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 8px;
          margin: 16px 0 16px;
        }

        .order-type-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border: 1px solid var(--border-color);
          margin-bottom: 16px;
        }

        .order-type-tab {
          padding: 12px;
          text-align: center;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-secondary);
          transition: var(--transition-fast);
        }

        .order-type-tab.active {
          background-color: var(--accent-gold);
          color: var(--bg-primary);
          font-weight: 600;
        }

        .order-summary-box {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin: 24px 0;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .summary-row.total-row {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          border-top: 1px solid var(--border-color);
          padding-top: 12px;
          margin-top: 4px;
        }

        .checkout-error-msg {
          background-color: rgba(244, 143, 177, 0.1);
          color: var(--error);
          border: 1px solid rgba(244, 143, 177, 0.2);
          padding: 12px;
          margin-top: 16px;
          font-size: 0.85rem;
        }

        .btn-checkout {
          width: 100%;
          margin-bottom: 40px;
        }
      `}</style>
    </div>
  );
};
