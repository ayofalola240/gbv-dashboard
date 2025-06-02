import React from 'react';

const MetricCard = ({ title, value, icon }) => {
  return (
    <div className="bg-primary-white p-5 rounded-lg shadow-lg border-l-4 border-primary-green flex-1 text-center m-2 min-w-[220px]">
      {icon && <div className="text-3xl text-primary-green mb-2">{icon}</div>}
      <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-3xl font-bold text-primary-green">{value}</p>
    </div>
  );
};

export default MetricCard;
