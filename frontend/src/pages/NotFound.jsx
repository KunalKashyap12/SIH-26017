import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
      <h2 className="text-4xl font-bold text-slate-800">404</h2>
      <p className="text-slate-600 mt-2">Page Not Found</p>
      <Link to="/" className="mt-4 text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
        Return to Dashboard
      </Link>
    </div>
  );
}
