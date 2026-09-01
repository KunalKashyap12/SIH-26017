import React, { useState } from 'react';
import client from '../api/client';
import {
  X,
  Sparkles,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
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

export default function PredictModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    state: 'Maharashtra',
    district: 'Thane',
    project_type: 'Highway',
    land_area_hectares: 120,
    affected_families: 350,
    compensation_disbursed_pct: 30,
    approval_pending_days: 280,
    legal_disputes_count: 3,
    possession_pct: 25,
    rehabilitation_progress_pct: 20,
    stakeholder_responsiveness_score: 4.5,
    historical_dept_performance_score: 5.0,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

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
        setError(err?.detail || 'Prediction failed. Please check form inputs.');
        setLoading(false);
      });
  };

  const resetForm = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Live Project Risk Assessment</h3>
              <p className="text-xs text-slate-400">Run XGBoost ML inference & SHAP explainability on a new project</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State Jurisdiction</label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800"
                  >
                    {Object.keys(STATES_DISTRICTS).map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                  <select
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800"
                  >
                    {(STATES_DISTRICTS[form.state] || []).map((dst) => (
                      <option key={dst} value={dst}>
                        {dst}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sector / Type</label>
                  <select
                    name="project_type"
                    value={form.project_type}
                    onChange={handleChange}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800"
                  >
                    {PROJECT_TYPES.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Land Area (ha)</label>
                  <input
                    type="number"
                    name="land_area_hectares"
                    value={form.land_area_hectares}
                    onChange={handleChange}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Affected Families</label>
                  <input
                    type="number"
                    name="affected_families"
                    value={form.affected_families}
                    onChange={handleChange}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Legal Disputes</label>
                  <input
                    type="number"
                    name="legal_disputes_count"
                    value={form.legal_disputes_count}
                    onChange={handleChange}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Approval Pending (Days)</label>
                  <input
                    type="number"
                    name="approval_pending_days"
                    value={form.approval_pending_days}
                    onChange={handleChange}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Compensation Disbursed (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    name="compensation_disbursed_pct"
                    value={form.compensation_disbursed_pct}
                    onChange={handleChange}
                    className="w-full accent-teal-600"
                  />
                  <div className="text-right text-[11px] text-teal-700 font-bold">{form.compensation_disbursed_pct}%</div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Physical Possession (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    name="possession_pct"
                    value={form.possession_pct}
                    onChange={handleChange}
                    className="w-full accent-emerald-600"
                  />
                  <div className="text-right text-[11px] text-emerald-700 font-bold">{form.possession_pct}%</div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Resettlement R&R (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    name="rehabilitation_progress_pct"
                    value={form.rehabilitation_progress_pct}
                    onChange={handleChange}
                    className="w-full accent-blue-600"
                  />
                  <div className="text-right text-[11px] text-blue-700 font-bold">{form.rehabilitation_progress_pct}%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stakeholder Score (1-10)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="10"
                    name="stakeholder_responsiveness_score"
                    value={form.stakeholder_responsiveness_score}
                    onChange={handleChange}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dept Performance (1-10)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="10"
                    name="historical_dept_performance_score"
                    value={form.historical_dept_performance_score}
                    onChange={handleChange}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Running ML Model...</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4" /> Calculate Risk Score & SHAP
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* PREDICTION RESULTS VIEW */
            <div className="space-y-6">
              {/* Score Header */}
              <div className="p-5 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Projected ML Risk Assessment</span>
                  <div className="text-3xl font-extrabold text-white mt-1">
                    {result.risk_score} <span className="text-xs font-normal text-slate-400">/ 100</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-3.5 py-1 rounded-full text-xs font-extrabold ${
                      result.risk_category === 'High'
                        ? 'bg-rose-500 text-white'
                        : result.risk_category === 'Medium'
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {result.risk_category} Risk Category
                  </span>
                </div>
              </div>

              {/* SHAP Factors */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Top SHAP Contributing Risk Drivers
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(result.top_factors || []).map((f, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-800">{f.feature}</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded-md ${
                          f.direction === 'increases_risk'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {f.shap_value > 0 ? `+${f.shap_value.toFixed(2)}` : f.shap_value.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  AI Actionable Policy Recommendations
                </h4>
                <ul className="space-y-2">
                  {(result.recommendations || []).map((rec, idx) => (
                    <li
                      key={idx}
                      className="p-3 bg-teal-50/60 border border-teal-200/80 rounded-lg text-xs text-slate-800 font-medium flex items-start gap-2"
                    >
                      <span className="w-4 h-4 rounded-full bg-teal-700 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Assess Another Project
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Done & Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
