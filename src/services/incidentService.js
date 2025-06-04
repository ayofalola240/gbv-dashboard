// src/services/incidentService.ts
import apiClient from './apiClient'; // Assuming you have a configured Axios instance

export const getAllIncidents = async (/* page = 1, limit = 10, filters = {} */) => {
  // Add query params for pagination/filtering: const params = new URLSearchParams({ page, limit, ...filters }).toString();
  // const response = await apiClient.get(`/incidents?${params}`);
  const response = await apiClient.get('/incidents'); // Simplified for now
  return response.data;
};

export const getIncidentById = async (incidentId) => {
  const response = await apiClient.get(`/incidents/${incidentId}`);
  return response.data;
};

export const updateIncidentStatusApi = async (incidentId, status, notes) => {
  const response = await apiClient.put(`/incidents/${incidentId}/status`, { status, notes });
  return response.data;
};

export const escalateIncidentApi = async (incidentId, agency, notes) => {
  const response = await apiClient.post(`/incidents/${incidentId}/escalate`, { agency, notes });
  return response.data;
};

export const addIncidentNoteApi = async (incidentId, note) => {
  const response = await apiClient.post(`/incidents/${incidentId}/notes`, { note });
  return response.data;
};
