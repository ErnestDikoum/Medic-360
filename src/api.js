import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://medicb-360.onrender.com/api', // pointe directement sur le préfixe API
  headers: {
    'Content-Type': 'application/json', // toujours envoyer du JSON
    'Accept': 'application/json',
  },
  withCredentials: false, // à mettre true si tu utilises des cookies/sessions Laravel
});
