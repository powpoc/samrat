import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [appliedPromo, setAppliedPromo] = useState(null);

    // Load cart from local storage on init
    useEffect(() => {
        const savedCart = localStorage.getItem('samrat-cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('samrat-cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                const max = existing.maxStock || 10; // Default limit if not set
                if (existing.quantity >= max) {
                    alert(`Sorry, only ${max} items available in stock.`);
                    return prev;
                }
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                const max = item.maxStock || 10;

                if (newQty > max) {
                    alert(`Sorry, max ${max} items available.`);
                    return item;
                }

                return { ...item, quantity: Math.max(1, newQty) };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCart([]);
        setAppliedPromo(null);
    };

    const applyPromo = (promo) => {
        setAppliedPromo(promo);
    };

    const removePromo = () => {
        setAppliedPromo(null);
    };

    const cartSubtotal = cart.reduce((acc, item) => {
        const price = (item.isOffer && item.offerPrice) ? Number(item.offerPrice) : Number(item.price);
        return acc + (price * item.quantity);
    }, 0);

    let discountAmount = 0;
    if (appliedPromo) {
        if (appliedPromo.type === 'percent') {
            discountAmount = (cartSubtotal * appliedPromo.value) / 100;
        } else if (appliedPromo.type === 'fixed') {
            discountAmount = appliedPromo.value;
        }
    }
    // Ensure discount doesn't exceed total
    discountAmount = Math.min(discountAmount, cartSubtotal);

    const cartTotal = cartSubtotal - discountAmount;

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isCartOpen,
            setIsCartOpen,
            cartTotal,
            cartSubtotal,
            discountAmount,
            appliedPromo,
            applyPromo,
            removePromo,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
