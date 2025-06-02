import React from 'react';

const Input = ({ label, type = 'text', value, onChange, name, required, ...props }) => {
  return (
    <div className="mb-4">
      {' '}
      {/* Margin bottom for group */}
      <label htmlFor={name || label} className="block mb-1 font-bold text-text-dark">
        {label}
      </label>
      <input
        id={name || label}
        name={name || label}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-2 border border-border-color rounded text-base focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none"
        {...props}
      />
    </div>
  );
};

export default Input;
