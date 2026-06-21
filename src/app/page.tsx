'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  const signatures = [
    {
      name: 'Wagyu Ribeye Steak',
      price: '$65',
      desc: 'Grade A5 Japanese Wagyu steak cooked to perfection, accompanied by roasted garlic potato mash and red wine demi-glace.',
      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Truffle Mushroom Crostini',
      price: '$18',
      desc: 'Sautéed wild forest mushrooms infused with white truffle oil, served on toasted artisanal sourdough with fresh whipped ricotta.',
      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Dark Chocolate Soufflé',
      price: '$16',
      desc: 'Decadent 70% dark Belgian chocolate soufflé served warm with a scoop of house-made Tahitian vanilla bean gelato.',
      img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="landing-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <span className="hero-subtitle">MICHELIN STARRED CUISINE</span>
          <h1 className="hero-title">The Art of Pure Gastronomy</h1>
          <p className="hero-description">
            Experience an unforgettable culinary journey inside Paris’ historic Place des Vosges, where classic French heritage meets modern refinement.
          </p>
          <div className="hero-actions">
            <Link href="/menu" className="btn btn-primary">
              Explore Our Menu
            </Link>
            <Link href="/reservations" className="btn btn-secondary">
              Book a Table
            </Link>
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="philosophy-section">
        <div className="container philosophy-container">
          <div className="philosophy-text-box">
            <span className="section-subtitle">OUR HERITAGE</span>
            <h2 className="section-title">A Symphony of Flavors</h2>
            <p className="philosophy-p">
              At NitheeshRestuarent, we believe dining is a sacred ritual. Every dish is a carefully composed sonnet, celebrating the absolute purity of seasonal ingredients sourced from independent artisanal producers.
            </p>
            <p className="philosophy-p">
              Under the culinary vision of our Master Chefs, classical techniques are elevated to modern art, offering a dining experience that resonates deep within the soul of every epicurean.
            </p>
            <Link href="/reservations" className="btn btn-outline philosophy-btn">
              Reservations
            </Link>
          </div>
          <div className="philosophy-image-box">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
              alt="Kitchen prep"
              className="philosophy-img"
            />
          </div>
        </div>
      </section>

      {/* Signature Creations */}
      <section className="signatures-section">
        <div className="container">
          <div className="text-center-wrapper">
            <span className="section-subtitle">CHEF&apos;S CURATION</span>
            <h2 className="section-title">Signature Masterpieces</h2>
          </div>

          <div className="signatures-grid">
            {signatures.map((dish, i) => (
              <div key={i} className="signature-card card-luxury">
                <div className="signature-img-wrapper">
                  <img src={dish.img} alt={dish.name} className="signature-img" />
                </div>
                <div className="signature-details">
                  <div className="signature-header">
                    <h3 className="signature-name">{dish.name}</h3>
                    <span className="signature-price">{dish.price}</span>
                  </div>
                  <p className="signature-desc">{dish.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container testimonials-container">
          <span className="section-subtitle">ACCOLADES</span>
          <div className="quote-box">
            <p className="testimonial-quote">
              &ldquo;NitheeshRestuarent remains the ultimate sanctuary of haute cuisine. A masterclass in precision, balance, and pure culinary poetry.&rdquo;
            </p>
            <span className="quote-author">&mdash; LE GUIDE MICHELIN</span>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .text-center-wrapper {
          text-align: center;
          margin-bottom: 48px;
        }

        .section-subtitle {
          font-size: 0.75rem;
          color: var(--accent-gold);
          letter-spacing: 3px;
          text-transform: uppercase;
          font-weight: 600;
          display: block;
          margin-bottom: 12px;
        }

        .section-title {
          font-size: 2.25rem;
          color: var(--text-primary);
          font-family: var(--font-serif);
          font-weight: 500;
        }

        /* Hero Styling */
        .hero-section {
          height: calc(100vh - var(--nav-height));
          min-height: 600px;
          position: relative;
          display: flex;
          align-items: center;
          background-image: url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80');
          background-size: cover;
          background-position: center;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(10, 10, 10, 0.4) 0%,
            rgba(10, 10, 10, 0.8) 70%,
            var(--bg-primary) 100%
          );
        }

        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 680px;
        }

        .hero-subtitle {
          font-size: 0.8rem;
          color: var(--accent-gold);
          font-weight: 600;
          letter-spacing: 4px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 16px;
        }

        .hero-title {
          font-size: 4rem;
          line-height: 1.15;
          font-weight: 400;
          margin-bottom: 24px;
        }

        .hero-description {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: 40px;
          font-weight: 300;
          line-height: 1.8;
        }

        .hero-actions {
          display: flex;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.75rem;
          }
          .hero-actions {
            flex-direction: column;
            gap: 12px;
          }
        }

        /* Philosophy Styling */
        .philosophy-section {
          padding: 120px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .philosophy-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .philosophy-text-box {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .philosophy-p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.8;
          font-weight: 300;
        }

        .philosophy-btn {
          align-self: flex-start;
          margin-top: 12px;
        }

        .philosophy-image-box {
          position: relative;
          border: 1px solid var(--border-color);
          padding: 16px;
        }

        .philosophy-img {
          width: 100%;
          height: auto;
          display: block;
          filter: grayscale(30%);
          transition: var(--transition-normal);
        }

        .philosophy-image-box:hover .philosophy-img {
          filter: grayscale(0%);
        }

        @media (max-width: 992px) {
          .philosophy-container {
            grid-template-columns: 1fr;
            gap: 60px;
          }
        }

        /* Signatures Styling */
        .signatures-section {
          padding: 120px 0;
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
        }

        .signatures-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .signature-card {
          background-color: var(--bg-primary);
        }

        .signature-img-wrapper {
          width: 100%;
          height: 240px;
          overflow: hidden;
          position: relative;
        }

        .signature-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .signature-card:hover .signature-img {
          transform: scale(1.08);
        }

        .signature-details {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .signature-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
        }

        .signature-name {
          font-size: 1.15rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .signature-price {
          font-size: 1rem;
          font-weight: 600;
          color: var(--accent-gold);
        }

        .signature-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
          font-weight: 300;
        }

        @media (max-width: 992px) {
          .signatures-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        /* Testimonials Styling */
        .testimonials-section {
          padding: 140px 0;
          background-image: linear-gradient(
            to bottom,
            var(--bg-secondary) 0%,
            var(--bg-primary) 100%
          );
          text-align: center;
        }

        .testimonials-container {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
        }

        .quote-box {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .testimonial-quote {
          font-family: var(--font-serif);
          font-size: 1.75rem;
          font-style: italic;
          color: var(--text-primary);
          line-height: 1.5;
          font-weight: 400;
        }

        .quote-author {
          font-size: 0.75rem;
          color: var(--accent-gold);
          letter-spacing: 3px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .testimonial-quote {
            font-size: 1.35rem;
          }
        }
      `}</style>
    </div>
  );
}
