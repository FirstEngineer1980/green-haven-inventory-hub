
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  role?: string;
  avatar?: string | null;
  timezone?: string;
  preferences?: Record<string, any> | null;
  is_active?: boolean;
  access_token?: string;
  last_login_at?: string | null;
}

export interface AuthResponse {
  user: User;
  message: string;
  access_token?: string;
}

export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
}
