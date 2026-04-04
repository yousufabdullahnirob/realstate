const BASE_URL = 'http://127.0.0.1:8000/api';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('access');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const apiProxy = {
  get: async (endpoint) => {
    console.log(`[Proxy] GET Request to: ${endpoint}`);
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: getHeaders(),
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`[Proxy] GET Error:`, error);
      throw error;
    }
  },

  post: async (endpoint, payload) => {
    console.log(`[Proxy] POST Request to: ${endpoint}`);
    const isFormData = payload instanceof FormData;
    
    // Create headers and handle FormData exclusion for Content-Type
    let headers = getHeaders();
    if (isFormData) {
      const { 'Content-Type': _, ...rest } = headers;
      headers = rest;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: isFormData ? payload : JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || JSON.stringify(errorData) || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`[Proxy] POST Error:`, error);
      throw error;
    }
  }
};

export default apiProxy;
