import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="footer-ethereal">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-brand-col">
                        <h2 className="footer-logo">samrat.</h2>
                        <p className="footer-tagline">{t('footer.tagline')}</p>
                    </div>

                    <div className="footer-nav-col">
                        <h4>{t('footer.titles.shop')}</h4>
                        <a href="/shop?category=Sherwani">{t('categories.sherwani')}</a>
                        <a href="/shop?category=Punjabi">{t('categories.punjabi')}</a>
                        <a href="/shop?category=Coaty">{t('categories.coaty')}</a>

                    </div>

                    <div className="footer-nav-col">
                        <h4>{t('footer.titles.support')}</h4>
                        <a href="#">{t('footer.links.shipping')}</a>
                        <a href="#">{t('footer.links.sizeGuide')}</a>
                        <a href="#">{t('footer.links.contact')}</a>
                        <a href="#">{t('footer.links.faq')}</a>
                    </div>

                    <div className="footer-nav-col">
                        <h4>{t('footer.titles.connect')}</h4>
                        <div className="social-links">
                            <a href="#" className="social-icon"><Instagram size={20} /></a>
                            <a href="#" className="social-icon"><Facebook size={20} /></a>
                            <a href="#" className="social-icon"><Twitter size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom glass-panel">
                    <p>{t('footer.rights')}</p>
                    <div className="footer-legal">
                        <a href="#">{t('footer.links.privacy')}</a>
                        <a href="#">{t('footer.links.terms')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
