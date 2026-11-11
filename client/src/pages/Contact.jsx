import React, { useState } from 'react';
import { Mail, User, Send, CheckCircle2, Clock } from 'lucide-react';
import { contactService } from '../services/api';
import { emailRegex } from '../utils/validators';
import useContactEmail from '../hooks/useContactEmail';
import Button from '../components/Button';
import Input, { Textarea } from '../components/Input';
import Alert from '../components/Alert';

export default function Contact() {
  const contactEmail = useContactEmail();

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (formData.name.trim().length < 2) next.name = 'Please enter your name';
    if (!emailRegex.test(formData.email.trim())) next.email = 'Enter a valid email address';
    if (formData.message.trim().length < 10) next.message = 'Message must be at least 10 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
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
      setServerError(
        err.response?.data?.message ||
          (!err.response
            ? 'Cannot reach the server. Check your connection and try again.'
            : 'We could not send your message. Please try again later.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-16 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            Questions? We’re listening.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
            Ask about eligibility, team rules or tracks. Use the form or write to us directly.
          </p>

          <dl className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-nova-50 text-nova-600">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <dt className="eyebrow">Email</dt>
                <dd className="mt-1">
                  {contactEmail ? (
                    <a href={`mailto:${contactEmail}`} className="font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:text-nova-600">
                      {contactEmail}
                    </a>
                  ) : (
                    <span className="text-ink-muted">Loading…</span>
                  )}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-nova-50 text-nova-600">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <dt className="eyebrow">Replies</dt>
                <dd className="mt-1 text-ink-soft">The organising team replies to your email address.</dd>
              </div>
            </div>
          </dl>
        </div>

        <div className="card p-6 sm:p-9">
          {submitted ? (
            <div className="space-y-4 py-10 text-center" role="status">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ok-soft text-ok">
                <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
              </span>
              <h2 className="font-display text-2xl font-bold">Message sent</h2>
              <p className="mx-auto max-w-sm text-sm text-ink-muted">
                Thanks for reaching out. The Code-a-Nova team has your message and will reply by email.
              </p>
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {serverError && <Alert type="error" message={serverError} onClose={() => setServerError('')} />}

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Your name"
                  name="name"
                  placeholder="Full name"
                  icon={User}
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
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
              </div>

              <Textarea
                label="Message"
                name="message"
                placeholder="How can we help?"
                value={formData.message}
                onChange={handleChange}
                error={errors.message}
                disabled={loading}
                maxLength={2000}
              />

              <Button type="submit" size="lg" className="w-full sm:w-auto" loading={loading}>
                Send message
                {!loading && <Send className="h-4 w-4" aria-hidden="true" />}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
