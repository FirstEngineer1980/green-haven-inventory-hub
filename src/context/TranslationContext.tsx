
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '@/i18n/translations';
import { setDocumentLanguage } from '@/i18n/languageUtils';
import { config } from '@/config/config';
import { TranslationHook } from '@/i18n/types';

type Language = 'en' | 'ar';

// Export the context so it can be imported in other files
export const TranslationContext = createContext<TranslationHook | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  // Get stored language or default to English
  const getInitialLanguage = (): Language => {
    const storedLang = localStorage.getItem('language');
    return (storedLang === 'en' || storedLang === 'ar') ? storedLang : 'en';
  };

  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage);
  const supportedLanguages = ['en', 'ar'];

  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
    setDocumentLanguage(currentLanguage);
  }, [currentLanguage]);

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const changeLanguage = (lang: string) => {
    if (lang === 'en' || lang === 'ar') {
      setCurrentLanguage(lang);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let translated = translations[currentLanguage];
    
    for (const k of keys) {
      if (translated && typeof translated === 'object' && k in translated) {
        translated = translated[k] as any;
      } else {
        // Return the key itself if translation not found
        return key;
      }
    }
    
    return typeof translated === 'string' ? translated : key;
  };

  const contextValue: TranslationHook = {
    t,
    currentLanguage,
    toggleLanguage,
    changeLanguage,
    supportedLanguages
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationHook => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
