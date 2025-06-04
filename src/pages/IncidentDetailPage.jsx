import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { getIncidentById, updateIncidentStatusApi, escalateIncidentApi, addIncidentNoteApi } from '../services/incidentService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

// At the top of your IncidentDetailPage.jsx, or in a separate constants file
const AGENCIES = [
  { value: 'NSCDC', label: 'NSCDC' },
  { value: 'NAPTIP', label: 'NAPTIP' },
  { value: 'FCTA WAS', label: 'FCTA' }
  // Add more agencies here if needed
];

const IncidentDetailPage = () => {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState();
  const [actionLoading, setActionLoading] = useState(false);

  // States for modal/forms for actions
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateAgency, setEscalateAgency] = useState('');
  const [escalateNotes, setEscalateNotes] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveNotes, setResolveNotes] = useState('');
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNote, setNewNote] = useState('');

  const fetchIncident = useCallback(async () => {
    if (!incidentId) return;
    try {
      setLoading(true);
      const data = await getIncidentById(incidentId);
      setIncident(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch incident details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [incidentId]);

  useEffect(() => {
    fetchIncident();
  }, [fetchIncident]);

  const handleUpdateStatus = async (newStatus, notes) => {
    if (!incidentId) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await updateIncidentStatusApi(incidentId, newStatus, notes);
      setSuccessMessage(`${newStatus === 'Resolved' ? 'Incident marked as Resolved.' : 'Status updated.'}`);
      setShowResolveModal(false);
      setResolveNotes(''); // Close modal and clear notes
      fetchIncident(); // Refresh incident data
    } catch (err) {
      setActionError(err.message || 'Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEscalate = async () => {
    if (!incidentId || !escalateAgency) {
      setActionError('Agency name is required for escalation.');
      return;
    }
    setActionLoading(true);
    setActionError(null);
    try {
      await escalateIncidentApi(incidentId, escalateAgency, escalateNotes);
      setSuccessMessage('Incident escalated successfully.');
      setShowEscalateModal(false);
      setEscalateAgency('');
      setEscalateNotes(''); // Close modal
      fetchIncident(); // Refresh incident data
    } catch (err) {
      setActionError(err.message || 'Failed to escalate incident.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!incidentId || !newNote.trim()) {
      setActionError('Note cannot be empty.');
      return;
    }
    setActionLoading(true);
    setActionError(null);
    try {
      await addIncidentNoteApi(incidentId, newNote);
      setSuccessMessage('Note added successfully.');
      setShowAddNoteModal(false);
      setNewNote(''); // Close modal & clear
      fetchIncident(); // Refresh
    } catch (err) {
      setActionError(err.message || 'Failed to add note.');
    } finally {
      setActionLoading(false);
    }
  };

  const [successMessage, setSuccessMessage] = useState(null);
  useEffect(() => {
    // Auto-clear success message
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (loading)
    return (
      <DashboardLayout>
        <p>Loading incident details...</p>
      </DashboardLayout>
    );
  if (error)
    return (
      <DashboardLayout>
        <p className="text-red-500">Error: {error}</p>
      </DashboardLayout>
    );
  if (!incident)
    return (
      <DashboardLayout>
        <p>Incident not found.</p>
      </DashboardLayout>
    );

  // Basic structure for detail display - you'll want to make this look nice
  return (
    <DashboardLayout>
      <div className="bg-primary-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-primary-green">Incident Details: {incident.referenceId}</h1>
          <Button onClick={() => navigate('/dashboard/incidents')}>&larr; Back to All Incidents</Button>
        </div>
        {successMessage && <div className="mb-4 p-3 bg-light-green text-dark-green rounded">{successMessage}</div>}
        {actionError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{actionError}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <strong>Status:</strong>{' '}
            <span className="font-medium px-3 py-1 text-sm rounded-full bg-light-green text-dark-green">{incident.status}</span>
          </div>
          <div>
            <strong>Date Reported:</strong> {new Date(incident.createdAt).toLocaleString()}
          </div>
          <div>
            <strong>Violence Type:</strong> {incident.violenceType || 'N/A'}
          </div>
          <div>
            <strong>Anonymous:</strong> {incident.isAnonymous ? 'Yes' : 'No'}
          </div>
          {!incident.isAnonymous && (
            <>
              <div>
                <strong>Reporter Name:</strong> {incident.reporterName || 'N/A'}
              </div>
              <div>
                <strong>Reporter Phone:</strong> {incident.reporterPhone || 'N/A'}
              </div>
            </>
          )}
          {/* Add more fields here: incidentDate, incidentTime, locationText, exactLocationType, perpetrator details etc. */}
          <div>
            <strong>Description:</strong>{' '}
            <p className="mt-1 p-2 border border-border-color rounded bg-gray-50">{incident.description || 'N/A'}</p>
          </div>
          <div>
            <strong>Services Requested:</strong>{' '}
            {incident.servicesRequested && incident.servicesRequested.length > 0 ? incident.servicesRequested.join(', ') : 'None'}
          </div>
        </div>
        {incident.escalationDetails && (
          <div className="mb-4 p-3 border border-yellow-300 bg-yellow-50 rounded">
            <h3 className="font-semibold text-yellow-700">Escalation Details:</h3>
            <p>To: {incident.escalationDetails.agency}</p>
            <p>At: {new Date(incident.escalationDetails.escalatedAt).toLocaleString()}</p>
            {incident.escalationDetails.notes && <p>Notes: {incident.escalationDetails.notes}</p>}
          </div>
        )}
        {incident.resolutionDetails && (
          <div className="mb-4 p-3 border border-green-300 bg-green-50 rounded">
            <h3 className="font-semibold text-green-700">Resolution Details:</h3>
            <p>At: {new Date(incident.resolutionDetails.resolvedAt).toLocaleString()}</p>
            {incident.resolutionDetails.notes && <p>Notes: {incident.resolutionDetails.notes}</p>}
          </div>
        )}
        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          {incident.status !== 'Resolved' && incident.status !== 'Closed' && incident.status !== 'Escalated' && (
            <Button onClick={() => setShowEscalateModal(true)} primary>
              Escalate to Agency
            </Button>
          )}
          {incident.status !== 'Resolved' && incident.status !== 'Closed' && (
            <Button onClick={() => setShowResolveModal(true)}>Mark as Resolved</Button>
          )}
          <Button onClick={() => setShowAddNoteModal(true)}>Add Internal Note</Button>
        </div>

        {/* Modals for Actions - Simplified inline for brevity */}
        {showEscalateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50 p-4">
            {' '}
            {/* Added padding for smaller screens */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              {' '}
              {/* Increased padding */}
              <h2 className="text-xl font-semibold text-primary-green mb-4">Escalate Incident</h2>
              {actionError && <p className="text-red-500 text-sm mb-3">{actionError}</p>}
              {/* CHANGED: From Input to Select for Agency Name */}
              <div className="mb-4">
                <label htmlFor="escalateAgencySelect" className="block mb-1 font-bold text-text-dark">
                  Agency Name
                </label>
                <select
                  id="escalateAgencySelect"
                  value={escalateAgency}
                  onChange={(e) => {
                    setEscalateAgency(e.target.value);
                    if (e.target.value) setActionError(null); // Clear error when a selection is made
                  }}
                  required // HTML5 required attribute
                  className="w-full p-2.5 border border-border-color rounded text-base focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none appearance-none bg-white" // Tailwind classes for select
                >
                  <option value="">-- Select Agency --</option>
                  {AGENCIES.map((agency) => (
                    <option key={agency.value} value={agency.value}>
                      {agency.label}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={escalateNotes}
                onChange={(e) => setEscalateNotes(e.target.value)}
                placeholder="Escalation notes (optional)"
                className="w-full p-2 border border-border-color rounded mt-2 mb-4 h-24 resize-none" // Added resize-none
              ></textarea>
              <div className="flex justify-end gap-3 mt-4">
                {' '}
                {/* Added margin top */}
                <Button
                  onClick={() => {
                    setShowEscalateModal(false);
                    setActionError(null); // Clear error on cancel
                    setEscalateAgency(''); // Reset agency on cancel
                    setEscalateNotes(''); // Reset notes on cancel
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700" // More distinct cancel button
                >
                  Cancel
                </Button>
                <Button onClick={handleEscalate} primary disabled={actionLoading || !escalateAgency}>
                  {' '}
                  {/* Disable if no agency selected */}
                  {actionLoading ? 'Escalating...' : 'Escalate'}
                </Button>
              </div>
            </div>
          </div>
        )}
        {showResolveModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-xl font-semibold text-primary-green mb-4">Mark as Resolved</h2>
              {actionError && <p className="text-red-500 mb-3">{actionError}</p>}
              <textarea
                value={resolveNotes}
                onChange={(e) => setResolveNotes(e.target.value)}
                placeholder="Resolution notes (optional)"
                className="w-full p-2 border border-border-color rounded mt-2 mb-4 h-24"
              ></textarea>
              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => {
                    setShowResolveModal(false);
                    setActionError(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </Button>
                <Button onClick={() => handleUpdateStatus('Resolved', resolveNotes)} primary disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Mark Resolved'}
                </Button>
              </div>
            </div>
          </div>
        )}
        {showAddNoteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-xl font-semibold text-primary-green mb-4">Add Internal Note</h2>
              {actionError && <p className="text-red-500 mb-3">{actionError}</p>}
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Your note..."
                className="w-full p-2 border border-border-color rounded mt-2 mb-4 h-24"
                required
              ></textarea>
              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => {
                    setShowAddNoteModal(false);
                    setActionError(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddNote} primary disabled={actionLoading}>
                  {actionLoading ? 'Adding...' : 'Add Note'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default IncidentDetailPage;
