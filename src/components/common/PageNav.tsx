import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, LayoutDashboard } from 'lucide-react';

interface PageNavProps {
  title?: string;
  showDashboard?: boolean;
}

const PageNav: React.FC<PageNavProps> = ({ title, showDashboard = true }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-2 rounded-xl transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>
      {showDashboard && (
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-2 rounded-xl transition-all"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
      )}
      {title && (
        <>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-semibold text-slate-700">{title}</span>
        </>
      )}
    </div>
  );
};

export default PageNav;
