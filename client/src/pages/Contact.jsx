import React, { useState } from 'react';
import { Mail, User, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { contactService } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please provide your full name (min 2 characters)';
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      const response = await contactService.submitInquiry(formData);
      if (response.status === 'success') {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' || !err.response
          ? 'Cannot connect to backend server. Please verify the backend is running on http://localhost:5000.'
          : 'Unable to send your inquiry at this moment. Please try again later.');
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
            Support & Inquiries
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Get in Touch with Code-a-Nova
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Have questions regarding eligibility, team registration, or track requirements? Send us a message below.
          </p>
        </div>

        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative">
          {serverError && (
            <div className="mb-6">
              <Alert type="error" message={serverError} onClose={() => setServerError('')} />
            </div>
          )}

          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Message Received!</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                Thank you for reaching out. The Code-a-Nova event organizing committee has received your message and will respond to your email.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubmitted(false)}
                className="mt-4"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Input
                label="Your Name"
                placeholder="e.g. Maya Sharma"
                icon={User}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                disabled={loading}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="maya@example.com"
                icon={Mail}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                disabled={loading}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Message / Inquiry
                </label>
                <textarea
                  rows={5}
                  placeholder="Detail your question or query here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  disabled={loading}
                  className={`w-full rounded-xl bg-slate-900/80 border text-slate-100 placeholder-slate-500 text-sm p-3.5 transition-smooth focus:outline-none focus:ring-2 ${
                    errors.message
                      ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-rose-400 font-medium mt-1">
                    • {errors.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={loading}
              >
                <span>Submit Inquiry</span>
                {!loading && <Send className="w-4 h-4 ml-1" />}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
