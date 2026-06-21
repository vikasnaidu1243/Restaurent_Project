'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/components/CartContext';
import { MenuItem } from '@/lib/db';
import { SpinnerIcon, PlusIcon } from '@/components/SVGIcons';

export default function MenuPage() {
  const { addToCart } = useCart();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const categories = [
    { name: 'All', value: 'all' },
    { name: 'Appetizers', value: 'appetizers' },
    { name: 'Mains', value: 'mains' },
    { name: 'Desserts', value: 'desserts' },
    { name: 'Drinks', value: 'drinks' },
  ];

  const tags = ['all', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Chef\'s Special', 'Best Seller'];

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/menu');
        if (res.ok) {
          const data = await res.json();
          setMenu(data);
        }
      } catch (err) {
        console.error('Failed to load menu', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  // Filter items based on category, search query, and tag selection
  const filteredMenu = menu.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || item.tags.includes(selectedTag);

    return matchesCategory && matchesSearch && matchesTag;
  });

  return (
    <div className="menu-page container animate-fade-in">
      <div className="text-center-wrapper page-header">
        <span className="section-subtitle">OUR OFFERINGS</span>
        <h1 className="section-title">The Culinary Menu</h1>
        <p className="menu-subtitle">
          Indulge in a curated selection of masterpieces designed to ignite the senses.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="menu-controls-bar">
        <div className="search-box-wrapper">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search our dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`category-tab ${activeCategory === cat.value ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tag Filters */}
      <div className="tag-filters">
        <span className="tag-label">Dietary & Style:</span>
        <div className="tags-container">
          {tags.map((tag) => (
            <button
              key={tag}
              className={`tag-pill ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag === 'all' ? 'All Styles' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="menu-loading flex-center">
          <SpinnerIcon size={40} />
          <span className="loading-text">Crafting Menu...</span>
        </div>
      ) : filteredMenu.length === 0 ? (
        <div className="no-items-found flex-center">
          <p>No dishes found matching your criteria. Try adjusting your filters.</p>
        </div>
      ) : (
        /* Menu Grid */
        <div className="grid-menu menu-grid-layout">
          {filteredMenu.map((item) => (
            <div key={item.id} className={`card-luxury menu-card ${!item.available ? 'out-of-stock' : ''}`}>
              <div className="menu-card-img-wrapper">
                <img src={item.image} alt={item.name} className="menu-card-img" />
                {!item.available && <div className="out-of-stock-overlay">Out of Stock</div>}
              </div>
              <div className="menu-card-content">
                <div className="menu-card-header">
                  <h3 className="menu-item-name">{item.name}</h3>
                  <span className="menu-item-price">${item.price.toFixed(2)}</span>
                </div>
                <p className="menu-item-desc">{item.description}</p>
                <div className="menu-item-footer">
                  <div className="menu-item-tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="badge badge-gold menu-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    disabled={!item.available}
                    onClick={() => addToCart({ menuItemId: item.id, name: item.name, price: item.price })}
                    className="btn btn-primary btn-sm btn-add-cart"
                  >
                    <PlusIcon size={12} style={{ marginRight: '6px' }} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        .page-header {
          margin-top: 60px;
          margin-bottom: 60px;
        }

        .menu-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 300;
          margin-top: 12px;
        }

        /* Controls Bar */
        .menu-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
        }

        .search-box-wrapper {
          flex: 1;
          max-width: 400px;
        }

        .search-input {
          font-size: 0.85rem;
          background-color: var(--bg-secondary);
        }

        .category-tabs {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .category-tab {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--text-secondary);
          padding: 10px 20px;
          border: 1px solid transparent;
          transition: var(--transition-fast);
        }

        .category-tab:hover {
          color: var(--accent-gold);
          border-color: var(--border-color);
        }

        .category-tab.active {
          color: var(--bg-primary);
          background-color: var(--accent-gold);
          border-color: var(--accent-gold);
          font-weight: 600;
        }

        /* Tag Filters */
        .tag-filters {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 48px;
        }

        .tag-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--accent-gold);
          font-weight: 600;
        }

        .tags-container {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .tag-pill {
          font-size: 0.7rem;
          color: var(--text-secondary);
          padding: 6px 14px;
          border: 1px solid var(--border-color);
          transition: var(--transition-fast);
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tag-pill:hover {
          color: var(--text-primary);
          border-color: var(--text-primary);
        }

        .tag-pill.active {
          color: var(--accent-gold);
          border-color: var(--accent-gold);
          background-color: var(--accent-gold-light);
        }

        /* Loading & Empty States */
        .menu-loading {
          padding: 80px 0;
          flex-direction: column;
          gap: 16px;
          color: var(--text-secondary);
        }

        .loading-text {
          font-size: 0.9rem;
          font-weight: 300;
          letter-spacing: 1px;
        }

        .no-items-found {
          padding: 80px 0;
          color: var(--text-secondary);
          font-size: 0.95rem;
          text-align: center;
        }

        /* Menu Card Details */
        .menu-grid-layout {
          margin-bottom: 120px;
        }

        .menu-card {
          display: flex;
          flex-direction: column;
          background-color: var(--bg-secondary);
          height: 100%;
        }

        .menu-card-img-wrapper {
          width: 100%;
          height: 220px;
          overflow: hidden;
          position: relative;
        }

        .menu-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .menu-card:hover .menu-card-img {
          transform: scale(1.06);
        }

        .menu-card-content {
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .menu-card-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
        }

        .menu-item-name {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .menu-item-price {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--accent-gold);
        }

        .menu-item-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
          font-weight: 300;
          flex: 1;
        }

        .menu-item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
          margin-top: 4px;
        }

        .menu-item-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .menu-tag {
          font-size: 0.6rem;
          padding: 2px 6px;
        }

        .btn-add-cart {
          font-size: 0.65rem;
          padding: 6px 12px;
        }

        /* Out of Stock Styling */
        .menu-card.out-of-stock {
          opacity: 0.6;
        }

        .out-of-stock-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--error);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 600;
        }

        @media (max-width: 992px) {
          .menu-controls-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 20px;
          }
          .search-box-wrapper {
            max-width: 100%;
          }
          .category-tabs {
            justify-content: flex-start;
          }
          .tag-filters {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
