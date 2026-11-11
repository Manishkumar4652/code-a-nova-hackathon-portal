import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Instagram, Mail } from 'lucide-react';
import Logo from './Logo';
import useContactEmail from '../hooks/useContactEmail';
import { SOCIALS, TRACKS } from '../config/event';

const socialIcons = { github: Github, linkedin: Linkedin, twitter: Twitter, instagram: Instagram };

const footLink = 'text-sm text-[#AAB4C5] transition-colors duration-200 hover:text-surface';

export default function Footer() {
  const email = useContactEmail();

  return (
    <footer className="mt-auto w-full border-t border-white/10 bg-navy text-[#AAB4C5]">
      <div className="container-page py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="space-y-5 md:col-span-5">
            <Link to="/" className="inline-block" aria-label="Code-a-Nova home">
              <Logo tone="light" />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed">
              A collegiate hackathon for builders — form a team, ship a prototype and demo it to industry judges.
            </p>

            {email && (
              <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-sm font-medium text-surface hover:text-nova-300">
                <Mail className="h-4 w-4" aria-hidden="true" />
                {email}
              </a>
            )}

            <ul className="flex items-center gap-2" aria-label="Social links">
              {SOCIALS.map((s) => {
                const Icon = socialIcons[s.key];
                return (
                  <li key={s.key}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#AAB4C5] transition-all duration-200 hover:border-nova-400 hover:text-nova-300"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <nav className="md:col-span-3" aria-label="Footer">
            <h4 className="eyebrow !text-[#7F8CA3]">Quick navigation</h4>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/" className={footLink}>Home</Link></li>
              <li><Link to="/about" className={footLink}>About</Link></li>
              <li><Link to="/contact" className={footLink}>Contact</Link></li>
              <li><Link to="/login" className={footLink}>Login</Link></li>
              <li><Link to="/signup" className={footLink}>Sign up</Link></li>
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h4 className="eyebrow !text-[#7F8CA3]">Tracks</h4>
            <ul className="mt-4 space-y-2.5">
              {TRACKS.map((t) => (
                <li key={t.name} className="text-sm">{t.name}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} Code-a-Nova. All rights reserved.</p>
          <p className="font-mono uppercase tracking-wider text-[#7F8CA3]">Hackathon registration portal</p>
        </div>
      </div>
    </footer>
  );
}
