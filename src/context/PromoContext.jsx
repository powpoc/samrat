import React, { createContext, useContext, useState, useEffect } from 'react';

const PromoContext = createContext();

export const usePromo = () => useContext(PromoContext);

export const PromoProvider = ({ children }) => {
    const [promoCodes, setPromoCodes] = useState([]);

    // Load from local storage
    useEffect(() => {
        const savedCodes = localStorage.getItem('samrat-promos');
        if (savedCodes) {
            const parsed = JSON.parse(savedCodes);
            if (parsed.length > 0) {
                setPromoCodes(parsed);
                return;
            }
        }

        // Default demo codes
        setPromoCodes([
            { code: 'SAVE10', type: 'percent', value: 10 },
            { code: 'FLAT500', type: 'fixed', value: 500 }
        ]);
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('samrat-promos', JSON.stringify(promoCodes));
    }, [promoCodes]);

    const addPromoCode = (newCode) => {
        if (promoCodes.some(p => p.code === newCode.code)) {
            alert('Promo code already exists!');
            return;
        }
        setPromoCodes([...promoCodes, newCode]);
    };

    const removePromoCode = (codeToRemove) => {
        setPromoCodes(promoCodes.filter(p => p.code !== codeToRemove));
    };

    const getPromo = (code) => {
        return promoCodes.find(p => p.code.toUpperCase() === code.toUpperCase());
    };

    return (
        <PromoContext.Provider value={{ promoCodes, addPromoCode, removePromoCode, getPromo }}>
            {children}
        </PromoContext.Provider>
    );
};
