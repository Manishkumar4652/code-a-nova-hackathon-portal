import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Check, UserPlus, MailCheck, LogIn, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { EVENT, TRACKS, TIMELINE, PRIZES } from '../config/event';

const HOW_IT_WORKS = [
  { icon: UserPlus, title: 'Create an account', text: 'Name, email and a password.' },
  { icon: MailCheck, title: 'Verify with OTP', text: 'Enter the 6-digit code we email you.' },
  { icon: LogIn, title: 'Log in', text: 'Open your personal dashboard.' },
  { icon: ClipboardList, title: 'Register your team', text: 'Add 1–5 members and your project links.' },
];

/** Perforated "ticket" summarising the event — the hero's visual anchor. */
function EventTicket() {
  const facts = [
    ['Team size', `${EVENT.teamSize.min} – ${EVENT.teamSize.max} members`],
    ['Tracks', `${TRACKS.length} to choose from`],
    ['Submit', 'PPT + working prototype'],
    ['Status', 'Registrations open'],
  ];

  return (
    <div className="relative mx-auto w-full max-w-sm rotate-[1.5deg] transition-transform duration-500 ease-out hover:rotate-0 lg:ml-auto">
      <div className="overflow-hidden rounded-xl2 bg-navy text-surface shadow-lift">
        <div className="dot-grid-light relative px-7 pb-6 pt-7">
          <p className="eyebrow !text-nova-300">Admit one team</p>
          <p className="mt-3 font-display text-3xl font-bold leading-tight !text-surface">
            Code<span className="text-nova-400">-a-</span>Nova
            <span className="block text-[#AAB4C5]">Hackathon 2026</span>
          </p>
        </div>

        {/* Perforation */}
        <div className="relative">
          <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-paper" aria-hidden="true" />
          <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-paper" aria-hidden="true" />
          <div className="mx-6 border-t-2 border-dashed border-white/20" />
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-5 px-7 pb-7 pt-6">
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt className="eyebrow !text-[#7F8CA3]">{k}</dt>
              <dd className="mt-1 text-sm font-semibold text-surface">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="dot-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-page relative grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-10">
          <div className="animate-rise">
            <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-nova-600" aria-hidden="true" />
              National collegiate hackathon · 2026
            </p>

            <h1 className="mt-6 font-display text-[2.75rem] font-extrabold leading-[1.02] sm:text-6xl lg:text-[4.5rem]">
              Build something
              <br />
              worth <span className="relative whitespace-nowrap text-nova-600">shipping.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Form a team of up to five, pick a track, and turn an idea into a working prototype. Register in minutes —
              verified by email, tracked on your own dashboard.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Go to dashboard <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Register now <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <EventTicket />
        </div>
      </section>

      {/* Tracks */}
      <section className="border-b border-line py-20 sm:py-24" aria-labelledby="tracks-heading">
        <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Event highlights</p>
            <h2 id="tracks-heading" className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Six tracks. One goal: a prototype that works.
            </h2>
            <p className="mt-4 text-ink-muted">
              Choose the track that fits your idea. Every entry is judged on execution, clarity and real-world impact.
            </p>
          </div>

          <ul className="divide-y divide-line border-y border-line">
            {TRACKS.map((t, i) => (
              <li
                key={t.name}
                className="group grid grid-cols-[3rem_1fr] items-baseline gap-2 py-5 transition-colors duration-200 hover:bg-paper-2/60 sm:grid-cols-[4rem_1fr] sm:px-3"
              >
                <span className="font-mono text-sm text-nova-600">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-display text-xl font-semibold">{t.name}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{t.blurb}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-b border-line bg-paper-2/60 py-20 sm:py-24" aria-labelledby="timeline-heading">
        <div className="container-page">
          <p className="eyebrow">Timeline</p>
          <h2 id="timeline-heading" className="mt-3 max-w-xl font-display text-3xl font-bold sm:text-4xl">
            From sign-up to demo day
          </h2>

          <ol className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
            <div className="absolute left-[15px] top-2 hidden h-[calc(100%-1rem)] w-px bg-line-strong max-md:block" aria-hidden="true" />
            <div className="absolute left-0 right-0 top-[15px] hidden h-px bg-line-strong md:block" aria-hidden="true" />
            {TIMELINE.map((item) => (
              <li key={item.step} className="relative pl-12 md:pl-0 md:pt-12">
                <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-nova-600 bg-paper font-mono text-[11px] font-semibold text-nova-600">
                  {item.step}
                </span>
                <p className="font-mono text-xs font-medium uppercase tracking-wider text-nova-700">{item.date}</p>
                <h3 className="mt-2 font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Prizes */}
      <section className="border-b border-line py-20 sm:py-24" aria-labelledby="prizes-heading">
        <div className="container-page">
          <p className="eyebrow">Prizes</p>
          <h2 id="prizes-heading" className="mt-3 max-w-xl font-display text-3xl font-bold sm:text-4xl">
            Recognition that opens doors
          </h2>

          <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,6fr)_minmax(0,3fr)_minmax(0,3fr)]">
            {PRIZES.map((p) => (
              <article
                key={p.rank}
                className={`flex flex-col rounded-xl2 p-7 transition-transform duration-300 ease-out hover:-translate-y-1 ${
                  p.featured ? 'bg-navy text-surface shadow-lift' : 'card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className={`eyebrow ${p.featured ? '!text-nova-300' : ''}`}>{p.rank}</p>
                  <Trophy className={`h-5 w-5 ${p.featured ? 'text-nova-400' : 'text-nova-600'}`} aria-hidden="true" />
                </div>
                <p
                  className={`mt-6 font-display font-extrabold leading-none ${
                    p.featured ? 'text-6xl !text-surface' : 'text-4xl'
                  }`}
                >
                  {p.amount}
                </p>
                <ul className={`mt-8 space-y-2.5 text-sm ${p.featured ? 'text-[#C9D1DF]' : 'text-ink-soft'}`}>
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5">
                      <Check
                        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${p.featured ? 'text-nova-400' : 'text-ok'}`}
                        aria-hidden="true"
                      />
                      {perk}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works + CTA */}
      <section className="py-20 sm:py-24" aria-labelledby="how-heading">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <p className="eyebrow">How to register</p>
              <h2 id="how-heading" className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                Four steps, about three minutes.
              </h2>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to={isAuthenticated ? '/hackathon/register' : '/signup'}>
                  <Button size="lg" className="w-full sm:w-auto">
                    {isAuthenticated ? 'Register your team' : 'Create your account'}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>

            <ol className="grid gap-4 sm:grid-cols-2">
              {HOW_IT_WORKS.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="card flex gap-4 p-5">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-nova-50 text-nova-600">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">Step {i + 1}</p>
                    <h3 className="mt-0.5 font-display text-lg font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-ink-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
