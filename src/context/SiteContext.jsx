import React, { createContext, useContext, useState, useEffect } from 'react';

const SiteContext = createContext();

export const useSite = () => useContext(SiteContext);

export const SiteProvider = ({ children }) => {
    const [heroImage, setHeroImage] = useState(() => {
        return localStorage.getItem('samrat_hero_image') || '';
    });

    const [whatsappNumber, setWhatsappNumber] = useState(() => {
        return localStorage.getItem('samrat_whatsapp') || '';
    });

    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

    const updateHeroImage = (image) => {
        setHeroImage(image);
        localStorage.setItem('samrat_hero_image', image);
    };

    const updateWhatsappNumber = (number) => {
        setWhatsappNumber(number);
        localStorage.setItem('samrat_whatsapp', number);
    };

    const toggleMaintenanceMode = (status) => {
        setIsMaintenanceMode(status);
        localStorage.setItem('samrat_maintenance', status);
    };

    return (
        <SiteContext.Provider value={{ heroImage, updateHeroImage, whatsappNumber, updateWhatsappNumber, isMaintenanceMode, toggleMaintenanceMode }}>
            {children}
        </SiteContext.Provider>
    );
};
