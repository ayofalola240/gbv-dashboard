import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiGrid,
  FiList,
  FiSearch,
  FiShield,
} from 'react-icons/fi';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import MetricCard from '../components/Dashboard/MetricCard';
import ViolenceTypeChart from '../components/Dashboard/ViolenceTypeChart';
import StatusOverviewChart from '../components/Dashboard/StatusOverviewChart';
import { getAllIncidents } from '../services/incidentService';
import { AGENCY_CONFIG } from '../config/agencies';

const STATUS_OPTIONS = ['New', 'Investigating', 'Referred to Agency', 'Escalated', 'Resolved', 'Closed'];
const ACTIVE_STATUS_OPTIONS = ['New', 'Investigating', 'Referred to Agency', 'Escalated'];
const VIOLENCE_TYPE_OPTIONS = ['Physical', 'Sexual', 'Emotional', 'Trafficking', 'Rape', 'Other'];
const ACTIVE_STATUSES = new Set(ACTIVE_STATUS_OPTIONS);

const STATUS_BADGE = {
  New: 'bg-blue-50 text-blue-700 border border-blue-100',
  Investigating: 'bg-amber-50 text-amber-700 border border-amber-100',
  'Referred to Agency': 'bg-purple-50 text-purple-700 border border-purple-100',
  Escalated: 'bg-orange-50 text-orange-700 border border-orange-100',
  Resolved: 'bg-green-50 text-green-700 border border-green-100',
  Closed: 'bg-gray-100 text-gray-600 border border-gray-200',
};

const EmptyState = ({ message, sub }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-color bg-gray-50 p-16 text-center">
    <FiShield className="mb-4 h-12 w-12 text-gray-300" />
    <p className="font-bold text-gray-600">{message}</p>
    {sub && <p className="mt-1 text-sm text-gray-400">{sub}</p>}
  </div>
);

const IncidentsTable = ({ incidents }) => {
  if (!incidents.length) {
    return <EmptyState message="No incidents found." sub="Try adjusting your filters." />;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-border-color bg-white shadow-sm">
      <table className="min-w-full divide-y divide-border-color">
        <thead className="bg-primary-green">
          <tr>
            {['Ref ID', 'Date Reported', 'Violence Type', 'Status', 'Area Council', 'Actions'].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color">
          {incidents.map((incident, i) => (
            <tr key={incident._id} className={i % 2 === 1 ? 'bg-light-green/30' : 'bg-white'}>
              <td className="px-5 py-4 text-sm font-semibold text-gray-800">{incident.referenceId}</td>
              <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                {new Date(incident.createdAt).toLocaleDateString()}
              </td>
              <td className="px-5 py-4 text-sm text-gray-600">{incident.violenceType || 'N/A'}</td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    STATUS_BADGE[incident.status] || 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {incident.status}
                </span>
              </td>
              <td className="px-5 py-4 text-sm text-gray-600">{incident.areaCouncil || 'N/A'}</td>
              <td className="px-5 py-4">
                <Link
                  to={`/dashboard/incidents/${incident._id}`}
                  className="text-sm font-semibold text-primary-green hover:text-dark-green hover:underline"
                >
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

const FilterBar = ({ statusOptions, statusFilter, setStatusFilter, violenceTypeFilter, setViolenceTypeFilter, searchTerm, setSearchTerm }) => (
  <div className="grid grid-cols-1 gap-4 rounded-xl border border-border-color bg-white p-4 shadow-sm md:grid-cols-3">
    <div className="relative">
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">Search</label>
      <div className="relative">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Ref ID, description…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-border-color py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20"
        />
      </div>
    </div>
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">Status</label>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full rounded-lg border border-border-color bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20"
      >
        <option value="">All Statuses</option>
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">Violence Type</label>
      <select
        value={violenceTypeFilter}
        onChange={(e) => setViolenceTypeFilter(e.target.value)}
        className="w-full rounded-lg border border-border-color bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20"
      >
        <option value="">All Types</option>
        {VIOLENCE_TYPE_OPTIONS.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const AgencyDashboardPage = () => {
  const { agencySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'overview';

  const agency = AGENCY_CONFIG[agencySlug];

  const [allIncidents, setAllIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState('');
  const [violenceTypeFilter, setViolenceTypeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchIncidents = useCallback(async () => {
    if (!agency) return;
    try {
      setLoading(true);
      const data = await getAllIncidents({});
      const incidents = data?.incidents || [];
      setAllIncidents(incidents.filter((i) => i.escalationDetails?.agency === agency.apiValue));
    } catch (err) {
      setError(err.message || 'Failed to load incidents.');
    } finally {
      setLoading(false);
    }
  }, [agency]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  // Reset filters when switching tabs
  useEffect(() => {
    setStatusFilter('');
    setViolenceTypeFilter('');
    setSearchTerm('');
  }, [activeTab]);

  const activeIncidents = useMemo(
    () => allIncidents.filter((i) => ACTIVE_STATUSES.has(i.status)),
    [allIncidents]
  );

  const resolvedCount = useMemo(
    () => allIncidents.filter((i) => i.status === 'Resolved').length,
    [allIncidents]
  );

  const newThisWeekCount = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return allIncidents.filter((i) => new Date(i.createdAt) >= weekAgo).length;
  }, [allIncidents]);

  const violenceTypeData = useMemo(() => {
    const counts = {};
    allIncidents.forEach((i) => {
      const vt = i.violenceType || 'N/A';
      counts[vt] = (counts[vt] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [allIncidents]);

  const statusData = useMemo(() => {
    const counts = {};
    allIncidents.forEach((i) => {
      counts[i.status] = (counts[i.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [allIncidents]);

  const applyFilters = useCallback(
    (list) =>
      list.filter((i) => {
        if (statusFilter && i.status !== statusFilter) return false;
        if (violenceTypeFilter && i.violenceType !== violenceTypeFilter) return false;
        if (searchTerm) {
          const t = searchTerm.toLowerCase();
          return i.referenceId?.toLowerCase().includes(t) || i.description?.toLowerCase().includes(t);
        }
        return true;
      }),
    [statusFilter, violenceTypeFilter, searchTerm]
  );

  const filteredReports = useMemo(() => applyFilters(allIncidents), [applyFilters, allIncidents]);
  const filteredActive = useMemo(() => applyFilters(activeIncidents), [applyFilters, activeIncidents]);

  const setTab = (tab) => setSearchParams({ tab });

  if (!agency) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center text-red-500">Agency not found.</div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiGrid className="h-4 w-4" /> },
    {
      id: 'reports',
      label: 'Reports',
      count: allIncidents.length,
      icon: <FiFileText className="h-4 w-4" />,
    },
    {
      id: 'active-cases',
      label: 'Active Cases',
      count: activeIncidents.length,
      icon: <FiList className="h-4 w-4" />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Page header */}
        <div className="flex items-center justify-between rounded-xl border border-border-color bg-white px-6 py-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-green/10">
              <FiShield className="h-6 w-6 text-primary-green" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">{agency.label}</h1>
              <p className="text-sm text-gray-500">{agency.fullName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="hidden items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary-green sm:flex"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto rounded-xl border border-border-color bg-white shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-green text-primary-green'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    activeTab === tab.id
                      ? 'bg-primary-green/10 text-primary-green'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center rounded-xl border border-border-color bg-white p-16">
            <FiClock className="mr-2 h-5 w-5 animate-spin text-primary-green" />
            <p className="text-sm text-gray-500">Loading {agency.name} incidents…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <FiAlertCircle className="h-5 w-5 shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Tab content */}
        {!loading && !error && (
          <>
            {/* ─── OVERVIEW ─────────────────────────────────────────────── */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard title="Total Cases" value={allIncidents.length} icon={<FiFileText />} />
                  <MetricCard title="Active Cases" value={activeIncidents.length} icon={<FiClock />} />
                  <MetricCard title="Resolved" value={resolvedCount} icon={<FiCheckCircle />} />
                  <MetricCard title="New This Week" value={newThisWeekCount} icon={<FiAlertCircle />} />
                </div>

                {allIncidents.length === 0 ? (
                  <EmptyState
                    message={`No incidents assigned to ${agency.name} yet.`}
                    sub="Incidents escalated to this agency will appear here."
                  />
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {violenceTypeData.length > 0 && <ViolenceTypeChart data={violenceTypeData} />}
                      {statusData.length > 0 && <StatusOverviewChart data={statusData} />}
                    </div>

                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-700">Recent Cases</h3>
                        <button
                          type="button"
                          onClick={() => setTab('reports')}
                          className="text-sm font-semibold text-primary-green hover:text-dark-green"
                        >
                          View all →
                        </button>
                      </div>
                      <IncidentsTable incidents={allIncidents.slice(0, 5)} />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ─── REPORTS ──────────────────────────────────────────────── */}
            {activeTab === 'reports' && (
              <div className="space-y-4">
                <FilterBar
                  statusOptions={STATUS_OPTIONS}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  violenceTypeFilter={violenceTypeFilter}
                  setViolenceTypeFilter={setViolenceTypeFilter}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm text-gray-500">
                    {filteredReports.length} incident{filteredReports.length !== 1 ? 's' : ''}
                  </p>
                  {(statusFilter || violenceTypeFilter || searchTerm) && (
                    <button
                      type="button"
                      onClick={() => { setStatusFilter(''); setViolenceTypeFilter(''); setSearchTerm(''); }}
                      className="text-xs font-semibold text-gray-400 hover:text-primary-green"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
                <IncidentsTable incidents={filteredReports} />
              </div>
            )}

            {/* ─── ACTIVE CASES ─────────────────────────────────────────── */}
            {activeTab === 'active-cases' && (
              <div className="space-y-4">
                {/* Urgency summary strip */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {ACTIVE_STATUS_OPTIONS.map((status) => {
                    const count = activeIncidents.filter((i) => i.status === status).length;
                    return (
                      <div
                        key={status}
                        className="flex items-center justify-between rounded-lg border border-border-color bg-white px-4 py-3 shadow-sm"
                      >
                        <span className="text-xs font-semibold text-gray-600">{status}</span>
                        <span className="text-lg font-extrabold text-primary-green">{count}</span>
                      </div>
                    );
                  })}
                </div>

                <FilterBar
                  statusOptions={ACTIVE_STATUS_OPTIONS}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  violenceTypeFilter={violenceTypeFilter}
                  setViolenceTypeFilter={setViolenceTypeFilter}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm text-gray-500">
                    {filteredActive.length} active case{filteredActive.length !== 1 ? 's' : ''}
                  </p>
                  {(statusFilter || violenceTypeFilter || searchTerm) && (
                    <button
                      type="button"
                      onClick={() => { setStatusFilter(''); setViolenceTypeFilter(''); setSearchTerm(''); }}
                      className="text-xs font-semibold text-gray-400 hover:text-primary-green"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
                <IncidentsTable incidents={filteredActive} />
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AgencyDashboardPage;
