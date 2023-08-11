import axios from 'axios';

const statusApi = axios.create({
  baseURL: process.env.REACT_APP_STATUS_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Connection': 'keep-alive',
  },
});

export default statusApi;