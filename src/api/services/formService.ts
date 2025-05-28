
import { Form, FormElement, FormResponse, FormStatus, QuestionType, FormResponsesResponse } from '../types/formTypes';
import { API_URL } from './config';
import { getAuthHeaders } from './authService';

/**
 * Fetch all forms
 */
export const getAllForms = async (): Promise<{
  data: Form[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}> => {
  console.log('Fetching forms from API:', `${API_URL}/forms`);
  
  try {
    const response = await fetch(`${API_URL}/forms`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch forms: ${response.status}`);
    }

    const data = await response.json();
    console.log('Forms fetched successfully:', data);
    
    return {
      data: data.data || [],
      meta: {
        current_page: data.current_page || 1,
        last_page: data.last_page || 1,
        total: data.total || 0,
      }
    };
  } catch (error) {
    console.error('Error fetching forms:', error);
    throw error;
  }
};

/**
 * Fetch a single form by ID
 */
export const getFormById = async (id: number): Promise<Form> => {
  try {
    const response = await fetch(`${API_URL}/forms/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch form: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching form:', error);
    throw error;
  }
};

// Add alias for getForm to support existing code
export const getForm = getFormById;

/**
 * Fetch a single form by slug
 */
export const getFormBySlug = async (slug: string): Promise<Form> => {
  try {
    const response = await fetch(`${API_URL}/forms/by-slug/${slug}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch form: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching form:', error);
    throw error;
  }
};

/**
 * Create a new form
 */
export const createForm = async (form: Omit<Form, 'id' | 'created_at' | 'updated_at'>): Promise<Form> => {
  try {
    const response = await fetch(`${API_URL}/forms`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      throw new Error(`Failed to create form: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating form:', error);
    throw error;
  }
};

/**
 * Update an existing form
 */
export const updateForm = async (id: number, form: Partial<Omit<Form, 'id' | 'created_at' | 'updated_at'>>): Promise<Form> => {
  try {
    const response = await fetch(`${API_URL}/forms/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      throw new Error(`Failed to update form: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating form:', error);
    throw error;
  }
};

/**
 * Delete a form
 */
export const deleteForm = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/forms/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete form: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting form:', error);
    throw error;
  }
};

/**
 * Toggle the publish status of a form
 */
export const togglePublishForm = async (id: number): Promise<Form> => {
  try {
    const response = await fetch(`${API_URL}/forms/${id}/toggle-publish`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle publish status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error toggling publish status:', error);
    throw error;
  }
};

/**
 * Update the status of a form
 */
export const updateFormStatus = async (id: number, status: FormStatus): Promise<Form> => {
  try {
    const response = await fetch(`${API_URL}/forms/${id}/status`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update form status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating form status:', error);
    throw error;
  }
};

/**
 * Get analytics for a form
 */
export const getFormAnalytics = async (id: number): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/forms/${id}/analytics`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to get form analytics: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting form analytics:', error);
    throw error;
  }
};

/**
 * Fetch all elements for a form
 */
export const getFormElements = async (formId: number): Promise<FormElement[]> => {
  try {
    const response = await fetch(`${API_URL}/forms/${formId}/elements`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch form elements: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching form elements:', error);
    throw error;
  }
};

/**
 * Create a new element for a form
 */
export const createFormElement = async (formId: number, element: Omit<FormElement, 'id' | 'created_at' | 'updated_at' | 'form_id'>): Promise<FormElement> => {
  try {
    const response = await fetch(`${API_URL}/forms/${formId}/elements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(element),
    });

    if (!response.ok) {
      throw new Error(`Failed to create form element: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating form element:', error);
    throw error;
  }
};

/**
 * Update an existing element for a form
 */
export const updateFormElement = async (formId: number, elementId: number, element: Partial<Omit<FormElement, 'id' | 'created_at' | 'updated_at' | 'form_id'>>): Promise<FormElement> => {
  try {
    const response = await fetch(`${API_URL}/forms/${formId}/elements/${elementId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(element),
    });

    if (!response.ok) {
      throw new Error(`Failed to update form element: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating form element:', error);
    throw error;
  }
};

/**
 * Delete an element from a form
 */
export const deleteFormElement = async (formId: number, elementId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/forms/${formId}/elements/${elementId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete form element: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting form element:', error);
    throw error;
  }
};

/**
 * Reorder elements for a form
 */
export const reorderFormElements = async (formId: number, elementIds: number[]): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/forms/${formId}/elements/reorder`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ elementIds }),
    });

    if (!response.ok) {
      throw new Error(`Failed to reorder form elements: ${response.status}`);
    }
  } catch (error) {
    console.error('Error reordering form elements:', error);
    throw error;
  }
};

/**
 * Submit a form response
 */
export const submitFormResponse = async (slug: string, responseData: Record<string, any>): Promise<FormResponse> => {
  try {
    const response = await fetch(`${API_URL}/forms/${slug}/responses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(responseData),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit form response: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting form response:', error);
    throw error;
  }
};

/**
 * Fetch all responses for a form
 */
export const getFormResponses = async (formId: number): Promise<FormResponsesResponse> => {
  try {
    const response = await fetch(`${API_URL}/forms/${formId}/responses`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch form responses: ${response.status}`);
    }

    const data = await response.json();
    console.log('Form responses data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching form responses:', error);
    throw error;
  }
};

/**
 * Fetch a single response for a form
 */
export const getFormResponse = async (formId: number, responseId: number): Promise<FormResponse> => {
  try {
    console.log(`Fetching form response: ${formId}/${responseId}`);
    const response = await fetch(`${API_URL}/forms/${formId}/responses/${responseId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Response error (${response.status}):`, errorText);
      throw new Error(`Failed to fetch form response: ${response.status}`);
    }

    const data = await response.json();
    console.log('Successfully fetched response data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching form response:', error);
    throw error;
  }
};

/**
 * Delete a response from a form
 */
export const deleteFormResponse = async (formId: number, responseId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/forms/${formId}/responses/${responseId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete form response: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting form response:', error);
    throw error;
  }
};

/**
 * Export responses for a form
 */
export const exportFormResponses = async (formId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/forms/${formId}/responses/export`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to export form responses: ${response.status}`);
    }

    // Trigger download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form_${formId}_responses.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting form responses:', error);
    throw error;
  }
};

/**
 * Get statistics for form responses
 */
export const getFormResponseStatistics = async (formId: number): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/forms/${formId}/responses/statistics`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to get form response statistics: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting form response statistics:', error);
    throw error;
  }
};

/**
 * Fetch all question types
 */
export const getAllQuestionTypes = async (): Promise<QuestionType[]> => {
  try {
    const response = await fetch(`${API_URL}/question-types`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch question types: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching question types:', error);
    throw error;
  }
};
