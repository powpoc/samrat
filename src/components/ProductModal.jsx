import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import { convertPrice } from '../utils/numberUtils';
import './ProductModal.css';

const ProductModal = ({ product, isOpen, onClose }) => {
    const { addToCart } = useCart();
    const { i18n } = useTranslation();
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [activeImage, setActiveImage] = useState(null);

    // Reset size if it becomes unavailable when switching colros
    React.useEffect(() => {
        if (selectedColor && selectedSize) {
            const isAvailable = checkSizeAvailability(selectedSize);
            if (!isAvailable) {
                setSelectedSize('');
            }
        }
    }, [selectedColor]);

    // Inventory Helpers
    const checkColorAvailability = (color) => {
        if (!product.inventory || product.inventory.length === 0) return true; // Fallback
        const item = product.inventory.find(i => i.color === color);
        if (!item) return false;
        return Object.values(item.sizes).some(qty => qty > 0);
    };

    const checkSizeAvailability = (size) => {
        if (!product.inventory || product.inventory.length === 0) return true;

        if (selectedColor) {
            const item = product.inventory.find(i => i.color === selectedColor);
            return item && (item.sizes[size] || 0) > 0;
        }

        // If no color selected, check if *any* color has this size
        return product.inventory.some(item => (item.sizes[size] || 0) > 0);
    };

    if (!isOpen || !product) return null;

    // Handling Image Gallery
    // If product has 'images' array, use it. Else fallback to single 'image' in an array.
    const galleryImages = product.images && product.images.length > 0
        ? product.images
        : [product.image];

    const currentImage = activeImage || galleryImages[0];

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            alert('Please select both a size and a color.');
            return;
        }

        // Final Validation
        if (!checkSizeAvailability(selectedSize) || !checkColorAvailability(selectedColor)) {
            alert('Selected combination is not available.');
            return;
        }

        // Find max stock for this specific variant
        let maxStock = 10; // Default if no inventory tracking
        if (product.inventory && product.inventory.length > 0) {
            const invItem = product.inventory.find(i => i.color === selectedColor);
            if (invItem && invItem.sizes[selectedSize]) {
                maxStock = invItem.sizes[selectedSize];
            }
        }

        const variantProduct = {
            ...product,
            id: `${product.id}-${selectedSize}-${selectedColor}`,
            variantName: `${product.name} (${selectedSize}, ${selectedColor})`,
            selectedSize,
            selectedColor,
            maxStock
        };

        addToCart(variantProduct);
        onClose();
        setSelectedSize('');
        setSelectedColor('');
        setActiveImage(null);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="product-floater glass-panel"
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    >
                        <button className="close-modal-btn" onClick={onClose}><X size={24} /></button>

                        <div className="floater-content">
                            {/* IMAGE GALLERY SECTION */}
                            <div className="floater-gallery-box">
                                <div className="main-image-frame">
                                    <img src={currentImage} alt={product.name} />
                                </div>
                                {/* Thumbnails */}
                                {galleryImages.length > 1 && (
                                    <div className="thumbnails-row">
                                        {galleryImages.map((img, idx) => (
                                            <button
                                                key={idx}
                                                className={`thumb-btn ${currentImage === img ? 'active' : ''}`}
                                                onClick={() => setActiveImage(img)}
                                            >
                                                <img src={img} alt={`View ${idx + 1}`} />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="floater-details">
                                <div className="floater-header">
                                    <h3 style={{ marginBottom: '0.2rem' }}>{product.name}</h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                        SKU: {product.sku || `SMT-${String(product.id).padStart(3, '0')}`}
                                    </span>
                                </div>

                                <p className="floater-desc">{product.description}</p>

                                <div className="floater-selectors">
                                    <div className="selector-group">
                                        <label>Color</label>
                                        <div className="option-row">
                                            {product.colors.map(color => {
                                                const colorMap = {
                                                    "Gold": "#FFD700", "Cream": "#FFFDD0", "Ivory": "#FFFFF0",
                                                    "White": "#FFFFFF", "Off-White": "#F8F8F8", "Midnight Blue": "#191970",
                                                    "Black": "#000000", "Beige": "#F5F5DC", "Pale Pink": "#FFD1DC",
                                                    "Maroon": "#800000", "Wine": "#722F37", "Tan": "#D2B48C",
                                                    "Grey": "#808080", "Emerald": "#50C878", "Teal": "#008080"
                                                };
                                                const bg = colorMap[color] || color;
                                                const isAvailable = checkColorAvailability(color);
                                                return (
                                                    <button
                                                        key={color}
                                                        className={`option-btn color-btn ${selectedColor === color ? 'active' : ''}`}
                                                        onClick={() => isAvailable && setSelectedColor(color)}
                                                        disabled={!isAvailable}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            opacity: isAvailable ? 1 : 0.4,
                                                            cursor: isAvailable ? 'pointer' : 'not-allowed'
                                                        }}
                                                    >
                                                        <span
                                                            className="color-swatch"
                                                            style={{
                                                                backgroundColor: bg,
                                                                width: '12px',
                                                                height: '12px',
                                                                borderRadius: '50%',
                                                                border: '1px solid rgba(0,0,0,0.1)',
                                                                display: 'inline-block'
                                                            }}
                                                        />
                                                        {color}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="selector-group">
                                        <label>Size</label>
                                        <div className="option-row">
                                            {product.sizes.map(size => {
                                                const isAvailable = checkSizeAvailability(size);
                                                return (
                                                    <button
                                                        key={size}
                                                        className={`option-btn ${selectedSize === size ? 'active' : ''}`}
                                                        onClick={() => isAvailable && setSelectedSize(size)}
                                                        disabled={!isAvailable}
                                                        style={{
                                                            opacity: isAvailable ? 1 : 0.4,
                                                            cursor: isAvailable ? 'pointer' : 'not-allowed',
                                                            // Optional: strikethrough for out of stock?
                                                            textDecoration: isAvailable ? 'none' : 'line-through'
                                                        }}
                                                    >
                                                        {size}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div className="price-display-large" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {product.isOffer && product.offerPrice ? (
                                            <>
                                                <span style={{ fontSize: '1.5rem', textDecoration: 'line-through', opacity: 0.6, color: 'var(--color-text-main)' }}>
                                                    ৳{convertPrice(product.price, i18n.language)}
                                                </span>
                                                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                                                    ৳{convertPrice(product.offerPrice, i18n.language)}
                                                </span>
                                            </>
                                        ) : (
                                            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                                                ৳{convertPrice(product.price, i18n.language)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    className="btn-add-floater"
                                    onClick={handleAddToCart}
                                    disabled={!selectedSize || !selectedColor}
                                    style={{
                                        opacity: (!selectedSize || !selectedColor) ? 0.5 : 1,
                                        cursor: (!selectedSize || !selectedColor) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <span>Add to Bag</span>
                                    <ShoppingBag size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProductModal;
