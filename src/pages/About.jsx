import React from 'react';
import { useTranslation } from 'react-i18next';
import './About.css';

const About = () => {
    const { t } = useTranslation();
    return (
        <div className="about-page">
            <div className="about-header border-b">
                <h1>{t('story.title')}</h1>
            </div>
            <div className="about-grid container">
                <div className="about-text section">
                    <h2>{t('story.heading')}</h2>
                    <p>
                        {t('story.p1')}
                    </p>
                    <p>
                        {t('story.p2')}
                    </p>
                </div>
                <div className="about-img border-l border-r">
                    <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000" alt="Attitude" />
                </div>
            </div>
        </div>
    );
};

export default About;
