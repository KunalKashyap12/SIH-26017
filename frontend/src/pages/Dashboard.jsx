import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  Layers,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const [overview, setOverview] = useState(null);
  const [stateData, setStateData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingStateData, setLoadingStateData] = useState(true);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  const [errorOverview, setErrorOverview] = useState(null);
  const [errorStateData, setErrorStateData] = useState(null);
  const [errorAlerts, setErrorAlerts] = useState(null);

  const fetchOverview = () => {
    setLoadingOverview(true);
    setErrorOverview(null);
    client
      .get('/stats/overview')
      .then((data) => {
        setOverview(data);
        setLoadingOverview(false);
      })
      .catch((err) => {
        console.error('Error fetching overview stats:', err);
        setErrorOverview('Failed to load overview data');
        setLoadingOverview(false);
      });
  };

  const fetchStateData = () => {
    setLoadingStateData(true);
    setErrorStateData(null);
    client
      .get('/stats/by-state')
      .then((data) => {
        setStateData(data);
        setLoadingStateData(false);
      })
      .catch((err) => {
        console.error('Error fetching state risk breakdown:', err);
        setErrorStateData('Failed to load state breakdown chart');
        setLoadingStateData(false);
      });
  };

  const fetchAlerts = () => {
    setLoadingAlerts(true);
    setErrorAlerts(null);
    client
      .get('/alerts')
      .then((data) => {
        setAlerts(data.alerts || []);
        setLoadingAlerts(false);
      })
      .catch((err) => {
        console.error('Error fetching high-risk alerts:', err);
        setErrorAlerts('Failed to load critical alerts');
        setLoadingAlerts(false);
      });
  };

  useEffect(() => {
    fetchOverview();
    fetchStateData();
    fetchAlerts();
  }, []);

  return (
    <div className="space-y-6 pb-8">
      {/* SECTION 1: KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects Card */}
        {loadingOverview ? (
          <KPICardSkeleton />
        ) : errorOverview ? (
          <KPIErrorCard message={errorOverview} onRetry={fetchOverview} />
        ) : (
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Projects</span>
              <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 relative z-10">
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {overview?.total_projects || 0}
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                <span>Across 10 Indian States</span>
                <span className="font-medium text-slate-700">{overview?.total_land_area_hectares?.toLocaleString() || 0} ha</span>
              </div>
            </div>
          </div>
        )}

        {/* High Risk Card */}
        {loadingOverview ? (
          <KPICardSkeleton />
        ) : errorOverview ? (
          <KPIErrorCard message={errorOverview} onRetry={fetchOverview} />
        ) : (
          <div className="bg-white rounded-xl p-5 border border-rose-200 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">High Risk Projects</span>
              <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 relative z-10">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-rose-600 tracking-tight">
                  {overview?.risk_category_counts?.High || 0}
                </span>
                <span className="text-xs px-2.5 py-1 bg-rose-100 text-rose-700 rounded-full font-bold border border-rose-200">
                  {overview?.total_projects ? ((overview.risk_category_counts.High / overview.total_projects) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="mt-2 text-xs text-rose-700/80 font-medium">
                Immediate inter-departmental intervention required
              </div>
            </div>
          </div>
        )}

        {/* Medium Risk Card */}
        {loadingOverview ? (
          <KPICardSkeleton />
        ) : errorOverview ? (
          <KPIErrorCard message={errorOverview} onRetry={fetchOverview} />
        ) : (
          <div className="bg-white rounded-xl p-5 border border-amber-200 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Medium Risk Projects</span>
              <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 relative z-10">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-amber-600 tracking-tight">
                  {overview?.risk_category_counts?.Medium || 0}
                </span>
                <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold border border-amber-200">
                  {overview?.total_projects ? ((overview.risk_category_counts.Medium / overview.total_projects) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="mt-2 text-xs text-amber-700/80 font-medium">
                Requires proactive bottleneck monitoring
              </div>
            </div>
          </div>
        )}

        {/* Low Risk Card */}
        {loadingOverview ? (
          <KPICardSkeleton />
        ) : errorOverview ? (
          <KPIErrorCard message={errorOverview} onRetry={fetchOverview} />
        ) : (
          <div className="bg-white rounded-xl p-5 border border-emerald-200 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Low Risk Projects</span>
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 relative z-10">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                  {overview?.risk_category_counts?.Low || 0}
                </span>
                <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold border border-emerald-200">
                  {overview?.total_projects ? ((overview.risk_category_counts.Low / overview.total_projects) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="mt-2 text-xs text-emerald-700/80 font-medium">
                On-track / minimal acquisition friction
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: STATE-LEVEL RISK BREAKDOWN STACKED BAR CHART */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" />
              State-Level Risk Category Breakdown
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Distribution of Low, Medium, and High risk projects across top Indian state jurisdictions
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block"></span> Low Risk
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block"></span> Medium Risk
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block"></span> High Risk
            </span>
          </div>
        </div>

        {loadingStateData ? (
          <div className="h-80 w-full flex items-center justify-center bg-slate-50 rounded-lg animate-pulse">
            <div className="text-sm text-slate-400 font-medium">Loading state-level risk breakdown...</div>
          </div>
        ) : errorStateData ? (
          <div className="h-80 w-full flex flex-col items-center justify-center bg-rose-50 border border-rose-200 rounded-lg text-center p-6">
            <AlertTriangle className="w-8 h-8 text-rose-500 mb-2" />
            <p className="text-sm text-rose-800 font-semibold">{errorStateData}</p>
            <button
              onClick={fetchStateData}
              className="mt-3 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-700 transition-colors"
            >
              Retry Loading Chart
            </button>
          </div>
        ) : (
          <div className="h-84 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stateData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="state"
                  tick={{ fill: '#475569', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  tick={{ fill: '#475569', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '15px' }} />
                <Bar dataKey="Low" name="Low Risk" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Medium" name="Medium Risk" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="High" name="High Risk" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* SECTION 3: TOP HIGH-RISK PROJECTS ALERTS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              Critical Intervention Projects (Top High-Risk Alerts)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Infrastructure projects sorted by highest ML-projected delay risk scores requiring urgent administrative mitigation
            </p>
          </div>

          <button
            onClick={() => navigate('/alerts')}
            className="inline-flex items-center text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3.5 py-2 rounded-lg transition-colors self-start sm:self-auto"
          >
            View All Critical Alerts <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>

        {loadingAlerts ? (
          <TableSkeleton />
        ) : errorAlerts ? (
          <div className="p-8 text-center bg-rose-50/50">
            <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <p className="text-sm text-rose-800 font-semibold">{errorAlerts}</p>
            <button
              onClick={fetchAlerts}
              className="mt-3 px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-700 transition-colors"
            >
              Retry Loading Alerts
            </button>
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No high risk alerts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">ID & Project Name</th>
                  <th className="py-3.5 px-4">State & District</th>
                  <th className="py-3.5 px-4">Sector</th>
                  <th className="py-3.5 px-4">Risk Score</th>
                  <th className="py-3.5 px-4">Est. Delay</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {alerts.slice(0, 7).map((proj) => (
                  <tr key={proj.project_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{proj.project_name}</div>
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
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-extrabold text-rose-600 w-10">{proj.risk_score}</span>
                        <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden hidden md:block">
                          <div
                            className="bg-rose-500 h-2 rounded-full"
                            style={{ width: `${Math.min(proj.risk_score, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-slate-900 font-bold">{proj.delay_days}</span>
                      <span className="text-xs text-slate-400 ml-1">days</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => navigate(`/projects?search=${encodeURIComponent(proj.project_id)}`)}
                        className="inline-flex items-center text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors border border-teal-200"
                      >
                        View Details <ExternalLink className="w-3 h-3 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* Custom Tooltip component for Recharts */
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const total = payload.reduce((acc, entry) => acc + entry.value, 0);
    return (
      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1.5 border border-slate-700 min-w-[160px]">
        <p className="font-bold text-sm text-slate-200 border-b border-slate-700 pb-1">{label}</p>
        <p className="text-emerald-400 font-semibold flex justify-between">
          <span>Low Risk:</span> <span>{payload.find((p) => p.dataKey === 'Low')?.value || 0}</span>
        </p>
        <p className="text-amber-400 font-semibold flex justify-between">
          <span>Medium Risk:</span> <span>{payload.find((p) => p.dataKey === 'Medium')?.value || 0}</span>
        </p>
        <p className="text-rose-400 font-semibold flex justify-between">
          <span>High Risk:</span> <span>{payload.find((p) => p.dataKey === 'High')?.value || 0}</span>
        </p>
        <p className="text-slate-400 pt-1 border-t border-slate-800 flex justify-between font-bold">
          <span>Total Projects:</span> <span>{total}</span>
        </p>
      </div>
    );
  }
  return null;
}

/* Skeleton Loaders */
function KPICardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 bg-slate-200 rounded-md w-24"></div>
        <div className="w-9 h-9 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="mt-4">
        <div className="h-8 bg-slate-200 rounded-md w-16"></div>
        <div className="h-3 bg-slate-100 rounded-md w-32 mt-3"></div>
      </div>
    </div>
  );
}

function KPIErrorCard({ message, onRetry }) {
  return (
    <div className="bg-rose-50 rounded-xl p-5 border border-rose-200 flex flex-col justify-between">
      <div className="flex items-center space-x-2 text-rose-700 text-xs font-semibold">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>{message}</span>
      </div>
      <button
        onClick={onRetry}
        className="mt-3 self-start text-xs font-bold text-rose-700 bg-white border border-rose-300 px-2.5 py-1 rounded-md hover:bg-rose-100 transition-colors flex items-center gap-1"
      >
        <RefreshCw className="w-3 h-3" /> Retry
      </button>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="space-y-2 w-1/4">
            <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
            <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
          </div>
          <div className="h-4 bg-slate-200 rounded-md w-1/6"></div>
          <div className="h-4 bg-slate-200 rounded-md w-1/8"></div>
          <div className="h-4 bg-slate-200 rounded-md w-1/12"></div>
          <div className="h-8 bg-slate-200 rounded-lg w-24"></div>
        </div>
      ))}
    </div>
  );
}
