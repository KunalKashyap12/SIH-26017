import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import {
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  FileSpreadsheet,
  CheckCheck,
  Clock,
  Scale,
  Sparkles,
  ArrowRight,
  Bell,
  Dot,
} from 'lucide-react';

export default function Alerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [unreadIds, setUnreadIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to generate simulated top risk factor string & timestamp
  const formatTopFactor = (proj) => {
    if (proj.legal_disputes_count > 2) {
      return `High legal disputes count (${proj.legal_disputes_count} active court cases)`;
    }
    if (proj.compensation_disbursed_pct < 35) {
      return `Low compensation disbursed (${proj.compensation_disbursed_pct}% DBT complete)`;
    }
    if (proj.approval_pending_days > 200) {
      return `Critical approval delay (${proj.approval_pending_days} pending days)`;
    }
    return `Delayed physical land possession (${proj.possession_pct || 25}% transferred)`;
  };

  const getFlaggedTimestamp = (idx) => {
    const times = [
      'Flagged 2 hours ago',
      'Flagged 5 hours ago',
      'Flagged 1 day ago',
      'Flagged 2 days ago',
      'Flagged 3 days ago',
      'Flagged 4 days ago',
      'Flagged 1 week ago',
    ];
    return times[idx % times.length];
  };

  const fetchAlerts = () => {
    setLoading(true);
    setError(null);
    client
      .get('/alerts')
      .then((data) => {
        const fetched = data.alerts || [];
        setAlerts(fetched);
        // Initially mark top 8 items as unread
        const initialUnread = new Set(fetched.slice(0, 8).map((a) => a.project_id));
        setUnreadIds(initialUnread);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch high-risk alerts:', err);
        setError('Failed to load high-risk alerts. Please try again.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAlerts();
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
    if (!alerts.length) return;
    const headers = ['Project ID', 'Project Name', 'State', 'District', 'Sector', 'Risk Score', 'Est Delay (Days)', 'Top Risk Factor'];
    const rows = alerts.map((a) => [
      a.project_id,
      `"${a.project_name}"`,
      a.state,
      a.district,
      a.project_type,
      a.risk_score,
      a.delay_days,
      `"${formatTopFactor(a)}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `high_risk_alerts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 text-white rounded-xl p-6 border border-rose-900/40 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider bg-rose-950/80 px-3 py-1 rounded-full border border-rose-800/60">
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span>Notification & Priority Alert Stream</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            High-Risk Project Alerts
            {unreadIds.size > 0 && (
              <span className="text-xs bg-rose-500 text-white font-extrabold px-2.5 py-0.5 rounded-full">
                {unreadIds.size} New
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-300">
            ML-flagged high priority delay risk alerts requiring administrative intervention
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {unreadIds.size > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700 gap-1.5"
            >
              <CheckCheck className="w-4 h-4 text-emerald-400" /> Mark All as Read
            </button>
          )}
          <button
            onClick={exportCSV}
            disabled={loading || alerts.length === 0}
            className="inline-flex items-center px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50 gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* NOTIFICATION STREAM LIST */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <AlertsSkeleton />
        ) : error ? (
          <div className="p-8 text-center bg-rose-50">
            <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-rose-800">{error}</p>
            <button
              onClick={fetchAlerts}
              className="mt-3 px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-700 transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Loading Alerts
            </button>
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No active high-risk alerts.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {alerts.map((proj, idx) => {
              const isUnread = unreadIds.has(proj.project_id);
              const topFactor = formatTopFactor(proj);
              const timestamp = getFlaggedTimestamp(idx);

              return (
                <div
                  key={proj.project_id}
                  onClick={() => navigate(`/projects/${proj.project_id}`)}
                  className={`p-5 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                    isUnread ? 'bg-rose-50/40 hover:bg-rose-50/80 border-l-4 border-l-rose-500' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    {/* Unread Dot Badge */}
                    <div className="mt-1 flex-shrink-0">
                      {isUnread ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block animate-pulse"></span>
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          {proj.project_id}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                          {proj.project_name}
                        </h4>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {timestamp}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-700">
                          {proj.district}, {proj.state}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                          {proj.project_type}
                        </span>
                      </div>

                      {/* Top Risk Factor Highlight */}
                      <div className="inline-flex items-center text-xs font-semibold text-rose-800 bg-rose-100/80 border border-rose-200/80 px-2.5 py-1 rounded-md mt-1">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-rose-600 flex-shrink-0" />
                        <span>Top Risk Factor: <strong>{topFactor}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side Metrics */}
                  <div className="flex items-center justify-between md:justify-end gap-5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-[11px] text-slate-400 font-bold uppercase block">Risk Score</span>
                      <span className="text-xl font-extrabold text-rose-600">{proj.risk_score} / 100</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => toggleRead(proj.project_id, e)}
                        title={isUnread ? 'Mark as Read' : 'Mark as Unread'}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <CheckCheck className={`w-4 h-4 ${isUnread ? 'text-slate-400' : 'text-emerald-600'}`} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/projects/${proj.project_id}`);
                        }}
                        className="inline-flex items-center text-xs font-bold text-slate-900 hover:text-white bg-slate-100 hover:bg-slate-900 border border-slate-300 hover:border-slate-900 px-3.5 py-2 rounded-lg transition-colors"
                      >
                        Inspect <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function AlertsSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-4 border-b border-slate-100">
          <div className="space-y-2 w-1/2">
            <div className="h-5 bg-slate-200 rounded-md w-3/4"></div>
            <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
          </div>
          <div className="h-6 bg-slate-200 rounded-md w-16"></div>
          <div className="h-8 bg-slate-200 rounded-lg w-28"></div>
        </div>
      ))}
    </div>
  );
}
