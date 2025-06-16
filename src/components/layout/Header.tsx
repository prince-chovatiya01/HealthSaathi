import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  User,
  LogOut,
  Heart,
  Home,
  Settings,
  Phone,
  PlusCircle,
} from 'lucide-react';
import { useHealthSaathi } from '../../context/HealthSaathiContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import translations from '../../utils/translations';
import { motion, AnimatePresence } from 'framer-motion';

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, pointerEvents: 'none' },
  visible: { opacity: 1, y: 0, pointerEvents: 'auto' },
};

const mobileMenuVariants = {
  hidden: { height: 0, opacity: 0, overflow: 'hidden' },
  visible: { height: 'auto', opacity: 1, overflow: 'visible' },
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, language, logout } = useHealthSaathi();
  const navigate = useNavigate();
  const t = translations[language];

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen((open) => !open);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen((open) => !open);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };
    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserDropdownOpen]);

  // Keyboard navigation for user dropdown
  const handleUserKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsUserDropdownOpen(false);
      userButtonRef.current?.focus();
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsUserDropdownOpen((open) => !open);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Heart className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-2xl font-bold text-indigo-600">
              HealthSaathi
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  {t.dashboard}
                </Link>
                <Link
                  to="/symptom-checker"
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  {t.symptomChecker}
                </Link>
                <Link
                  to="/doctors"
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  {t.doctors}
                </Link>
                <Link
                  to="/appointments"
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  {t.appointments}
                </Link>
                <Link
                  to="/medicines"
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  {t.medicines}
                </Link>
                <div className="relative" tabIndex={0}>
                  <button
                    ref={userButtonRef}
                    aria-haspopup="true"
                    aria-expanded={isUserDropdownOpen}
                    onClick={toggleUserDropdown}
                    onKeyDown={handleUserKeyDown}
                    className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                  >
                    <User className="h-5 w-5 mr-1" />
                    <span>{user?.name || t.profile}</span>
                    <svg
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        isUserDropdownOpen ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        ref={userDropdownRef}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                        role="menu"
                        aria-label="User menu"
                      >
                        <Link
                          to="/profile"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                          role="menuitem"
                          tabIndex={0}
                        >
                          {t.profile}
                        </Link>
                        <Link
                          to="/health-records"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                          role="menuitem"
                          tabIndex={0}
                        >
                          {t.healthRecords}
                        </Link>
                        <Link
                          to="/wellness"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                          role="menuitem"
                          tabIndex={0}
                        >
                          {t.wellness}
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                          role="menuitem"
                        >
                          {t.logout}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  {t.home}
                </Link>
                <Link
                  to="/login"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {t.login}
                </Link>
              </>
            )}
            <LanguageSwitcher />
          </nav>

          {/* Mobile menu button */}
          <button
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              id="mobile-menu"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
              className="md:hidden mt-4 pt-4 border-t border-gray-200 overflow-hidden"
            >
              <div className="flex flex-col space-y-4 px-4 pb-4">
                <LanguageSwitcher />
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      <Home className="h-5 w-5 mr-2" />
                      {t.dashboard}
                    </Link>
                    <Link
                      to="/symptom-checker"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      <PlusCircle className="h-5 w-5 mr-2" />
                      {t.symptomChecker}
                    </Link>
                    <Link
                      to="/doctors"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      <User className="h-5 w-5 mr-2" />
                      {t.doctors}
                    </Link>
                    <Link
                      to="/appointments"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      {t.appointments}
                    </Link>
                    <Link
                      to="/medicines"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      <Heart className="h-5 w-5 mr-2" />
                      {t.medicines}
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      <Settings className="h-5 w-5 mr-2" />
                      {t.profile}
                    </Link>
                    <Link
                      to="/health-records"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      <PlusCircle className="h-5 w-5 mr-2" />
                      {t.healthRecords}
                    </Link>
                    <Link
                      to="/wellness"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      <Heart className="h-5 w-5 mr-2" />
                      {t.wellness}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      {t.logout}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      {t.home}
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      {t.login}
                    </Link>
                  </>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
