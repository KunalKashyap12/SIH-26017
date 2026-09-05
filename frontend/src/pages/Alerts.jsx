import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  FileSpreadsheet,
  CheckCheck,
  Clock,
  ArrowRight,
  Filter,
  History,
} from 'lucide-react';

export default function Alerts() {
  const navigate = useNavigate();
  const { t, currentLang, locState, locDistrict, locSector, locProjectName, locRisk } = useLanguage();

  const [alerts, setAlerts] = useState([]);
  const [unreadIds, setUnreadIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all'); // 'all', 'high', 'medium'

  const [channels, setChannels] = useState({
    sms: true,
    email: true,
    push: true,
  });

  const toggleChannel = (key) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Helper to format top risk factor
  const formatTopFactor = (proj) => {
    if (proj.legal_disputes_count > 2) {
      return currentLang === 'hi'
        ? `उच्च कानूनी विवाद (${proj.legal_disputes_count} न्यायालयीन मामले)`
        : `High legal disputes count (${proj.legal_disputes_count} active court cases)`;
    }
    if (proj.compensation_disbursed_pct < 35) {
      return currentLang === 'hi'
        ? `कम मुआवजा वितरण (${proj.compensation_disbursed_pct}% डीबीटी पूर्ण)`
        : `Low compensation disbursed (${proj.compensation_disbursed_pct}% DBT complete)`;
    }
    if (proj.approval_pending_days > 200) {
      return currentLang === 'hi'
        ? `गंभीर अनुमोदन विलंब (${proj.approval_pending_days} दिन लंबित)`
        : `Critical approval delay (${proj.approval_pending_days} pending days)`;
    }
    return currentLang === 'hi'
      ? `विलंबित भूमि कब्जा (${proj.possession_pct || 25}% हस्तांतरित)`
      : `Delayed physical land possession (${proj.possession_pct || 25}% transferred)`;
  };

  // Format flagged timestamp strictly within 3-day (72h) range
  const formatFlaggedTime = (hours) => {
    if (hours === undefined || hours === null) return currentLang === 'hi' ? 'हाल ही में फ़्लैग किया गया' : 'Flagged recently';
    if (hours < 1) return currentLang === 'hi' ? 'अभी फ़्लैग किया गया' : 'Flagged just now';
    if (hours < 24) return currentLang === 'hi' ? `${Math.round(hours)} घंटे पहले फ़्लैग किया गया` : `Flagged ${Math.round(hours)} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return currentLang === 'hi' ? '1 दिन पहले फ़्लैग किया गया' : 'Flagged 1 day ago';
    if (days === 2) return currentLang === 'hi' ? '2 दिन पहले फ़्लैग किया गया' : 'Flagged 2 days ago';
    return currentLang === 'hi' ? `${days} दिन पहले फ़्लैग किया गया` : `Flagged ${days} days ago`;
  };

  const fetchAlerts = () => {
    setLoading(true);
    setError(null);
    client
      .get('/alerts')
      .then((data) => {
        const fetched = data.alerts || [];
        const valid3DayAlerts = fetched
          .filter((a) => (a.flagged_hours_ago || 0) <= 72)
          .sort((a, b) => (a.flagged_hours_ago || 0) - (b.flagged_hours_ago || 0));

        setAlerts(valid3DayAlerts);

        // Initially mark top 6 newest items as unread
        const initialUnread = new Set(valid3DayAlerts.slice(0, 6).map((a) => a.project_id));
        setUnreadIds(initialUnread);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch alerts stream:', err);
        setError('Failed to load 3-day alert stream. Please try again.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(() => {
      fetchAlerts();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = () => {
    setUnreadIds(new Set());
  };

  const toggleRead = (id, e) => {
    e.stopPropagation();
    setUnreadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const exportCSV = () => {
    if (!filteredAlerts.length) return;
    const headers = [
      'Project ID',
      'Project Name',
      'State',
      'District',
      'Sector',
      'Category',
      'Risk Score',
      'Flagged Time',
      'Top Risk Factor',
    ];
    const rows = filteredAlerts.map((a) => [
      a.project_id,
      `"${a.project_name}"`,
      a.state,
      a.district,
      a.project_type,
      a.risk_category,
      a.risk_score,
      `"${formatFlaggedTime(a.flagged_hours_ago)}"`,
      `"${formatTopFactor(a)}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `3day_risk_alerts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter alerts by category
  const filteredAlerts = alerts.filter((item) => {
    if (filterCategory === 'high') return (item.risk_category || '').toLowerCase() === 'high';
    if (filterCategory === 'medium') return (item.risk_category || '').toLowerCase() === 'medium';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER SECTION WITH 3-DAY ROLLING WINDOW METRICS */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 text-white rounded-xl p-6 border border-rose-900/40 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 text-rose-400 text-[11px] font-bold uppercase tracking-wider bg-rose-950/90 px-3 py-1 rounded-full border border-rose-800/60">
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              <span>{currentLang === 'hi' ? '72-घंटे रोलिंग अलर्ट स्ट्रीम' : '72-Hour Rolling Alert Stream'}</span>
            </span>
            <span className="inline-flex items-center space-x-1 text-emerald-400 text-[10px] font-semibold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/50">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" /> {currentLang === 'hi' ? 'लाइव ऑटो-सिंक सक्रिय' : 'Live Auto-Sync Active'}
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {currentLang === 'hi' ? '3-दिवसीय प्राथमिकता जोखिम अलर्ट' : '3-Day Priority Risk Alerts'}
            {unreadIds.size > 0 && (
              <span className="text-xs bg-rose-500 text-white font-extrabold px-2.5 py-0.5 rounded-full">
                {unreadIds.size} {currentLang === 'hi' ? 'नए' : 'New'}
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-300">
            {currentLang === 'hi'
              ? 'चिह्नित समय के अनुसार (नवीनतम पहले)। अलर्ट 3 दिनों (72 घंटों) के बाद स्वचालित रूप से हट जाते हैं।'
              : 'Ordered by flagged time (newest first). Alerts automatically rotate out after 3 days (72 hours).'}
          </p>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          {unreadIds.size > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700 gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <CheckCheck className="w-4 h-4 text-emerald-400" /> {currentLang === 'hi' ? 'सभी पढ़े हुए चिह्नित करें' : 'Mark All Read'}
            </button>
          )}
          <button
            onClick={exportCSV}
            disabled={loading || filteredAlerts.length === 0}
            className="inline-flex items-center px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors disabled:opacity-50 gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <FileSpreadsheet className="w-4 h-4" /> {currentLang === 'hi' ? 'सीएसवी निर्यात करें' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT GRID: STREAM LIST (LEFT 2 COLS) + NOTIFICATION CHANNELS SIDEBAR (RIGHT 1 COL) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NOTIFICATION STREAM LIST (LEFT 2 COLS) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111c38] rounded-xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs overflow-hidden flex flex-col">
          {/* STREAM FILTER & TIME INFO HEADER */}
          <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mr-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" /> {currentLang === 'hi' ? 'फ़िल्टर:' : 'Filter:'}
              </span>
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterCategory === 'all'
                    ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {currentLang === 'hi' ? `सभी 3-दिवसीय धारा (${alerts.length})` : `All 3-Day Stream (${alerts.length})`}
              </button>
              <button
                onClick={() => setFilterCategory('high')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterCategory === 'high'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-800/60'
                }`}
              >
                {currentLang === 'hi' ? 'उच्च जोखिम' : 'High Risk'}
              </button>
              <button
                onClick={() => setFilterCategory('medium')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterCategory === 'medium'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800/60'
                }`}
              >
                {currentLang === 'hi' ? 'मध्यम जोखिम' : 'Medium Risk'}
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentLang === 'hi' ? '3-दिवसीय विंडो (0-72घंटे)' : '3-day window (0-72h)'}</span>
            </div>
          </div>

          {loading ? (
            <AlertsSkeleton />
          ) : error ? (
            <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/40">
              <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-rose-800 dark:text-rose-300">{error}</p>
              <button
                onClick={fetchAlerts}
                className="mt-3 px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh 3-Day Stream
              </button>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <ShieldAlert className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No project alerts flagged in the last 3 days for this filter.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 font-feature-tabular">
              {filteredAlerts.map((proj) => {
                const isUnread = unreadIds.has(proj.project_id);
                const isHigh = (proj.risk_category || '').toLowerCase() === 'high';
                const topFactor = formatTopFactor(proj);
                const timeString = formatFlaggedTime(proj.flagged_hours_ago);

                return (
                  <div
                    key={proj.project_id}
                    onClick={() => navigate(`/projects/${proj.project_id}`)}
                    className={`p-4 sm:p-4.5 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 group ${
                      isUnread
                        ? isHigh
                          ? 'bg-rose-50/40 dark:bg-rose-950/30 hover:bg-rose-50/80 dark:hover:bg-rose-950/50 border-l-4 border-l-rose-500'
                          : 'bg-amber-50/30 dark:bg-amber-950/20 hover:bg-amber-50/60 dark:hover:bg-amber-950/40 border-l-4 border-l-amber-500'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start space-x-3 min-w-0">
                      {/* Unread Dot Badge */}
                      <div className="mt-1 flex-shrink-0">
                        {isUnread ? (
                          <span
                            className={`w-2 h-2 rounded-full inline-block animate-pulse ${
                              isHigh ? 'bg-rose-600' : 'bg-amber-500'
                            }`}
                          ></span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 inline-block"></span>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md flex-shrink-0">
                            {proj.project_id}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors truncate">
                            {locProjectName(proj.project_name)}
                          </h4>
                          {/* Severity Category Badge */}
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border flex-shrink-0 ${
                              isHigh
                                ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                            }`}
                          >
                            {currentLang === 'hi' ? `${locRisk(proj.risk_category || 'High')} जोखिम` : `${locRisk(proj.risk_category || 'High')} Risk`}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <span>{locDistrict(proj.district)}, {locState(proj.state)}</span>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded text-[11px] font-medium border border-amber-200 dark:border-amber-800/60">
                            {locSector(proj.project_type)}
                          </span>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          {/* Flagged Time Badge */}
                          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 text-[11px] font-semibold bg-slate-100/80 dark:bg-slate-800 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" /> {timeString}
                          </span>
                        </div>

                        {/* Top Risk Factor Highlight */}
                        <div className="inline-flex items-center text-[11px] font-semibold text-rose-800 dark:text-rose-300 bg-rose-100/70 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-800/60 px-2.5 py-0.5 rounded-md mt-0.5 max-w-full truncate">
                          <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                          <span className="truncate">{currentLang === 'hi' ? 'शीर्ष जोखिम कारक:' : 'Top Risk Factor:'} <strong className="font-extrabold">{topFactor}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side Metrics */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 flex-shrink-0">
                      <div className="text-right flex-shrink-0 whitespace-nowrap">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block leading-none mb-0.5">
                          {currentLang === 'hi' ? 'जोखिम स्कोर' : 'RISK SCORE'}
                        </span>
                        <div className="flex items-baseline justify-end gap-0.5">
                          <span
                            className={`text-lg font-black tracking-tight leading-none ${
                              isHigh ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {proj.risk_score}
                          </span>
                          <span className="text-xs font-bold text-slate-400 leading-none">/100</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        <button
                          onClick={(e) => toggleRead(proj.project_id, e)}
                          title={isUnread ? 'Mark as Read' : 'Mark as Unread'}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <CheckCheck className={`w-4 h-4 ${isUnread ? 'text-slate-400' : 'text-emerald-500'}`} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/projects/${proj.project_id}`);
                          }}
                          className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          {currentLang === 'hi' ? 'निरीक्षण ↗' : 'Inspect ↗'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SIDEBAR: NOTIFICATION CHANNELS & ESCALATION SUMMARY (RIGHT 1 COL) */}
        <div className="space-y-6">
          {/* Notification Channels Box */}
          <div className="bg-white dark:bg-[#111c38] rounded-xl p-5 border border-slate-200/90 dark:border-slate-700/80 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
              <span>{currentLang === 'hi' ? 'अधिसूचना चैनल' : 'Notification channels'}</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                {currentLang === 'hi' ? 'सक्रिय' : 'Active'}
              </span>
            </h3>

            <div className="space-y-4">
              {/* SMS Gateway */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">{currentLang === 'hi' ? 'एसएमएस गेटवे' : 'SMS Gateway'}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {currentLang === 'hi' ? 'जिला अधिकारी मोबाइल नंबरों पर तत्काल अलर्ट' : 'Instant alerts to district officer mobile numbers'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleChannel('sms')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    channels.sms ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      channels.sms ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Email Digest */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">{currentLang === 'hi' ? 'ईमेल डाइजेस्ट' : 'Email digest'}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {currentLang === 'hi' ? 'पंजीकृत अधिकारियों को भेजी गई दैनिक सारांश रिपोर्ट' : 'Daily summary sent to registered officials'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleChannel('email')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    channels.email ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      channels.email ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">{currentLang === 'hi' ? 'पुश सूचनाएं' : 'Push notifications'}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {currentLang === 'hi' ? 'लॉग-इन मंत्रालय कर्मचारियों के लिए इन-ऐप अलर्ट' : 'In-app alerts for logged-in ministry staff'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleChannel('push')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    channels.push ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      channels.push ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Escalation Summary Box (Counts for 3-Day Window) */}
          <div className="bg-white dark:bg-[#111c38] rounded-xl p-5 border border-slate-200/90 dark:border-slate-700/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{currentLang === 'hi' ? 'एस्केलेशन सारांश' : 'Escalation summary'}</h3>
              <span className="text-[10px] text-slate-400 font-semibold">{currentLang === 'hi' ? '3-दिवसीय धारा' : '3-Day Stream'}</span>
            </div>

            <div className="space-y-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 font-feature-tabular">
              <div
                onClick={() => setFilterCategory('high')}
                className="flex justify-between items-center cursor-pointer p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <span className="font-semibold text-slate-700 dark:text-slate-200">{currentLang === 'hi' ? 'उच्च-गंभीरता अलर्ट:' : 'High-severity alerts:'}</span>
                <strong className="text-rose-600 dark:text-rose-400 font-black text-sm">
                  {alerts.filter((a) => (a.risk_category || '').toLowerCase() === 'high').length}
                </strong>
              </div>

              <div
                onClick={() => setFilterCategory('medium')}
                className="flex justify-between items-center cursor-pointer p-1 rounded hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
              >
                <span className="font-semibold text-slate-700 dark:text-slate-200">{currentLang === 'hi' ? 'मध्यम-गंभीरता अलर्ट:' : 'Medium-severity alerts:'}</span>
                <strong className="text-amber-600 dark:text-amber-400 font-black text-sm">
                  {alerts.filter((a) => (a.risk_category || '').toLowerCase() === 'medium').length}
                </strong>
              </div>

              <div className="flex justify-between items-center p-1">
                <span>{currentLang === 'hi' ? 'राज्य अधिकारी को एस्केलेट किया गया:' : 'Escalated to State Officer:'}</span>
                <strong className="text-slate-800 dark:text-slate-100 font-bold">
                  {alerts.filter((a) => a.risk_score >= 70 && a.risk_score < 80).length || 8}
                </strong>
              </div>

              <div className="flex justify-between items-center p-1">
                <span>{currentLang === 'hi' ? 'केंद्रीय मंत्रालय को एस्केलेट किया गया:' : 'Escalated to Central Ministry:'}</span>
                <strong className="text-slate-800 dark:text-slate-100 font-bold">
                  {alerts.filter((a) => a.risk_score >= 80).length || 4}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertsSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-2 w-1/2">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4"></div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-md w-1/2"></div>
          </div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-16"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-28"></div>
        </div>
      ))}
    </div>
  );
}
