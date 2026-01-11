import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useSite } from '../context/SiteContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, User, Truck, CheckCircle } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
    const { cart, cartTotal, cartSubtotal, discountAmount, appliedPromo } = useCart();
    const { whatsappNumber } = useSite();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem('samrat_checkout_info');
        return saved ? JSON.parse(saved) : {
            name: '',
            phone: '',
            altPhone: '',
            address: '',
            city: '',
            note: ''
        };
    });

    useEffect(() => {
        localStorage.setItem('samrat_checkout_info', JSON.stringify(formData));
    }, [formData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty!");
            navigate('/shop');
            return;
        }

        if (!whatsappNumber) {
            alert("Order service is currently unavailable. Please contact support.");
            return;
        }

        // formatting the order for WhatsApp
        let message = `*New Order from Website* 🛍️\n\n`;
        message += `*Customer Details:*\n`;
        message += `👤 Name: ${formData.name}\n`;
        message += `📞 Phone: ${formData.phone}\n`;
        if (formData.altPhone) message += `📞 Alt Phone: ${formData.altPhone}\n`;
        message += `📍 Address: ${formData.address}, ${formData.city}\n`;
        if (formData.note) message += `📝 Note: ${formData.note}\n\n`;

        message += `*Order Summary:*\n`;
        cart.forEach(item => {
            message += `▪️ ${item.name} (x${item.quantity}) - ${item.selectedSize ? `Size: ${item.selectedSize}` : ''} ${item.selectedColor ? `Color: ${item.selectedColor}` : ''}\n`;
        });

        message += `\n----------------------------\n`;
        message += `💰 Subtotal: ৳${cartSubtotal}\n`;
        if (discountAmount > 0) message += `🏷️ Discount: -৳${discountAmount}\n`;
        message += `🚚 Delivery: Cash on Delivery\n`;
        message += `*💵 Total Payable: ৳${cartTotal}*\n`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    };

    if (cart.length === 0) {
        return (
            <div className="checkout-empty container">
                <h2>Your cart is empty</h2>
                <button className="btn btn-primary" onClick={() => navigate('/shop')}>Go to Shop</button>
            </div>
        );
    }

    return (
        <div className="checkout-page container">
            <h1 className="checkout-title">Checkout</h1>
            <div className="checkout-grid">
                {/* Information Form */}
                <div className="checkout-form-section">
                    <div className="section-header">
                        <User size={20} /> <h2>Contact Information</h2>
                    </div>

                    <form id="checkout-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Sultan Ahmed"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="e.g. 017..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Alternative Phone (Optional)</label>
                                <input
                                    type="tel"
                                    name="altPhone"
                                    value={formData.altPhone}
                                    onChange={handleChange}
                                    placeholder="e.g. 018..."
                                />
                            </div>
                        </div>

                        <div className="section-header mt-4">
                            <MapPin size={20} /> <h2>Delivery Details</h2>
                        </div>

                        <div className="form-group">
                            <label>Full Address *</label>
                            <textarea
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="House no, Street, Area..."
                                rows="3"
                            ></textarea>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City / Zone *</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="e.g. Dhaka"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Order Notes (Optional)</label>
                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                placeholder="Special delivery instructions..."
                                rows="2"
                            ></textarea>
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="checkout-summary-section">
                    <div className="summary-card">
                        <h3>Order Summary</h3>
                        <div className="summary-items">
                            {cart.map(item => (
                                <div key={item.id} className="summary-item">
                                    <div className="item-img">
                                        <img src={item.image} alt={item.name} />
                                        <span className="item-qty">{item.quantity}</span>
                                    </div>
                                    <div className="item-info">
                                        <h4>{item.name}</h4>
                                        <p>{item.selectedSize} {item.selectedColor ? `/ ${item.selectedColor}` : ''}</p>
                                    </div>
                                    <div className="item-price">
                                        ৳{item.isOffer ? item.offerPrice * item.quantity : item.price * item.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="summary-pricing">
                            <div className="price-row">
                                <span>Subtotal</span>
                                <span>৳{cartSubtotal}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="price-row discount">
                                    <span>Discount ({appliedPromo?.code})</span>
                                    <span>- ৳{discountAmount}</span>
                                </div>
                            )}
                            <div className="price-row">
                                <span>Shipping</span>
                                <span>TBD</span>
                            </div>
                            <small style={{ display: 'block', marginBottom: '1rem', color: '#666' }}>*Shipping charges will be confirmed upon confirmation.</small>
                            <div className="price-row total">
                                <span>Total</span>
                                <span>৳{cartTotal}</span>
                            </div>
                        </div>

                        <div className="payment-method">
                            <h4>Payment Method</h4>
                            <div className="payment-option selected">
                                <div className="radio-circle"><div className="inner-circle"></div></div>
                                <div className="pay-text">
                                    <span className="pay-title"><Truck size={16} /> Cash on Delivery</span>
                                    <span className="pay-desc">Pay with cash upon delivery.</span>
                                </div>
                            </div>
                        </div>

                        <button form="checkout-form" type="submit" className="btn btn-primary btn-lg btn-block order-btn">
                            Confirm Order on WhatsApp <CheckCircle size={18} style={{ marginLeft: '8px' }} />
                        </button>
                        <p className="secure-text">🔒 Secure Checkout via WhatsApp</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
