import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { emailRegex } from '../utils/validators';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';
import AuthShell from '../components/AuthShell';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const prefilledEmail = location.state?.verifiedEmail || '';
  const justVerified = Boolean(location.state?.verifiedEmail);
  const fromPath = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({ email: prefilledEmail, password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isUnverified, setIsUnverified] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!formData.email.trim()) next.email = 'Email address is required';
    else if (!emailRegex.test(formData.email.trim())) next.email = 'Enter a valid email address';
    if (!formData.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) {
      setServerError('');
      setIsUnverified(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');
    setIsUnverified(false);

    try {
      const response = await authService.login({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });

      if (response.status === 'success' && response.token) {
        login(response.token, response.user);
        navigate(fromPath, { replace: true });
      }
    } catch (err) {
      const status = err.response?.status;
      const message =
        err.response?.data?.message ||
        (!err.response
          ? 'Cannot reach the server. Check your connection and try again.'
          : 'Invalid email or password. Please try again.');

      setServerError(message);
      if (status === 403 || message.toLowerCase().includes('not verified')) setIsUnverified(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      current={2}
      title="Welcome back"
      subtitle="Log in to manage your hackathon registration and team."
      footer={
        <>
          New to Code-a-Nova?{' '}
          <Link to="/signup" className="link">
            Create an account
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        {justVerified && !serverError && (
          <Alert type="success" message="Email verified. You can log in now." />
        )}

        {serverError && (
          <Alert type="error" message={serverError} onClose={() => setServerError('')}>
            {isUnverified && (
              <>
                {' '}
                <Link to="/verify-otp" state={{ email: formData.email.trim() }} className="font-bold underline">
                  Verify your email →
                </Link>
              </>
            )}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Email address"
            name="email"
            type="email"
            placeholder="you@college.edu"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            disabled={loading}
            autoComplete="email"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Your password"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={loading}
            autoComplete="current-password"
          />
          <Button type="submit" size="lg" className="mt-2 w-full" loading={loading}>
            Log in
            {!loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
