export interface Form {
  id: number;
  user_id: number | null;
  title: string;
  description: string | null;
  slug: string;
  status: string;
  created_at: string;
  updated_at: string;
  form_elements?: FormElement[];
  elements?: FormElementTypes[];
  status_label?: string;
  is_published?: boolean;
  responses_count?: number;
  collect_email?: boolean;
  one_response_per_user?: boolean;
  show_progress_bar?: boolean;
  shuffle_questions?: boolean;
  is_paused?: boolean;
  theme?: string;
}

// This was missing and needed for the FormDetail page
export interface FormWithElements extends Form {
  elements: FormElementTypes[];
}

export interface FormElement {
  id: number;
  form_id: number;
  question: string;
  type: string;
  options: string[] | null;
  required: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  // Additional fields needed by the implementation
  placeholder?: string;
  default_value?: string | null;
  defaultValue?: string | null;
  label?: string;
  description?: string;
  element_id?: string;
  confirm_email?: boolean;
  max_stars?: number;
  address_expanded?: boolean;
  address_street1?: boolean;
  address_street2?: boolean;
  address_city?: boolean;
  address_state?: boolean;
  address_zipcode?: boolean;
  address_country?: boolean;
  default_country?: string;
  allowed_countries?: string[];
  conditional_logic_enabled?: boolean;
  conditional_action?: string;
  conditional_logic_gate?: string;
  properties?: any;
  conditionalLogic?: {
    enabled: boolean;
    action: 'show' | 'hide';
    conditions: any[];
    logicGate: 'all' | 'any';
  };
}

export type QuestionType = 
  | 'text'
  | 'paragraph'
  | 'number'
  | 'email'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'face'
  | 'star'
  | 'phone'
  | 'address'
  | 'section'
  | 'break';

export interface FormStatus {
  DRAFT: string;
  PUBLISHED: string;
  ARCHIVED: string;
}

export interface FormAnswer {
  id: number;
  form_response_id: number;
  form_element_id: number;
  answer: string;
  value?: string; // Added to match implementation
  question?: string;
  formElement?: FormElement;
}

export interface FormResponse {
  id: number;
  form_id: number;
  user_id: number | null;
  respondent_email?: string;
  ip_address?: string;
  location?: any;
  user_agent?: string;
  completion_time?: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  answers?: FormAnswer[];
  form?: Form;
}

// Add missing response interfaces for pagination
export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface FormsResponse {
  data: Array<{
    id: number;
    title: string;
    description: string;
    slug: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    responses_count: number;
  }>;
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface FormResponsesResponse {
  data: FormResponse[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface FormResponseWithAnswers extends FormResponse {
  answers: FormAnswer[];
  form?: Form;
}

// Make the ConditionOperator type definition match the one in the formBuilder file
export type ConditionOperator = 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than';

export interface Condition {
  questionId: string;
  operator: ConditionOperator;
  value: string;
}

// Type definitions that match the implementation in src/types/formBuilder.ts
export interface FormElementTypes {
  id: string;
  type: QuestionType;
  label: string;
  required: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  maxStars?: number;
  confirmEmail?: boolean;
  conditionalLogic?: {
    enabled: boolean;
    action: 'show' | 'hide';
    conditions: Condition[];
    logicGate: 'all' | 'any';
  };
  description?: string;
  expanded?: boolean;
  fields?: {
    street1: boolean;
    street2: boolean;
    city: boolean;
    state: boolean;
    zipCode: boolean;
    country: boolean;
  };
  allowedCountries?: string[];
  defaultCountry?: string;
  order?: number;
  element_id?: string;
}

export interface FormData {
  title: string;
  description: string;
  elements: FormElementTypes[];
}
