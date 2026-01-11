import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, ScrollRestoration, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Shop from './pages/Shop';
import CartSidebar from './components/CartSidebar';
import { CartProvider } from './context/CartContext';
import './index.css';

import { ProductProvider } from './context/ProductContext';
import { PromoProvider } from './context/PromoContext';

import { FestivalProvider } from './context/FestivalContext';
import { SiteProvider, useSite } from './context/SiteContext';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import { Phone, AlertTriangle, Sparkles } from 'lucide-react'; // Import icons
import { motion, AnimatePresence } from 'framer-motion';

function WhatsAppButton() {
  const { whatsappNumber } = useSite();

  if (!whatsappNumber) return null;

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float-btn"
      title="Chat on WhatsApp"
    >
      <Phone size={24} fill="currentColor" />
    </a>
  );
}

function MaintenancePage() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg-1)',
      color: 'var(--color-text-main)',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <AlertTriangle size={64} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '1rem' }}>Under Maintenance</h1>
      <p style={{ maxWidth: '500px', fontSize: '1.2rem', color: 'var(--color-text-light)' }}>
        We are currently updating our royal collection. Please check back soon for an even more majestic experience.
      </p>
    </div>
  );
}

function WelcomeScreen({ onComplete }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#000',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <h1 style={{
          fontFamily: "'Galada', cursive",
          color: '#D4AF37', // Gold
          fontSize: '5rem',
          margin: 0,
          textShadow: '0 0 20px rgba(212, 175, 55, 0.5)'
        }}>
          samrat.
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        style={{ color: '#fff', marginTop: '1rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.9rem' }}
      >
        Royal Ethnic Wear
      </motion.p>
    </motion.div>
  );
}

function Layout({ children }) {
  const location = useLocation();
  const { isMaintenanceMode } = useSite();
  const isAdmin = location.pathname === '/admin';
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Check if we've shown the welcome screen in this session
    const hasSeenWelcome = sessionStorage.getItem('samrat_welcome_seen');
    if (hasSeenWelcome || isAdmin) {
      setShowWelcome(false);
    } else {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        sessionStorage.setItem('samrat_welcome_seen', 'true');
      }, 3500); // Show for 3.5 seconds
      return () => clearTimeout(timer);
    }
  }, [isAdmin]);

  if (isMaintenanceMode && !isAdmin) {
    return <MaintenancePage />;
  }

  return (
    <>
      <AnimatePresence>
        {showWelcome && <WelcomeScreen />}
      </AnimatePresence>
      {!showWelcome && (
        <>
          {!isAdmin && <Navbar />}
          {!isAdmin && <CartSidebar />}
          {!isAdmin && <WhatsAppButton />}
          <main>
            {children}
          </main>
          {!isAdmin && <Footer />}
        </>
      )}
    </>
  );
}

function App() {
  return (
    <div className="app">
      <ProductProvider>
        <CartProvider>
          <PromoProvider>
            <FestivalProvider>
              <SiteProvider>
                <Router>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="*" element={<Home />} />
                    </Routes>
                  </Layout>
                </Router>
              </SiteProvider>
            </FestivalProvider>
          </PromoProvider>
        </CartProvider>
      </ProductProvider>
    </div>
  );
}

export default App;
