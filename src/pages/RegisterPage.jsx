import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Assuming you have useAuth hook
import AuthLayout from '../components/Auth/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }

      const userData = {
        firstname: firstName,
        lastname: lastName,
        email,
        phone,
        password
      };

      await auth.register(userData); // Assumes auth.register is implemented
      setSuccessMessage('Registration successful! You can now log in.');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');
      // Optionally navigate to login:
      // setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Email/phone may be in use or an error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Admin Account">
      <form onSubmit={handleSubmit}>
        {/* Tailwind classes for error and success messages */}
        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
        {successMessage && <p className="text-green-600 text-sm text-center mb-3">{successMessage}</p>}

        <Input label="First Name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <Input label="Last Name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        {/* Button component should already be using Tailwind classes internally */}
        {/* Added w-full for full width and mt-4 for margin top */}
        <Button type="submit" primary disabled={loading} className="w-full mt-4">
          {loading ? 'Registering...' : 'Register'}
        </Button>

        {/* Tailwind classes for the paragraph and link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-green hover:text-dark-green">
            Login here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
