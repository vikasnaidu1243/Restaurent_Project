'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order } from '@/lib/db';
import { SpinnerIcon, ClockIcon, MapPinIcon } from '@/components/SVGIcons';

export default function TrackOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id ? decodeURIComponent(params.id as string) : '';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return;

    async function fetchOrderStatus() {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Order not found');
        }
        const data = await response.json();
        setOrder(data);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    }

    // Fetch initially
    fetchOrderStatus();

    // Set up polling interval to fetch status updates every 5 seconds
    const interval = setInterval(fetchOrderStatus, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="track-page-loading flex-center container">
        <SpinnerIcon size={40} />
        <span>Locating Order...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="track-page-error container flex-center">
        <div className="error-card card-luxury">
          <h2>Order Not Found</h2>
          <p>We were unable to locate an order with ID: <strong>{orderId}</strong>.</p>
          <button onClick={() => router.push('/menu')} className="btn btn-primary" style={{ marginTop: '20px' }}>
            Go to Menu
          </button>
        </div>
      </div>
    );
  }

  // Determine progress step index based on order status
  const statusSteps = ['pending', 'preparing', 'ready', 'completed'];
  const currentStepIndex = statusSteps.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  const getStepClass = (stepIndex: number) => {
    if (isCancelled) return 'cancelled';
    if (currentStepIndex > stepIndex) return 'completed';
    if (currentStepIndex === stepIndex) return 'active';
    return 'upcoming';
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Order Placed';
      case 'preparing': return 'In the Kitchen';
      case 'ready': return order.type === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup';
      case 'completed': return 'Enjoy Your Meal!';
      case 'cancelled': return 'Order Cancelled';
      default: return '';
    }
  };

  return (
    <div className="track-order-page container animate-fade-in">
      <div className="text-center-wrapper page-header">
        <span className="section-subtitle">ORDER TRACKER</span>
        <h1 className="section-title">Track Your Culinary Order</h1>
        <p className="track-subtitle">Live status of order: <strong className="gold-highlight">{order.id}</strong></p>
      </div>

      <div className="tracker-layout">
        {/* Progress Tracker Card */}
        <div className="tracker-card card-luxury">
          <div className="tracker-card-header">
            <h3 className="tracker-status-text">
              Status: <span className={`status-highlight ${order.status}`}>{getStatusLabel(order.status)}</span>
            </h3>
            <p className="tracker-time-hint">
              {order.status !== 'completed' && order.status !== 'cancelled' && (
                <>
                  <ClockIcon size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
                  Updating live as our chefs prepare your food
                </>
              )}
            </p>
          </div>

          {!isCancelled ? (
            /* Progress Stepper */
            <div className="progress-stepper">
              {statusSteps.map((step, idx) => {
                const stepLabels = {
                  pending: { title: 'Received', desc: 'Order placed' },
                  preparing: { title: 'Preparing', desc: 'Chefs are cooking' },
                  ready: { title: order.type === 'delivery' ? 'Dispatched' : 'Ready', desc: order.type === 'delivery' ? 'Out for delivery' : 'Ready for pickup' },
                  completed: { title: 'Delivered', desc: 'Enjoy your food' }
                };
                const label = stepLabels[step as keyof typeof stepLabels];
                const stepClass = getStepClass(idx);

                return (
                  <div key={step} className={`step-node ${stepClass}`}>
                    <div className="step-marker">
                      {stepClass === 'completed' ? '✓' : idx + 1}
                    </div>
                    <div className="step-info">
                      <h4 className="step-title">{label.title}</h4>
                      <p className="step-desc">{label.desc}</p>
                    </div>
                    {idx < statusSteps.length - 1 && <div className="step-connector" />}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Cancelled Screen */
            <div className="cancelled-notice-box">
              <p>This order has been cancelled. If you believe this is in error, please contact support.</p>
            </div>
          )}
        </div>

        {/* Order Details & Summary Summary */}
        <div className="order-details-grid">
          {/* Items Summary */}
          <div className="details-card card-luxury">
            <h3 className="card-title-serif">Items Summary</h3>
            <div className="items-list-box">
              {order.items.map((item) => (
                <div key={item.menuItemId} className="summary-item-row">
                  <div className="item-name-qty">
                    <span className="qty-multiplier">{item.quantity}x</span>
                    <span className="item-name">{item.name}</span>
                  </div>
                  <span className="item-price-sum">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="total-calculation-box">
              <div className="summary-calc-row">
                <span>Subtotal</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="summary-calc-row">
                <span>Tax (10%)</span>
                <span>${(order.totalAmount * 0.1).toFixed(2)}</span>
              </div>
              {order.type === 'delivery' && (
                <div className="summary-calc-row">
                  <span>Delivery Fee</span>
                  <span>$5.00</span>
                </div>
              )}
              <div className="summary-calc-row grand-total-row">
                <span>Total Paid</span>
                <span className="gold-highlight">
                  ${(order.totalAmount + order.totalAmount * 0.1 + (order.type === 'delivery' ? 5 : 0)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery/Pickup Information */}
          <div className="details-card card-luxury">
            <h3 className="card-title-serif">Handover Details</h3>
            <div className="info-rows-container">
              <div className="info-block-row">
                <span className="info-label">Customer Name</span>
                <span className="info-val">{order.customerName}</span>
              </div>
              <div className="info-block-row">
                <span className="info-label">Contact Phone</span>
                <span className="info-val">{order.customerPhone}</span>
              </div>
              <div className="info-block-row">
                <span className="info-label">Service Type</span>
                <span className="info-val badge badge-gold" style={{ textTransform: 'uppercase', width: 'fit-content' }}>
                  {order.type}
                </span>
              </div>

              {order.type === 'delivery' && order.address && (
                <div className="info-block-row full-width">
                  <span className="info-label">
                    <MapPinIcon size={14} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
                    Delivery Address
                  </span>
                  <span className="info-val address-block">{order.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .track-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin-top: 12px;
        }

        .track-page-loading {
          padding: 120px 0;
          flex-direction: column;
          gap: 16px;
          color: var(--text-secondary);
        }

        .track-page-error {
          padding: 120px 0;
        }

        .error-card {
          background-color: var(--bg-secondary);
          padding: 40px;
          max-width: 440px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .error-card h2 {
          font-family: var(--font-serif);
          color: var(--error);
        }

        .error-card p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        /* Tracker layout */
        .tracker-layout {
          display: flex;
          flex-direction: column;
          gap: 40px;
          margin-bottom: 120px;
        }

        .tracker-card {
          background-color: var(--bg-secondary);
          padding: 40px;
        }

        .tracker-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 40px;
        }

        .tracker-status-text {
          font-size: 1.25rem;
          font-family: var(--font-serif);
          font-weight: 500;
        }

        .status-highlight {
          font-weight: 600;
          text-transform: uppercase;
          font-size: 1.1rem;
          padding: 4px 12px;
          letter-spacing: 1px;
        }

        .status-highlight.pending { color: var(--warning); }
        .status-highlight.preparing { color: var(--accent-gold-hover); }
        .status-highlight.ready { color: var(--info); }
        .status-highlight.completed { color: var(--success); }
        .status-highlight.cancelled { color: var(--error); }

        .tracker-time-hint {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        /* Progress Stepper */
        .progress-stepper {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
        }

        .step-node {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .step-marker {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          background-color: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all var(--transition-normal);
          margin-bottom: 16px;
        }

        .step-info {
          padding: 0 12px;
        }

        .step-title {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-muted);
          margin-bottom: 4px;
          transition: all var(--transition-normal);
        }

        .step-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 300;
        }

        /* Connecting Lines */
        .step-connector {
          position: absolute;
          top: 20px;
          left: calc(50% + 20px);
          right: calc(-50% + 20px);
          height: 2px;
          background-color: var(--border-color);
          z-index: 1;
          transition: all var(--transition-normal);
        }

        /* Stepper States styling */
        .step-node.completed .step-marker {
          background-color: var(--accent-gold);
          border-color: var(--accent-gold);
          color: var(--bg-primary);
        }

        .step-node.completed .step-title {
          color: var(--text-primary);
        }

        .step-node.completed .step-connector {
          background-color: var(--accent-gold);
        }

        .step-node.active .step-marker {
          background-color: var(--bg-primary);
          border-color: var(--accent-gold);
          color: var(--accent-gold);
          box-shadow: var(--shadow-gold);
        }

        .step-node.active .step-title {
          color: var(--accent-gold);
          font-weight: 600;
        }

        .cancelled-notice-box {
          background-color: rgba(244, 143, 177, 0.05);
          border: 1px dashed var(--error);
          color: var(--error);
          padding: 24px;
          text-align: center;
          font-size: 0.95rem;
        }

        /* Details section */
        .order-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .details-card {
          background-color: var(--bg-secondary);
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .card-title-serif {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          color: var(--accent-gold);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
          font-weight: 500;
        }

        .items-list-box {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .summary-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .qty-multiplier {
          color: var(--accent-gold);
          font-weight: 600;
          margin-right: 8px;
        }

        .total-calculation-box {
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .summary-calc-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .summary-calc-row.grand-total-row {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
          border-top: 1px dashed var(--border-color);
          padding-top: 16px;
          margin-top: 4px;
        }

        .info-rows-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-block-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          padding-bottom: 12px;
        }

        .info-block-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .info-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--accent-gold);
        }

        .info-val {
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .address-block {
          white-space: pre-wrap;
          line-height: 1.6;
        }

        @media (max-width: 992px) {
          .progress-stepper {
            flex-direction: column;
            gap: 24px;
            padding-left: 20px;
          }
          .step-node {
            flex-direction: row;
            align-items: center;
            text-align: left;
          }
          .step-marker {
            margin-bottom: 0;
            margin-right: 16px;
          }
          .step-connector {
            position: absolute;
            left: 20px;
            top: 40px;
            bottom: -24px;
            width: 2px;
            height: auto;
            z-index: 1;
          }
          .step-node:last-child .step-connector {
            display: none;
          }
          .order-details-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .tracker-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
