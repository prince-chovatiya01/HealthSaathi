import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';

interface PageNavProps {
  showDashboard?: boolean;
  className?: string;
}

const PageNav: React.FC<PageNavProps> = ({ showDashboard = true, className = '' }) => {
  const navigate = useNavigate();
  return (
    <div className={`flex items-center gap-3 mb-6 ${className}`}>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      {showDashboard && (
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition-all"
        >
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </button>
      )}
    </div>
  );
};

export default PageNav;
