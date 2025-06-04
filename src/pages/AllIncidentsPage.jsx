import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { getAllIncidents } from '../services/incidentService';
import { Link } from 'react-router-dom';
// You'd likely use a more robust table component or build one
// For now, a simple table structure:

const IncidentsTable = ({ incidents }) => {
  if (!incidents || incidents.length === 0) {
    return <p className="text-center text-gray-500 mt-5">No incidents found.</p>;
  }
  return (
    <div className="mt-8 bg-primary-white shadow-lg rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-border-color">
        <thead className="bg-primary-green">
          <tr>
            {['Ref ID', 'Date Reported', 'Violence Type', 'Status', 'Location', 'Actions'].map((header) => (
              <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-primary-white divide-y divide-border-color">
          {incidents.map((incident, index) => (
            <tr key={incident._id} className={index % 2 === 1 ? 'bg-light-green' : ''}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark">{incident.referenceId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark">{new Date(incident.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark">{incident.violenceType || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark">{incident.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark">{incident.locationText || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link to={`/dashboard/incidents/${incident._id}`} className="text-primary-green hover:text-dark-green">
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AllIncidentsPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const data = await getAllIncidents();
        setIncidents(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch incidents.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-primary-green mb-6">All Incident Reports</h1>
      {loading && <p>Loading incidents...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && <IncidentsTable incidents={incidents} />}
    </DashboardLayout>
  );
};

export default AllIncidentsPage;
