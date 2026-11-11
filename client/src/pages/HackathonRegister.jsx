import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Mail, Phone, FileText, Link2, Video, CheckCircle2, ArrowRight, Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { hackathonService } from '../services/api';
import { TRACK_NAMES, EVENT } from '../config/event';
import { emailRegex, mobileRegex, nameRegex, isValidHttpUrl } from '../utils/validators';
import Button from '../components/Button';
import Input, { Select } from '../components/Input';
import Alert from '../components/Alert';
import Loading from '../components/Loading';

const COLLEGES = [
  'Indian Institute of Technology (IIT)',
  'National Institute of Technology (NIT)',
  'Birla Institute of Technology and Science (BITS)',
  'Delhi Technological University (DTU)',
  'Netaji Subhas University of Technology (NSUT)',
  'Vellore Institute of Technology (VIT)',
  'Manipal Institute of Technology (MIT)',
  'SRM Institute of Science and Technology',
  'Thapar Institute of Engineering and Technology',
  'Anna University',
  'Jadavpur University',
  'State Government Engineering College',
  'Autonomous Engineering College',
  'Private University',
  'Other Institution / University',
];

const COURSES = [
  'B.Tech / B.E.',
  'M.Tech / M.E.',
  'BCA (Bachelor of Computer Applications)',
  'MCA (Master of Computer Applications)',
  'B.Sc (Computer Science / IT)',
  'M.Sc (Computer Science / IT)',
  'Other Degree Program',
];

const BRANCHES = [
  'Computer Science and Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence & Data Science (AI/DS)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Other Engineering / Tech Specialization',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const TEAM_SIZES = Array.from({ length: EVENT.teamSize.max }, (_, i) => i + 1);

const SECTIONS = [
  { id: 'personal', label: 'Personal details' },
  { id: 'academic', label: 'Academic details' },
  { id: 'project', label: 'Project & links' },
  { id: 'team', label: 'Team' },
];

/** Numbered section card wrapper. */
function Section({ id, index, title, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="card scroll-mt-24 p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3 border-b border-line pb-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy font-mono text-xs font-semibold text-surface">
          {index}
        </span>
        <h2 id={`${id}-title`} className="font-display text-xl font-bold">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export default function HackathonRegister() {
  const { user } = useAuth();

  const [checkingExisting, setCheckingExisting] = useState(true);
  const [existingEntry, setExistingEntry] = useState(null);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    mobile: '',
    college: '',
    course: '',
    branch: '',
    year: '',
    domain: '',
    projectName: '',
    pptUrl: '',
    prototypeUrl: '',
    demoVideoUrl: '',
    teamSize: 1,
    teamMembers: [],
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);

  // Pre-fill the name once the auth context has loaded
  useEffect(() => {
    if (user?.fullName) {
      setFormData((prev) => (prev.fullName ? prev : { ...prev, fullName: user.fullName }));
    }
  }, [user]);

  // If an entry already exists, don't show the form again
  useEffect(() => {
    hackathonService
      .getMyEntry()
      .then((res) => {
        if (res.hasRegistered && res.entry) setExistingEntry(res.entry);
      })
      .catch(() => {})
      .finally(() => setCheckingExisting(false));
  }, []);

  /** Grow / shrink the member rows to match the chosen team size (keeps what was typed). */
  const handleTeamSizeChange = (size) => {
    setFormData((prev) => {
      const needed = size - 1;
      const members = prev.teamMembers.slice(0, needed);
      while (members.length < needed) members.push({ name: '', email: '' });
      return { ...prev, teamSize: size, teamMembers: members };
    });
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => k.startsWith('member_') && delete next[k]);
      return next;
    });
  };

  const handleMemberChange = (index, field, value) => {
    setFormData((prev) => {
      const members = [...prev.teamMembers];
      members[index] = { ...members[index], [field]: value };
      return { ...prev, teamMembers: members };
    });
    const key = `member_${index}_${field}`;
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Mobile accepts digits only
    const next = name === 'mobile' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: next }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const validate = () => {
    const e = {};
    const f = formData;

    if (f.fullName.trim().length < 3) e.fullName = 'Use at least 3 characters';
    else if (!nameRegex.test(f.fullName.trim())) e.fullName = 'Letters and spaces only';

    if (!f.mobile) e.mobile = 'Mobile number is required';
    else if (!mobileRegex.test(f.mobile)) e.mobile = 'Enter a valid 10-digit Indian mobile number';

    if (!f.college) e.college = 'Select your college';
    if (!f.course) e.course = 'Select your course';
    if (!f.branch) e.branch = 'Select your branch';
    if (!f.year) e.year = 'Select your year of study';
    if (!f.domain) e.domain = 'Select a track';

    if (f.projectName.trim().length < 5) e.projectName = 'Project name needs at least 5 characters';

    if (!f.pptUrl.trim()) e.pptUrl = 'PPT link is required';
    else if (!isValidHttpUrl(f.pptUrl)) e.pptUrl = 'Enter a valid link starting with https://';

    if (!f.prototypeUrl.trim()) e.prototypeUrl = 'Prototype link is required';
    else if (!isValidHttpUrl(f.prototypeUrl)) e.prototypeUrl = 'Enter a valid link starting with https://';

    if (f.demoVideoUrl.trim() && !isValidHttpUrl(f.demoVideoUrl)) {
      e.demoVideoUrl = 'Enter a valid link starting with https://';
    }

    f.teamMembers.forEach((m, i) => {
      if (m.name.trim().length < 2) e[`member_${i}_name`] = 'Enter the member’s name';
      if (!emailRegex.test(m.email.trim())) e[`member_${i}_email`] = 'Enter a valid email';
    });

    setErrors(e);
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const found = validate();
    const firstKey = Object.keys(found)[0];
    if (firstKey) {
      // Jump to the first invalid field so nothing is hidden below the fold
      const el = document.getElementsByName(firstKey)[0] || document.getElementById(firstKey);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus?.({ preventScroll: true });
      return;
    }

    setSubmitting(true);
    setServerError('');

    try {
      const response = await hackathonService.register({
        ...formData,
        fullName: formData.fullName.trim(),
        projectName: formData.projectName.trim(),
        pptUrl: formData.pptUrl.trim(),
        prototypeUrl: formData.prototypeUrl.trim(),
        demoVideoUrl: formData.demoVideoUrl.trim(),
      });

      if (response.status === 'success') {
        setSuccessResult(response);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          (!err.response
            ? 'Cannot reach the server. Check your connection and try again.'
            : 'Registration failed. Please review your details and try again.')
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingExisting) return <Loading fullScreen message="Checking registration status" size="lg" />;

  /* ---------- Already registered ---------- */
  if (existingEntry) {
    return (
      <div className="container-page py-16 sm:py-24">
        <div className="card mx-auto max-w-xl p-8 text-center sm:p-12">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ok-soft text-ok">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold">You’re already registered</h1>
          <p className="mt-3 text-ink-muted">
            Your entry <strong className="text-ink">{existingEntry.projectName}</strong> is on file. You can review it —
            or withdraw it — from your dashboard.
          </p>
          <Link to="/dashboard" className="mt-8 inline-block">
            <Button size="lg">
              Go to dashboard <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ---------- Success ---------- */
  if (successResult) {
    const reg = successResult.registration;
    const mailOk = successResult.emailConfigured && successResult.emailSent;
    const mailFailed = successResult.emailConfigured && !successResult.emailSent;

    return (
      <div className="container-page py-14 sm:py-20">
        <div className="mx-auto max-w-2xl animate-rise">
          <div className="text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ok text-white shadow-card">
              <Check className="h-8 w-8" strokeWidth={3} aria-hidden="true" />
            </span>
            <p className="eyebrow mt-6 !text-ok">Registration confirmed</p>
            <h1 className="mt-2 font-display text-4xl font-extrabold">You’re in.</h1>
            <p className="mx-auto mt-3 max-w-md text-ink-muted">
              Your entry has been saved. Here’s what we have on record for your team.
            </p>
          </div>

          <div className="mt-8">
            {mailOk && (
              <Alert type="success" message={<>Confirmation sent from <strong>Code-a-Nova</strong> to <strong>{user?.email}</strong>.</>} />
            )}
            {mailFailed && (
              <Alert type="warning" message="Your registration is saved, but we couldn’t send the confirmation email. You can view everything on your dashboard." />
            )}
            {!successResult.emailConfigured && (
              <Alert type="info" message="Your registration is saved. Email delivery isn’t configured on this server yet." />
            )}
          </div>

          <div className="card mt-6 p-6 sm:p-8">
            <dl className="grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="eyebrow">Project</dt>
                <dd className="mt-1 font-display text-xl font-bold">{reg.projectName}</dd>
              </div>
              <div>
                <dt className="eyebrow">Track</dt>
                <dd className="mt-1 font-semibold">{reg.domain}</dd>
              </div>
              <div>
                <dt className="eyebrow">Team lead</dt>
                <dd className="mt-1 font-semibold">{reg.fullName}</dd>
              </div>
              <div>
                <dt className="eyebrow">Team size</dt>
                <dd className="mt-1 font-semibold">{reg.teamSize} {reg.teamSize === 1 ? '(solo)' : 'members'}</dd>
              </div>
            </dl>

            {reg.teamMembers?.length > 0 && (
              <div className="mt-6 border-t border-line pt-5">
                <p className="eyebrow">Team members</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {reg.teamMembers.map((m, i) => (
                    <li key={i} className="flex flex-wrap items-center gap-x-2">
                      <span className="font-semibold">{m.name}</span>
                      <span className="text-ink-muted">{m.email}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link to="/dashboard">
              <Button size="lg">
                Go to dashboard <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Form ---------- */
  return (
    <div className="container-page py-10 sm:py-14">
      <header className="max-w-2xl">
        <p className="eyebrow">Official registration</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">Register your team</h1>
        <p className="mt-3 text-ink-muted">
          Fields marked optional can be skipped; everything else is required. Each account can submit one registration.
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)]">
        {/* Section rail */}
        <nav aria-label="Form sections" className="hidden lg:block">
          <ol className="sticky top-28 space-y-1 border-l border-line">
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="-ml-px block border-l-2 border-transparent py-2 pl-4 text-sm font-medium text-ink-muted transition-colors hover:border-nova-600 hover:text-ink"
                >
                  <span className="mr-2 font-mono text-xs text-nova-600">{String(i + 1).padStart(2, '0')}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6" noValidate>
          {serverError && <Alert type="error" message={serverError} onClose={() => setServerError('')} />}
          {Object.keys(errors).some((k) => errors[k]) && (
            <Alert type="warning" message="Some fields need attention — they’re marked below." />
          )}

          <Section id="personal" index={1} title="Personal details">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Full name"
                name="fullName"
                icon={User}
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                disabled={submitting}
                autoComplete="name"
                helperText="Letters only, minimum 3 characters"
              />
              <Input
                label="Email address"
                name="email"
                type="email"
                icon={Mail}
                value={user?.email || ''}
                readOnly
                disabled
                helperText="From your verified account"
              />
              <div className="sm:col-span-2">
                <Input
                  label="Mobile number"
                  name="mobile"
                  type="tel"
                  inputMode="numeric"
                  icon={Phone}
                  value={formData.mobile}
                  onChange={handleChange}
                  error={errors.mobile}
                  disabled={submitting}
                  placeholder="9876543210"
                  autoComplete="tel-national"
                  helperText="10-digit Indian mobile number"
                />
              </div>
            </div>
          </Section>

          <Section id="academic" index={2} title="Academic details">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Select label="College name" name="college" placeholder="Select your college" options={COLLEGES}
                  value={formData.college} onChange={handleChange} error={errors.college} disabled={submitting} />
              </div>
              <Select label="Course" name="course" placeholder="Select course" options={COURSES}
                value={formData.course} onChange={handleChange} error={errors.course} disabled={submitting} />
              <Select label="Branch" name="branch" placeholder="Select branch" options={BRANCHES}
                value={formData.branch} onChange={handleChange} error={errors.branch} disabled={submitting} />
              <div className="sm:col-span-2">
                <Select label="Year of study" name="year" placeholder="Select year" options={YEARS}
                  value={formData.year} onChange={handleChange} error={errors.year} disabled={submitting} />
              </div>
            </div>
          </Section>

          <Section id="project" index={3} title="Project & links">
            <div className="space-y-5">
              <Select label="Domain / track" name="domain" placeholder="Select a track" options={TRACK_NAMES}
                value={formData.domain} onChange={handleChange} error={errors.domain} disabled={submitting} />
              <Input
                label="Project name"
                name="projectName"
                icon={FileText}
                value={formData.projectName}
                onChange={handleChange}
                error={errors.projectName}
                disabled={submitting}
                placeholder="e.g. Rural Health Triage Assistant"
                helperText="Minimum 5 characters"
              />
              <Input
                label="PPT link"
                name="pptUrl"
                type="url"
                icon={Link2}
                value={formData.pptUrl}
                onChange={handleChange}
                error={errors.pptUrl}
                disabled={submitting}
                placeholder="https://drive.google.com/…"
                helperText="Google Drive or OneDrive link with view access"
              />
              <Input
                label="Prototype link"
                name="prototypeUrl"
                type="url"
                icon={Link2}
                value={formData.prototypeUrl}
                onChange={handleChange}
                error={errors.prototypeUrl}
                disabled={submitting}
                placeholder="https://github.com/you/project"
                helperText="GitHub repository, Figma file or live demo"
              />
              <Input
                label="Demo video link"
                optional
                name="demoVideoUrl"
                type="url"
                icon={Video}
                value={formData.demoVideoUrl}
                onChange={handleChange}
                error={errors.demoVideoUrl}
                disabled={submitting}
                placeholder="https://youtube.com/watch?v=…"
                helperText="YouTube or Drive link"
              />
            </div>
          </Section>

          <Section id="team" index={4} title="Team">
            <fieldset>
              <legend className="text-[13px] font-semibold text-ink">Team size (including you)</legend>
              <div className="mt-2 grid max-w-md grid-cols-5 gap-2" role="radiogroup" aria-label="Team size">
                {TEAM_SIZES.map((size) => {
                  const active = formData.teamSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => handleTeamSizeChange(size)}
                      disabled={submitting}
                      className={`rounded-[10px] border py-3 font-mono text-sm font-semibold transition-all duration-200 ${
                        active
                          ? 'border-ink bg-ink text-surface shadow-card'
                          : 'border-line-strong bg-surface text-ink hover:border-ink'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-ink-muted">
                {formData.teamSize === 1
                  ? 'Solo entry — no extra member details needed.'
                  : `Add details for ${formData.teamSize - 1} teammate${formData.teamSize - 1 > 1 ? 's' : ''} below.`}
              </p>
            </fieldset>

            {formData.teamMembers.length > 0 && (
              <div className="mt-6 space-y-4 border-t border-line pt-6">
                {formData.teamMembers.map((member, idx) => (
                  <div key={idx} className="rounded-[10px] border border-line bg-paper p-5">
                    <p className="eyebrow mb-4">Member {idx + 2}</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Member name"
                        name={`member_${idx}_name`}
                        icon={User}
                        placeholder="Full name"
                        value={member.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        error={errors[`member_${idx}_name`]}
                        disabled={submitting}
                      />
                      <Input
                        label="Member email"
                        name={`member_${idx}_email`}
                        type="email"
                        icon={Mail}
                        placeholder="member@college.edu"
                        value={member.email}
                        onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                        error={errors[`member_${idx}_email`]}
                        disabled={submitting}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <div className="flex flex-col-reverse items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-xs text-ink-muted sm:max-w-xs">
              <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
              A confirmation email from Code-a-Nova is sent to {user?.email} after you submit.
            </p>
            <Button type="submit" size="lg" loading={submitting}>
              Submit registration
              {!submitting && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
