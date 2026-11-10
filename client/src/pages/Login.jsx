import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, LogIn, AlertCircle } from 'lucide-react';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const prefilledEmail = location.state?.verifiedEmail || '';
  const fromPath = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({
    email: prefilledEmail,
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isUnverified, setIsUnverified] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        err.response?.data?.message || 'Invalid email or password. Please try again.';

      setServerError(message);

      // Check for unverified account error (403)
      if (status === 403 || message.toLowerCase().includes('not verified')) {
        setIsUnverified(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#030712] relative overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/10 blur-[120px] rounded-full" />

      <div className="max-w-md w-full glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-3 border border-indigo-500/20">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Participant Login
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Access your Code-a-Nova hackathon registration and team dashboard.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-6 space-y-3">
            <Alert
              type="error"
              message={serverError}
              onClose={() => setServerError('')}
            />
            {isUnverified && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center justify-between">
                <span>Account requires OTP verification.</span>
                <Link
                  to="/verify-otp"
                  state={{ email: formData.email }}
                  className="font-bold underline hover:text-white"
                >
                  Verify Now →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="name@example.com"
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
            placeholder="Enter your password"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={loading}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            loading={loading}
          >
            <span>Log In to Portal</span>
            {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
          </Button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
          Don't have an account yet?{' '}
          <Link
            to="/signup"
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

