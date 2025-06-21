const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export class ApiClient {
  private baseURL: string;
  private static instance: ApiClient;

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    if (config.body instanceof FormData) {
      delete (config.headers as Record<string, string>)['Content-Type'];
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        if (errorData.errors) {
            const errorDetails = Object.values(errorData.errors).flat().join(' ');
            errorMessage += ` (${errorDetails})`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  public setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  public removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async getBlob(endpoint: string): Promise<Blob> {
    const token = this.getAuthToken();
    const config: RequestInit = {
      method: 'GET',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
      if (errorData.errors) {
          const errorDetails = Object.values(errorData.errors).flat().join(' ');
          errorMessage += ` (${errorDetails})`;
      }
      throw new Error(errorMessage);
    }

    return response.blob();
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
      ...options,
      headers: {
        ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        'Accept': 'application/json',
        ...options?.headers,
      },
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
      ...options,
      headers: {
        ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        'Accept': 'application/json',
        ...options?.headers,
      },
    });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
      ...options,
      headers: {
        ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        'Accept': 'application/json',
        ...options?.headers,
      },
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = ApiClient.getInstance();