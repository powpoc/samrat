import React, { createContext, useContext, useState, useEffect } from 'react';

const FestivalContext = createContext();

export const useFestivals = () => useContext(FestivalContext);

export const FestivalProvider = ({ children }) => {
    const [festivals, setFestivals] = useState(() => {
        const saved = localStorage.getItem('samrat_festivals');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('samrat_festivals', JSON.stringify(festivals));
    }, [festivals]);

    const addFestival = (name, image) => {
        if (!festivals.some(f => f.name.toLowerCase() === name.toLowerCase())) {
            setFestivals([...festivals, { id: Date.now(), name, image, isActive: true }]);
        }
    };

    const updateFestival = (id, updatedData) => {
        setFestivals(festivals.map(f => f.id === id ? { ...f, ...updatedData } : f));
    };

    const removeFestival = (id) => {
        setFestivals(festivals.filter(f => f.id !== id));
    };

    const toggleFestivalStatus = (id) => {
        setFestivals(festivals.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f));
    };

    return (
        <FestivalContext.Provider value={{ festivals, addFestival, updateFestival, removeFestival, toggleFestivalStatus }}>
            {children}
        </FestivalContext.Provider>
    );
};
