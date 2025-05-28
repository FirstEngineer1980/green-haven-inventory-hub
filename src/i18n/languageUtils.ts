
import { config } from "../config/config";

/**
 * Gets the current language from URL parameters
 * @returns The detected language code, or default language if not found
 */
export const getLanguageFromUrl = (): string => {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get("lang");
  
  if (langParam && config.supportedLanguages.includes(langParam)) {
    return langParam;
  }
  
  return config.defaultLanguage;
};

/**
 * Updates the document's direction and language attributes
 * @param language The language code to set
 */
export const setDocumentLanguage = (language: string): void => {
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = language;
  
  // Add or remove RTL class to body
  if (language === "ar") {
    document.body.classList.add("rtl");
  } else {
    document.body.classList.remove("rtl");
  }
};

/**
 * Updates the URL with the language parameter without page refresh
 * @param language The language code to set in URL
 */
export const updateUrlLanguage = (language: string): void => {
  // Check if language is supported
  const supportedLangs = ["en", "ar"]; // Fallback list of supported languages
  if (!supportedLangs.includes(language)) return;
  
  const url = new URL(window.location.href);
  url.searchParams.set("lang", language);
  window.history.pushState({}, "", url.toString());
};

/**
 * Adds language parameter to a given URL/path
 * @param path The URL or path to add language parameter to
 * @param language The language code to add
 * @returns The URL with language parameter
 */
export const addLanguageToPath = (path: string, language: string): string => {
  // If path already contains query params
  if (path.includes('?')) {
    const url = new URL(path, window.location.origin);
    url.searchParams.set("lang", language);
    return url.pathname + url.search;
  } 
  // If no query params yet
  return `${path}?lang=${language}`;
};
