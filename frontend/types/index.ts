export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'engineer' | 'viewer';
  subscription: 'free_trial' | 'professional' | 'enterprise';
  subscription_expires_at: string | null;
  is_active: number;
  created_at: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  name: string;
  type: 'residential' | 'commercial' | 'infrastructure' | 'other';
  description: string;
  creator_id: number;
  creator_name: string;
  creator_email: string;
  created_at: string;
  updated_at: string;
}

export interface LoginLog {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  ip_address: string;
  user_agent: string;
  action: string;
  logged_in_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AdminStats {
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalProjects: number;
    usersByRole: { role: string; count: number }[];
    usersBySubscription: { subscription: string; count: number }[];
  };
  recentLogins: LoginLog[];
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: { field: string; message: string }[];
}
