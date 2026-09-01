import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  MapPin,
  ShieldAlert,
  Menu,
  X,
  Building2,
  Activity,
  Calculator,
  Sparkles,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PredictModal from '../components/PredictModal';

export default function Layout() {
  const { userRole, userName, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [predictModalOpen, setPredictModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // If not logged in, redirect to /login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // All possible nav items
  const allNavItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['Policymaker', 'District Administrator', 'Field Officer'] },
    { name: 'Projects', path: '/projects', icon: FolderKanban, roles: ['Policymaker', 'District Administrator', 'Field Officer'] },
    { name: 'Risk Map', path: '/map', icon: MapPin, roles: ['Policymaker', 'District Administrator'] },
    { name: 'High-Risk Alerts', path: '/alerts', icon: ShieldAlert, roles: ['Policymaker'] },
    { name: 'Predict Risk', path: '/predict', icon: Calculator, roles: ['Policymaker', 'District Administrator', 'Field Officer'] },
  ];

  // Filter items visible to the current role
  const navItems = allNavItems.filter((item) => item.roles.includes(userRole));

  const getPageTitle = (pathname) => {
    if (pathname === '/') return 'National Land Acquisition Overview';
    if (pathname.startsWith('/projects/')) return 'Project Risk & Explainability Deep-Dive';
    if (pathname === '/projects') return 'Infrastructure Project Directory';
    if (pathname === '/map') return 'GIS Risk & Acquisition Heatmap';
    if (pathname === '/alerts') return 'Critical Intervention & High-Risk Alerts';
    if (pathname === '/predict') return 'Live Proposal Risk Assessment Engine';
    return 'Land Acquisition Predictor System';
  };

  const getRoleBadgeStyle = (role) => {
    if (role === 'Policymaker') return 'bg-rose-950 text-rose-300 border-rose-800/60';
    if (role === 'District Administrator') return 'bg-amber-950 text-amber-300 border-amber-800/60';
    return 'bg-teal-950 text-teal-300 border-teal-800/60';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="sm:hidden text-slate-300 hover:text-white p-1 rounded-md focus:outline-none"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  N-LAPS <span className="text-xs font-normal px-2 py-0.5 bg-teal-950 text-teal-300 border border-teal-700/50 rounded-full">v1.0</span>
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">National Land Acquisition Delay Predictor System</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* User Role Badge */}
            <div className={`flex items-center space-x-1.5 border px-3 py-1 rounded-full text-xs font-bold ${getRoleBadgeStyle(userRole)}`}>
              <UserCheck className="w-3.5 h-3.5" />
              <span>{userName} ({userRole})</span>
            </div>

            <button
              onClick={() => navigate('/predict')}
              className="inline-flex items-center px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors border border-teal-500/50 gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Predict New Risk</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              title="Logout / Change Role"
              className="inline-flex items-center px-3 py-1.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-300 border border-slate-700 hover:border-rose-800/60 rounded-lg text-xs font-semibold transition-colors gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-20 sm:hidden"
          ></div>
        )}

        {/* Sidebar Navigation */}
        <aside
          className={`
            fixed sm:static inset-y-0 left-0 z-30
            w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex-shrink-0
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
            flex flex-col justify-between
          `}
        >
          <div className="py-4">
            <div className="px-4 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider flex justify-between items-center">
              <span>Navigation Menu</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">{userRole}</span>
            </div>
            <nav className="space-y-1 px-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) => `
                      flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${
                        isActive
                          ? 'bg-teal-700/30 text-teal-300 border border-teal-600/40 shadow-xs'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 mr-3 flex-shrink-0 text-slate-400 group-hover:text-white" />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Footer Metadata */}
          <div className="p-4 border-t border-slate-800 text-xs text-slate-400 bg-slate-950/40">
            <div className="font-medium text-slate-300 mb-1">Ministry of Infrastructure & Revenue</div>
            <div className="text-[11px] text-slate-400">PM Gati Shakti Alignment | ML Engine Active</div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 lg:p-8">
          {/* Breadcrumb & Section Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                {getPageTitle(location.pathname)}
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                AI & XGBoost SHAP-driven predictive decision support system for Indian infrastructure projects
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>Model Accuracy: <strong className="text-slate-800 font-semibold">74.4%</strong> | R²: <strong className="text-slate-800 font-semibold">0.82</strong></span>
            </div>
          </div>

          <Outlet />
        </main>
      </div>

      {/* Live Risk Prediction Modal */}
      <PredictModal isOpen={predictModalOpen} onClose={() => setPredictModalOpen(false)} />
    </div>
  );
}
