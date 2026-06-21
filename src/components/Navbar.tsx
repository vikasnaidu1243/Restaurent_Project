'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartContext';
import { CartIcon, MenuIcon, XIcon } from './SVGIcons';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Reservations', path: '/reservations' },
    { name: 'Admin Portal', path: '/admin' },
  ];

  return (
    <header className="navbar-header">
      <div className="container nav-container">
        <Link href="/" className="nav-logo">
          HARISHRESTAURENT
        </Link>

        {/* Desktop Menu */}
        <nav className="nav-desktop">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="nav-actions">
          <button
            onClick={() => setIsCartOpen(true)}
            className="nav-cart-btn"
            aria-label="Open Shopping Cart"
          >
            <CartIcon size={20} />
            {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
          </button>

          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="nav-mobile animate-fade-in">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`nav-mobile-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      )}

      <style jsx global>{`
        .navbar-header {
          position: sticky;
          top: 0;
          height: var(--nav-height);
          background-color: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border-color);
          z-index: 100;
          display: flex;
          align-items: center;
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .nav-logo {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 3px;
          transition: var(--transition-fast);
        }

        .nav-logo:hover {
          color: var(--accent-gold);
        }

        .nav-desktop {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .nav-link {
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--text-secondary);
          position: relative;
          padding: 8px 0;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background-color: var(--accent-gold);
          transition: var(--transition-normal);
        }

        .nav-link:hover {
          color: var(--text-primary);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-link.active {
          color: var(--accent-gold);
        }

        .nav-link.active::after {
          width: 100%;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-cart-btn {
          position: relative;
          color: var(--text-primary);
          padding: 8px;
          border-radius: var(--radius-full);
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
        }

        .nav-cart-btn:hover {
          color: var(--accent-gold);
          background-color: var(--bg-tertiary);
          border-color: var(--border-color);
        }

        .nav-cart-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background-color: var(--accent-gold);
          color: var(--bg-primary);
          font-size: 0.65rem;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-mobile-toggle {
          display: none;
          color: var(--text-primary);
          padding: 8px;
        }

        .nav-mobile {
          position: absolute;
          top: var(--nav-height);
          left: 0;
          width: 100%;
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          padding: 24px;
          gap: 20px;
          z-index: 99;
          box-shadow: var(--shadow-lg);
        }

        .nav-mobile-link {
          font-size: 0.85rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--text-secondary);
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .nav-mobile-link.active {
          color: var(--accent-gold);
          border-bottom-color: var(--accent-gold);
        }

        @media (max-width: 768px) {
          .nav-desktop {
            display: none;
          }
          .nav-mobile-toggle {
            display: block;
          }
        }
      `}</style>
    </header>
  );
};
