import axios from 'axios';

const statusApi = axios.create({
  // baseURL: process.env.REACT_APP_SERVER_STATUS_URL,
  baseURL: "http://localhost:3000",
  headers: {
    'Content-Type': 'application/json',
  },
});

export default statusApi;