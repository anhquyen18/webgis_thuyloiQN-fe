import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Đổi thành domain API mới
  // baseURL: 'http://api.tamky.click/api',
  timeout: 5000, // Timeout mặc định
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
