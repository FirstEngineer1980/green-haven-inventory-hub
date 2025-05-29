
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  role?: 'admin' | 'manager' | 'employee' | 'staff' | 'viewer';
  avatar?: string | null;
  timezone?: string;
  preferences?: Record<string, any> | null;
  is_active?: boolean;
  access_token?: string;
  last_login_at?: string | null;
  permissions?: string[];
}

export interface AuthResponse {
  user: User;
  message: string;
  access_token?: string;
  token?: string;
}

export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
}
