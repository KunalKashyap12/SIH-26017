import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import client from '../api/client';
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
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(state || district || projectType || riskCategory || search);

  return (
    <div className="space-y-6 pb-8">
      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-800">
            <Filter className="w-4 h-4 text-teal-600" />
            <span>Filter Projects Directory</span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 self-start sm:self-auto"
            >
              <XCircle className="w-3.5 h-3.5" /> Clear All Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative col-span-1 sm:col-span-2 md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search name or ID..."
              value={search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          {/* State Filter */}
          <select
            value={state}
            onChange={(e) => updateFilter('state', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
          >
            <option value="">All States</option>
            {STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Sector / Project Type Filter */}
          <select
            value={projectType}
            onChange={(e) => updateFilter('project_type', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
          >
            <option value="">All Project Types</option>
            {PROJECT_TYPES.map((pt) => (
              <option key={pt} value={pt}>
                {pt}
              </option>
            ))}
          </select>

          {/* Risk Category Filter */}
          <select
            value={riskCategory}
            onChange={(e) => updateFilter('risk_category', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
          >
            <option value="">All Risk Levels</option>
            {RISK_CATEGORIES.map((rc) => (
              <option key={rc} value={rc}>
                {rc} Risk
              </option>
            ))}
          </select>

          {/* Items Count Summary */}
          <div className="flex items-center justify-end text-xs font-semibold text-slate-500 px-1">
            <span>{pagination.total} matching projects</span>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <ProjectsTableSkeleton />
        ) : error ? (
          <div className="p-8 text-center bg-rose-50">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-rose-800">{error}</p>
            <button
              onClick={fetchProjects}
              className="mt-3 px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-700 transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Loading
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-base font-semibold text-slate-700">No projects found matching criteria.</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or search terms.</p>
            <button
              onClick={clearFilters}
              className="px-3.5 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-medium hover:bg-teal-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">ID & Project Name</th>
                  <th className="py-3.5 px-4">State & District</th>
                  <th className="py-3.5 px-4">Sector</th>
                  <th className="py-3.5 px-4">Risk Category</th>
                  <th className="py-3.5 px-4">Risk Score</th>
                  <th className="py-3.5 px-4">Est. Delay</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {projects.map((proj) => (
                  <tr
                    key={proj.project_id}
                    onClick={() => navigate(`/projects/${proj.project_id}`)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {proj.project_name}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{proj.project_id}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-slate-800 font-semibold">{proj.state}</div>
                      <div className="text-xs text-slate-500">{proj.district}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md border border-slate-200">
                        {proj.project_type}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <RiskBadge category={proj.risk_category} />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-extrabold text-slate-800 w-9">{proj.risk_score}</span>
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden hidden md:block">
                          <div
                            className={`h-1.5 rounded-full ${
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
                    <td className="py-4 px-4">
                      <span className="text-slate-900 font-bold">{proj.delay_days}</span>
                      <span className="text-xs text-slate-400 ml-1">days</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/projects/${proj.project_id}`);
                        }}
                        className="inline-flex items-center text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors border border-teal-200"
                      >
                        Inspect <ExternalLink className="w-3 h-3 ml-1" />
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
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500 font-medium">
            <div>
              Showing <span className="font-bold text-slate-800">{(page - 1) * 10 + 1}</span> to{' '}
              <span className="font-bold text-slate-800">{Math.min(page * 10, pagination.total)}</span> of{' '}
              <span className="font-bold text-slate-800">{pagination.total}</span> projects
            </div>

            <div className="flex items-center space-x-2 self-center sm:self-auto">
              <button
                disabled={page <= 1}
                onClick={() => updateFilter('page', page - 1)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800">
                Page {page} of {pagination.pages}
              </span>

              <button
                disabled={page >= pagination.pages}
                onClick={() => updateFilter('page', page + 1)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Color-coded Risk Badges */
function RiskBadge({ category }) {
  switch (category) {
    case 'High':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span> High Risk
        </span>
      );
    case 'Medium':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span> Medium Risk
        </span>
      );
    case 'Low':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span> Low Risk
        </span>
      );
  }
}

function ProjectsTableSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100">
          <div className="space-y-2 w-1/3">
            <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
            <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
          </div>
          <div className="h-4 bg-slate-200 rounded-md w-1/6"></div>
          <div className="h-4 bg-slate-200 rounded-md w-1/8"></div>
          <div className="h-6 bg-slate-200 rounded-full w-20"></div>
          <div className="h-8 bg-slate-200 rounded-lg w-24"></div>
        </div>
      ))}
    </div>
  );
}
