import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useLanguage } from '../context/LanguageContext';
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
  MapPin,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, currentLang, locState, locDistrict, locSector, locProjectName, locRisk } = useLanguage();

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
      <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl p-8 text-center max-w-xl mx-auto my-12 space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-300">{currentLang === 'hi' ? 'परियोजना नहीं मिली' : 'Project Not Found'}</h3>
        <p className="text-sm text-rose-700 dark:text-rose-400">{error || (currentLang === 'hi' ? 'अनुरोधित परियोजना का विवरण नहीं मिल सका।' : 'The requested project could not be located.')}</p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {currentLang === 'hi' ? 'परियोजना निर्देशिका पर वापस जाएं' : 'Back to Projects'}
          </button>
          <button
            onClick={fetchDetails}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> {currentLang === 'hi' ? 'पुनः प्रयास करें' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  // Format SHAP top factors for chart
  const chartData = (insights?.top_factors || []).map((factor) => ({
    name: formatFeatureName(factor.feature, currentLang),
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
          className="inline-flex items-center text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#111c38] border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-lg transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> {currentLang === 'hi' ? 'परियोजना निर्देशिका पर वापस जाएं' : 'Back to Projects Directory'}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-md font-bold">
            {project.project_id}
          </span>
          <RiskCategoryBadge category={project.risk_category} locRisk={locRisk} />
        </div>
      </div>

      {/* HEADER INFO & RISK GAUGE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Info Card */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111c38] rounded-xl p-6 border border-slate-200/90 dark:border-slate-700/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2.5 py-0.5 rounded-full">
              {locSector(project.project_type)}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
              {locProjectName(project.project_name)}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              <strong className="text-slate-800 dark:text-slate-200">{locDistrict(project.district)}</strong>, {locState(project.state)}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-feature-tabular">
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{currentLang === 'hi' ? 'भूमि क्षेत्र' : 'Land Area'}</span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                {project.land_area_hectares} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">ha</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{currentLang === 'hi' ? 'प्रभावित परिवार' : 'Affected Families'}</span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                {project.affected_families?.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{currentLang === 'hi' ? 'कानूनी विवाद' : 'Legal Disputes'}</span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                {project.legal_disputes_count}{' '}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{currentLang === 'hi' ? 'सक्रिय मामले' : 'active cases'}</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{currentLang === 'hi' ? 'स्वीकृति लंबित' : 'Approval Pending'}</span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                {project.approval_pending_days} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{t('label_days', 'days')}</span>
              </div>
            </div>
          </div>

          {/* Acquisition Progress Bars */}
          <div className="space-y-3 pt-2 font-feature-tabular">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">{currentLang === 'hi' ? 'मुआवजा वितरण प्रगति' : 'Compensation Disbursed'}</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">{project.compensation_disbursed_pct}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all"
                  style={{ width: `${project.compensation_disbursed_pct}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">{currentLang === 'hi' ? 'भौतिक भूमि कब्जा प्रगति' : 'Physical Land Possession'}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{project.possession_pct}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${project.possession_pct}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">{currentLang === 'hi' ? 'पुनर्वास एवं पुनर्व्यवस्था (R&R)' : 'Rehabilitation & Resettlement (R&R)'}</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{project.rehabilitation_progress_pct}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${project.rehabilitation_progress_pct}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Big Risk Score Meter */}
        <div className="bg-white dark:bg-[#111c38] rounded-xl p-6 border border-slate-200/90 dark:border-slate-700/80 shadow-xs flex flex-col justify-between items-center text-center">
          <div className="w-full">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-4">
              {currentLang === 'hi' ? 'एआई जोखिम सूचकांक एवं पूर्वानुमान' : 'AI Risk Index & Projection'}
            </span>

            {/* Circular / Big Gauge Card */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-800"
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
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-feature-tabular">{project.risk_score}</span>
                <span className="text-xs font-bold text-slate-400">{currentLang === 'hi' ? '100 में से' : 'OUT OF 100'}</span>
              </div>
            </div>
          </div>

          <div className="w-full mt-6 space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 font-feature-tabular">
            <div className="flex items-center justify-between text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-medium">{currentLang === 'hi' ? 'अनुमानित अधिग्रहण विलंब:' : 'Projected Acquisition Delay:'}</span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">{project.delay_days} {t('label_days', 'days')}</span>
            </div>

            <div className="flex items-center justify-between text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-medium">{currentLang === 'hi' ? 'विभागीय प्रदर्शन स्कोर:' : 'Department Performance:'}</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-100">
                {project.historical_dept_performance_score ??
                  Math.max(
                    1.5,
                    Math.min(
                      9.8,
                      10.0 -
                        (project.approval_pending_days || 0) / 35.0 -
                        (100 - (project.compensation_disbursed_pct || 50)) * 0.025 -
                        (100 - (project.possession_pct || 50)) * 0.015
                    )
                  ).toFixed(1)}{' '}
                / 10
              </span>
            </div>

            <div className="flex items-center justify-between text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-medium">{currentLang === 'hi' ? 'हितधारक अनुक्रियाशीलता:' : 'Stakeholder Responsiveness:'}</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-100">
                {project.stakeholder_responsiveness_score ??
                  Math.max(
                    1.2,
                    Math.min(
                      9.6,
                      10.0 -
                        (project.legal_disputes_count || 0) * 1.3 -
                        (100 - (project.rehabilitation_progress_pct || 50)) * 0.03
                    )
                  ).toFixed(1)}{' '}
                / 10
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SHAP CONTRIBUTING FACTORS & RECOMMENDATIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SHAP Drivers Chart Card */}
        <div className="bg-white dark:bg-[#111c38] rounded-xl p-6 border border-slate-200/90 dark:border-slate-700/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              {currentLang === 'hi' ? 'SHAP शीर्ष जोखिम कारक' : 'SHAP Top Risk Drivers (Local Explainability)'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentLang === 'hi'
                ? 'इस परियोजना के पूर्वानुमानित जोखिम स्कोर पर उच्चतम प्रभाव वाले कारक (लाल = जोखिम बढ़ाता है, हरा = जोखिम कम करता है)'
                : 'Features with the highest impact on this project\'s predicted risk score (Red = Increases Risk, Green = Decreases Risk)'}
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.4} />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 600 }}
                  width={140}
                />
                <Tooltip content={<ShapTooltip currentLang={currentLang} />} />
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
        <div className="bg-white dark:bg-[#111c38] rounded-xl p-6 border border-slate-200/90 dark:border-slate-700/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              {currentLang === 'hi' ? 'एआई सुझाई गई कार्यवाही एवं सिफारिशें' : 'AI Actionable Mitigation Recommendations'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentLang === 'hi'
                ? 'शीर्ष जोखिम कारकों के आधार पर नीति इंजन द्वारा उत्पन्न प्रशासनिक हस्तक्षेप'
                : 'Tailored administrative interventions generated by the rule-based policy engine based on top SHAP drivers'}
            </p>

            <ul className="mt-4 space-y-3">
              {(insights?.recommendations || []).map((rec, idx) => (
                <li
                  key={idx}
                  className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{currentLang === 'hi' ? 'नीति प्रोटोकॉल: पीएम गति शक्ति दिशानिर्देश' : 'Policy Protocol: PM Gati Shakti Guidelines'}</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">{currentLang === 'hi' ? 'स्वचालित उत्पन्न' : 'Auto-Generated'}</span>
          </div>
        </div>
      </div>

      {/* PROJECT LIFECYCLE STAGE TIMELINE */}
      <div className="bg-white dark:bg-[#111c38] rounded-xl p-6 border border-slate-200/90 dark:border-slate-700/80 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{currentLang === 'hi' ? 'भूमि अधिग्रहण चरण प्रगति' : 'Land Acquisition Stage Progress'}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          {currentLang === 'hi'
            ? 'भूमि अधिसूचना, वितरण, भौतिक कब्जा और पुनर्वास के आधार पर चरणवार स्थिति'
            : 'Sequential stage completion based on land notification, disbursal, physical possession, and resettlement'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative">
          <TimelineStep
            step={1}
            title={currentLang === 'hi' ? 'भूमि अधिसूचना' : 'Land Notification'}
            subtitle={currentLang === 'hi' ? 'धारा 4 अधिसूचना जारी' : 'Section 4 Notification Issued'}
            status="completed"
            value="100%"
          />
          <TimelineStep
            step={2}
            title={currentLang === 'hi' ? 'संयुक्त सर्वेक्षण' : 'Joint Survey'}
            subtitle={currentLang === 'hi' ? 'स्वामित्व एवं मूल्यांकन पूर्ण' : 'Title & Valuation Complete'}
            status="completed"
            value="100%"
          />
          <TimelineStep
            step={3}
            title={currentLang === 'hi' ? 'मुआवजा वितरण' : 'Compensation Disbursal'}
            subtitle={currentLang === 'hi' ? 'प्रत्यक्ष लाभ अंतरण (DBT)' : 'Direct Benefit Transfer'}
            status={project.compensation_disbursed_pct > 50 ? 'completed' : 'in-progress'}
            value={`${project.compensation_disbursed_pct}%`}
          />
          <TimelineStep
            step={4}
            title={currentLang === 'hi' ? 'भौतिक कब्जा' : 'Physical Possession'}
            subtitle={currentLang === 'hi' ? 'एजेंसी को भूमि हस्तांतरण' : 'Land Handover to Agency'}
            status={project.possession_pct > 50 ? 'completed' : project.possession_pct > 0 ? 'in-progress' : 'pending'}
            value={`${project.possession_pct}%`}
          />
          <TimelineStep
            step={5}
            title={currentLang === 'hi' ? 'पुनर्वास (R&R)' : 'Resettlement (R&R)'}
            subtitle={currentLang === 'hi' ? 'आवास एवं समुदाय हस्तांतरण' : 'Housing & Community Transfer'}
            status={project.rehabilitation_progress_pct > 70 ? 'completed' : project.rehabilitation_progress_pct > 0 ? 'in-progress' : 'pending'}
            value={`${project.rehabilitation_progress_pct}%`}
          />
        </div>
      </div>
    </div>
  );
}

/* Helper function to format feature names nicely */
function formatFeatureName(rawName, lang) {
  const mapEn = {
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

  const mapHi = {
    approval_pending_days: 'लंबित स्वीकृतियां',
    compensation_disbursed_pct: 'वितरित मुआवजा %',
    possession_pct: 'भौतिक कब्जा %',
    rehabilitation_progress_pct: 'पुनर्वास प्रगति %',
    legal_disputes_count: 'कानूनी विवाद',
    stakeholder_responsiveness_score: 'हितधारक अनुक्रियाशीलता',
    historical_dept_performance_score: 'विभागीय प्रदर्शन',
    land_area_hectares: 'भूमि क्षेत्रफल (हेक्टेयर)',
    affected_families: 'प्रभावित परिवार',
    district: 'जिला स्थान',
    state: 'राज्य क्षेत्र',
    project_type: 'क्षेत्र / प्रकार',
  };

  if (lang === 'hi') {
    return mapHi[rawName] || rawName;
  }
  return mapEn[rawName] || rawName;
}

/* Custom SHAP chart tooltip */
function ShapTooltip({ active, payload, currentLang }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isIncrease = data.direction === 'increases_risk';
    return (
      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1 border border-slate-700">
        <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">{data.name}</p>
        <p className="text-slate-300">{currentLang === 'hi' ? 'कारक मान:' : 'Feature Value:'} <strong className="text-white">{data.rawVal}</strong></p>
        <p className={isIncrease ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
          SHAP {currentLang === 'hi' ? 'प्रभाव:' : 'Impact:'} {data.value > 0 ? `+${data.value}` : data.value} ({isIncrease ? (currentLang === 'hi' ? 'जोखिम बढ़ाता है' : 'Increases Risk') : (currentLang === 'hi' ? 'जोखिम घटाता है' : 'Decreases Risk')})
        </p>
      </div>
    );
  }
  return null;
}

/* Risk badge helper */
function RiskCategoryBadge({ category, locRisk }) {
  const displayLabel = locRisk ? locRisk(category) : category;
  if (category === 'High') {
    return <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 rounded-full font-bold text-xs border border-rose-200 dark:border-rose-800/60">{displayLabel}</span>;
  }
  if (category === 'Medium') {
    return <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full font-bold text-xs border border-amber-200 dark:border-amber-800/60">{displayLabel}</span>;
  }
  return <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full font-bold text-xs border border-emerald-200 dark:border-emerald-800/60">{displayLabel}</span>;
}

/* Timeline step component */
function TimelineStep({ step, title, subtitle, status, value }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs flex items-center justify-center">
            {step}
          </span>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              status === 'completed'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                : status === 'in-progress'
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {value}
          </span>
        </div>
        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{title}</h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function ProjectDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-48"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
      </div>
    </div>
  );
}
