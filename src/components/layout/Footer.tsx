import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone } from 'lucide-react';
import { useHealthSaathi } from '../../context/HealthSaathiContext';
import translations from '../../utils/translations';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Footer = () => {
  const { language } = useHealthSaathi();
  const t = translations?.[language] ?? translations['en'];



  return (
    <motion.footer
      className="bg-indigo-900 text-white"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      role="contentinfo"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Tagline */}
          <div className="col-span-1">
            <Link
              to="/"
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
            >
              <Heart className="h-7 w-7 text-white transition-transform duration-300 hover:scale-110" />
              <span className="ml-2 text-xl font-bold">HealthSaathi</span>
            </Link>
            <p className="mt-3 text-indigo-200">{t.footerTagline}</p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">{t.quickLinks}</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: t.home },
                { to: '/symptom-checker', label: t.symptomChecker },
                { to: '/doctors', label: t.doctors },
                { to: '/medicines', label: t.medicines },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Health Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">{t.healthResources}</h3>
            <ul className="space-y-2">
              {[
                { href: 'javascript:void(0)', label: t.covidResources },
                { href: 'javascript:void(0)', label: t.mentalHealth },
                { href: 'javascript:void(0)', label: t.pregnancyCare },
                { href: 'javascript:void(0)', label: t.childHealth },
              ].map(({ href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    // Uncomment below if external links and you want new tab
                    // target="_blank"
                    // rel="noopener noreferrer"
                    className="text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">{t.contactUs}</h3>
            <address className="not-italic space-y-3">
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-0.5 text-indigo-300" />
                <a
                  href="tel:+9118001234567"
                  className="text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded transition-colors"
                >
                  +91 1800-123-4567
                </a>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5 text-indigo-300" />
                <a
                  href="mailto:support@healthsaathi.org"
                  className="text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded transition-colors"
                >
                  support@healthsaathi.org
                </a>
              </div>
            </address>
            <div className="mt-4">
              <a
                href="javascript:void(0)"
                className="bg-white text-indigo-700 px-4 py-2 rounded-lg inline-block font-medium hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
              >
                {t.emergencyHelp}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-indigo-800 text-center">
          <p className="text-indigo-300 text-sm">
            &copy; 2025 HealthSaathi. {t.allRightsReserved}
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
