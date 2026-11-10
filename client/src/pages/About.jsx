import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Lightbulb, Users, Award, CheckCircle } from 'lucide-react';
import Button from '../components/Button';

export default function About() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
            About The Event
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Pioneering Practical Engineering Excellence
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            The Code-a-Nova Hackathon 2026 is designed to challenge collegiate developers to solve real-world problems through robust full-stack engineering, clean user experience, and innovative architecture.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 border border-indigo-500/20">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Our Mission</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              To provide a level playing field for aspiring software developers to build scalable applications, learn collaborative workflows, and interface with industry practices.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5 border border-purple-500/20">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Open Innovation</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Teams can choose from five technology tracks—ranging from Artificial Intelligence to Distributed Web Apps—or define novel intersections between disciplines.
            </p>
          </div>
        </div>

        {/* Evaluation Benchmarks */}
        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-slate-800 mb-16">
          <h2 className="font-heading text-2xl font-bold text-white mb-6">
            Evaluation Benchmarks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Functional Completeness:</strong>
                End-to-end working prototypes without broken interactions or dead code.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Architecture & Code Quality:</strong>
                Maintainable codebase structure, separation of concerns, and clean logic.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">UI/UX Design Standard:</strong>
                Responsive layouts, intentional typography, and thoughtful user workflows.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Security & Resilience:</strong>
                Safe authentication practices, input sanitization, and graceful error handling.
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/signup">
            <Button size="lg">Join Code-a-Nova 2026</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

