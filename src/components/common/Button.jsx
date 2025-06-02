import React from 'react';

const Button = ({ children, onClick, type = 'button', primary = false, className = '', ...props }) => {
  const baseClasses = 'py-2 px-4 rounded font-bold text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-opacity-50';

  const primaryClasses = 'bg-primary-green text-text-light hover:bg-dark-green focus:ring-primary-green';

  const defaultClasses = 'bg-light-grey text-text-dark border border-border-color hover:bg-gray-200 focus:ring-gray-400';

  const combinedClasses = `
    ${baseClasses}
    ${primary ? primaryClasses : defaultClasses}
    ${className}
  `;

  return (
    <button type={type} className={combinedClasses.trim()} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
