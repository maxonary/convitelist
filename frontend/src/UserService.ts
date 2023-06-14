import api from './api';

export interface User {
  minecraftUsername: string;
  approved: boolean;
  id?: number; // Optional because it's not included when creating a user
}

const UserService = {
  getAll: () => api.get<User[]>('/user'),
  getById: (id: number) => api.get<User>(`/user/${id}`),
  create: (user: User) => api.post<User>('/user', user),
  delete: (id: number) => api.delete(`/user/${id}`),
  approve: (id: number) => api.put(`/user/${id}/approve`),
  reject: (id: number) => api.put(`/user/${id}/reject`),
};

export default UserService;
