import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import client from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Building2,
  AlertCircle,
  XCircle,
} from 'lucide-react';

const STATES = [
  'Maharashtra',
  'Uttar Pradesh',
  'Tamil Nadu',
  'Gujarat',
  'Karnataka',
  'Rajasthan',
  'Andhra Pradesh',
  'Odisha',
  'Madhya Pradesh',
  'West Bengal',
];

const PROJECT_TYPES = [
  'Highway',
  'Railway',
  'Irrigation',
  'Industrial Corridor',
  'Power Transmission',
  'Urban Infrastructure',
];

const RISK_CATEGORIES = ['Low', 'Medium', 'High'];

export default function Projects() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, currentLang, locState, locDistrict, locSector, locProjectName, locRisk } = useLanguage();

  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters from URL query params
  const page = parseInt(searchParams.get('page') || '1', 10);
  const state = searchParams.get('state') || '';
  const district = searchParams.get('district') || '';
  const projectType = searchParams.get('project_type') || '';
  const riskCategory = searchParams.get('risk_category') || '';
  const search = searchParams.get('search') || '';

  const fetchProjects = () => {
    setLoading(true);
    setError(null);

    const params = {
      page,
      limit: 10,
    };
    if (state) params.state = state;
    if (district) params.district = district;
    if (projectType) params.project_type = projectType;
    if (riskCategory) params.risk_category = riskCategory;
    if (search) params.search = search;

    client
      .get('/projects', { params })
      .then((data) => {
        setProjects(data.projects || []);
        setPagination({
          total: data.total || 0,
          page: data.page || 1,
          limit: data.limit || 10,
          pages: data.pages || 1,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load projects list:', err);
        setError('Failed to load projects data. Please try again.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, [page, state, district, projectType, riskCategory, search]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, String(value));
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') {
      newParams.set('page', '1'); // Reset to page 1 on filter change only
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(state || district || projectType || riskCategory || search);

  return (
    <div className="space-y-6 pb-8">
      {/* FILTER & SEARCH BAR */}
      <div className="bg-white dark:bg-[#111c38] rounded-xl p-5 border border-slate-200/90 dark:border-slate-700/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-800 dark:text-white">
            <Filter className="w-4 h-4 text-amber-500" />
            <span>{currentLang === 'hi' ? 'परियोजना निर्देशिका फ़िल्टर करें' : 'Filter Infrastructure Directory'}</span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" /> {currentLang === 'hi' ? 'सभी फ़िल्टर साफ़ करें' : 'Clear All Filters'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative col-span-1 sm:col-span-2 md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t('search_placeholder', 'Search name or ID...')}
              value={search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* State Filter */}
          <select
            value={state}
            onChange={(e) => updateFilter('state', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors cursor-pointer"
          >
            <option className="bg-white dark:bg-slate-900" value="">{currentLang === 'hi' ? 'सभी राज्य' : 'All States'}</option>
            {STATES.map((st) => (
              <option className="bg-white dark:bg-slate-900" key={st} value={st}>
                {locState(st)}
              </option>
            ))}
          </select>

          {/* Sector / Project Type Filter */}
          <select
            value={projectType}
            onChange={(e) => updateFilter('project_type', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors cursor-pointer"
          >
            <option className="bg-white dark:bg-slate-900" value="">{t('filter_all_sectors', 'All Sectors')}</option>
            {PROJECT_TYPES.map((pt) => (
              <option className="bg-white dark:bg-slate-900" key={pt} value={pt}>
                {locSector(pt)}
              </option>
            ))}
          </select>

          {/* Risk Category Filter */}
          <select
            value={riskCategory}
            onChange={(e) => updateFilter('risk_category', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors cursor-pointer"
          >
            <option className="bg-white dark:bg-slate-900" value="">{t('filter_all_risks', 'All Risk Levels')}</option>
            {RISK_CATEGORIES.map((rc) => (
              <option className="bg-white dark:bg-slate-900" key={rc} value={rc}>
                {locRisk(rc)}
              </option>
            ))}
          </select>

          {/* Items Count Summary */}
          <div className="flex items-center justify-end text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
            <span>{pagination.total} {currentLang === 'hi' ? 'परियोजनाएं पाई गईं' : 'matching projects'}</span>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white dark:bg-[#111c38] rounded-xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs overflow-hidden">
        {loading ? (
          <ProjectsTableSkeleton />
        ) : error ? (
          <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/40">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-rose-800 dark:text-rose-300">{error}</p>
            <button
              onClick={fetchProjects}
              className="mt-3 px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Loading
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-base font-semibold text-slate-700 dark:text-slate-200">No projects found matching criteria.</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or search terms.</p>
            <button
              onClick={clearFilters}
              className="px-3.5 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3.5 px-6">{t('col_project_id', 'ID & Project Name')}</th>
                  <th className="py-3.5 px-4">{currentLang === 'hi' ? 'राज्य एवं जिला' : 'State & District'}</th>
                  <th className="py-3.5 px-4">{t('col_sector', 'Sector')}</th>
                  <th className="py-3.5 px-4">{t('col_risk_category', 'Risk Category')}</th>
                  <th className="py-3.5 px-4">{t('col_risk_score', 'Risk Score')}</th>
                  <th className="py-3.5 px-4">{currentLang === 'hi' ? 'अनुमानित विलंब' : 'Est. Delay'}</th>
                  <th className="py-3.5 px-6 text-right">{t('col_actions', 'Action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium font-feature-tabular">
                {projects.map((proj) => (
                  <tr
                    key={proj.project_id}
                    onClick={() => navigate(`/projects/${proj.project_id}`)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-[#0f766e] dark:text-emerald-400 group-hover:underline">
                        {locProjectName(proj.project_name)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{proj.project_id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{locState(proj.state)}</div>
                      <div className="text-[11px] text-slate-400">{locDistrict(proj.district)}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-semibold border border-amber-200 dark:border-amber-800/60">
                        {locSector(proj.project_type)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge category={proj.risk_category} locRisk={locRisk} />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs w-7">{proj.risk_score}</span>
                        <div className="w-16 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden hidden md:block">
                          <div
                            className={`h-full rounded-full ${
                              proj.risk_category === 'High'
                                ? 'bg-rose-500'
                                : proj.risk_category === 'Medium'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(proj.risk_score, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {proj.delay_days} <span className="text-[11px] font-normal text-slate-400">{t('label_days', 'days')}</span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/projects/${proj.project_id}`);
                        }}
                        className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        {t('btn_inspect', 'Inspect ↗')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION FOOTER */}
        {!loading && !error && projects.length > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div>
              {t('label_showing', 'Showing')} <span className="font-bold text-slate-800 dark:text-slate-200">{(page - 1) * 10 + 1}</span> {t('label_to', 'to')}{' '}
              <span className="font-bold text-slate-800 dark:text-slate-200">{Math.min(page * 10, pagination.total)}</span> {t('label_of', 'of')}{' '}
              <span className="font-bold text-slate-800 dark:text-slate-200">{pagination.total}</span> {t('label_projects_unit', 'projects')}
            </div>

            <div className="flex items-center space-x-2 self-center sm:self-auto">
              <button
                disabled={page <= 1}
                onClick={() => updateFilter('page', page - 1)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> {t('btn_prev', 'Previous')}
              </button>

              <span className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-800 dark:text-slate-200">
                {t('label_page', 'Page')} {page} {t('label_of', 'of')} {pagination.pages}
              </span>

              <button
                disabled={page >= pagination.pages}
                onClick={() => updateFilter('page', page + 1)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
              >
                {t('btn_next', 'Next')} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Color-coded Risk Badges */
function RiskBadge({ category, locRisk }) {
  const displayLabel = locRisk ? locRisk(category) : category;
  switch (category) {
    case 'High':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span> {displayLabel}
        </span>
      );
    case 'Medium':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span> {displayLabel}
        </span>
      );
    case 'Low':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span> {displayLabel}
        </span>
      );
  }
}

function ProjectsTableSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-2 w-1/3">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4"></div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-md w-1/2"></div>
          </div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-1/6"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-1/8"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-24"></div>
        </div>
      ))}
    </div>
  );
}
