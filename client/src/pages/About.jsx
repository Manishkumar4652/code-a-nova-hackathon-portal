import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Layers, ShieldCheck, Users2, Link2, Mail, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import { EVENT } from '../config/event';

const PILLARS = [
  {
    icon: Target,
    title: 'Our mission',
    text: 'Give student developers a fair stage to build real software, work as a team and meet people from the industry.',
  },
  {
    icon: Layers,
    title: 'Open innovation',
    text: 'Pick one of six technology tracks — or combine disciplines. What matters is a prototype that solves a real problem.',
  },
];

const RULES = [
  { icon: Users2, title: `Teams of ${EVENT.teamSize.min}–${EVENT.teamSize.max}`, text: 'Enter solo or bring up to four teammates. Each member needs a name and email.' },
  { icon: ShieldCheck, title: 'One entry per account', text: 'Accounts are verified by email OTP, and every account can submit a single registration.' },
  { icon: Link2, title: 'What you submit', text: 'A shareable PPT link and a prototype link (GitHub, Figma or live demo). A demo video is optional.' },
  { icon: Mail, title: 'Confirmation email', text: 'As soon as you register you get an email from Code-a-Nova with your team and project details.' },
];

const CRITERIA = [
  ['Functionality', 'Does the prototype actually work end-to-end?'],
  ['Engineering quality', 'Clean structure, sensible architecture, readable code.'],
  ['Design & usability', 'Responsive layouts and a thoughtful user experience.'],
  ['Security & resilience', 'Safe handling of data, input validation, graceful errors.'],
];

export default function About() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="container-page py-16 sm:py-24">
          <p className="eyebrow">About the event</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">
            A hackathon built around practical engineering.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            {EVENT.name} challenges collegiate developers to solve real-world problems with robust full-stack
            engineering, clear design and sound architecture.
          </p>
        </div>
      </section>

      <section className="border-b border-line py-16 sm:py-20">
        <div className="container-page grid gap-6 md:grid-cols-2">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <article key={title} className="card p-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-nova-50 text-nova-600">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-bold">{title}</h2>
              <p className="mt-2 leading-relaxed text-ink-muted">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-b border-line bg-paper-2/60 py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            <p className="eyebrow">Participation</p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">How registration works</h2>
          </div>
          <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {RULES.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <dt className="flex items-center gap-2.5 font-display text-lg font-semibold">
                  <Icon className="h-5 w-5 text-nova-600" aria-hidden="true" />
                  {title}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            <p className="eyebrow">Judging</p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">What the jury looks for</h2>
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {CRITERIA.map(([title, text], i) => (
              <li key={title} className="grid grid-cols-[3rem_1fr] gap-2 py-5 sm:grid-cols-[4rem_1fr]">
                <span className="font-mono text-sm text-nova-600">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-display text-xl font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="container-page mt-14">
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl2 bg-navy p-8 text-surface sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="font-display text-2xl font-bold !text-surface sm:text-3xl">Ready to build with us?</h2>
              <p className="mt-2 text-[#AAB4C5]">Create your account and register your team today.</p>
            </div>
            <Link to="/signup">
              <Button variant="light" size="lg">
                Join {EVENT.shortName} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
