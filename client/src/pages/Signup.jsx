import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { authService } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters long';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = 'Full name can only contain letters and spaces';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      const response = await authService.signup(formData);
      if (response.status === 'success') {
        // Navigate to OTP verification with the registered email
        navigate('/verify-otp', {
          state: { email: formData.email.toLowerCase().trim() },
        });
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' || !err.response
          ? 'Cannot connect to backend server. Please verify the backend is running on http://localhost:5000.'
          : 'Unable to create account. Please check your details and try again.');
      setServerError(message);
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
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Create Participant Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Join the Code-a-Nova Hackathon 2026. A 6-digit OTP will be sent to your email.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-6">
            <Alert
              type="error"
              message={serverError}
              onClose={() => setServerError('')}
            />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Full Name"
            name="fullName"
            type="text"
            placeholder="e.g. Alex Johnson"
            icon={User}
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            disabled={loading}
            autoComplete="name"
          />

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
            placeholder="At least 6 characters"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={loading}
            autoComplete="new-password"
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Re-type your password"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            disabled={loading}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            loading={loading}
          >
            <span>Send Verification OTP</span>
            {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
          </Button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
          >
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}

