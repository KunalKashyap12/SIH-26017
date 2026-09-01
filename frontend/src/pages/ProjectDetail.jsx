import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [insights, setInsights] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetails = () => {
    setLoading(true);
    setError(null);

    Promise.all([
      client.get(`/projects/${id}`),
      client.get(`/projects/${id}/insights`),
    ])
      .then(([projData, insightsData]) => {
        setProject(projData);
        setInsights(insightsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load project details or insights:', err);
        setError(`Project '${id}' could not be found or details failed to load.`);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) {
    return <ProjectDetailSkeleton />;
  }

  if (error || !project) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-8 text-center max-w-xl mx-auto my-12 space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-900">Project Not Found</h3>
        <p className="text-sm text-rose-700">{error || 'The requested project could not be located.'}</p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Back to Projects
          </button>
          <button
            onClick={fetchDetails}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      </div>
    );
  }

  // Format SHAP top factors for chart
  const chartData = (insights?.top_factors || []).map((factor) => ({
    name: formatFeatureName(factor.feature),
    value: Number(factor.shap_value.toFixed(4)),
    absMagnitude: factor.magnitude,
    direction: factor.direction,
    rawVal: factor.value,
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-lg transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Projects Directory
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-slate-200 text-slate-800 px-2.5 py-1 rounded-md font-bold">
            {project.project_id}
          </span>
          <RiskCategoryBadge category={project.risk_category} />
        </div>
      </div>

      {/* HEADER INFO & RISK GAUGE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Info Card */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
              {project.project_type}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">
              {project.project_name}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              <strong className="text-slate-800">{project.district}</strong>, {project.state}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Land Area</span>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">
                {project.land_area_hectares} <span className="text-xs font-normal text-slate-500">ha</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Affected Families</span>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">
                {project.affected_families?.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Legal Disputes</span>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">
                {project.legal_disputes_count}{' '}
                <span className="text-xs font-normal text-slate-500">active cases</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Approval Pending</span>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">
                {project.approval_pending_days} <span className="text-xs font-normal text-slate-500">days</span>
              </div>
            </div>
          </div>

          {/* Acquisition Progress Bars */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Compensation Disbursed</span>
                <span className="text-teal-700 font-bold">{project.compensation_disbursed_pct}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-teal-600 h-2 rounded-full transition-all"
                  style={{ width: `${project.compensation_disbursed_pct}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Physical Land Possession</span>
                <span className="text-emerald-700 font-bold">{project.possession_pct}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${project.possession_pct}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Rehabilitation & Resettlement (R&R)</span>
                <span className="text-blue-700 font-bold">{project.rehabilitation_progress_pct}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${project.rehabilitation_progress_pct}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Big Risk Score Meter */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between items-center text-center">
          <div className="w-full">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-4">
              AI Risk Index & Projection
            </span>

            {/* Circular / Big Gauge Card */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={
                    project.risk_category === 'High'
                      ? 'text-rose-500'
                      : project.risk_category === 'Medium'
                      ? 'text-amber-500'
                      : 'text-emerald-500'
                  }
                  strokeDasharray={`${project.risk_score}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-slate-900">{project.risk_score}</span>
                <span className="text-xs font-bold text-slate-400">OUT OF 100</span>
              </div>
            </div>
          </div>

          <div className="w-full mt-6 space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-600 font-medium">Projected Acquisition Delay:</span>
              <span className="font-extrabold text-slate-900 text-sm">{project.delay_days} days</span>
            </div>

            <div className="flex items-center justify-between text-xs px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-600 font-medium">Department Performance:</span>
              <span className="font-extrabold text-slate-800">{project.historical_dept_performance_score} / 10</span>
            </div>

            <div className="flex items-center justify-between text-xs px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-600 font-medium">Stakeholder Responsiveness:</span>
              <span className="font-extrabold text-slate-800">{project.stakeholder_responsiveness_score} / 10</span>
            </div>
          </div>
        </div>
      </div>

      {/* SHAP CONTRIBUTING FACTORS & RECOMMENDATIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SHAP Drivers Chart Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              SHAP Top Risk Drivers (Local Explainability)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Features with the highest impact on this project's predicted risk score (Red = Increases Risk, Green = Decreases Risk)
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#1e293b', fontSize: 11, fontWeight: 600 }}
                  width={140}
                />
                <Tooltip content={<ShapTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.direction === 'increases_risk' ? '#ef4444' : '#10b981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actionable Recommendations Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              AI Actionable Mitigation Recommendations
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Tailored administrative interventions generated by the rule-based policy engine based on top SHAP drivers
            </p>

            <ul className="mt-4 space-y-3">
              {(insights?.recommendations || []).map((rec, idx) => (
                <li
                  key={idx}
                  className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-800 leading-relaxed font-medium"
                >
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Policy Protocol: PM Gati Shakti Guidelines</span>
            <span className="font-semibold text-teal-700">Auto-Generated</span>
          </div>
        </div>
      </div>

      {/* PROJECT LIFECYCLE STAGE TIMELINE */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">Land Acquisition Stage Progress</h3>
        <p className="text-xs text-slate-500 mb-6">
          Sequential stage completion based on land notification, disbursal, physical possession, and resettlement
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative">
          <TimelineStep
            step={1}
            title="Land Notification"
            subtitle="Section 4 Notification Issued"
            status="completed"
            value="100%"
          />
          <TimelineStep
            step={2}
            title="Joint Survey"
            subtitle="Title & Valuation Complete"
            status="completed"
            value="100%"
          />
          <TimelineStep
            step={3}
            title="Compensation Disbursal"
            subtitle="Direct Benefit Transfer"
            status={project.compensation_disbursed_pct > 50 ? 'completed' : 'in-progress'}
            value={`${project.compensation_disbursed_pct}%`}
          />
          <TimelineStep
            step={4}
            title="Physical Possession"
            subtitle="Land Handover to Agency"
            status={project.possession_pct > 50 ? 'completed' : project.possession_pct > 0 ? 'in-progress' : 'pending'}
            value={`${project.possession_pct}%`}
          />
          <TimelineStep
            step={5}
            title="Resettlement (R&R)"
            subtitle="Housing & Community Transfer"
            status={project.rehabilitation_progress_pct > 70 ? 'completed' : project.rehabilitation_progress_pct > 0 ? 'in-progress' : 'pending'}
            value={`${project.rehabilitation_progress_pct}%`}
          />
        </div>
      </div>
    </div>
  );
}

/* Helper function to format feature names nicely */
function formatFeatureName(rawName) {
  const map = {
    approval_pending_days: 'Pending Approvals',
    compensation_disbursed_pct: 'Compensation Disbursed',
    possession_pct: 'Physical Possession',
    rehabilitation_progress_pct: 'R&R Progress',
    legal_disputes_count: 'Legal Disputes',
    stakeholder_responsiveness_score: 'Stakeholder Responsiveness',
    historical_dept_performance_score: 'Dept Performance',
    land_area_hectares: 'Land Area (ha)',
    affected_families: 'Affected Families',
    district: 'District Location',
    state: 'State Jurisdiction',
    project_type: 'Sector / Type',
  };
  return map[rawName] || rawName;
}

/* Custom SHAP chart tooltip */
function ShapTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isIncrease = data.direction === 'increases_risk';
    return (
      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1 border border-slate-700">
        <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">{data.name}</p>
        <p className="text-slate-300">Feature Value: <strong className="text-white">{data.rawVal}</strong></p>
        <p className={isIncrease ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
          SHAP Impact: {data.value > 0 ? `+${data.value}` : data.value} ({isIncrease ? 'Increases Risk' : 'Decreases Risk'})
        </p>
      </div>
    );
  }
  return null;
}

/* Risk badge helper */
function RiskCategoryBadge({ category }) {
  if (category === 'High') {
    return <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full font-bold text-xs border border-rose-200">High Risk</span>;
  }
  if (category === 'Medium') {
    return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-xs border border-amber-200">Medium Risk</span>;
  }
  return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs border border-emerald-200">Low Risk</span>;
}

/* Timeline step component */
function TimelineStep({ step, title, subtitle, status, value }) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
            {step}
          </span>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              status === 'completed'
                ? 'bg-emerald-100 text-emerald-800'
                : status === 'in-progress'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {value}
          </span>
        </div>
        <h4 className="text-xs font-bold text-slate-900">{title}</h4>
        <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function ProjectDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-slate-200 rounded-lg w-48"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-slate-200 rounded-xl"></div>
        <div className="h-64 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-slate-200 rounded-xl"></div>
        <div className="h-64 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  );
}
