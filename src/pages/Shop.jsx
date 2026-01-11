import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { useFestivals } from '../context/FestivalContext';
import { Filter, ArrowDownUp, Palette, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { convertPrice } from '../utils/numberUtils';
import './Shop.css';

const Shop = () => {
    const { products, categories: contextCategories } = useProducts();
    const { festivals } = useFestivals();
    const { t, i18n } = useTranslation();
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeFestival, setActiveFestival] = useState('All');
    const [activeColor, setActiveColor] = useState('All');
    const [sortOption, setSortOption] = useState('newest');
    const [searchParams] = useSearchParams();
    const [isFilterOpen, setIsFilterOpen] = useState(true);

    const categories = ['All', ...contextCategories, 'Offer'];

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        const festivalParam = searchParams.get('festival');

        if (categoryParam) {
            if (categories.includes(categoryParam)) {
                setActiveCategory(categoryParam);
                setActiveFestival('All'); // Clear festival if category clicked
            }
        }
        if (festivalParam) {
            setActiveFestival(festivalParam);
            setActiveCategory('All'); // Clear category if festival clicked
        }
    }, [searchParams]);

    // Price Filter State
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    // Calculate Max Price from products dynamically
    const maxProductPrice = useMemo(() => {
        if (products.length === 0) return 25000;
        return Math.max(...products.map(p => p.price));
    }, [products]);


    // Sync state with maxPrice only on initial load ideally, but for now simple default is fine.


    // Extract all unique colors from products
    const allColors = useMemo(() => {
        const colors = new Set(['All']);
        products.forEach(p => {
            if (p.colors) p.colors.forEach(c => colors.add(c));
        });
        return Array.from(colors);
    }, [products]);

    // Filter & Sort Logic
    // ... (logic remains same, just moved UI) 
    const filteredProducts = useMemo(() => {
        let result = products.filter(p => !p.isHidden);

        if (activeCategory !== 'All') {
            if (activeCategory === 'Offer') {
                result = result.filter(p => !!p.isOffer || p.category === 'Offer');
            } else {
                result = result.filter(p => p.category === activeCategory);
            }
        }

        if (activeFestival !== 'All') {
            result = result.filter(p => p.festival === activeFestival);
        }

        if (activeColor !== 'All') {
            result = result.filter(p => p.colors && p.colors.includes(activeColor));
        }

        // Price Filter
        if (priceRange.min !== '') {
            result = result.filter(p => p.price >= Number(priceRange.min));
        }
        if (priceRange.max !== '') {
            result = result.filter(p => p.price <= Number(priceRange.max));
        }

        return [...result].sort((a, b) => {
            if (sortOption === 'price-low') return a.price - b.price;
            if (sortOption === 'price-high') return b.price - a.price;
            return b.id - a.id;
        });
    }, [products, activeCategory, activeFestival, activeColor, sortOption, priceRange]);

    const resetFilters = () => {
        setActiveCategory('All');
        setActiveFestival('All');
        setActiveColor('All');
        setSortOption('newest');
        setPriceRange({ min: '', max: '' });
    };

    return (
        <div className="shop-page">
            <div className="container">
                {/* Shop Header */}
                <div className="shop-header-ethereal">
                    <h1>{t('shop.title')}</h1>
                    <p>{t('shop.subtitle')}</p>
                </div>

                <div className="shop-actions-bar">
                    <button
                        className="btn-filter-toggle"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <Filter size={18} /> {isFilterOpen ? t('shop.hideFilters') : t('shop.showFilters')}
                    </button>

                    <div className="sort-wrapper">
                        <span className="label-icon"><ArrowDownUp size={16} /> {t('shop.sort')}</span>
                        <select
                            className="sort-select"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="newest">{t('shop.newest')}</option>
                            <option value="price-low">{t('shop.priceLow')}</option>
                            <option value="price-high">{t('shop.priceHigh')}</option>
                        </select>
                    </div>
                </div>

                <div className="shop-layout">
                    {/* FILTER SIDEBAR */}
                    <aside className={`shop-sidebar ${isFilterOpen ? 'open' : 'closed'}`}>
                        <div className="sidebar-section">
                            <h3>{t('shop.category')}</h3>
                            <div className="filter-list">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        className={`filter-item ${activeCategory === cat ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(cat)}
                                    >
                                        {cat === 'All' ? t('categories.all') : t(`categories.${cat.toLowerCase()}`, cat)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Festival Filter */}
                        <div className="sidebar-section">
                            <h3><Sparkles size={16} style={{ marginRight: '8px' }} /> Festival Collections</h3>
                            <div className="filter-list">
                                <button
                                    className={`filter-item ${activeFestival === 'All' ? 'active' : ''}`}
                                    onClick={() => setActiveFestival('All')}
                                >
                                    All Festivals
                                </button>
                                {festivals.filter(f => f.isActive).map(f => (
                                    <button
                                        key={f.id}
                                        className={`filter-item ${activeFestival === f.name ? 'active' : ''}`}
                                        onClick={() => setActiveFestival(f.name)}
                                    >
                                        {f.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="sidebar-section">
                            <h3>{t('shop.color')}</h3>
                            <div className="color-grid">
                                <button
                                    className={`color-dot-btn ${activeColor === 'All' ? 'active' : ''}`}
                                    onClick={() => setActiveColor('All')}
                                    title="All Colors"
                                >
                                    <span className="color-dot all"></span>
                                </button>
                                {allColors.filter(c => c !== 'All').map(color => {
                                    const colorMap = {
                                        "Gold": "#FFD700", "Cream": "#FFFDD0", "Ivory": "#FFFFF0",
                                        "White": "#FFFFFF", "Off-White": "#F8F8F8", "Midnight Blue": "#191970",
                                        "Black": "#000000", "Beige": "#F5F5DC", "Pale Pink": "#FFD1DC",
                                        "Maroon": "#800000", "Wine": "#722F37", "Tan": "#D2B48C",
                                        "Grey": "#808080", "Emerald": "#50C878", "Teal": "#008080"
                                    };
                                    return (
                                        <button
                                            key={color}
                                            className={`color-dot-btn ${activeColor === color ? 'active' : ''}`}
                                            onClick={() => setActiveColor(color)}
                                            title={color}
                                        >
                                            <span
                                                className="color-dot"
                                                style={{ backgroundColor: colorMap[color] || color }}
                                            />
                                        </button>
                                    )
                                })}
                            </div>
                        </div>


                        <div className="sidebar-section">
                            <h3>{t('shop.priceRange')}</h3>
                            <div className="price-filter">
                                <p className="price-display">
                                    {t('shop.upTo')} ৳{priceRange.max ? convertPrice(Number(priceRange.max), i18n.language) : convertPrice(maxProductPrice, i18n.language)}
                                </p>
                                <div className="price-inputs">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                        className="price-input"
                                    />
                                    <span className="price-separator">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                        className="price-input"
                                    />
                                </div>
                                <div className="price-slider-container" style={{ marginTop: '1rem' }}>
                                    <input
                                        type="range"
                                        min="0"
                                        max={maxProductPrice}
                                        value={priceRange.max || maxProductPrice}
                                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                        className="price-slider"
                                    />
                                </div>
                            </div>
                        </div>

                        <button onClick={resetFilters} className="btn-reset-sidebar">{t('shop.resetAll')}</button>
                    </aside>

                    {/* PRODUCT GRID */}
                    <div className="shop-main-content">
                        <div className="shop-grid-ethereal">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(p => (
                                    <ProductCard key={p.id} product={p} />
                                ))
                            ) : (
                                <div className="no-results">
                                    <p>{t('shop.noResults')}</p>
                                    <button onClick={resetFilters} className="btn btn-primary">{t('shop.resetFilters')}</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
