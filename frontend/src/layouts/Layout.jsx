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
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, GovTopNavbar } from '../context/LanguageContext';
import PredictModal from '../components/PredictModal';

export default function Layout() {
  const { userRole, userName, userCadre, userDesignation, logout } = useAuth();
  const { t, currentLang, istTime } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [predictModalOpen, setPredictModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // If not logged in, redirect to /login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // Map Central Administration to Policymaker for nav visibility
  const currentRoleKey = userRole === 'Central Administration' ? 'Policymaker' : userRole;

  // All possible nav items with translation keys and badges
  const allNavItems = [
    {
      key: 'nav_dashboard',
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      roles: ['Policymaker', 'District Administrator', 'Field Officer'],
    },
    {
      key: 'nav_directory',
      name: 'Project Directory',
      path: '/projects',
      icon: FolderKanban,
      roles: ['Policymaker', 'District Administrator', 'Field Officer'],
    },
    {
      key: 'nav_gis',
      name: 'GIS Cadastral Map',
      path: '/map',
      icon: MapPin,
      ping: true,
      roles: ['Policymaker', 'District Administrator'],
    },
    {
      key: 'nav_alerts',
      name: 'High-Risk Alerts',
      path: '/alerts',
      icon: ShieldAlert,
      roles: ['Policymaker', 'District Administrator', 'Field Officer'],
    },
    {
      key: 'nav_predictor',
      name: 'Risk Predictor',
      path: '/predict',
      icon: Calculator,
      roles: ['Policymaker', 'District Administrator', 'Field Officer'],
    },
  ];

  // Filter items visible to current role
  const navItems = allNavItems.filter((item) => item.roles.includes(currentRoleKey));

  const getPageTitle = (pathname) => {
    if (pathname === '/') return t('title_dashboard', 'National Land Acquisition Intelligence');
    if (pathname.startsWith('/projects/')) return t('title_project_detail', 'Project Risk & Explainability Deep-Dive');
    if (pathname === '/projects') return t('dir_title', 'Infrastructure Project Directory');
    if (pathname === '/map') return t('title_map', 'GIS Risk & Acquisition Heatmap');
    if (pathname === '/alerts') return t('title_alerts', 'Critical Intervention & High-Risk Alerts');
    if (pathname === '/predict') return t('title_predict', 'Live Proposal Risk Assessment Engine');
    return 'BhoomiDrishti Portal';
  };

  const getBreadcrumbName = (pathname) => {
    if (pathname === '/') return t('nav_dashboard', 'Dashboard');
    if (pathname.startsWith('/projects/')) return t('title_project_detail', 'Project Details');
    if (pathname === '/projects') return t('bc_project_directory', 'Project Directory');
    if (pathname === '/map') return t('nav_gis', 'GIS Cadastral Map');
    if (pathname === '/alerts') return t('nav_alerts', 'High-Risk Alerts');
    if (pathname === '/predict') return t('nav_predictor', 'Risk Predictor');
    return 'Overview';
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#070d1e] text-slate-800 dark:text-slate-100 flex flex-col font-sans cadastral-pattern antialiased selection:bg-amber-500 selection:text-white">
      {/* Top Sovereign Utility Strip & Tricolor Bar */}
      <GovTopNavbar />

      {/* Main Brand Navigation Bar */}
      <nav className="w-full bg-white dark:bg-[#0e172e] border-b border-slate-200/90 dark:border-slate-800 shadow-sm sticky top-0 z-40 transition-colors duration-200" data-purpose="primary-navbar">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
          {/* Logo and App Title */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 rounded-md cursor-pointer"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <a className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => navigate('/')}>
              <img
                alt="BhoomiDrishti Emblem Logo"
                className="h-11 w-auto max-w-[50px] object-contain drop-shadow-sm transition-transform hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1tmtCuVEHr8W_23odifTpdT2_SkeEm3TjJph2ge7C4SASAe0Z8VChgbyZ2QC0Hibet4oZkfBpOYTTidPBRTxhFR4m22BmnTP3UeEdHtatnKaydS__iwc5yjnJvARs9jEYNf5mFe2lqIyCy3y_0c-_KOAyqMHQtD7OVRQfnUvno4u1wseuuc9_WNj4DldCYYY9br7HMvSVCe9A1iGvqiB6xbnsNnmw1hmHSGHjvRc2bAq_tXFBSgjJRuhDFyQ5Dyr67Q"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-[#072448] dark:text-white font-sans">
                    Bhoomi<span className="text-amber-500">Drishti</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hidden sm:inline-block">
                    {t('sih_badge_banner', 'SIH PROTOTYPE • DEMO ENVIRONMENT')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:block">
                  {t('main_sub', 'AI & XGBoost/LightGBM SHAP-driven predictive decision support system for Indian infrastructure projects')}
                </p>
              </div>
            </a>
          </div>

          {/* User Session, Engine Status, Predict CTA */}
          <div className="flex items-center gap-3 shrink-0">

            {/* Cadre / User Pill */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
              <div className="px-2.5 py-1 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-100">{userName}</span>
                  <span className="bg-amber-500/10 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 text-[10px] font-semibold px-1.5 py-0.2 rounded border border-amber-300 dark:border-amber-600/40">
                    {userRole === 'District Administrator' ? t('cadre_dm', 'DM Cadre') : userRole === 'Field Officer' ? t('cadre_field', 'Field Cadre') : t('cadre_pmu', 'PMU Cadre')}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  {userRole === 'District Administrator' ? t('desig_district', 'District Collector / SLAO (Mysuru & Mandya)') : userRole === 'Field Officer' ? t('desig_field', 'Field Survey & Verification Officer') : t('desig_central', 'Senior Policymaker / Central PMU')}
                </p>
              </div>
            </div>

            {/* Predict Risk CTA Button */}
            <button
              onClick={() => setPredictModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-semibold shadow-xs shadow-amber-500/20 transition-all cursor-pointer"
              type="button"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">{t('predict_risk', 'Predict New Risk')}</span>
            </button>

            {/* Logout Action */}
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-200 dark:hover:border-rose-800/60 transition-all text-xs font-semibold cursor-pointer"
              title="Sign Out"
              type="button"
            >
              <span>{t('btn_logout', 'Logout')}</span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main App Layout (Sidebar + Content) */}
      <div className="flex-1 flex w-full max-w-[1920px] mx-auto overflow-hidden">
        {/* Left Administrative Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-30
            w-64 shrink-0 bg-white dark:bg-[#0c142b] border-r border-slate-200 dark:border-slate-800/80
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            flex flex-col justify-between p-3.5
          `}
          data-purpose="administrative-sidebar"
        >
          {/* Top Navigation Clusters */}
          <div className="space-y-5 overflow-y-auto pr-1">
            <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-slate-800/60 border border-amber-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-0.5">
                <span>{t('active_perspective', 'ACTIVE PERSPECTIVE')}</span>
                <span className="text-[9px] bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-1 rounded">{currentLang === 'hi' ? 'मैसूर' : 'Mysuru'}</span>
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {userRole === 'District Administrator' ? t('role_district_admin', 'District Administrator & SLAO') : userRole === 'Field Officer' ? t('role_field_officer', 'Field Survey & Verification Officer') : t('role_central_admin', 'Central Policymaker & PMU')}
              </div>
            </div>

            <ul className="space-y-1.5 text-xs font-medium">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold border-l-4 border-amber-500'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`
                      }
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>{t(item.key, item.name)}</span>
                      </span>
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.badgeClass || ''}`}>
                          {item.badge}
                        </span>
                      )}
                      {item.ping && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Bottom System Telemetry Indicator */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{t('pm_gati_status', 'PM Gati Shakti Alignment')}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>{t('ml_engine_active', 'ML Engine: Active')}</span>
              <span>{istTime || '16:37:10 IST'}</span>
            </div>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-20 lg:hidden"
          ></div>
        )}

        {/* Main Dashboard Content Container */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6" data-purpose="main-dashboard-body">
          {/* Dashboard Breadcrumbs & Section Title */}
          <section className="space-y-2" data-purpose="dashboard-header">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>{t('bc_root', 'BhoomiDrishti')}</span>
                  <span>/</span>
                  <span>{t('bc_ws', 'Workspaces')}</span>
                  <span>/</span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    {getBreadcrumbName(location.pathname)}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  {getPageTitle(location.pathname)}
                </h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {t('dir_sub', 'AI & XGBoost SHAP-driven predictive decision support system for Indian infrastructure projects')}
                </p>
              </div>
            </div>
          </section>

          {/* Subpage Content */}
          <Outlet />
        </main>
      </div>

      {/* Sovereign Compliance Footer */}
      <footer className="w-full bg-white dark:bg-[#070d1e] border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200" data-purpose="government-footer">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              <span>{t('terms', 'Terms of Use')}</span> • <span>{t('hyperlink', 'Hyperlink Policy')}</span> • <span>{t('privacy', 'Privacy Statement')}</span> • <span>{t('gigw', 'GIGW 3.0 Compliance')}</span> • <span>{t('helpdesk', 'Helpdesk / Grievance Cell')}</span> • <span>{t('stqc', 'STQC Certification Status')}</span>
            </p>
            <p className="text-[11px]">
              {t('footer_hosting', 'Designed and developed in accordance with UX4G (User Experience for Government) guidelines. Hosted on National Cloud (MeitY) by National Informatics Centre (NIC).')}
            </p>
          </div>
          <div className="text-[11px] text-right font-mono text-slate-400 shrink-0">
            <div>{t('sih_badge', 'SIH Prototype (PS 26017) • Designed for Predictive Land Acquisition Governance')}</div>
            <div>NIC PMU ID: 9482-BHOOMIDRISHTI</div>
          </div>
        </div>
      </footer>

      {/* Live Risk Prediction Modal */}
      <PredictModal isOpen={predictModalOpen} onClose={() => setPredictModalOpen(false)} />
    </div>
  );
}
