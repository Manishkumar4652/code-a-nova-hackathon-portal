import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { authService } from '../services/api';
import { emailRegex, nameRegex } from '../utils/validators';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';
import AuthShell from '../components/AuthShell';

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};

    if (!formData.fullName.trim()) next.fullName = 'Full name is required';
    else if (formData.fullName.trim().length < 3) next.fullName = 'Use at least 3 characters';
    else if (!nameRegex.test(formData.fullName.trim())) next.fullName = 'Letters and spaces only';

    if (!formData.email.trim()) next.email = 'Email address is required';
    else if (!emailRegex.test(formData.email.trim())) next.email = 'Enter a valid email address';

    if (!formData.password) next.password = 'Password is required';
    else if (formData.password.length < 6) next.password = 'Use at least 6 characters';

    if (!formData.confirmPassword) next.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) next.confirmPassword = 'Passwords do not match';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
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
        // fromSignup tells the OTP page an email was just sent (so the resend cooldown applies)
        navigate('/verify-otp', {
          state: { email: formData.email.toLowerCase().trim(), fromSignup: true },
        });
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          (!err.response
            ? 'Cannot reach the server. Check your connection and try again.'
            : 'Unable to create your account. Please check your details and try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      current={0}
      title="Create your account"
      subtitle="We’ll email a 6-digit code to confirm it’s really you."
      footer={
        <>
          Already registered?{' '}
          <Link to="/login" className="link">
            Log in
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        {serverError && <Alert type="error" message={serverError} onClose={() => setServerError('')} />}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Full name"
            name="fullName"
            placeholder="As on your college ID"
            icon={User}
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            disabled={loading}
            autoComplete="name"
          />
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
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              disabled={loading}
              autoComplete="new-password"
            />
            <Input
              label="Confirm password"
              name="confirmPassword"
              type="password"
              placeholder="Repeat password"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" size="lg" className="mt-2 w-full" loading={loading}>
            Send verification code
            {!loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
