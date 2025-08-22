import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
   headers: {
        'Accept': 'application/json'
    }
});
