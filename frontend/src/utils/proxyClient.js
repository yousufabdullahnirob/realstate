const BASE_URL = 'http://127.0.0.1:8000/api';

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
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
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || JSON.stringify(errorData) || `HTTP error! status: ${response.status}`);
  }
  if (response.status === 204) return null;
  return await response.json();
};

const apiProxy = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, { headers: getHeaders() });
      return await handleResponse(response);
    } catch (error) {
      console.error(`[Proxy] GET Error (${endpoint}):`, error);
      throw error;
    }
  },

  post: async (endpoint, payload) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`[Proxy] POST Error (${endpoint}):`, error);
      throw error;
    }
  },

  patch: async (endpoint, payload) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`[Proxy] PATCH Error (${endpoint}):`, error);
      throw error;
    }
  },

  put: async (endpoint, payload) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      return await handleResponse(response);
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
      return await handleResponse(response);
    } catch (error) {
      console.error(`[Proxy] DELETE Error (${endpoint}):`, error);
      throw error;
    }
  },
};

export default apiProxy;
