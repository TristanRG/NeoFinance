import axios from 'axios';

const baseURL = 'http://localhost:8000'; 

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const token = localStorage.getItem('access_token');
if (token) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default instance;
