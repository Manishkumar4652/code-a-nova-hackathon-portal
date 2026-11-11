import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Mail, CalendarDays, ArrowRight, ExternalLink, Phone, GraduationCap,
  Layers, Users2, Pencil, Check, X, Trash2, RotateCw, CheckCircle2, Circle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService, hackathonService } from '../services/api';
import { nameRegex } from '../utils/validators';
import Button from '../components/Button';
import Input from '../components/Input';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

/** Small labelled value used in the registration summary. */
function Detail({ icon: Icon, label, children }) {
  return (
    <div className="rounded-[10px] border border-line bg-paper p-4">
      <dt className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label}
      </dt>
      <dd className="mt-1.5 break-words text-sm font-semibold text-ink">{children}</dd>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout, setUser } = useAuth();

  const [loadingEntry, setLoadingEntry] = useState(true);
  const [entryError, setEntryError] = useState('');
  const [entry, setEntry] = useState(null);

  // Profile editing
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [nameError, setNameError] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [notice, setNotice] = useState('');

  // Withdraw registration
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchMyEntry = useCallback(async () => {
    setLoadingEntry(true);
    setEntryError('');
    try {
      const res = await hackathonService.getMyEntry();
      setEntry(res.hasRegistered ? res.entry : null);
    } catch (err) {
      setEntryError(err.response?.data?.message || 'Unable to load your registration right now.');
    } finally {
      setLoadingEntry(false);
    }
  }, []);

  useEffect(() => {
    fetchMyEntry();
  }, [fetchMyEntry]);

  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    : '—';

  const startEdit = () => {
    setNameDraft(user?.fullName || '');
    setNameError('');
    setEditing(true);
  };

  const saveName = async (e) => {
    e.preventDefault();
    const value = nameDraft.trim();
    if (value.length < 3) return setNameError('Use at least 3 characters');
    if (!nameRegex.test(value)) return setNameError('Letters and spaces only');

    setSavingName(true);
    setNameError('');
    try {
      const res = await authService.updateProfile({ fullName: value });
      setUser(res.user);
      setEditing(false);
      setNotice('Profile updated.');
    } catch (err) {
      setNameError(err.response?.data?.message || 'Could not update your name.');
    } finally {
      setSavingName(false);
    }
  };

  const withdraw = async () => {
    setDeleting(true);
    setEntryError('');
    try {
      await hackathonService.deleteEntry(entry._id);
      setEntry(null);
      setConfirmDelete(false);
      setNotice('Your registration was withdrawn. You can register again any time.');
    } catch (err) {
      setEntryError(err.response?.data?.message || 'Could not withdraw your registration.');
    } finally {
      setDeleting(false);
    }
  };

  const registered = Boolean(entry);

  return (
    <div className="container-page py-10 sm:py-14">
      {/* Header */}
      <header className="flex flex-col justify-between gap-5 border-b border-line pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow inline-flex items-center gap-1.5 !text-ok">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified participant
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Hi, {user?.fullName?.split(' ')[0] || 'there'}.
          </h1>
          <p className="mt-1.5 text-ink-muted">Your Code-a-Nova Hackathon 2026 dashboard.</p>
        </div>

        {/* Progress */}
        <ol className="flex items-center gap-3 text-sm" aria-label="Your progress">
          <li className="flex items-center gap-2 font-medium text-ok">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> Account verified
          </li>
          <span className="h-px w-6 bg-line-strong" aria-hidden="true" />
          <li className={`flex items-center gap-2 font-medium ${registered ? 'text-ok' : 'text-ink-muted'}`}>
            {registered ? <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> : <Circle className="h-5 w-5" aria-hidden="true" />}
            Team registered
          </li>
        </ol>
      </header>

      <div className="mt-6 space-y-3">
        {notice && <Alert type="success" message={notice} onClose={() => setNotice('')} />}
        {entryError && (
          <Alert type="error" message={entryError} onClose={() => setEntryError('')}>
            {!entry && (
              <button onClick={fetchMyEntry} className="ml-2 inline-flex items-center gap-1 font-bold underline">
                <RotateCw className="h-3.5 w-3.5" aria-hidden="true" /> Retry
              </button>
            )}
          </Alert>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        {/* Profile */}
        <aside className="card h-fit p-6">
          <div className="flex items-start justify-between">
            <h2 className="eyebrow">Profile</h2>
            {!editing && (
              <button
                onClick={startEdit}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-nova-600 hover:bg-nova-50"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
              </button>
            )}
          </div>

          <span className="mt-5 flex h-14 w-14 items-center justify-center rounded-full bg-navy font-display text-xl font-bold uppercase text-surface">
            {user?.fullName?.[0] || '?'}
          </span>

          {editing ? (
            <form onSubmit={saveName} className="mt-4 space-y-3" noValidate>
              <Input
                label="Full name"
                name="fullName"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                error={nameError}
                disabled={savingName}
                autoFocus
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" loading={savingName}>
                  <Check className="h-4 w-4" aria-hidden="true" /> Save
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)} disabled={savingName}>
                  <X className="h-4 w-4" aria-hidden="true" /> Cancel
                </Button>
              </div>
            </form>
          ) : (
            <p className="mt-4 font-display text-2xl font-bold leading-tight">{user?.fullName}</p>
          )}

          <dl className="mt-6 space-y-4 border-t border-line pt-5 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-muted" aria-hidden="true" />
              <div className="min-w-0">
                <dt className="text-xs text-ink-muted">Email</dt>
                <dd className="break-all font-medium">{user?.email}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-muted" aria-hidden="true" />
              <div>
                <dt className="text-xs text-ink-muted">Joined</dt>
                <dd className="font-medium">{joined}</dd>
              </div>
            </div>
          </dl>

          <Button variant="outline" size="sm" className="mt-6 w-full" onClick={logout}>
            Sign out
          </Button>
        </aside>

        {/* Registration */}
        <section aria-label="Hackathon registration">
          {loadingEntry ? (
            <div className="card flex min-h-[320px] items-center justify-center">
              <Loading message="Loading your entry" />
            </div>
          ) : entry ? (
            <div className="card overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-line bg-ok-soft/60 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                  <p className="eyebrow inline-flex items-center gap-1.5 !text-ok">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Registration confirmed
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{entry.projectName}</h2>
                </div>
                <span className="self-start rounded-full border border-line-strong bg-surface px-3.5 py-1.5 text-xs font-semibold">
                  {entry.domain}
                </span>
              </div>

              <div className="space-y-8 p-6 sm:p-8">
                <dl className="grid gap-3 sm:grid-cols-2">
                  <Detail icon={GraduationCap} label="College">{entry.college}</Detail>
                  <Detail icon={Layers} label="Course · Branch · Year">
                    {entry.course} · {entry.branch} · {entry.year}
                  </Detail>
                  <Detail icon={Phone} label="Mobile">{entry.mobile}</Detail>
                  <Detail icon={Users2} label="Team size">
                    {entry.teamSize} {entry.teamSize === 1 ? '(solo)' : 'members'}
                  </Detail>
                </dl>

                {entry.teamMembers?.length > 0 && (
                  <div>
                    <h3 className="eyebrow">Team members</h3>
                    <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                      {entry.teamMembers.map((m, idx) => (
                        <li key={idx} className="flex items-center gap-3 rounded-[10px] border border-line p-3.5">
                          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-paper-3 text-sm font-bold uppercase">
                            {m.name[0]}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{m.name}</p>
                            <p className="truncate text-xs text-ink-muted">{m.email}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="eyebrow">Submission links</h3>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {[
                      ['Presentation (PPT)', entry.pptUrl],
                      ['Prototype', entry.prototypeUrl],
                      entry.demoVideoUrl && ['Demo video', entry.demoVideoUrl],
                    ]
                      .filter(Boolean)
                      .map(([label, href]) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-4 py-2.5 text-sm font-semibold transition-colors hover:border-ink hover:bg-paper-2"
                        >
                          {label} <ExternalLink className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
                        </a>
                      ))}
                  </div>
                </div>

                {/* Withdraw */}
                <div className="border-t border-line pt-6">
                  {confirmDelete ? (
                    <div className="flex flex-col gap-3 rounded-[10px] border border-bad/25 bg-bad-soft p-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-medium text-bad">Withdraw this registration? This cannot be undone.</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)} disabled={deleting}>
                          Keep it
                        </Button>
                        <Button size="sm" variant="danger" onClick={withdraw} loading={deleting}>
                          Yes, withdraw
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition-colors hover:text-bad"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" /> Withdraw registration
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-xl2 bg-navy p-7 text-surface shadow-lift sm:p-10">
              <div className="dot-grid-light absolute inset-0" aria-hidden="true" />
              <div className="relative">
                <p className="eyebrow !text-nova-300">Registrations open</p>
                <h2 className="mt-3 max-w-md font-display text-3xl font-bold leading-tight !text-surface sm:text-4xl">
                  You haven’t registered a team yet.
                </h2>
                <p className="mt-4 max-w-lg leading-relaxed text-[#C9D1DF]">
                  Add your team (1–5 members), choose a track and share your PPT and prototype links. It takes about
                  three minutes and you’ll get a confirmation email.
                </p>
                <Link to="/hackathon/register" className="mt-8 inline-block">
                  <Button size="lg">
                    Register now <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
