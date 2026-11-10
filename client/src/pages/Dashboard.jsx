import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hackathonService } from '../services/api';
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  LogOut,
  FolderGit2,
  ExternalLink,
  Phone,
  GraduationCap,
  Layers,
  Users2,
  CheckCircle2,
  AlertCircle,
  RotateCw,
} from 'lucide-react';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [loadingEntry, setLoadingEntry] = useState(true);
  const [entryError, setEntryError] = useState('');
  const [hasRegistered, setHasRegistered] = useState(false);
  const [entry, setEntry] = useState(null);

  const fetchMyEntry = async () => {
    setLoadingEntry(true);
    setEntryError('');
    try {
      const res = await hackathonService.getMyEntry();
      if (res.status === 'success') {
        setHasRegistered(Boolean(res.hasRegistered));
        setEntry(res.entry || null);
      }
    } catch (err) {
      setEntryError(
        err.response?.data?.message || 'Unable to retrieve hackathon registration status.'
      );
    } finally {
      setLoadingEntry(false);
    }
  };

  useEffect(() => {
    fetchMyEntry();
  }, []);

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Active Participant';

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Participant Account</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white pt-1">
              Welcome back, {user?.fullName}!
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Code-a-Nova Hackathon 2026 Participant Dashboard
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="self-start sm:self-center text-slate-400 hover:text-rose-400 border-slate-800 hover:border-rose-900/40"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Sign Out
          </Button>
        </div>

        {/* Error Alert */}
        {entryError && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{entryError}</span>
            </div>
            <button
              onClick={fetchMyEntry}
              className="text-xs font-semibold underline hover:text-white flex items-center gap-1"
            >
              <RotateCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Account Overview
            </h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-3 text-slate-300">
                <User className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Full Name</span>
                  <span className="font-semibold text-white">{user?.fullName}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Email Address</span>
                  <span className="text-xs text-slate-300 font-mono">{user?.email}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-slate-300">
                <Calendar className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Joined Platform</span>
                  <span className="text-xs text-slate-300">{formattedDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60 text-xs text-slate-400">
                <span className="text-slate-300 font-medium block mb-1">Status:</span>
                {hasRegistered ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Registered for Event
                  </span>
                ) : (
                  <span className="text-amber-400 font-bold">Pending Registration</span>
                )}
              </div>
            </div>
          </div>

          {/* Hackathon Event Section (Dynamic based on registration status) */}
          <div className="md:col-span-2">
            {loadingEntry ? (
              <div className="glass-panel p-12 rounded-3xl border border-slate-800 flex items-center justify-center min-h-[250px]">
                <Loading message="Fetching your hackathon entry..." size="md" />
              </div>
            ) : hasRegistered && entry ? (
              /* State A: Already Registered -> Display Full Submission Details */
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 space-y-6 relative overflow-hidden shadow-2xl">
                <div className="pointer-events-none absolute -top-10 -right-10 w-72 h-72 bg-indigo-500/10 blur-[90px] rounded-full" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Registration Confirmed</span>
                    </div>
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                      {entry.projectName}
                    </h2>
                  </div>
                  <span className="text-xs text-indigo-400 font-semibold px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 self-start sm:self-center">
                    {entry.domain}
                  </span>
                </div>

                {/* Academic & Contact Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/60 space-y-1">
                    <span className="text-slate-500 text-xs flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-purple-400" /> College
                    </span>
                    <strong className="text-slate-200 block truncate">{entry.college}</strong>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/60 space-y-1">
                    <span className="text-slate-500 text-xs flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" /> Course & Branch
                    </span>
                    <strong className="text-slate-200 block truncate">
                      {entry.course} ({entry.branch}) • {entry.year}
                    </strong>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/60 space-y-1">
                    <span className="text-slate-500 text-xs flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" /> Contact Number
                    </span>
                    <strong className="text-slate-200 block">{entry.mobile}</strong>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/60 space-y-1">
                    <span className="text-slate-500 text-xs flex items-center gap-1">
                      <Users2 className="w-3.5 h-3.5 text-amber-400" /> Team Size
                    </span>
                    <strong className="text-slate-200 block">
                      {entry.teamSize} {entry.teamSize === 1 ? 'Participant (Solo)' : 'Members'}
                    </strong>
                  </div>
                </div>

                {/* Additional Team Members */}
                {entry.teamMembers && entry.teamMembers.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                      Team Members ({entry.teamMembers.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {entry.teamMembers.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex flex-col"
                        >
                          <span className="font-semibold text-white">{m.name}</span>
                          <span className="text-slate-400 font-mono text-[11px] truncate">{m.email}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submission Links */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Submission Links
                  </span>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={entry.pptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-smooth"
                    >
                      <span>Presentation Deck (PPT)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={entry.prototypeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30 transition-smooth"
                    >
                      <span>Working Prototype</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {entry.demoVideoUrl && (
                      <a
                        href={entry.demoVideoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 text-xs font-semibold border border-pink-500/30 transition-smooth"
                      >
                        <span>Demo Video</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* State B: Not Registered Yet -> Prominent Register Now CTA */
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-2xl">
                <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[90px] rounded-full" />
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Registrations Currently Open</span>
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-white mb-2">
                    Submit Your Hackathon Project Entry
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 max-w-lg">
                    You have not registered for the Code-a-Nova Hackathon 2026 yet. Assemble your team (1-5 members), prepare your PPT presentation and prototype link, and complete your registration before deadlines.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Takes approx. 3 minutes to complete.
                  </div>
                  <Link to="/hackathon/register">
                    <Button size="lg" className="gap-2 shadow-indigo-600/30">
                      <FolderGit2 className="w-4 h-4" />
                      <span>Register Now</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
