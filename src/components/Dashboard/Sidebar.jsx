import { useEffect, useState } from 'react';
import { FiChevronRight, FiFileText, FiGrid, FiSettings, FiShield, FiUsers } from 'react-icons/fi';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getDashboardStats } from '../../services/dashboardService';
import nigeriaLogo from '../../assets/nigeria-logo.png';
import { AGENCIES_LIST, getAllowedAgencySlugs } from '../../config/agencies';

const SUB_TABS = [
  { label: 'Overview', tab: 'overview' },
  { label: 'Reports', tab: 'reports' },
  { label: 'Active Cases', tab: 'active-cases' },
];

const Sidebar = ({ incidentCount }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [totalIncidents, setTotalIncidents] = useState(incidentCount);
  const [agencyCounts, setAgencyCounts] = useState({});
  const [openAgency, setOpenAgency] = useState(null);

  const isSuperAdmin = user?.role === 'super_admin';
  const allowedSlugs = getAllowedAgencySlugs(user?.role);
  const visibleAgencies = AGENCIES_LIST.filter((a) => allowedSlugs.includes(a.slug));

  useEffect(() => {
    if (incidentCount !== undefined) {
      setTotalIncidents(incidentCount);
    }
    let isMounted = true;
    getDashboardStats()
      .then((stats) => {
        if (!isMounted) return;
        if (incidentCount === undefined) setTotalIncidents(stats?.totalIncidents);
        setAgencyCounts(
          (stats?.incidentsByAgency || []).reduce((counts, item) => {
            counts[item.name] = item.value;
            return counts;
          }, {})
        );
      })
      .catch(() => {
        if (isMounted && incidentCount === undefined) setTotalIncidents(null);
      });
    return () => { isMounted = false; };
  }, [incidentCount]);

  // Auto-open the agency whose page we're currently on
  useEffect(() => {
    const match = AGENCIES_LIST.find((a) => location.pathname.startsWith(`/dashboard/agency/${a.slug}`));
    if (match) setOpenAgency(match.slug);
  }, [location.pathname]);

  const fullName = [user?.firstname, user?.lastname].filter(Boolean).join(' ') || 'Ibrahim Ali';
  const initials = fullName.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  const reportsActive = location.pathname.startsWith('/dashboard/incidents');

  const currentTabParam = new URLSearchParams(location.search).get('tab') || 'overview';

  const isAgencyActive = (slug) => location.pathname.startsWith(`/dashboard/agency/${slug}`);
  const isTabActive = (slug, tab) => isAgencyActive(slug) && currentTabParam === tab;

  return (
    <aside className="bg-white border-r border-border-color lg:w-[300px] lg:min-h-screen lg:sticky lg:top-0 lg:flex lg:flex-col shadow-md">
      {/* Branded header */}
      <NavLink
        to="/dashboard"
        className="flex flex-col items-center gap-2 bg-dark-green px-5 py-6 text-center"
      >
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white shadow-lg ring-4 ring-white/20">
          <img src={nigeriaLogo} alt="Nigerian Coat of Arms" className="h-16 w-16 object-contain" />
        </div>
        <div className="mt-1">
          <span className="block text-lg font-extrabold tracking-wide text-white">FCTA GBV</span>
          <span className="block text-xs font-semibold uppercase tracking-widest text-green-200 opacity-90">
            Reporting System
          </span>
        </div>
        <div className="mt-2 h-0.5 w-16 rounded-full bg-white/30" />
      </NavLink>

      <div className="flex-1 overflow-y-auto px-3 py-6">
        {/* Main Menu — super admin only */}
        {isSuperAdmin && (
          <section className="mb-8">
            <h2 className="mb-3 px-3 text-[11px] font-extrabold uppercase tracking-widest text-gray-400">
              Main Menu
            </h2>
            <nav className="space-y-1">
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-primary-green text-white shadow-sm'
                      : 'text-gray-700 hover:bg-light-green hover:text-primary-green'
                  }`
                }
              >
                <FiGrid className="h-5 w-5 shrink-0" />
                <span>Dashboard Overview</span>
              </NavLink>

              <NavLink
                to="/dashboard/incidents"
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                  reportsActive
                    ? 'bg-primary-green text-white shadow-sm'
                    : 'text-gray-700 hover:bg-light-green hover:text-primary-green'
                }`}
              >
                <FiFileText className="h-5 w-5 shrink-0" />
                <span className="min-w-0 flex-1">All Reports</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    reportsActive ? 'bg-white/20 text-white' : 'bg-light-green text-primary-green'
                  }`}
                >
                  {totalIncidents ?? '--'}
                </span>
              </NavLink>
            </nav>
          </section>
        )}

        {isSuperAdmin && <div className="mx-3 mb-6 h-px bg-border-color" />}

        {/* Agency Dashboards */}
        <section className="mb-8">
          <h2 className="mb-3 px-3 text-[11px] font-extrabold uppercase tracking-widest text-gray-400">
            Agency Dashboards
          </h2>
          <div className="space-y-1">
            {visibleAgencies.map((agency) => {
              const agencyPath = `/dashboard/agency/${agency.slug}`;
              const isActive = isAgencyActive(agency.slug);
              const isExpanded = openAgency === agency.slug;

              return (
                <div key={agency.slug}>
                  {/* Agency row: Link + chevron toggle */}
                  <div
                    className={`flex items-center rounded-lg transition-all ${
                      isActive
                        ? 'bg-light-green text-primary-green'
                        : 'text-gray-700 hover:bg-light-green hover:text-primary-green'
                    }`}
                  >
                    <Link
                      to={agencyPath}
                      onClick={() => setOpenAgency(agency.slug)}
                      className="flex flex-1 items-center gap-3 px-3 py-2.5 text-sm font-semibold"
                    >
                      <FiShield className="h-5 w-5 shrink-0" />
                      <span className="min-w-0 flex-1 truncate">{agency.label}</span>
                      <span className="rounded-full bg-primary-green/10 px-2.5 py-0.5 text-xs font-bold text-primary-green">
                        {agencyCounts[agency.apiValue] ?? 0}
                      </span>
                    </Link>
                    <button
                      type="button"
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenAgency((cur) => (cur === agency.slug ? null : agency.slug));
                      }}
                      className="px-2 py-3 text-gray-400 hover:text-primary-green"
                    >
                      <FiChevronRight
                        className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </button>
                  </div>

                  {/* Sub-tab links */}
                  {isExpanded && (
                    <div className="ml-10 mt-1 space-y-0.5 border-l-2 border-light-green py-1 pl-4">
                      {SUB_TABS.map(({ label, tab }) => {
                        const active = isTabActive(agency.slug, tab);
                        return (
                          <Link
                            key={tab}
                            to={`${agencyPath}?tab=${tab}`}
                            className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                              active
                                ? 'bg-light-green font-bold text-primary-green'
                                : 'font-medium text-gray-600 hover:bg-light-green hover:text-primary-green'
                            }`}
                          >
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <div className="mx-3 mb-6 h-px bg-border-color" />

        {/* Administration — super admin only */}
        {isSuperAdmin && (
          <section>
            <h2 className="mb-3 px-3 text-[11px] font-extrabold uppercase tracking-widest text-gray-400">
              Administration
            </h2>
            <div className="space-y-1">
              <NavLink
                to="/dashboard/users"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-primary-green text-white shadow-sm'
                      : 'text-gray-700 hover:bg-light-green hover:text-primary-green'
                  }`
                }
              >
                <FiUsers className="h-5 w-5 shrink-0" />
                <span>User Management</span>
              </NavLink>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-gray-700 transition-all hover:bg-light-green hover:text-primary-green"
              >
                <FiSettings className="h-5 w-5 shrink-0" />
                <span>Settings</span>
              </button>
            </div>
          </section>
        )}
      </div>

      {/* User profile footer */}
      <div className="border-t border-border-color bg-light-grey px-4 py-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-light-green"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-green text-sm font-bold text-white shadow-sm">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-gray-900">{fullName}</span>
            <span className="block text-xs font-medium text-gray-500">Administrator</span>
          </span>
          <FiChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
