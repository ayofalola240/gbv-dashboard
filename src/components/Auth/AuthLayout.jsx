import nigeriaLogo from '../../assets/nigeria-logo.png';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex bg-light-grey">
      {/* Left branding panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] shrink-0 flex-col items-center justify-between bg-dark-green px-12 py-14 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary-green/25" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-primary-green/20" />

        <div className="relative z-10 flex flex-col items-center text-center mt-8">
          <div className="mb-7 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-2xl ring-8 ring-white/10">
            <img src={nigeriaLogo} alt="Nigerian Coat of Arms" className="h-24 w-24 object-contain" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white">FCTA GBV</h1>
          <p className="mt-1 text-base font-semibold uppercase tracking-widest text-green-300">
            Reporting System
          </p>

          <div className="my-6 h-px w-20 rounded-full bg-white/25" />

          <p className="text-sm leading-relaxed text-green-100/75 max-w-[240px]">
            Federal Capital Territory Administration — Gender‑Based Violence Incident Reporting &amp; Case Management
          </p>
        </div>

        {/* Bottom badge */}
        <p className="relative z-10 text-xs text-green-300/60 text-center">
          © {new Date().getFullYear()} FCTA. All rights reserved.
        </p>
      </div>

      {/* Right form area */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
        {/* Mobile-only logo */}
        <div className="lg:hidden flex flex-col items-center mb-8">
          <img src={nigeriaLogo} alt="Nigerian Coat of Arms" className="h-14 w-14 object-contain mb-2" />
          <span className="text-lg font-extrabold text-dark-green">FCTA GBV Reporting System</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
