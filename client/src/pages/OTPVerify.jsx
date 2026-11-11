import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, RotateCw } from 'lucide-react';
import { authService } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';
import AuthShell from '../components/AuthShell';

const OTP_LENGTH = 6;

export default function OTPVerify() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialEmail = location.state?.email || '';
  const fromSignup = Boolean(location.state?.fromSignup);

  const [email, setEmail] = useState(initialEmail);
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // A code was only just emailed when arriving from signup; otherwise allow an immediate resend
  const [cooldown, setCooldown] = useState(fromSignup ? 60 : 0);
  const inputs = useRef([]);

  const otp = digits.join('');

  // Resend countdown
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const focusBox = (i) => inputs.current[Math.max(0, Math.min(OTP_LENGTH - 1, i))]?.focus();

  const handleDigitChange = (i, value) => {
    const clean = value.replace(/\D/g, '');
    if (!clean) {
      setDigits((prev) => prev.map((d, idx) => (idx === i ? '' : d)));
      return;
    }
    // Typing several characters (autofill / fast typing) spreads across the boxes
    setDigits((prev) => {
      const next = [...prev];
      clean.split('').slice(0, OTP_LENGTH - i).forEach((ch, k) => {
        next[i + k] = ch;
      });
      return next;
    });
    focusBox(i + clean.length);
    if (error) setError('');
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i]) focusBox(i - 1);
    if (e.key === 'ArrowLeft') focusBox(i - 1);
    if (e.key === 'ArrowRight') focusBox(i + 1);
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    setDigits(Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] || ''));
    focusBox(pasted.length);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError('Email address is required.');
    if (otp.length !== OTP_LENGTH) return setError('Enter the full 6-digit code.');

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await authService.verifyOTP({ email: email.trim(), otp });
      if (response.status === 'success') {
        setSuccessMessage('Account verified. Taking you to login…');
        setTimeout(() => navigate('/login', { state: { verifiedEmail: email.trim() } }), 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code. Please try again.');
      setDigits(Array(OTP_LENGTH).fill(''));
      focusBox(0);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resendLoading) return;
    if (!email.trim()) return setError('Enter your email address to resend the code.');

    setResendLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await authService.resendOTP(email.trim());
      if (response.status === 'success') {
        setSuccessMessage('A fresh code is on its way to your inbox.');
        setCooldown(60);
        setDigits(Array(OTP_LENGTH).fill(''));
        focusBox(0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend the code. Please wait and retry.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthShell
      current={1}
      title="Check your inbox"
      subtitle={
        initialEmail
          ? `We sent a 6-digit code to ${initialEmail}. It stays valid for 10 minutes.`
          : 'Enter your email and the 6-digit code we sent you. It stays valid for 10 minutes.'
      }
      footer={
        <>
          Already verified?{' '}
          <Link to="/login" className="link">
            Go to login
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {successMessage && <Alert type="success" message={successMessage} />}

        <form onSubmit={handleVerify} className="space-y-5" noValidate>
          {!initialEmail && (
            <Input
              label="Registered email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@college.edu"
              icon={Mail}
              disabled={loading}
              autoComplete="email"
            />
          )}

          <fieldset>
            <legend className="mb-2 text-[13px] font-semibold text-ink">Verification code</legend>
            <div className="flex gap-2 sm:gap-3" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  autoComplete={i === 0 ? 'one-time-code' : 'off'}
                  maxLength={OTP_LENGTH}
                  value={d}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onFocus={(e) => e.target.select()}
                  disabled={loading}
                  autoFocus={i === 0}
                  aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
                  className={`h-14 w-full min-w-0 rounded-[10px] border bg-surface text-center font-mono text-2xl font-semibold text-ink transition-all duration-200 focus:outline-none focus:ring-4 disabled:bg-paper-2 ${
                    d
                      ? 'border-ink'
                      : 'border-line-strong'
                  } focus:border-nova-600 focus:ring-nova-600/15`}
                />
              ))}
            </div>
          </fieldset>

          <Button type="submit" size="lg" className="w-full" loading={loading} disabled={otp.length !== OTP_LENGTH}>
            Verify and continue
            {!loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
          </Button>
        </form>

        <div className="flex items-center justify-between rounded-[10px] bg-paper-2 px-4 py-3 text-sm">
          <span className="text-ink-muted">Didn’t get the email?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resendLoading}
            className={`inline-flex items-center gap-1.5 font-semibold transition-colors ${
              cooldown > 0 || resendLoading ? 'cursor-not-allowed text-ink-muted' : 'text-nova-600 hover:text-nova-700'
            }`}
          >
            {resendLoading ? (
              'Sending…'
            ) : cooldown > 0 ? (
              <span className="font-mono text-[13px]">Resend in {cooldown}s</span>
            ) : (
              <>
                <RotateCw className="h-3.5 w-3.5" aria-hidden="true" /> Resend code
              </>
            )}
          </button>
        </div>
      </div>
    </AuthShell>
  );
}
