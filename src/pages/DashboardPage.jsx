import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import MetricCard from '../components/Dashboard/MetricCard';
// REMOVE ChartPlaceholder import
// import ChartPlaceholder from '../components/Dashboard/ChartPlaceholder';
// ADD these new chart imports
import ViolenceTypeChart from '../components/Dashboard/ViolenceTypeChart';
import StatusOverviewChart from '../components/Dashboard/StatusOverviewChart';
import RecentIncidentsTable from '../components/Dashboard/RecentIncidentsTable';
import { getDashboardStats } from '../services/dashboardService';
// Example icons:
// import { FaFileAlt, FaExclamationTriangle, FaCheckCircle, FaUsers } from 'react-icons/fa';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center p-10">Loading dashboard data...</div>
      </DashboardLayout>
    );
  }
  if (!stats) {
    return (
      <DashboardLayout>
        <div className="text-center p-10 text-red-500">Failed to load dashboard data.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* KPI Cards Row */}
      <div className="flex flex-wrap -m-2 mb-6">
        <MetricCard title="Total Incidents" value={stats.totalIncidents} /* icon={<FaFileAlt />} */ />
        <MetricCard title="New This Week" value={stats.newThisWeek} /* icon={<FaExclamationTriangle />} */ />
        <MetricCard title="Resolved Incidents" value={stats.resolvedIncidents} /* icon={<FaCheckCircle />} */ />
        <MetricCard title="Pending Incidents" value={stats.pendingIncidents} /* icon={<FaUsers />} */ />
      </div>

      {/* Charts Row */}
      <div className="flex flex-wrap -m-2 mb-6">
        <div className="w-full lg:w-1/2 p-2">
          {/* REPLACE ChartPlaceholder with ViolenceTypeChart */}
          {stats.incidentsByViolenceType && stats.incidentsByViolenceType.length > 0 ? (
            <ViolenceTypeChart data={stats.incidentsByViolenceType} />
          ) : (
            <div className="bg-primary-white p-6 rounded-lg shadow-lg text-center h-[400px] flex items-center justify-center">
              No data for violence types.
            </div>
          )}
        </div>
        <div className="w-full lg:w-1/2 p-2">
          {/* REPLACE ChartPlaceholder with StatusOverviewChart */}
          {stats.incidentStatusOverview && stats.incidentStatusOverview.length > 0 ? (
            <StatusOverviewChart data={stats.incidentStatusOverview} />
          ) : (
            <div className="bg-primary-white p-6 rounded-lg shadow-lg text-center h-[400px] flex items-center justify-center">
              No data for status overview.
            </div>
          )}
        </div>
      </div>

      <RecentIncidentsTable incidents={stats.recentIncidents} />
    </DashboardLayout>
  );
};

export default DashboardPage;
