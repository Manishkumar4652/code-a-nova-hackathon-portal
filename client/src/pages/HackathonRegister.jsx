import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hackathonService } from '../services/api';
import {
  Code2,
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Calendar,
  Layers,
  FileText,
  Link2,
  Video,
  Users2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
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

const DOMAINS = [
  'AI / Machine Learning',
  'Full-Stack Web Development',
  'Internet of Things (IoT)',
  'Cyber Security & Privacy',
  'Blockchain / Web3',
  'Cloud & DevOps Solutions',
];

const urlRegex = /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .~-]*)*\/?(\?.*)?$/i;
const mobileRegex = /^[6-9]\d{9}$/;
const nameRegex = /^[a-zA-Z\s]+$/;
const emailRegex = /^\S+@\S+\.\S+$/;

export default function HackathonRegister() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [checkingExisting, setCheckingExisting] = useState(true);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [existingEntry, setExistingEntry] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    mobile: '',
    college: COLLEGES[0],
    course: COURSES[0],
    branch: BRANCHES[0],
    year: YEARS[2], // Default 3rd Year
    domain: DOMAINS[0],
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

  // Sync user fullName if user context finishes loading
  useEffect(() => {
    if (user?.fullName && !formData.fullName) {
      setFormData((prev) => ({ ...prev, fullName: user.fullName }));
    }
  }, [user]);

  // Check if user has already submitted a registration
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await hackathonService.getMyEntry();
        if (res.status === 'success' && res.hasRegistered && res.entry) {
          setAlreadyRegistered(true);
          setExistingEntry(res.entry);
        }
      } catch (err) {
        // Not registered or network check completed
      } finally {
        setCheckingExisting(false);
      }
    };

    checkStatus();
  }, []);

  // Update dynamic team members array when teamSize changes
  const handleTeamSizeChange = (newSize) => {
    const parsed = parseInt(newSize, 10);
    const requiredMembers = parsed - 1;

    setFormData((prev) => {
      const currentMembers = [...prev.teamMembers];
      let updatedMembers = [];

      if (parsed === 1) {
        updatedMembers = [];
      } else if (currentMembers.length < requiredMembers) {
        // Expand preserving existing
        updatedMembers = [...currentMembers];
        while (updatedMembers.length < requiredMembers) {
          updatedMembers.push({ name: '', email: '' });
        }
      } else {
        // Truncate to new required size
        updatedMembers = currentMembers.slice(0, requiredMembers);
      }

      return {
        ...prev,
        teamSize: parsed,
        teamMembers: updatedMembers,
      };
    });

    if (errors.teamSize) setErrors((prev) => ({ ...prev, teamSize: '' }));
  };

  const handleMemberChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.teamMembers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, teamMembers: updated };
    });

    const key = `member_${index}_${field}`;
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const validate = () => {
    const newErrors = {};

    // Personal
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters long.';
    } else if (!nameRegex.test(formData.fullName.trim())) {
      newErrors.fullName = 'Full name can only contain letters and spaces.';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!mobileRegex.test(formData.mobile.trim())) {
      newErrors.mobile = 'Please provide a valid 10-digit Indian mobile number (e.g. 9876543210).';
    }

    // Academic
    if (!formData.college) newErrors.college = 'College selection is required.';
    if (!formData.course) newErrors.course = 'Course selection is required.';
    if (!formData.branch) newErrors.branch = 'Branch selection is required.';
    if (!formData.year) newErrors.year = 'Year of study is required.';

    // Project
    if (!formData.domain) newErrors.domain = 'Domain track selection is required.';

    if (!formData.projectName.trim() || formData.projectName.trim().length < 5) {
      newErrors.projectName = 'Project name must be at least 5 characters long.';
    }

    if (!formData.pptUrl.trim()) {
      newErrors.pptUrl = 'Shareable PPT presentation link is required.';
    } else if (!urlRegex.test(formData.pptUrl.trim())) {
      newErrors.pptUrl = 'Please provide a valid URL for your presentation (e.g. https://drive.google.com/...).';
    }

    if (!formData.prototypeUrl.trim()) {
      newErrors.prototypeUrl = 'Prototype URL is required.';
    } else if (!urlRegex.test(formData.prototypeUrl.trim())) {
      newErrors.prototypeUrl = 'Please provide a valid URL for your prototype (GitHub / Figma / Live demo).';
    }

    if (formData.demoVideoUrl && formData.demoVideoUrl.trim() !== '') {
      if (!urlRegex.test(formData.demoVideoUrl.trim())) {
        newErrors.demoVideoUrl = 'Please provide a valid URL for demo video (YouTube / Google Drive).';
      }
    }

    // Dynamic Team Members validation
    if (formData.teamSize > 1) {
      formData.teamMembers.forEach((member, i) => {
        if (!member.name || member.name.trim().length < 2) {
          newErrors[`member_${i}_name`] = `Member #${i + 2} name must be at least 2 characters.`;
        }
        if (!member.email || !emailRegex.test(member.email.trim())) {
          newErrors[`member_${i}_email`] = `Member #${i + 2} has an invalid email format.`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    setServerError('');

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        mobile: formData.mobile.trim(),
        college: formData.college,
        course: formData.course,
        branch: formData.branch,
        year: formData.year,
        domain: formData.domain,
        projectName: formData.projectName.trim(),
        pptUrl: formData.pptUrl.trim(),
        prototypeUrl: formData.prototypeUrl.trim(),
        demoVideoUrl: formData.demoVideoUrl.trim(),
        teamSize: formData.teamSize,
        teamMembers: formData.teamMembers,
      };

      const response = await hackathonService.register(payload);

      if (response.status === 'success') {
        setSuccessResult({
          registration: response.registration,
          emailSent: response.emailSent,
          emailConfigured: response.emailConfigured,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' || !err.response
          ? 'Cannot connect to backend server. Please verify the backend is running on http://localhost:5000.'
          : 'Registration failed. Please check your submission details.');
      setServerError(message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingExisting) {
    return <Loading fullScreen message="Checking registration status..." size="lg" />;
  }

  // View: Already registered
  if (alreadyRegistered && existingEntry) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto glass-panel p-8 sm:p-10 rounded-3xl border border-indigo-500/30 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            You Are Already Registered!
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            You have already submitted your official project entry (<strong>{existingEntry.projectName}</strong>) for the Code-a-Nova Hackathon 2026.
          </p>
          <div className="pt-2">
            <Link to="/dashboard">
              <Button size="lg">Go to Dashboard to View Submission</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // View: Successful Submission Screen
  if (successResult) {
    const reg = successResult.registration;
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/40 shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full" />

          {/* Success Banner */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Registration Successful!
            </h1>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your hackathon entry has been officially saved and recorded in the Code-a-Nova registry.
            </p>
          </div>

          {/* Email Delivery Status Banner */}
          <div className="mb-8">
            {successResult.emailConfigured && successResult.emailSent ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>
                  Official confirmation email dispatched from <strong>Code-a-Nova</strong> to <strong>{user?.email}</strong>.
                </span>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>
                  Registration recorded in database. Confirmation email could not be sent (SMTP service unconfigured in environment).
                </span>
              </div>
            )}
          </div>

          {/* Summary Card */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4 mb-8">
            <h3 className="font-heading font-bold text-lg text-white border-b border-slate-800 pb-3">
              Submission Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 block text-xs">Project Name</span>
                <strong className="text-white font-semibold text-base">{reg.projectName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Domain / Track</span>
                <span className="text-indigo-400 font-semibold">{reg.domain}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Lead Participant</span>
                <span className="text-white font-medium">{reg.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Team Composition</span>
                <span className="text-white font-medium">
                  {reg.teamSize} {reg.teamSize === 1 ? 'Member (Solo)' : 'Members'}
                </span>
              </div>
            </div>

            {reg.teamMembers && reg.teamMembers.length > 0 && (
              <div className="pt-3 border-t border-slate-800/80">
                <span className="text-xs text-slate-400 block mb-2 font-semibold">Additional Team Members:</span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {reg.teamMembers.map((m, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span>{m.name}</span>
                      <span className="text-slate-500">({m.email})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="flex justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                <span>View Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Official Event Registration</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Hackathon Registration Form
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Please fill out all mandatory fields accurately. Once submitted, your entry will be locked and confirmed.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <Alert type="error" message={serverError} onClose={() => setServerError('')} />
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Section 1: Lead Participant Details */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80">
              <User className="w-5 h-5 text-indigo-400" />
              <h2 className="font-heading text-lg font-bold text-white">
                1. Personal Details (Lead / Submitter)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Full Name *"
                name="fullName"
                icon={User}
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                disabled={submitting}
                placeholder="Your official full name"
                helperText="Minimum 3 characters, letters only"
              />

              <Input
                label="Registered Email (Account Verified)"
                name="email"
                type="email"
                icon={Mail}
                value={user?.email || ''}
                disabled={true}
                helperText="Pre-filled from your authenticated session (Read-only)"
              />

              <div className="sm:col-span-2">
                <Input
                  label="Mobile Number *"
                  name="mobile"
                  type="tel"
                  icon={Phone}
                  value={formData.mobile}
                  onChange={handleChange}
                  error={errors.mobile}
                  disabled={submitting}
                  placeholder="10-digit Indian mobile number"
                  helperText="10 digits starting with 6, 7, 8, or 9"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Details */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80">
              <GraduationCap className="w-5 h-5 text-purple-400" />
              <h2 className="font-heading text-lg font-bold text-white">
                2. Academic Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  College / Institution Name *
                </label>
                <select
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm p-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-smooth"
                >
                  {COLLEGES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
                {errors.college && <p className="text-xs text-rose-400">• {errors.college}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Course Degree *
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm p-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-smooth"
                >
                  {COURSES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Branch / Department *
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm p-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-smooth"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b} className="bg-slate-900 text-white">
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Year of Study *
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm p-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-smooth"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y} className="bg-slate-900 text-white">
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Project Submission Details */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80">
              <Code2 className="w-5 h-5 text-pink-400" />
              <h2 className="font-heading text-lg font-bold text-white">
                3. Project Details & Links
              </h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Technology Track / Domain *
                </label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm p-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-smooth"
                >
                  {DOMAINS.map((d) => (
                    <option key={d} value={d} className="bg-slate-900 text-white">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Project Title *"
                name="projectName"
                icon={FileText}
                value={formData.projectName}
                onChange={handleChange}
                error={errors.projectName}
                disabled={submitting}
                placeholder="e.g. Decentralized Health Verification System"
                helperText="Minimum 5 characters"
              />

              <Input
                label="Presentation Deck Link (PPT / Slide Deck) *"
                name="pptUrl"
                type="url"
                icon={Link2}
                value={formData.pptUrl}
                onChange={handleChange}
                error={errors.pptUrl}
                disabled={submitting}
                placeholder="https://drive.google.com/file/d/..."
                helperText="Shareable Google Drive or OneDrive link with view access"
              />

              <Input
                label="Working Prototype Link (GitHub / Figma / Live Demo) *"
                name="prototypeUrl"
                type="url"
                icon={Link2}
                value={formData.prototypeUrl}
                onChange={handleChange}
                error={errors.prototypeUrl}
                disabled={submitting}
                placeholder="https://github.com/your-username/project-repo"
                helperText="GitHub repository, Figma design prototype, or live URL"
              />

              <Input
                label="Demo Video Link (Optional)"
                name="demoVideoUrl"
                type="url"
                icon={Video}
                value={formData.demoVideoUrl}
                onChange={handleChange}
                error={errors.demoVideoUrl}
                disabled={submitting}
                placeholder="https://youtube.com/watch?v=... or Drive link"
                helperText="Optional 2-3 minute demonstration video"
              />
            </div>
          </div>

          {/* Section 4: Dynamic Team Composition */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80">
              <Users2 className="w-5 h-5 text-amber-400" />
              <h2 className="font-heading text-lg font-bold text-white">
                4. Team Size & Member Management
              </h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Select Total Team Size (Including Leader) *
                </label>
                <div className="grid grid-cols-5 gap-2 sm:gap-4 max-w-lg">
                  {[1, 2, 3, 4, 5].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleTeamSizeChange(size)}
                      disabled={submitting}
                      className={`py-3 rounded-xl font-bold text-sm transition-smooth border ${
                        formData.teamSize === size
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {size === 1 ? '1 (Solo)' : size}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {formData.teamSize === 1
                    ? 'Solo entry — You are the sole participant. No additional member fields required.'
                    : `Team of ${formData.teamSize} — Requires exactly ${formData.teamSize - 1} additional member(s).`}
                </p>
              </div>

              {/* Dynamic Additional Member Fields */}
              {formData.teamSize > 1 && (
                <div className="space-y-4 pt-4 border-t border-slate-800/80">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    Additional Team Members Information
                  </div>

                  {formData.teamMembers.map((member, idx) => (
                    <div
                      key={idx}
                      className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300">
                          Team Member #{idx + 2}
                        </span>
                        <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                          Partner {idx + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Full Name *"
                          placeholder="Member's full name"
                          icon={User}
                          value={member.name}
                          onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                          error={errors[`member_${idx}_name`]}
                          disabled={submitting}
                        />
                        <Input
                          label="Email Address *"
                          type="email"
                          placeholder="member@example.com"
                          icon={Mail}
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
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              className="w-full py-4 text-base shadow-xl shadow-indigo-600/20"
            >
              <span>Submit Official Hackathon Registration</span>
              {!submitting && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

