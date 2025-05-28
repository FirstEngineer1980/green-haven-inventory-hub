
export interface TranslationHook {
  /**
   * Translation function to get translated string by key
   */
  t: (key: string) => string;
  
  /**
   * Current active language
   */
  currentLanguage: string;
  
  /**
   * Function to change the active language
   */
  changeLanguage: (lang: string) => void;
  
  /**
   * List of supported languages
   */
  supportedLanguages: string[];

  /**
   * Function to toggle between available languages
   */
  toggleLanguage: () => void;
}
