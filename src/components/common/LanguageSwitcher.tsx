import React from 'react';
import { Globe } from 'lucide-react';
import { useHealthSaathi } from '../../context/HealthSaathiContext';
import { Language } from '../../types';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'mr', name: 'मराठी' },
  { code: 'gu', name: 'ગુજરાતી' },
];

const LanguageSwitcher = () => {
  const { language, setLanguage } = useHealthSaathi();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <div className="flex items-center">
      <Globe className="h-5 w-5 text-gray-600 mr-2" />
      <select
        value={language}
        onChange={handleLanguageChange}
        className="bg-white border border-gray-300 rounded-md py-1 pl-2 pr-7 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;