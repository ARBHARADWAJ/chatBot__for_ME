// src/services/api.js
import axios from 'axios';

// Create an instance of axios with a custom configuration
const api = axios.create({
  // This is the base URL of your backend server
  baseURL: 'http://localhost:3000/api',
  // This is important for sending cookies with requests for authentication later
  withCredentials: true,
});

export default api;