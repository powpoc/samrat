import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Menu, X, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useFestivals } from '../context/FestivalContext';
import './Navbar.css';

const Navbar = () => {
    const { cartCount, setIsCartOpen } = useCart();
    const { festivals } = useFestivals();
    const { t, i18n } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        if (i18n.language === 'bn') {
            document.body.classList.add('font-bengali');
        } else {
            document.body.classList.remove('font-bengali');
        }
    }, [i18n.language]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'bn' : 'en');
    };

    return (
        <>
            <nav className="navbar">
                <div className="glass-nav-pill">
                    <Link to="/" className="nav-logo">samrat.</Link>

                    <div className="nav-links desktop-only">
                        <NavLink to="/">{t('nav.home')}</NavLink>
                        <NavLink to="/shop">{t('nav.shop')}</NavLink>
                        <NavLink to="/shop?category=Offer">{t('nav.offer')}</NavLink>
                        {festivals.filter(f => f.isActive).map(f => (
                            <NavLink key={f.id} to={`/shop?festival=${f.name}`} className="festival-link">
                                {f.name}
                            </NavLink>
                        ))}
                        <NavLink to="/about">{t('nav.story')}</NavLink>
                    </div>

                    <div className="nav-icons">
                        <button
                            className={`icon-btn lang-btn ${i18n.language === 'en' ? 'font-bengali' : ''}`}
                            onClick={toggleLanguage}
                            style={{ fontSize: i18n.language === 'en' ? '1rem' : '0.8rem', fontWeight: 'bold' }}
                        >
                            {i18n.language === 'en' ? 'বাংলা' : 'English'}
                        </button>
                        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
                            {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
                        </button>
                        <button className="icon-btn" onClick={() => setIsCartOpen(true)}>
                            <ShoppingBag size={22} />
                            {cartCount > 0 && <span className="badge">{cartCount}</span>}
                        </button>
                        <button className="icon-btn mobile-only" onClick={() => setMobileMenuOpen(true)}>
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="mobile-overlay glass-panel"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <div className="mobile-header">
                            <span className="logo-mobile">samrat.</span>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <button className="icon-btn" onClick={toggleTheme}>
                                    {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
                                </button>
                                <button onClick={() => setMobileMenuOpen(false)}><X size={28} /></button>
                            </div>
                        </div>
                        <div className="mobile-links">
                            <Link to="/" onClick={() => setMobileMenuOpen(false)}>{t('nav.home')}</Link>
                            <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>{t('nav.shop')}</Link>
                            <Link to="/shop?category=Offer" onClick={() => setMobileMenuOpen(false)}>{t('nav.offer')}</Link>
                            {festivals.filter(f => f.isActive).map(f => (
                                <Link key={f.id} to={`/shop?festival=${f.name}`} onClick={() => setMobileMenuOpen(false)} className="festival-link-mobile">
                                    {f.name}
                                </Link>
                            ))}
                            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>{t('nav.story')}</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
