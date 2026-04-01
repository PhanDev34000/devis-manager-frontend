export interface UserProfile {
  companyName?: string;
  representativeName?: string;
  address?: {
    street?: string;
    city?: string;
    zip?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  logo?: string;
}

export interface User {
  id: string;
  email: string;
  profile: UserProfile;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}