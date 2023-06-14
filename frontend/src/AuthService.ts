import api from './api';

export interface AdminUser {
  username: string;
  password: string;
  email: string;
  id?: number;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
}

const AuthService = {
  login: (data: LoginData) => api.post<LoginResult>('/auth/login', data),
};

export default AuthService;
