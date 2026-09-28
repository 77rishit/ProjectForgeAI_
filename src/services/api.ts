const BASE_URL = '/api';

interface RequestOptions extends RequestInit {
  data?: any;
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('projectforge_token');
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers
    };

    if (options.data) {
      config.body = JSON.stringify(options.data);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      // Automatic handling of expired or invalid sessions
      if (response.status === 401 && token) {
        console.warn(`[API Auth] 401 Unauthorized encountered on ${endpoint}. Session expired.`);
        localStorage.removeItem('projectforge_token');
        window.dispatchEvent(new CustomEvent('auth:expired', { detail: { endpoint } }));
      }

      if (!response.ok) {
        let errorMsg = data.message || `Request failed with status ${response.status}`;
        if (data.error) {
          if (typeof data.error === 'string') {
            errorMsg = data.error;
          } else if (typeof data.error === 'object') {
            const firstKey = Object.keys(data.error)[0];
            if (firstKey && data.error[firstKey]) {
              errorMsg = data.error[firstKey];
            }
          }
        }
        throw new Error(errorMsg);
      }

      // Merge data and data.data for seamless compatibility with ApiResponse wrapper
      if (
        data &&
        typeof data === 'object' &&
        'data' in data &&
        data.data !== null &&
        typeof data.data === 'object' &&
        !Array.isArray(data.data)
      ) {
        return {
          ...data,
          ...data.data
        } as T;
      }

      return data as T;
    } catch (error: any) {
      console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, error.message);
      throw error;
    }
  }

  get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', data });
  }

  put<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', data });
  }

  patch<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', data });
  }

  delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();

