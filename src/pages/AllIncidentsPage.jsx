import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { getAllIncidents } from '../services/incidentService';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark">{incident.areaCouncil || 'N/A'}</td>
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
// A simple debounce hook to prevent API calls on every keystroke
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const STATUS_OPTIONS = ['New', 'Investigating', 'Referred to Agency', 'Escalated', 'Resolved', 'Closed'];
const VIOLENCE_TYPE_OPTIONS = ['Physical', 'Sexual', 'Emotional', 'Trafficking', 'Rape', 'Other'];

const AllIncidentsPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: '', violenceType: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllIncidents({ ...filters, search: debouncedSearchTerm });
      setIncidents(data?.incidents || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch incidents.');
      setIncidents([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearchTerm]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);
  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // --- NEW: Function to handle Excel export ---
  const handleExportExcel = () => {
    // 1. Define the file type and extension for the Excel file.
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    // 2. Format the data for export. We can select and rename columns here.
    const dataToExport = incidents.map((incident) => ({
      'Reference ID': incident.referenceId,
      'Date Reported': new Date(incident.createdAt).toLocaleString(),
      Status: incident.status,
      'Violence Type': incident.violenceType || 'N/A',
      Location: incident.locationText || 'N/A',
      Description: incident.description || 'N/A',
      'Is Anonymous': incident.isAnonymous ? 'Yes' : 'No',
      'Services Requested': incident.servicesRequested?.join(', ') || 'None'
    }));

    // 3. Create a new worksheet from our formatted JSON data.
    const ws = XLSX.utils.json_to_sheet(dataToExport);

    // 4. Create a new workbook and append the worksheet to it with a name.
    const wb = { Sheets: { Incidents: ws }, SheetNames: ['Incidents'] };

    // 5. Generate the Excel file's data buffer.
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // 6. Create a Blob from the buffer and trigger the download using FileSaver.js.
    const dataBlob = new Blob([excelBuffer], { type: fileType });
    saveAs(dataBlob, 'incident_reports' + fileExtension);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-primary-green">All Incident Reports</h1>
        {/* CHANGED: Button now calls handleExportExcel */}
        <Button onClick={handleExportExcel} primary disabled={incidents.length === 0}>
          Export as Excel
        </Button>
      </div>

      {/* Search and Filter Controls (No changes here) */}
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-primary-white rounded-lg shadow">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Ref ID, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1 w-full p-2 border border-border-color rounded focus:ring-primary-green focus:border-primary-green"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Filter by Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="mt-1 w-full p-2 border border-border-color rounded bg-white focus:ring-primary-green focus:border-primary-green"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="violenceType" className="block text-sm font-medium text-gray-700">
            Filter by Violence Type
          </label>
          <select
            id="violenceType"
            name="violenceType"
            value={filters.violenceType}
            onChange={handleFilterChange}
            className="mt-1 w-full p-2 border border-border-color rounded bg-white focus:ring-primary-green focus:border-primary-green"
          >
            <option value="">All Types</option>
            {VIOLENCE_TYPE_OPTIONS.map((vtype) => (
              <option key={vtype} value={vtype}>
                {vtype}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="text-center">Loading incidents...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {!loading && !error && <IncidentsTable incidents={incidents} />}
    </DashboardLayout>
  );
};

export default AllIncidentsPage;
