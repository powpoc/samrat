import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialData } from '../data';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('samrat_products');
        if (saved) {
            return JSON.parse(saved);
        }
        // Initialize with data.js but ensure new inventory structure exists if not present
        return initialData.map(p => ({
            ...p,
            // Default inventory structure if migrating from old data
            inventory: p.inventory || (p.colors || []).map(c => ({
                color: c,
                sizes: (p.sizes || []).reduce((acc, s) => ({ ...acc, [s]: 10 }), {}) // Default 10 stock per size
            }))
        }));
    });

    useEffect(() => {
        localStorage.setItem('samrat_products', JSON.stringify(products));
    }, [products]);

    const addProduct = (product) => {
        setProducts(prev => [...prev, { ...product, id: Date.now() }]);
    };

    const updateProduct = (id, updatedProduct) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };
    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('samrat_categories');
        return saved ? JSON.parse(saved) : ['Sherwani', 'Punjabi', 'Coaty'];
    });

    useEffect(() => {
        localStorage.setItem('samrat_categories', JSON.stringify(categories));
    }, [categories]);

    const addCategory = (category) => {
        if (!categories.includes(category)) {
            setCategories([...categories, category]);
        }
    };

    const deleteCategory = (category) => {
        setCategories(prev => prev.filter(c => c !== category));
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, categories, addCategory, deleteCategory }}>
            {children}
        </ProductContext.Provider>
    );
};
