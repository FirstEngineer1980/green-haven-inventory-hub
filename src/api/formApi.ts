
// Re-export everything from the individual files for backward compatibility
export * from './types/formTypes';
export * from './services/formService';
export * from './hooks/useFormQueries';

// Add explicit exports of renamed functions for backward compatibility
import { getAllForms, getFormResponse, getFormResponses } from './services/formService';
export const fetchForms = getAllForms;
export const fetchFormResponseDetails = getFormResponse;
export const fetchFormResponses = getFormResponses;
