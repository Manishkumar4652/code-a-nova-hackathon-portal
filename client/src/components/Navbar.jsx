import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import Logo from './Logo';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close the mobile menu whenever the route changes
  useEffect(() => setOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const desktopLink = ({ isActive }) =>
    `relative py-1 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-ink after:absolute after:inset-x-0 after:-bottom-[19px] after:h-0.5 after:bg-nova-600'
        : 'text-ink-muted hover:text-ink'
    }`;

  const mobileLink = ({ isActive }) =>
    `block rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors ${
      isActive ? 'bg-nova-50 text-nova-700' : 'text-ink-soft hover:bg-paper-2'
    }`;

  const firstName = user?.fullName?.split(' ')[0] || 'Account';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="container-page">
        <div className="flex h-[60px] items-center justify-between">
          <Link to="/" aria-label="Code-a-Nova home" className="rounded-lg">
            <Logo />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={desktopLink}>
                {l.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <NavLink to="/dashboard" className={desktopLink}>
                Dashboard
              </NavLink>
            )}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 rounded-[10px] border border-line bg-surface px-3 py-1.5 text-[13px] font-medium text-ink transition-colors hover:border-ink"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[10px] font-bold uppercase text-surface">
                    {firstName[0]}
                  </span>
                  <span className="max-w-[110px] truncate">{firstName}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-ink hover:bg-paper-2 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-paper px-4 pb-5 pt-3 md:hidden">
          <nav className="space-y-1" aria-label="Mobile">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={mobileLink}>
                {l.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <NavLink to="/dashboard" className={mobileLink}>
                <span className="inline-flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Dashboard
                </span>
              </NavLink>
            )}
          </nav>

          <div className="mt-4 border-t border-line pt-4">
            {isAuthenticated ? (
              <div className="space-y-3">
                <p className="px-1 text-xs text-ink-muted">
                  Signed in as <strong className="text-ink">{user?.fullName}</strong>
                </p>
                <Button variant="outline" onClick={handleLogout} className="w-full">
                  <LogOut className="h-4 w-4" aria-hidden="true" /> Log out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
