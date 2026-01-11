import React from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { usePromo } from '../context/PromoContext';
import { useTranslation } from 'react-i18next';
import { convertPrice } from '../utils/numberUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './CartSidebar.css';

const CartSidebar = () => {
    const navigate = useNavigate();
    const {
        cart, removeFromCart, updateQuantity,
        isCartOpen, setIsCartOpen,
        cartTotal, cartSubtotal, discountAmount,
        appliedPromo, applyPromo, removePromo
    } = useCart();

    const { getPromo } = usePromo();
    const { i18n } = useTranslation();
    const [promoInput, setPromoInput] = React.useState('');

    const handleApplyPromo = () => {
        if (!promoInput.trim()) return;

        const promo = getPromo(promoInput.trim());
        if (promo) {
            applyPromo(promo);
            setPromoInput('');
        } else {
            alert('Invalid Promo Code');
        }
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        className="cart-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                    />
                    <motion.div
                        className="cart-sidebar"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                    >
                        <div className="cart-header">
                            <h2>Your Bag</h2>
                            <button className="close-btn" onClick={() => setIsCartOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="cart-items">
                            {cart.length === 0 ? (
                                <div className="empty-cart">
                                    <p>Your bag is empty.</p>
                                    <button onClick={() => setIsCartOpen(false)} className="btn btn-outline">Continue Shopping</button>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <img src={item.image} alt={item.name} className="cart-item-img" />
                                        <div className="cart-item-details">
                                            <h3>{item.name}</h3>
                                            {(item.selectedSize || item.selectedColor) && (
                                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', margin: '0 0 0.5rem 0' }}>
                                                    {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                                                    {item.selectedSize && item.selectedColor && <span> | </span>}
                                                    {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                                                </p>
                                            )}
                                            <div className="cart-item-price">
                                                {item.isOffer && item.offerPrice ? (
                                                    <>
                                                        <span style={{ textDecoration: 'line-through', marginRight: '5px', fontSize: '0.9em', opacity: 0.7 }}>
                                                            ৳{convertPrice(item.price, i18n.language)}
                                                        </span>
                                                        <span style={{ color: 'var(--color-accent)' }}>
                                                            ৳{convertPrice(item.offerPrice, i18n.language)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span>৳{convertPrice(item.price, i18n.language)}</span>
                                                )}
                                            </div>
                                            <div className="cart-item-controls">
                                                <div className="qty-controls">
                                                    <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                                                </div>
                                                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="cart-footer">
                                {/* Promo Code Section */}
                                <div className="promo-section">
                                    {appliedPromo ? (
                                        <div className="applied-promo">
                                            <span>Code: <strong>{appliedPromo.code}</strong> applied!</span>
                                            <button onClick={removePromo} className="remove-promo-btn"><Trash2 size={14} /></button>
                                        </div>
                                    ) : (
                                        <div className="promo-input-group">
                                            <input
                                                type="text"
                                                placeholder="Promo Code"
                                                value={promoInput}
                                                onChange={(e) => setPromoInput(e.target.value)}
                                            />
                                            <button type="button" onClick={handleApplyPromo}>Apply</button>
                                        </div>
                                    )}
                                </div>

                                <div className="cart-total-row">
                                    <span>Subtotal</span>
                                    <span>৳{convertPrice(cartSubtotal, i18n.language)}</span>
                                </div>
                                {appliedPromo && (
                                    <div className="cart-total-row discount-row">
                                        <span>Discount</span>
                                        <span>- ৳{convertPrice(discountAmount, i18n.language)}</span>
                                    </div>
                                )}
                                <div className="cart-total-row final-total">
                                    <span>Total</span>
                                    <span>৳{convertPrice(cartTotal, i18n.language)}</span>
                                </div>
                                <p className="shipping-note">Shipping & taxes calculated at checkout</p>
                                <button className="btn btn-primary checkout-btn" onClick={() => {
                                    setIsCartOpen(false);
                                    navigate('/checkout');
                                }}>Checkout</button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
