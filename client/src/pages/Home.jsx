import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users2,
  Trophy,
  Calendar,
  Layers,
  Code2,
  CheckCircle,
} from 'lucide-react';
import Button from '../components/Button';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-32 md:pb-36 border-b border-slate-800/80">
        {/* Ambient Gradient Glows */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/10 blur-[130px] rounded-full" />
        <div className="pointer-events-none absolute top-12 left-10 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>National Collegiate Developer Hackathon</span>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
            Code-a-Nova{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Hackathon 2026
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Build, collaborate, and compete with the brightest student engineers.
            Showcase your prototypes, assemble your dream squad, and win exciting awards.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            {isAuthenticated ? (
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto shadow-indigo-500/20">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    <span>Register Now</span>
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <span>Participant Login</span>
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto">
            <div className="glass-panel p-5 rounded-2xl text-left border border-slate-800/80">
              <Users2 className="w-6 h-6 text-indigo-400 mb-2" />
              <div className="font-heading font-bold text-white text-lg">1 to 5 Members</div>
              <div className="text-xs text-slate-400 mt-1">Flexible solo or team entries</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl text-left border border-slate-800/80">
              <ShieldCheck className="w-6 h-6 text-purple-400 mb-2" />
              <div className="font-heading font-bold text-white text-lg">Email OTP Verified</div>
              <div className="text-xs text-slate-400 mt-1">Authentic participant security</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl text-left border border-slate-800/80">
              <Layers className="w-6 h-6 text-pink-400 mb-2" />
              <div className="font-heading font-bold text-white text-lg">5 Innovation Tracks</div>
              <div className="text-xs text-slate-400 mt-1">AI/ML, Web, Cloud, IoT, Security</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl text-left border border-slate-800/80">
              <Trophy className="w-6 h-6 text-amber-400 mb-2" />
              <div className="font-heading font-bold text-white text-lg">Grand Awards</div>
              <div className="text-xs text-slate-400 mt-1">Cash prizes, merch & internships</div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 border-b border-slate-800/80 bg-[#020617]/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
              Roadmap
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              Event Timeline & Milestones
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Follow these core milestones from initial account verification to project demonstration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl relative border-t-2 border-t-indigo-500">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Phase 01</div>
              <h3 className="text-lg font-bold text-white mb-2">Account Registration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sign up with your credentials, verify your student identity via secure 6-digit OTP, and access your private dashboard.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl relative border-t-2 border-t-purple-500">
              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Phase 02</div>
              <h3 className="text-lg font-bold text-white mb-2">Team Assembly</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Form a squad of 1 to 5 members, select your target technology track, and submit project details.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl relative border-t-2 border-t-pink-500">
              <div className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-2">Phase 03</div>
              <h3 className="text-lg font-bold text-white mb-2">Prototype Submission</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide your presentation deck, working prototype repository, and live demonstration links before the deadline.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl relative border-t-2 border-t-emerald-500">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Phase 04</div>
              <h3 className="text-lg font-bold text-white mb-2">Evaluation & Awards</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Expert industry jury review, project presentations, leaderboard rankings, and celebration of winning teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prizes & Recognition */}
      <section className="py-24 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
              Recognition
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              Prizes & Opportunities
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Recognizing outstanding creativity, engineering depth, and execution rigor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="glass-card p-8 rounded-2xl text-center border border-slate-800 hover:border-indigo-500/40 transition-smooth">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/20">
                <Trophy className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Grand Champion</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Top overall project across all tracks with highest score in innovation and practical implementation.
              </p>
              <div className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 py-1.5 px-3 rounded-lg inline-block">
                Trophy + Cash Prize + Fast-Track Interview
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl text-center border border-slate-800 hover:border-purple-500/40 transition-smooth">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Track Winners</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Best-in-class solutions in each respective track: AI/ML, Web Dev, IoT, Cybersecurity, and Blockchain.
              </p>
              <div className="text-xs text-purple-400 font-semibold bg-purple-500/10 py-1.5 px-3 rounded-lg inline-block">
                Track Awards + Certificates + Swag Kit
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl text-center border border-slate-800 hover:border-emerald-500/40 transition-smooth">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20">
                <Code2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Internship Consideration</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Direct consideration for full-stack developer internship roles with Code-a-Nova for top performers.
              </p>
              <div className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 py-1.5 px-3 rounded-lg inline-block">
                Internship Offers + Mentorship
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-indigo-500/30 relative overflow-hidden shadow-2xl">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4 relative z-10">
              Ready to Showcase Your Skills?
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto mb-8 relative z-10">
              Join hundreds of enthusiastic developers. Register your account, verify via OTP, and register your hackathon team today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Create Your Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
