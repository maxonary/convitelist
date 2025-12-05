import axios from 'axios';

// Backend API
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT protected routes
// When using react-auth-kit with cookie authType, the cookie is sent automatically
// with withCredentials: true. We also add it to Authorization header as fallback.
export const apiJwt = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token storage for interceptor
// This will be set by components that use useAuthToken hook
let currentToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  currentToken = token;
};

// Add token to Authorization header
// react-auth-kit stores token in localStorage when authType is "localstorage"
apiJwt.interceptors.request.use(
  (config) => {
    // First try to use token from setAuthToken (most reliable)
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
      return config;
    }
    
    // Fallback: Read token from localStorage (react-auth-kit stores it as __auth__)
    try {
      const stored = localStorage.getItem('__auth__');
      if (stored) {
        // react-auth-kit stores as JSON: {token: "...", type: "Bearer", ...}
        const authData = JSON.parse(stored);
        if (authData.token) {
          config.headers.Authorization = `Bearer ${authData.token}`;
          return config;
        }
      }
    } catch (e) {
      // If parsing fails, try reading as plain string
      const token = localStorage.getItem('__auth__');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      }
    }
    
    // No token found
    console.warn('[apiJwt] No authentication token found. Make sure you are logged in.');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Sleeping Minecraft server API
export const apiStatus = axios.create({
  baseURL: process.env.REACT_APP_STATUS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
