const Input = ({ label, type = 'text', value, onChange, name, required, ...props }) => {
  const id = name || label;
  return (
    <div className="mb-5">
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-border-color bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 disabled:bg-light-grey"
        {...props}
      />
    </div>
  );
};

export default Input;
