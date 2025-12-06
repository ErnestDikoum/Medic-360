export const api = axios.create({
  baseURL: 'https://medicb-360.onrender.com/api',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});
