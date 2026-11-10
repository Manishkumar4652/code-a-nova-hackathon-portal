import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#020617] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-white">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-lg text-white">
                Code-a-Nova
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering the next generation of builders, problem-solvers, and innovators through national collegiate hackathons.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-smooth">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition-smooth">
                  About Event
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition-smooth">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-indigo-400 transition-smooth">
                  Register Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines & Tracks */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Domains
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="text-slate-400">AI / Machine Learning</li>
              <li className="text-slate-400">Full-Stack Web Development</li>
              <li className="text-slate-400">Cybersecurity & Trust</li>
              <li className="text-slate-400">Internet of Things (IoT)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} Code-a-Nova. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-slate-500">
            <span>Official Hackathon Registration Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

