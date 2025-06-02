import React from 'react';

const RecentIncidentsTable = ({ incidents }) => {
  if (!incidents || incidents.length === 0) {
    return <p className="text-center text-gray-500 mt-5">No recent incidents to display.</p>;
  }

  return (
    <div className="mt-8 bg-primary-white shadow-lg rounded-lg overflow-x-auto">
      <h2 className="text-xl font-semibold text-primary-green p-4 border-b border-border-color">Recent Incidents</h2>
      <table className="min-w-full divide-y divide-border-color">
        <thead className="bg-primary-green">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
              Reference ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
              Date Reported
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
              Violence Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
              Location (LGA)
            </th>
          </tr>
        </thead>
        <tbody className="bg-primary-white divide-y divide-border-color">
          {incidents.map((incident, index) => (
            <tr key={incident.id || index} className={index % 2 === 1 ? 'bg-light-green' : ''}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark">{incident.referenceId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark">{new Date(incident.dateReported).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark">{incident.violenceType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark">{incident.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark">{incident.locationLGA}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentIncidentsTable;
