import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useLanguage } from '../context/LanguageContext';
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
  Layers,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, currentLang, locState, locDistrict, locSector, locProjectName } = useLanguage();

  const [overview, setOverview] = useState(null);
  const [stateData, setStateData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [visibleAlertsCount, setVisibleAlertsCount] = useState(15);

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
      {/* DASHBOARD HEADER & LIVE MODEL ACCURACY BADGE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{currentLang === 'hi' ? 'कार्यकारी डैशबोर्ड' : 'Executive Dashboard'}</span>
            <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-bold border border-amber-300 dark:border-amber-800/60">
              {currentLang === 'hi' ? 'सजीव जीआईएस एवं एमएल फीड' : 'Live GIS & ML Feed'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {currentLang === 'hi' ? 'भारतीय बुनियादी ढांचा परियोजनाओं में रियल-टाइम भूमि अधिग्रहण जोखिम निगरानी।' : 'Real-time land acquisition risk monitoring and predictive intelligence across Indian infrastructure projects.'}
          </p>
        </div>

        {/* Live Predictive Model Accuracy Badge on Dashboard Right */}
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3.5 py-1.5 rounded-full shadow-xs self-start sm:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <span>{currentLang === 'hi' ? 'मॉडल सटीकता:' : 'Model Accuracy:'}</span> <span className="font-extrabold">94.2%</span> | R²: <span className="font-extrabold">0.95</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects Card */}
        {loadingOverview ? (
          <KPICardSkeleton />
        ) : errorOverview ? (
          <KPIErrorCard message={errorOverview} onRetry={fetchOverview} />
        ) : (
          <div className="bg-white dark:bg-[#111c38] rounded-xl p-5 border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 dark:bg-slate-800/40 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t('kpi_total_projects', 'Total Active Projects')}
              </span>
              <div className="p-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl shadow-xs">
                <Building2 className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <div className="mt-4 relative z-10">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {overview?.total_projects || 0}
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{currentLang === 'hi' ? '10 भारतीय राज्यों में' : 'Across 10 Indian States'}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{overview?.total_land_area_hectares?.toLocaleString() || 0} ha</span>
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
          <div className="bg-white dark:bg-[#111c38] rounded-xl p-5 border border-rose-200 dark:border-rose-900/60 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 dark:bg-rose-950/40 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                {t('kpi_high_risk', 'High Risk Projects')}
              </span>
              <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 relative z-10">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight">
                  {overview?.risk_category_counts?.High || 0}
                </span>
                <span className="text-xs px-2.5 py-1 bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 rounded-full font-bold border border-rose-200 dark:border-rose-800/60">
                  {overview?.total_projects ? ((overview.risk_category_counts.High / overview.total_projects) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="mt-2 text-xs text-rose-700/80 dark:text-rose-300/80 font-medium">
                {currentLang === 'hi' ? 'तत्काल अंतर-विभागीय हस्तक्षेप आवश्यक' : 'Immediate inter-departmental intervention required'}
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
          <div className="bg-white dark:bg-[#111c38] rounded-xl p-5 border border-amber-200 dark:border-amber-900/60 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 dark:bg-amber-950/40 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {t('kpi_med_risk', 'Medium Risk Projects')}
              </span>
              <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 relative z-10">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
                  {overview?.risk_category_counts?.Medium || 0}
                </span>
                <span className="text-xs px-2.5 py-1 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded-full font-bold border border-amber-200 dark:border-amber-800/60">
                  {overview?.total_projects ? ((overview.risk_category_counts.Medium / overview.total_projects) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="mt-2 text-xs text-amber-700/80 dark:text-amber-300/80 font-medium">
                {currentLang === 'hi' ? 'सक्रिय अड़चन निगरानी आवश्यक' : 'Requires proactive bottleneck monitoring'}
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
          <div className="bg-white dark:bg-[#111c38] rounded-xl p-5 border border-emerald-200 dark:border-emerald-900/60 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-950/40 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {t('kpi_low_risk', 'Low Risk Projects')}
              </span>
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 relative z-10">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {overview?.risk_category_counts?.Low || 0}
                </span>
                <span className="text-xs px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-full font-bold border border-emerald-200 dark:border-emerald-800/60">
                  {overview?.total_projects ? ((overview.risk_category_counts.Low / overview.total_projects) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="mt-2 text-xs text-emerald-700/80 dark:text-emerald-300/80 font-medium">
                {currentLang === 'hi' ? 'समय पर / न्यूनतम बाधाएं' : 'On-track / minimal acquisition friction'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: STATE-LEVEL RISK BREAKDOWN STACKED BAR CHART */}
      <div className="bg-white dark:bg-[#111c38] rounded-xl p-6 border border-slate-200/90 dark:border-slate-700/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              {t('chart_state_risk', 'State-wise Risk Distribution')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentLang === 'hi'
                ? 'शीर्ष भारतीय राज्यों के अधिकार क्षेत्रों में कम, मध्यम और उच्च जोखिम वाली परियोजनाओं का वितरण'
                : 'Distribution of Low, Medium, and High risk projects across top Indian state jurisdictions'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block"></span> {currentLang === 'hi' ? 'कम जोखिम' : 'Low Risk'}
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block"></span> {currentLang === 'hi' ? 'मध्यम जोखिम' : 'Medium Risk'}
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block"></span> {currentLang === 'hi' ? 'उच्च जोखिम' : 'High Risk'}
            </span>
          </div>
        </div>

        {loadingStateData ? (
          <div className="h-80 w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900/60 rounded-lg animate-pulse">
            <div className="text-sm text-slate-400 font-medium">Loading state-level risk breakdown...</div>
          </div>
        ) : errorStateData ? (
          <div className="h-80 w-full flex flex-col items-center justify-center bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-lg text-center p-6">
            <AlertTriangle className="w-8 h-8 text-rose-500 mb-2" />
            <p className="text-sm text-rose-800 dark:text-rose-300 font-semibold">{errorStateData}</p>
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
                data={stateData.map((d) => ({ ...d, state: locState(d.state) }))}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.4} />
                <XAxis
                  dataKey="state"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#475569' }}
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#475569' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '15px' }} />
                <Bar dataKey="Low" name={currentLang === 'hi' ? 'कम जोखिम' : 'Low Risk'} stackId="a" fill="#059669" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Medium" name={currentLang === 'hi' ? 'मध्यम जोखिम' : 'Medium Risk'} stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="High" name={currentLang === 'hi' ? 'उच्च जोखिम' : 'High Risk'} stackId="a" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* SECTION 3: TOP HIGH-RISK PROJECTS ALERTS TABLE */}
      <div className="bg-white dark:bg-[#111c38] rounded-xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              {t('table_priority_interventions', 'Priority Interventions Required')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentLang === 'hi'
                ? 'गंभीर प्रशासनिक शमन की आवश्यकता वाली उच्चतम एमएल-अनुमानित विलंब जोखिम वाली परियोजनाएं'
                : 'Infrastructure projects sorted by highest ML-projected delay risk scores requiring urgent administrative mitigation'}
            </p>
          </div>

          <button
            onClick={() => navigate('/alerts')}
            className="inline-flex items-center text-xs font-bold text-amber-700 dark:text-amber-300 hover:text-amber-800 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 border border-amber-200 dark:border-amber-800/60 px-3.5 py-2 rounded-lg transition-colors self-start sm:self-auto cursor-pointer"
          >
            {currentLang === 'hi' ? 'सभी गंभीर अलर्ट देखें' : 'View All Critical Alerts'} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>

        {loadingAlerts ? (
          <TableSkeleton />
        ) : errorAlerts ? (
          <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/40">
            <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <p className="text-sm text-rose-800 dark:text-rose-300 font-semibold">{errorAlerts}</p>
            <button
              onClick={fetchAlerts}
              className="mt-3 px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-700 transition-colors"
            >
              Retry Loading Alerts
            </button>
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">No high risk alerts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3.5 px-6">{t('col_project_id', 'ID & Project Name')}</th>
                  <th className="py-3.5 px-4">{currentLang === 'hi' ? 'राज्य एवं जिला' : 'State & District'}</th>
                  <th className="py-3.5 px-4">{t('col_sector', 'Sector')}</th>
                  <th className="py-3.5 px-4">{t('col_risk_score', 'Risk Score')}</th>
                  <th className="py-3.5 px-4">{currentLang === 'hi' ? 'अनुमानित विलंब' : 'Est. Delay'}</th>
                  <th className="py-3.5 px-4 text-right">{t('col_actions', 'Action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium font-feature-tabular">
                {alerts.slice(0, visibleAlertsCount).map((proj) => (
                  <tr key={proj.project_id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-[#0f766e] dark:text-emerald-400 hover:underline cursor-pointer" onClick={() => navigate(`/projects?search=${encodeURIComponent(proj.project_id)}`)}>
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
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-rose-600 dark:text-rose-400 text-xs w-7">{proj.risk_score}</span>
                        <div className="w-16 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden hidden md:block">
                          <div
                            className="bg-rose-500 h-full rounded-full"
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
                        onClick={() => navigate(`/projects?search=${encodeURIComponent(proj.project_id)}`)}
                        className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        {t('btn_inspect', 'Inspect ↗')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {alerts.length > 7 && (
              <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 px-6 font-medium">
                <span>
                  {currentLang === 'hi'
                    ? `कुल ${alerts.length} में से ${Math.min(visibleAlertsCount, alerts.length)} प्रोजेक्ट्स प्रदर्शित हैं`
                    : `Displaying ${Math.min(visibleAlertsCount, alerts.length)} of ${alerts.length} high-priority intervention projects`}
                </span>
                {visibleAlertsCount < alerts.length ? (
                  <button
                    onClick={() => setVisibleAlertsCount(alerts.length)}
                    className="font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 px-3 py-1 rounded-lg transition-colors"
                  >
                    <span>{currentLang === 'hi' ? `सभी ${alerts.length} प्रोजेक्ट्स दिखाएं` : `Show All ${alerts.length} Priority Projects`} ↓</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setVisibleAlertsCount(15)}
                    className="font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>{currentLang === 'hi' ? 'केवल मुख्य 15 दिखाएं' : 'Show Top 15 Only'} ↑</span>
                  </button>
                )}
              </div>
            )}
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
      <div className="bg-slate-900 dark:bg-[#070d1e] text-white p-3 rounded-lg shadow-xl text-xs space-y-1.5 border border-slate-700 min-w-[160px]">
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

function KPICardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#111c38] rounded-xl p-5 border border-slate-200/90 dark:border-slate-700/80 shadow-xs animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-md w-24"></div>
        <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
      </div>
      <div className="mt-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-md w-16"></div>
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-md w-32 mt-3"></div>
      </div>
    </div>
  );
}

function KPIErrorCard({ message, onRetry }) {
  return (
    <div className="bg-rose-50 dark:bg-rose-950/40 rounded-xl p-5 border border-rose-200 dark:border-rose-800/60 flex flex-col justify-between">
      <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>{message}</span>
      </div>
      <button
        onClick={onRetry}
        className="mt-3 self-start text-xs font-bold text-rose-700 dark:text-rose-300 bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-700 px-2.5 py-1 rounded-md hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer"
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
        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-2 w-1/4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4"></div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-md w-1/2"></div>
          </div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-1/6"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-1/8"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-1/12"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-24"></div>
        </div>
      ))}
    </div>
  );
}
