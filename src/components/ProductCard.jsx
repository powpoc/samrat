import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ProductModal from './ProductModal';
import { useTranslation } from 'react-i18next';
import { convertPrice } from '../utils/numberUtils';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { i18n } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className={`product-card ${product.festival ? 'festival-card' : ''} ${product.isOffer ? 'offer-card' : ''}`} onClick={() => setIsModalOpen(true)}>
                <div className="img-wrapper">
                    {product.festival && <span className="card-badge festival-badge">{product.festival}</span>}
                    {product.isOffer && <span className="card-badge offer-badge">Offer</span>}
                    <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
                    <button className="add-btn" onClick={(e) => {
                        e.stopPropagation();
                        setIsModalOpen(true);
                    }}>
                        <Plus size={20} />
                    </button>
                </div>
                <div className="card-info">
                    <h3 className="p-name">{product.name}</h3>
                    <span className="p-cat">{product.category}</span>
                    <div className="p-price">
                        {!!product.isOffer && product.offerPrice ? (
                            <>
                                <span style={{ textDecoration: 'line-through', marginRight: '8px', fontSize: '0.9em', opacity: 0.7 }}>
                                    ৳{convertPrice(product.price, i18n.language)}
                                </span>
                                <span style={{ color: 'var(--color-accent)' }}>
                                    ৳{convertPrice(product.offerPrice, i18n.language)}
                                </span>
                            </>
                        ) : (
                            <span>৳{convertPrice(product.price, i18n.language)}</span>
                        )}
                    </div>
                </div>
            </div>

            <ProductModal
                product={product}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default ProductCard;
