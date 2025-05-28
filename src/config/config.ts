
/**
 * Application configuration
 */
export const config = {
  // Supported languages in the application
  supportedLanguages: ['en', 'ar'],
  
  // Default language if none specified
  defaultLanguage: 'en',
  
  // API base URL
  apiUrl: import.meta.env.VITE_API_URL || '/api',
};
