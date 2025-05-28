
// Type for translations
export type TranslationRecord = Record<string, string>;

// Import translations directly from the languages index
import languages from './languages';

// Available translations
export const translations: Record<string, TranslationRecord> = languages;
