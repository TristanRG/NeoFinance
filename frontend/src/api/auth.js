import axios from './axios';

const BASE_URL = 'http://localhost:8000';

export const loginUser = async (email, password) => {
  const response = await axios.post('/login/', {
    email,
    password,
  });
  return response.data; 
};

export async function registerUser(email, username, password) {
    const response = await axios.post(`${BASE_URL}/register/`, {
      email,
      username,
      password,
    });
    return response.data;
  }
  