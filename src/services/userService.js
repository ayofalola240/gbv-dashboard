import apiClient from './apiClient';

export const getUsers = async () => {
  const response = await apiClient.get('/admin/users');
  return response.data;
};

export const createUser = async (userData) => {
  // Re-uses the register endpoint; role is sent so the backend can assign it
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await apiClient.patch(`/admin/users/${userId}`, { role });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/admin/users/${userId}`);
  return response.data;
};
