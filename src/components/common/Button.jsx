const Button = ({ children, onClick, type = 'button', primary = false, className = '', disabled = false, ...props }) => {
  const base =
    'inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variant = primary
    ? 'bg-primary-green text-white hover:bg-dark-green focus:ring-primary-green shadow-sm'
    : 'bg-light-grey text-text-dark border border-border-color hover:bg-gray-200 focus:ring-gray-400';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
