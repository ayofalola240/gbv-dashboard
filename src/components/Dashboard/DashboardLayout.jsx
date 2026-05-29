import React, { useState } from 'react';
import Header from '../common/Header';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, incidentCount }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-light-grey lg:flex">
      {sidebarOpen && <Sidebar incidentCount={incidentCount} />}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header sidebarOpen={sidebarOpen} onMenuToggle={() => setSidebarOpen((isOpen) => !isOpen)} />
        <main className="flex-grow p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
