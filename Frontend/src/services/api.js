// src/services/api.js
import axios from 'axios';

// Create an instance of axios with a custom configuration
const api = axios.create({
  // This is the base URL of your backend server
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/',
  //register
  // This is important for sending cookies with requests for authentication later
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;