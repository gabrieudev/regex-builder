export {};

declare global {
  export type AuthProvider = "local" | "google" | "github";

  export interface LoginRequest {
    email: string;
    password: string;
  }

  export interface SignupRequest {
    name: string;
    email: string;
    password: string;
  }

  export interface AuthResponse {
    accessToken: string;
    tokenType: string;
  }

  export interface ApiError {
    message: string;
    status?: number;
  }

  export interface User {
    id?: number;
    name: string;
    email: string;
    imageUrl?: string;
    emailVerified: boolean;
    password?: string;
    provider: AuthProvider;
    providerId?: string;
    emailVerificationToken?: string;
    emailVerificationTokenExpiry?: string;
  }
}
