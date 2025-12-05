import axios from 'axios';

// Backend API
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT protected routes
export const apiJwt = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Sleeping Minecraft server API
export const apiStatus = axios.create({
  baseURL: process.env.REACT_APP_STATUS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});