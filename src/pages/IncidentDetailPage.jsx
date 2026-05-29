import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/Dashboard/DashboardLayout";
import { getIncidentById, getIncidentMedia, updateIncidentStatusApi, escalateIncidentApi, addIncidentNoteApi } from "../services/incidentService";
import Button from "../components/common/Button";
import { FiAlertCircle, FiArrowLeft, FiCheckCircle, FiClock, FiFileText, FiImage, FiMapPin, FiShield, FiUser } from "react-icons/fi";

// At the top of your IncidentDetailPage.jsx, or in a separate constants file
const AGENCIES = [
  { value: "NSCDC", label: "NSCDC" },
  { value: "NAPTIP", label: "NAPTIP" },
  { value: "FCTA WAS", label: "FCTA" },
  // Add more agencies here if needed
];

const statusStyles = {
  New: "bg-light-green text-dark-green",
  Investigating: "bg-blue-50 text-blue-700",
  Referred: "bg-amber-50 text-amber-700",
  Escalated: "bg-amber-50 text-amber-700",
  Resolved: "bg-green-50 text-green-700",
  Closed: "bg-gray-100 text-gray-700",
};

const formatDate = (value) => (value ? new Date(value).toLocaleString() : "N/A");

const DetailItem = ({ label, value, children }) => (
  <div>
    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{label}</p>
    <div className="mt-1 text-base font-medium text-text-dark">{children || value || "N/A"}</div>
  </div>
);

const SectionCard = ({ title, icon, children, className = "" }) => (
  <section className={`rounded-lg border border-border-color bg-white shadow-sm ${className}`}>
    <div className="flex items-center gap-3 border-b border-border-color px-5 py-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-light-green text-primary-green">{icon}</span>
      <h2 className="text-lg font-bold text-primary-green">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </section>
);

const IncidentDetailPage = () => {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState();
  const [actionLoading, setActionLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);

  // States for modal/forms for actions
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateAgency, setEscalateAgency] = useState("");
  const [escalateNotes, setEscalateNotes] = useState("");
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveNotes, setResolveNotes] = useState("");
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNote, setNewNote] = useState("");

  const fetchIncident = useCallback(async () => {
    if (!incidentId) return;
    try {
      setLoading(true);
      const [data, media] = await Promise.all([getIncidentById(incidentId), getIncidentMedia(incidentId)]);
      setIncident(data);
      setMediaFiles(media);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch incident details.");
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
      setSuccessMessage(`${newStatus === "Resolved" ? "Incident marked as Resolved." : "Status updated."}`);
      setShowResolveModal(false);
      setResolveNotes(""); // Close modal and clear notes
      fetchIncident(); // Refresh incident data
    } catch (err) {
      setActionError(err.message || "Failed to update status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEscalate = async () => {
    if (!incidentId || !escalateAgency) {
      setActionError("Agency name is required for escalation.");
      return;
    }
    setActionLoading(true);
    setActionError(null);
    try {
      await escalateIncidentApi(incidentId, escalateAgency, escalateNotes);
      setSuccessMessage("Incident escalated successfully.");
      setShowEscalateModal(false);
      setEscalateAgency("");
      setEscalateNotes(""); // Close modal
      fetchIncident(); // Refresh incident data
    } catch (err) {
      setActionError(err.message || "Failed to escalate incident.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!incidentId || !newNote.trim()) {
      setActionError("Note cannot be empty.");
      return;
    }
    setActionLoading(true);
    setActionError(null);
    try {
      await addIncidentNoteApi(incidentId, newNote);
      setSuccessMessage("Note added successfully.");
      setShowAddNoteModal(false);
      setNewNote(""); // Close modal & clear
      fetchIncident(); // Refresh
    } catch (err) {
      setActionError(err.message || "Failed to add note.");
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-lg border border-border-color bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <button type="button" onClick={() => navigate("/dashboard/incidents")} className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-primary-green hover:text-dark-green">
                <FiArrowLeft className="h-4 w-4" />
                Back to All Incidents
              </button>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-primary-green">Incident Details</h1>
                <span className={`rounded-full px-3 py-1 text-sm font-bold ${statusStyles[incident.status] || statusStyles.New}`}>{incident.status}</span>
              </div>
              <p className="mt-2 break-all text-sm font-semibold text-gray-500">{incident.referenceId}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {incident.status !== "Resolved" && incident.status !== "Closed" && incident.status !== "Escalated" && (
                <Button onClick={() => setShowEscalateModal(true)} primary className="shadow-sm">
                  Escalate to Agency
                </Button>
              )}
              {incident.status !== "Resolved" && incident.status !== "Closed" && <Button onClick={() => setShowResolveModal(true)}>Mark as Resolved</Button>}
              <Button onClick={() => setShowAddNoteModal(true)}>Add Internal Note</Button>
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
            <FiCheckCircle className="h-5 w-5 shrink-0" />
            <p className="font-semibold">{successMessage}</p>
          </div>
        )}
        {actionError && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <FiAlertCircle className="h-5 w-5 shrink-0" />
            <p className="font-semibold">{actionError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <SectionCard title="Report Summary" icon={<FiFileText className="h-5 w-5" />}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <DetailItem label="Violence Type" value={incident.violenceType} />
                <DetailItem label="Date Reported" value={formatDate(incident.createdAt)} />
                <DetailItem label="Incident Date" value={incident.incidentDate || "N/A"} />
                <DetailItem label="Incident Time" value={incident.incidentTime || "N/A"} />
                <DetailItem label="Anonymous" value={incident.isAnonymous ? "Yes" : "No"} />
                <DetailItem label="Language" value={incident.language || "N/A"} />
              </div>

              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Description</p>
                <div className="mt-2 rounded-lg border border-border-color bg-gray-50 p-4 text-base leading-relaxed text-text-dark">{incident.description || "No description provided."}</div>
              </div>
            </SectionCard>

            <SectionCard title="Location & Support" icon={<FiMapPin className="h-5 w-5" />}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <DetailItem label="Area Council" value={incident.areaCouncil || "N/A"} />
                <DetailItem label="Exact Location Type" value={incident.exactLocationType || "N/A"} />
                <DetailItem label="Location Text" value={incident.locationText || "N/A"} />
                <DetailItem label="Services Requested">
                  {incident.servicesRequested && incident.servicesRequested.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {incident.servicesRequested.map((service) => (
                        <span key={service} className="rounded-full bg-light-green px-3 py-1 text-sm font-bold text-dark-green">
                          {service}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "None"
                  )}
                </DetailItem>
              </div>
            </SectionCard>

            <SectionCard title="Uploaded Media" icon={<FiImage className="h-5 w-5" />}>
              {mediaFiles.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border-color bg-gray-50 p-6 text-center text-sm font-medium text-gray-500">No media uploaded for this incident.</div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {mediaFiles.map((media) => (
                    <div key={media.id} className="overflow-hidden rounded-lg border border-border-color bg-gray-50">
                      <div className="flex items-start justify-between gap-3 border-b border-border-color bg-white p-4">
                        <div>
                          <p className="font-bold text-text-dark">{media.fileType}</p>
                          <p className="text-sm text-gray-500">{media.mimeType || "Unknown type"}</p>
                        </div>
                        {media.signedUrl && (
                          <a href={media.signedUrl} target="_blank" rel="noreferrer" className="rounded-md bg-primary-green px-3 py-1.5 text-sm font-bold text-white hover:bg-dark-green">
                            Open
                          </a>
                        )}
                      </div>
                      <div className="p-4">
                        {!media.signedUrl && (
                          <p className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm font-medium text-yellow-800">
                            Media is recorded but unavailable for preview. {media.unavailableReason || "Check storage configuration."}
                          </p>
                        )}
                        {media.signedUrl && media.fileType === "Image" && <img src={media.signedUrl} alt="Incident evidence" className="w-full max-h-80 object-contain rounded bg-white" />}
                        {media.signedUrl && media.fileType === "Audio" && <audio controls src={media.signedUrl} className="w-full" />}
                        {media.signedUrl && media.fileType === "Video" && <video controls src={media.signedUrl} className="w-full max-h-96 rounded bg-black" />}
                        {media.signedUrl && media.fileType === "Document" && <p className="text-sm font-medium text-gray-700">Use Open to view or download this file.</p>}
                        {media.caption && <p className="mt-3 text-sm text-gray-700">Caption: {media.caption}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard title="Reporter" icon={<FiUser className="h-5 w-5" />}>
              <div className="space-y-5">
                <DetailItem label="Reporter Name" value={incident.isAnonymous ? "Anonymous" : incident.reporterName || "N/A"} />
                <DetailItem label="Reporter Phone" value={incident.isAnonymous ? "N/A" : incident.reporterPhone || "N/A"} />
                <DetailItem label="Consent Given" value={incident.consentGiven ? "Yes" : "No"} />
                <DetailItem label="Direct Service Request" value={incident.isDirectServiceRequest ? "Yes" : "No"} />
              </div>
            </SectionCard>

            <SectionCard title="Perpetrator" icon={<FiShield className="h-5 w-5" />}>
              <div className="space-y-5">
                <DetailItem label="Known" value={incident.perpetratorKnown === undefined ? "N/A" : incident.perpetratorKnown ? "Yes" : "No"} />
                <DetailItem label="Relationship" value={incident.perpetratorRelationship || "N/A"} />
                <DetailItem label="Count" value={incident.perpetratorCount || "N/A"} />
              </div>
            </SectionCard>

            {(incident.escalationDetails || incident.resolutionDetails || incident.internalNotes?.length > 0) && (
              <SectionCard title="Case Activity" icon={<FiClock className="h-5 w-5" />}>
                <div className="space-y-4">
                  {incident.escalationDetails && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <p className="font-bold text-amber-800">Escalated to {incident.escalationDetails.agency || "Agency"}</p>
                      <p className="mt-1 text-sm text-amber-800">{formatDate(incident.escalationDetails.escalatedAt)}</p>
                      {incident.escalationDetails.notes && <p className="mt-2 text-sm text-amber-900">{incident.escalationDetails.notes}</p>}
                    </div>
                  )}
                  {incident.resolutionDetails && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <p className="font-bold text-green-800">Resolved</p>
                      <p className="mt-1 text-sm text-green-800">{formatDate(incident.resolutionDetails.resolvedAt)}</p>
                      {incident.resolutionDetails.notes && <p className="mt-2 text-sm text-green-900">{incident.resolutionDetails.notes}</p>}
                    </div>
                  )}
                  {incident.internalNotes?.map((note) => (
                    <div key={note._id || `${note.createdAt}-${note.note}`} className="rounded-lg border border-border-color bg-gray-50 p-4">
                      <p className="text-sm font-medium text-text-dark">{note.note}</p>
                      <p className="mt-2 text-xs font-semibold text-gray-500">{formatDate(note.createdAt)}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>
        </div>

        {/* Modals for Actions - Simplified inline for brevity */}
        {showEscalateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50 p-4">
            {" "}
            {/* Added padding for smaller screens */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              {" "}
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
                {" "}
                {/* Added margin top */}
                <Button
                  onClick={() => {
                    setShowEscalateModal(false);
                    setActionError(null); // Clear error on cancel
                    setEscalateAgency(""); // Reset agency on cancel
                    setEscalateNotes(""); // Reset notes on cancel
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700" // More distinct cancel button
                >
                  Cancel
                </Button>
                <Button onClick={handleEscalate} primary disabled={actionLoading || !escalateAgency}>
                  {" "}
                  {/* Disable if no agency selected */}
                  {actionLoading ? "Escalating..." : "Escalate"}
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
                <Button onClick={() => handleUpdateStatus("Resolved", resolveNotes)} primary disabled={actionLoading}>
                  {actionLoading ? "Saving..." : "Mark Resolved"}
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
                  {actionLoading ? "Adding..." : "Add Note"}
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
