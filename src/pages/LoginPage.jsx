import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/Auth/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await auth.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Admin Login">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center" role="alert">
            {error}
          </div>
        )}
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" primary className="w-full mt-4" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        <p className="text-center mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-green font-semibold">
            Register here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
