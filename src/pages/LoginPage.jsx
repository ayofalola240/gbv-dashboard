import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/Auth/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { ROLE_TO_AGENCY_SLUG } from '../config/agencies';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  // src/pages/LoginPage.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await auth.login(email, password);
      const ownSlug = ROLE_TO_AGENCY_SLUG[data?.role];
      navigate(ownSlug ? `/dashboard/agency/${ownSlug}` : '/dashboard');
    } catch (err) {
      // This block should execute on error
      console.error('Login page caught error:', err); // For debugging
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your FCTA GBV admin account to continue.">
      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div
            className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            <span className="mt-0.5 shrink-0 text-base">⚠</span>
            <span>{error}</span>
          </div>
        )}

        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        <Button type="submit" primary className="mt-2 w-full py-3" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>

        <p className="mt-6 text-center text-sm text-gray-400">
          Contact your system administrator to create an account.
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
