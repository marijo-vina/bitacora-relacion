export interface User {
  id: number;
  name: string;
  email: string;
  profile_photo_url: string | null;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
