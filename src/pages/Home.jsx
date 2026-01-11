import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFestivals } from '../context/FestivalContext';
import { useSite } from '../context/SiteContext';
import defaultHeroImage from '../assets/hero-regal.png'; // Renamed import
import './Home.css';

const Home = () => {

    const { products } = useProducts();
    const { festivals } = useFestivals();
    const { heroImage } = useSite();
    const { t } = useTranslation();

    const displayHero = heroImage || defaultHeroImage;
    const activeFestivals = festivals.filter(f => f.isActive);

    return (
        <div className="home-container">
            {/* Royal Split Hero */}
            <section className="hero-section">
                <div className="container hero-container-split">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="hero-text-side"
                    >

                        <span className="hero-subtitle-new">{t('home.subtitle')}</span>
                        <h1 className="display-heading">{t('home.title').split(' ').map((word, i) => <React.Fragment key={i}>{word} <br /></React.Fragment>)}</h1>
                        <p className="hero-desc">
                            {t('home.description')}
                        </p>
                        <div className="hero-btns">
                            <Link to="/shop" className="btn btn-primary btn-lg">{t('home.explore')}</Link>
                            <Link to="/about" className="btn btn-outline btn-lg">{t('home.ourstory')}</Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                        className="hero-image-side"
                    >
                        <div className="image-frame-royal">
                            <img src={displayHero} alt="Royal Groom" />
                            <div className="royal-accent-circle"></div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories - Soft Blobs */}
            <section className="section categories-section">
                <div className="container">
                    <div className="category-row">
                        <Link to="/shop?category=Sherwani" className="category-pill glass-panel">
                            <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=400" alt="Sherwani" />
                            <h3>{t('categories.sherwani')}</h3>
                        </Link>
                        <Link to="/shop?category=Punjabi" className="category-pill glass-panel">
                            <img src="https://images.unsplash.com/photo-1626307416562-ee839676f5fc?auto=format&fit=crop&q=80&w=400" alt="Punjabi" />
                            <h3>{t('categories.punjabi')}</h3>
                        </Link>
                        <Link to="/shop?category=Coaty" className="category-pill glass-panel">
                            <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=400" alt="Coaty" />
                            <h3>{t('categories.coaty')}</h3>
                        </Link>

                    </div>
                </div>
            </section>

            {/* Active Festivals Horizontal Scroll */}
            {activeFestivals.length > 0 && (
                <section className="section festival-section">
                    <div className="container">
                        <div className="text-center mb-5">
                            <h2 className="section-title-gold">Festive Collections</h2>
                        </div>
                        <div className="festival-scroll-wrapper">
                            {activeFestivals.map(festival => (
                                <Link key={festival.id} to={`/shop?festival=${festival.name}`} className="festival-card-home glass-panel">
                                    {festival.image && (
                                        <img src={festival.image} alt={festival.name} className="festival-img" />
                                    )}
                                    <div className="festival-overlay">
                                        <h3>{festival.name}</h3>
                                        <span>Explore Collection &rarr;</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Grid */}
            <section className="section featured-section">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title-gold">{t('home.majestic')}</h2>
                    </div>
                    <div className="product-layout-grid">
                        {products.filter(p => !p.isHidden).slice(0, 4).map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
