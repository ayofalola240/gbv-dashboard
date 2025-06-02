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
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await auth.login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <AuthLayout title="Admin Login">
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" primary className="w-full mt-4">
          {' '}
          {/* Added w-full and mt-4 */}
          Login
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
