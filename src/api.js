import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://medicb-360.onrender.com', // ton backend Laravel
});
