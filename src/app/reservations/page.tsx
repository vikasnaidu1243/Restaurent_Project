'use client';

import React, { useState } from 'react';
import { SpinnerIcon, CheckIcon } from '@/components/SVGIcons';

export default function ReservationsPage() {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successReservation, setSuccessReservation] = useState<any | null>(null);

  const timeSlots = [
    '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  const formatTimeSlot = (t: string) => {
    const [h, m] = t.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
  };

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName || !customerEmail || !customerPhone || !date || !time || !guests) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          date,
          time,
          guests: Number(guests),
          specialRequests,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to place reservation');
      }

      const res = await response.json();
      setSuccessReservation(res);
      
      // Clear inputs
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setDate('');
      setTime('');
      setGuests('2');
      setSpecialRequests('');
    } catch (err: any) {
      setError(err.message || 'An error occurred while booking your table.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reservations-page container animate-fade-in">
      <div className="text-center-wrapper page-header">
        <span className="section-subtitle">TABLE BOOKINGS</span>
        <h1 className="section-title">Reserve a Table</h1>
        <p className="reservations-subtitle">
          Secure an extraordinary dining experience. For parties larger than 10, please contact us directly.
        </p>
      </div>

      <div className="booking-layout">
        {/* Success Card */}
        {successReservation ? (
          <div className="booking-success-card animate-fade-in">
            <div className="success-icon-wrapper flex-center">
              <CheckIcon size={32} />
            </div>
            <h2 className="success-title">Reservation Confirmed</h2>
            <p className="success-desc">
              Thank you, <strong>{successReservation.customerName}</strong>. Your reservation request has been received and is currently pending review.
            </p>
            <div className="booking-details-box">
              <div className="detail-row">
                <span className="detail-label">Reservation ID</span>
                <span className="detail-val gold-highlight">{successReservation.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date</span>
                <span className="detail-val">{successReservation.date}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time</span>
                <span className="detail-val">{formatTimeSlot(successReservation.time)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Guests</span>
                <span className="detail-val">{successReservation.guests} Persons</span>
              </div>
            </div>
            <p className="confirmation-notice">
              A confirmation email has been sent to <strong>{successReservation.customerEmail}</strong>.
            </p>
            <button
              onClick={() => setSuccessReservation(null)}
              className="btn btn-primary"
              style={{ marginTop: '20px' }}
            >
              Book Another Table
            </button>
          </div>
        ) : (
          /* Booking Form */
          <div className="booking-form-wrapper">
            <form onSubmit={handleSubmit} className="booking-form card-luxury">
              <div className="booking-form-header">
                <h3 className="form-title">Reservation Details</h3>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Enter name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="Enter email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="form-control"
                    placeholder="Enter phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Number of Guests *</label>
                  <select
                    className="form-control"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    min={getTodayDateString()}
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Time *</label>
                  <select
                    required
                    className="form-control"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  >
                    <option value="" disabled>Select Time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {formatTimeSlot(slot)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Special Requests (Allergies, Seating Preference, etc.)</label>
                <textarea
                  className="form-control"
                  placeholder="Tell us any requirements..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>

              {error && <div className="checkout-error-msg" style={{ marginBottom: '20px' }}>{error}</div>}

              <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-book-table">
                {isSubmitting ? <SpinnerIcon size={18} /> : 'Request Reservation'}
              </button>
            </form>
          </div>
        )}

        {/* Side Info Panel */}
        <div className="booking-info-panel card-luxury">
          <h3 className="info-panel-title">Important Information</h3>
          <div className="info-block">
            <h4>Cancellations</h4>
            <p>
              Please notify us at least 24 hours in advance if you need to cancel or modify your reservation.
            </p>
          </div>
          <div className="info-block">
            <h4>Dress Code</h4>
            <p>
              Smart elegant. Jacket is preferred for gentlemen. Athletic wear, shorts, and sandals are not permitted.
            </p>
          </div>
          <div className="info-block">
            <h4>Children</h4>
            <p>
              We welcome children over the age of 8. We do not offer high chairs or a children&apos;s menu.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .reservations-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 300;
          margin-top: 12px;
        }

        .booking-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
          margin-bottom: 120px;
          align-items: start;
        }

        /* Success Card Styling */
        .booking-success-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .success-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-full);
          background-color: rgba(163, 217, 165, 0.1);
          color: var(--success);
          border: 1px solid rgba(163, 217, 165, 0.2);
        }

        .success-title {
          font-family: var(--font-serif);
          font-size: 1.75rem;
          color: var(--accent-gold);
          font-weight: 500;
        }

        .success-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          max-width: 500px;
          line-height: 1.7;
        }

        .booking-details-box {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          width: 100%;
          max-width: 400px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin: 10px 0;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
        }

        .detail-label {
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .detail-val {
          font-weight: 600;
          color: var(--text-primary);
        }

        .gold-highlight {
          color: var(--accent-gold);
        }

        .confirmation-notice {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        /* Form Styling */
        .booking-form {
          background-color: var(--bg-secondary);
        }

        .booking-form-header {
          padding: 24px 32px;
          border-bottom: 1px solid var(--border-color);
        }

        .form-title {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .booking-form .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          padding: 32px 32px 12px;
        }

        .booking-form .form-group:last-child {
          grid-column: span 2;
        }

        .booking-form textarea.form-control {
          margin: 0 32px 32px;
          width: calc(100% - 64px);
        }

        .booking-form .form-group-textarea {
          padding: 0 32px;
          margin-bottom: 24px;
        }

        .booking-form textarea {
          margin-bottom: 0 !important;
          width: 100% !important;
        }

        /* Form Textarea Padding Adjustment */
        .booking-form {
          padding-bottom: 32px;
        }

        .booking-form .form-group:not(.form-grid *) {
          padding: 0 32px;
        }

        .btn-book-table {
          margin-left: 32px;
          width: calc(100% - 64px);
        }

        /* Info Panel Styling */
        .booking-info-panel {
          background-color: var(--bg-secondary);
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .info-panel-title {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          color: var(--accent-gold);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
          font-weight: 500;
        }

        .info-block {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .info-block h4 {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--text-primary);
          font-weight: 600;
        }

        .info-block p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
          font-weight: 300;
        }

        @media (max-width: 992px) {
          .booking-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 576px) {
          .booking-form .form-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .booking-form .form-group:last-child {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}
