import React from 'react';
import Header from '../common/Header';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
      {/* You can add a footer here if needed */}
    </div>
  );
};

export default DashboardLayout;
