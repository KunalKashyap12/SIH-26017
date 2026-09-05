import React, { useState } from 'react';
import client from '../api/client';
import { useLanguage } from '../context/LanguageContext';
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
  const { t, currentLang, locState, locDistrict, locSector, locRisk } = useLanguage();
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#111c38] rounded-2xl max-w-3xl w-full border border-slate-200/90 dark:border-slate-700/80 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 dark:bg-[#0b1329] text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {currentLang === 'hi' ? 'सजीव परियोजना जोखिम मूल्यांकन' : 'Live Project Risk Assessment'}
              </h3>
              <p className="text-xs text-slate-400">
                {currentLang === 'hi' ? 'नई परियोजना पर एक्सजीबूस्ट एमएल इनफ़रेंस एवं एसएचएपी व्याख्यात्मकता चलाएं' : 'Run XGBoost ML inference & SHAP explainability on a new project'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
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
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {currentLang === 'hi' ? 'राज्य क्षेत्राधिकार' : 'State Jurisdiction'}
                  </label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                  >
                    {Object.keys(STATES_DISTRICTS).map((st) => (
                      <option className="bg-white dark:bg-slate-900" key={st} value={st}>
                        {locState(st)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {currentLang === 'hi' ? 'जिला' : 'District'}
                  </label>
                  <select
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                  >
                    {(STATES_DISTRICTS[form.state] || []).map((dst) => (
                      <option className="bg-white dark:bg-slate-900" key={dst} value={dst}>
                        {locDistrict(dst)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {currentLang === 'hi' ? 'क्षेत्र (सेक्टर) / प्रकार' : 'Sector / Type'}
                  </label>
                  <select
                    name="project_type"
                    value={form.project_type}
                    onChange={handleChange}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                  >
                    {PROJECT_TYPES.map((pt) => (
                      <option className="bg-white dark:bg-slate-900" key={pt} value={pt}>
                        {locSector(pt)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {currentLang === 'hi' ? 'भूमि क्षेत्रफल (हेक्टेयर)' : 'Land Area (ha)'}
                  </label>
                  <input
                    type="number"
                    name="land_area_hectares"
                    value={form.land_area_hectares}
                    onChange={handleChange}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {currentLang === 'hi' ? 'प्रभावित परिवार' : 'Affected Families'}
                  </label>
                  <input
                    type="number"
                    name="affected_families"
                    value={form.affected_families}
                    onChange={handleChange}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {currentLang === 'hi' ? 'कानूनी विवाद' : 'Legal Disputes'}
                  </label>
                  <input
                    type="number"
                    name="legal_disputes_count"
                    value={form.legal_disputes_count}
                    onChange={handleChange}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {currentLang === 'hi' ? 'लंबित स्वीकृतियां (दिन)' : 'Approval Pending (Days)'}
                  </label>
                  <input
                    type="number"
                    name="approval_pending_days"
                    value={form.approval_pending_days}
                    onChange={handleChange}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-feature-tabular">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {currentLang === 'hi' ? 'वितरित मुआवजा (%)' : 'Compensation Disbursed (%)'}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    name="compensation_disbursed_pct"
                    value={form.compensation_disbursed_pct}
                    onChange={handleChange}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="text-right text-[11px] text-amber-600 dark:text-amber-400 font-bold">{form.compensation_disbursed_pct}%</div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {currentLang === 'hi' ? 'भौतिक कब्जा (%)' : 'Physical Possession (%)'}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    name="possession_pct"
                    value={form.possession_pct}
                    onChange={handleChange}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="text-right text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">{form.possession_pct}%</div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {currentLang === 'hi' ? 'पुनर्वास एवं पुनर्स्थापना R&R (%)' : 'Resettlement R&R (%)'}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    name="rehabilitation_progress_pct"
                    value={form.rehabilitation_progress_pct}
                    onChange={handleChange}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <div className="text-right text-[11px] text-blue-600 dark:text-blue-400 font-bold">{form.rehabilitation_progress_pct}%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 font-feature-tabular">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {currentLang === 'hi' ? 'हितधारक स्कोर (1-10)' : 'Stakeholder Score (1-10)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="10"
                    name="stakeholder_responsiveness_score"
                    value={form.stakeholder_responsiveness_score}
                    onChange={handleChange}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {currentLang === 'hi' ? 'विभाग प्रदर्शन (1-10)' : 'Dept Performance (1-10)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="10"
                    name="historical_dept_performance_score"
                    value={form.historical_dept_performance_score}
                    onChange={handleChange}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-lg text-xs text-rose-800 dark:text-rose-300 font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  {currentLang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{currentLang === 'hi' ? 'एमएल मॉडल चल रहा है...' : 'Running ML Model...'}</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4" /> {currentLang === 'hi' ? 'पूर्वाकलन निष्पादित करें' : 'Calculate Risk Score & SHAP'}
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* PREDICTION RESULTS VIEW */
            <div className="space-y-6">
              {/* Score Header */}
              <div className="p-5 bg-slate-900 dark:bg-[#0b1329] text-white rounded-xl flex items-center justify-between border border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Projected ML Risk Assessment</span>
                  <div className="text-3xl font-extrabold text-white mt-1 font-feature-tabular">
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
                    {locRisk(result.risk_category)} Risk Category
                  </span>
                </div>
              </div>

              {/* SHAP Factors */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Top SHAP Contributing Risk Drivers
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-feature-tabular">
                  {(result.top_factors || []).map((f, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-xs flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{formatFeatureName(f.feature)}</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded-md ${
                          f.direction === 'increases_risk'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
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
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  AI Actionable Policy Recommendations
                </h4>
                <ul className="space-y-2">
                  {(result.recommendations || []).map((rec, idx) => (
                    <li
                      key={idx}
                      className="p-3 bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-lg text-xs text-slate-800 dark:text-slate-200 font-medium flex items-start gap-2"
                    >
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Assess Another Project
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors cursor-pointer"
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

function formatFeatureName(rawName) {
  if (!rawName) return '';
  const map = {
    approval_pending_days: 'Pending Approvals (Days)',
    compensation_disbursed_pct: 'Compensation Disbursed (%)',
    possession_pct: 'Physical Land Possession (%)',
    rehabilitation_progress_pct: 'Resettlement (R&R) Progress',
    legal_disputes_count: 'Legal Disputes Count',
    stakeholder_responsiveness_score: 'Stakeholder Responsiveness',
    historical_dept_performance_score: 'Department Performance',
    land_area_hectares: 'Land Area (ha)',
    affected_families: 'Affected Families',
    district: 'District Location',
    state: 'State Jurisdiction',
    project_type: 'Sector / Project Type',
  };
  return map[rawName] || rawName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}
