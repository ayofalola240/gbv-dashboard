import apiClient from './apiClient';

export const getAllIncidents = async (filters) => {
  // Create URLSearchParams object to safely build the query string
  const params = new URLSearchParams();

  if (filters.status) params.append('status', filters.status);
  if (filters.violenceType) params.append('violenceType', filters.violenceType);
  if (filters.areaCouncil) params.append('areaCouncil', filters.areaCouncil);
  if (filters.search) params.append('search', filters.search);

  const response = await apiClient.get(`/incidents?${params.toString()}`);
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
