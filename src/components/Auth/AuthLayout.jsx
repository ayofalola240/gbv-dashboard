import React from 'react';

const AuthLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light-grey py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-primary-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-primary-green">
        <h2 className="text-2xl font-bold text-primary-green text-center mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
