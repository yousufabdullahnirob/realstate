// Use relative URL so Vite dev proxy handles routing — avoids CORS issues
// Use environment variable for production, fallback to current localhost for development
const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const getHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  
  const token = localStorage.getItem('access');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('user');
      // Redirect to login if not already there to prevent loops
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || JSON.stringify(errorData) || `HTTP error! status: ${response.status}`);
  }
  if (response.status === 204) return null;
  return await response.json();
};

const apiCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const apiProxy = {
  get: async (endpoint, options = { bypassCache: false }) => {
    if (!options.bypassCache && apiCache.has(endpoint)) {
      const { data, timestamp } = apiCache.get(endpoint);
      if (Date.now() - timestamp < CACHE_TTL_MS) {
        return data; // Return cached response
      } else {
        apiCache.delete(endpoint); // Cache expired
      }
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, { headers: getHeaders() });
      const data = await handleResponse(response);
      
      if (!options.bypassCache) {
        apiCache.set(endpoint, { data, timestamp: Date.now() });
      }
      return data;
    } catch (error) {
      console.error(`[Proxy] GET Error (${endpoint}):`, error);
      throw error;
    }
  },

  post: async (endpoint, payload = {}) => {
    const isFormData = payload instanceof FormData;
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(!isFormData),
        body: isFormData ? payload : JSON.stringify(payload),
      });
      const data = await handleResponse(response);
      apiCache.clear(); // Invalidate cache on change
      return data;
    } catch (error) {
      console.error(`[Proxy] POST Error (${endpoint}):`, error);
      throw error;
    }
  },

  patch: async (endpoint, payload = {}) => {
    const isFormData = payload instanceof FormData;
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: getHeaders(!isFormData),
        body: isFormData ? payload : JSON.stringify(payload),
      });
      const data = await handleResponse(response);
      apiCache.clear(); // Invalidate cache on change
      return data;
    } catch (error) {
      console.error(`[Proxy] PATCH Error (${endpoint}):`, error);
      throw error;
    }
  },

  put: async (endpoint, payload = {}) => {
    const isFormData = payload instanceof FormData;
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(!isFormData),
        body: isFormData ? payload : JSON.stringify(payload),
      });
      const data = await handleResponse(response);
      apiCache.clear(); // Invalidate cache on change
      return data;
    } catch (error) {
      console.error(`[Proxy] PUT Error (${endpoint}):`, error);
      throw error;
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await handleResponse(response);
      apiCache.clear(); // Invalidate cache on change
      return data;
    } catch (error) {
      console.error(`[Proxy] DELETE Error (${endpoint}):`, error);
      throw error;
    }
  },

  download: async (endpoint, filename = 'download.csv') => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`[Proxy] Download Error (${endpoint}):`, error);
      throw error;
    }
  },
};

export default apiProxy;
