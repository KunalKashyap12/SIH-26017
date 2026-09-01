import React, { useState } from 'react';
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
  Calculator,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Building2,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';

const STATES_DISTRICTS = {
  Maharashtra: ['Pune', 'Thane', 'Nagpur'],
  'Uttar Pradesh': ['Lucknow', 'Varanasi', 'Agra'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara'],
  Karnataka: ['Bengaluru Urban', 'Mysuru', 'Belagavi'],
  Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur'],
  Odisha: ['Khordha', 'Cuttack', 'Sambalpur'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior'],
  'West Bengal': ['Kolkata', 'Howrah', 'North 24 Parganas'],
};

const PROJECT_TYPES = [
  'Highway',
  'Railway',
  'Irrigation',
  'Industrial Corridor',
  'Power Transmission',
  'Urban Infrastructure',
];

export default function PredictNew() {
  const [form, setForm] = useState({
    state: 'Maharashtra',
    district: 'Thane',
    project_type: 'Highway',
    land_area_hectares: 150,
    affected_families: 420,
    compensation_disbursed_pct: 25,
    approval_pending_days: 310,
    legal_disputes_count: 4,
    possession_pct: 20,
    rehabilitation_progress_pct: 15,
    stakeholder_responsiveness_score: 4.0,
    historical_dept_performance_score: 4.5,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'state' || name === 'district' || name === 'project_type'
          ? value
          : Number(value),
    }));

    if (name === 'state') {
      const defaultDist = STATES_DISTRICTS[value]?.[0] || '';
      setForm((prev) => ({ ...prev, district: defaultDist }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    client
      .post('/predict', form)
      .then((res) => {
        setResult(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Prediction failed:', err);
        setError(err?.detail || 'Failed to generate risk prediction. Please verify inputs.');
        setLoading(false);
      });
  };

  const resetForm = () => {
    setResult(null);
    setError(null);
  };

  // Format SHAP top factors for chart
  const chartData = (result?.top_factors || []).map((factor) => ({
    name: formatFeatureName(factor.feature),
    value: Number(factor.shap_value.toFixed(4)),
    direction: factor.direction,
    rawVal: factor.value,
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* PAGE HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950 text-white rounded-xl p-6 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider bg-teal-950/80 px-3 py-1 rounded-full border border-teal-800/60 mb-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Interactive Live Inference Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Predict Risk for New Infrastructure Proposal
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Submit hypothetical project parameters to execute real-time XGBoost ML predictions and SHAP explainability insights
          </p>
        </div>

        {result && (
          <button
            onClick={resetForm}
            className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors border border-slate-700 gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Assess Another Proposal
          </button>
        )}
      </div>

      {!result ? (
        /* INPUT FORM SECTION */
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Project Parameters & Location</h3>
              <p className="text-xs text-slate-500">Configure administrative jurisdiction and sector properties</p>
            </div>

            {/* Row 1: Jurisdiction & Sector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">State Jurisdiction</label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  {Object.keys(STATES_DISTRICTS).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">District</label>
                <select
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  {(STATES_DISTRICTS[form.state] || []).map((dst) => (
                    <option key={dst} value={dst}>
                      {dst}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Sector / Project Type</label>
                <select
                  name="project_type"
                  value={form.project_type}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  {PROJECT_TYPES.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Land & Demographics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Land Area (Hectares)</label>
                <input
                  type="number"
                  name="land_area_hectares"
                  value={form.land_area_hectares}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Affected Families</label>
                <input
                  type="number"
                  name="affected_families"
                  value={form.affected_families}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Legal Disputes Count</label>
                <input
                  type="number"
                  name="legal_disputes_count"
                  value={form.legal_disputes_count}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Pending Approvals (Days)</label>
                <input
                  type="number"
                  name="approval_pending_days"
                  value={form.approval_pending_days}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>
            </div>

            {/* Row 3: Progress Sliders */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Acquisition Progress Indicators (%)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-slate-700">Compensation Disbursed</span>
                    <span className="text-teal-700 font-extrabold">{form.compensation_disbursed_pct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    name="compensation_disbursed_pct"
                    value={form.compensation_disbursed_pct}
                    onChange={handleChange}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-slate-700">Physical Possession</span>
                    <span className="text-emerald-700 font-extrabold">{form.possession_pct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    name="possession_pct"
                    value={form.possession_pct}
                    onChange={handleChange}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-slate-700">Resettlement (R&R)</span>
                    <span className="text-blue-700 font-extrabold">{form.rehabilitation_progress_pct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    name="rehabilitation_progress_pct"
                    value={form.rehabilitation_progress_pct}
                    onChange={handleChange}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Row 4: Performance Ratings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Stakeholder Responsiveness Score (1 to 10)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="10"
                  name="stakeholder_responsiveness_score"
                  value={form.stakeholder_responsiveness_score}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Department Performance Score (1 to 10)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="10"
                  name="historical_dept_performance_score"
                  value={form.historical_dept_performance_score}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Running ML XGBoost & SHAP Inference...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-4.5 h-4.5" /> Execute Live Risk Prediction
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* RESULTS SECTION - MATCHING PROJECT DETAIL PAGE */
        <div className="space-y-6">
          {/* HEADER INFO & RISK GAUGE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info Summary Card */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                  Hypothetical Proposal • {form.project_type}
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">
                  New Infrastructure Project Assessment
                </h1>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <strong className="text-slate-800">{form.district}</strong>, {form.state}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">Land Area</span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    {form.land_area_hectares} <span className="text-xs font-normal text-slate-500">ha</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">Affected Families</span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    {form.affected_families}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">Legal Disputes</span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    {form.legal_disputes_count} <span className="text-xs font-normal text-slate-500">cases</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">Approval Pending</span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    {form.approval_pending_days} <span className="text-xs font-normal text-slate-500">days</span>
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Compensation Disbursed</span>
                    <span className="text-teal-700 font-bold">{form.compensation_disbursed_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-teal-600 h-2 rounded-full transition-all"
                      style={{ width: `${form.compensation_disbursed_pct}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Physical Land Possession</span>
                    <span className="text-emerald-700 font-bold">{form.possession_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${form.possession_pct}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Rehabilitation & Resettlement (R&R)</span>
                    <span className="text-blue-700 font-bold">{form.rehabilitation_progress_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${form.rehabilitation_progress_pct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Circular Risk Score Gauge Meter */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between items-center text-center">
              <div className="w-full">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-4">
                  Predicted Risk Score & Gauge
                </span>

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
                        result.risk_category === 'High'
                          ? 'text-rose-500'
                          : result.risk_category === 'Medium'
                          ? 'text-amber-500'
                          : 'text-emerald-500'
                      }
                      strokeDasharray={`${result.risk_score}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-slate-900">{result.risk_score}</span>
                    <span className="text-xs font-bold text-slate-400">OUT OF 100</span>
                  </div>
                </div>
              </div>

              <div className="w-full mt-6 space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-600 font-medium">Risk Classification:</span>
                  <span
                    className={`font-extrabold px-2 py-0.5 rounded-full text-[11px] ${
                      result.risk_category === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : result.risk_category === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {result.risk_category} Risk
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-600 font-medium">Stakeholder Score:</span>
                  <span className="font-extrabold text-slate-800">{form.stakeholder_responsiveness_score} / 10</span>
                </div>

                <div className="flex items-center justify-between text-xs px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-600 font-medium">Department Performance:</span>
                  <span className="font-extrabold text-slate-800">{form.historical_dept_performance_score} / 10</span>
                </div>
              </div>
            </div>
          </div>

          {/* SHAP FACTORS & RECOMMENDATIONS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SHAP Chart */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  SHAP Risk Factor Contributions
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Features with highest impact on predicted risk score (Red = Increases Risk, Green = Decreases Risk)
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

            {/* Recommendations */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-600" />
                  Recommended Administrative Remedies
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Targeted policy interventions based on top SHAP drivers
                </p>

                <ul className="mt-4 space-y-3">
                  {(result.recommendations || []).map((rec, idx) => (
                    <li
                      key={idx}
                      className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-800 font-medium leading-relaxed"
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
                <span>Model Engine: XGBoost + SHAP TreeExplainer</span>
                <button
                  onClick={resetForm}
                  className="font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Assess Another Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatFeatureName(rawName) {
  const map = {
    approval_pending_days: 'Pending Approvals',
    compensation_disbursed_pct: 'Compensation Disbursed',
    possession_pct: 'Physical Possession',
    rehabilitation_progress_pct: 'R&R Progress',
    legal_disputes_count: 'Legal Disputes',
    stakeholder_responsiveness_score: 'Stakeholder Score',
    historical_dept_performance_score: 'Dept Performance',
    land_area_hectares: 'Land Area (ha)',
    affected_families: 'Affected Families',
    district: 'District Location',
    state: 'State Jurisdiction',
    project_type: 'Sector / Type',
  };
  return map[rawName] || rawName;
}

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
