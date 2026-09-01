import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, User, LogOut, Heart, Home, Calendar,
  Stethoscope, FileText, Pill, Leaf, ChevronDown, Shield,
} from 'lucide-react';
import { useHealthSaathi } from '../../context/HealthSaathiContext';

const navLinks = [
  { to: '/dashboard',      label: 'Dashboard',    icon: Home },
  { to: '/doctors',        label: 'Doctors',       icon: Stethoscope },
  { to: '/appointments',   label: 'Appointments',  icon: Calendar },
  { to: '/health-records', label: 'Records',       icon: FileText },
  { to: '/medicines',      label: 'Medicines',     icon: Pill },
  { to: '/wellness',       label: 'Wellness',      icon: Leaf },
];

const adminLinks = [
  { to: '/admin/doctors',              label: 'Manage Doctors' },
  { to: '/admin/add-doctor',           label: 'Add Doctor' },
  { to: '/admin/manage-appointments',  label: 'Manage Appointments' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useHealthSaathi();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

  const isActive = (to: string) => location.pathname === to;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 gradient-health rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <span className="text-lg font-bold text-primary-700">HealthSaathi</span>
              <span className="hidden sm:block text-[10px] text-slate-400 leading-none -mt-0.5 font-medium tracking-wide uppercase">Healthcare Portal</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive(to)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link
                  to="/admin/doctors"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(o => !o)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-slate-50 transition-all text-sm font-medium text-slate-700"
                >
                  <div className="w-7 h-7 bg-primary-100 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-700" />
                  </div>
                  <span className="hidden sm:block max-w-[120px] truncate">{user?.name || 'Account'}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-card-lg py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{user?.role === 'admin' ? '🛡 Admin' : '👤 Patient'}</p>
                    </div>
                    <Link to="/profile" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-700">
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <Link to="/health-records" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-700">
                      <FileText className="w-4 h-4" /> Health Records
                    </Link>
                    {user?.role === 'admin' && (
                      <>
                        <div className="border-t border-slate-100 my-1" />
                        {adminLinks.map(l => (
                          <Link key={l.to} to={l.to} onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50">
                            <Shield className="w-4 h-4" /> {l.label}
                          </Link>
                        ))}
                      </>
                    )}
                    <div className="border-t border-slate-100 my-1" />
                    <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary-700 px-3 py-2 rounded-lg hover:bg-slate-50 transition-all">Sign In</Link>
                <Link to="/signup" className="btn-primary btn-sm">Get Started</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setIsMenuOpen(o => !o)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-3 pb-4 space-y-1">
            {isAuthenticated ? (
              <>
                {navLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive(to) ? 'bg-primary-50 text-primary-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </Link>
                ))}
                {user?.role === 'admin' && adminLinks.map(l => (
                  <Link key={l.to} to={l.to} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-amber-700 hover:bg-amber-50">
                    <Shield className="w-4 h-4" /> {l.label}
                  </Link>
                ))}
                <div className="border-t border-slate-200 pt-2 mt-2">
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-4 pt-2">
                <Link to="/login" className="btn-outline text-center justify-center">Sign In</Link>
                <Link to="/signup" className="btn-primary text-center justify-center">Get Started</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
