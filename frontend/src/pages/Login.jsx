import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage, GovTopNavbar } from '../context/LanguageContext';

const DEMO_USERS = [
  {
    email: 'a.sharma@gov.in',
    phone: '9876543210',
    password: 'password123',
    name: 'Dr. A. Sharma, IAS',
    role: 'District Administrator',
    cadre: 'DM Cadre',
    designation: 'District Collector / SLAO (Mysuru & Mandya)',
  },
  {
    email: 'r.verma@gov.in',
    phone: '9876543210',
    password: 'password123',
    name: 'R. K. Verma',
    role: 'Field Officer',
    cadre: 'Field Cadre',
    designation: 'Field Survey & Verification Officer',
  },
  {
    email: 's.mehta@nic.in',
    phone: '9876543210',
    password: 'password123',
    name: 'S. Mehta, IAS',
    role: 'Central Administration',
    cadre: 'PMU Cadre',
    designation: 'Senior Policymaker / Central PMU',
  },
];

const translations = {
  en: {
    topbar_gov: "भारत सरकार | Government of India",
    topbar_ministry: "Ministry of Road Transport & Highways • PM Gati Shakti National Master Plan",
    btn_contrast: "High Contrast",
    portal_title: "BhoomiDrishti",
    badge_proto_head: "SIH PROTOTYPE • DEMO ENVIRONMENT",
    portal_subtitle: "(Predictive Analytics for Early Detection of Land Acquisition Delays)",
    portal_meta: "Integrated with PM Gati Shakti NMP • MoRTH • NIC National Infrastructure Pipeline",
    auth_sso_ready: "JanParichay / MeriPehchaan Ready",
    auth_authorized_only: "Authorized Administrative Personnel Only",
    clock_server_ist: "Server IST",
    main_heading: "Access Your BhoomiDrishti Workspace",
    main_subheading: "Predictive land-acquisition intelligence for proactive infrastructure governance.",
    flow_pill: "MONITOR • PREDICT • EXPLAIN • ACT",
    input_label_title: "Email Address or Mobile Number",
    badge_demo: "SIH PROTOTYPE • DEMO ENVIRONMENT",
    input_placeholder: "a.sharma@gov.in or 9876543210",
    pwd_label_title: "Password",
    pwd_required_note: "(Required)",
    link_forgot_pwd: "Forgot Password?",
    error_id_required: "Please enter your Email Address or Mobile Number before proceeding.",
    nic_verification_status: "Designed for integration with Government Identity Services (SPARROW / MeriPehchaan / NIC SSO)",
    card1_badge: "FIELD OFFICER",
    card1_title: "Ground Operations & Survey",
    card1_desc: "Capture field observations, verify parcels and update acquisition status.",
    card2_badge: "DISTRICT ADMINISTRATOR",
    card2_title: "Collector / SLAO / CALA",
    card2_desc: "Monitor acquisition progress, identify bottlenecks and prioritize interventions.",
    card3_badge: "CENTRAL ADMINISTRATION",
    card3_title: "Policymaker / Senior Official",
    card3_desc: "Analyse national trends, compare regions and identify systemic acquisition risks.",
    modules_label: "Visible Modules:",
    mod_dashboard: "Dashboard",
    mod_projects: "Projects Directory",
    mod_cadastral: "Cadastral Survey",
    mod_risk: "Risk Predictor",
    mod_gis_risk: "GIS Risk Map",
    mod_pipeline: "Sec 11/19 Pipeline",
    mod_nat_map: "National GIS Map",
    mod_alerts: "High-Risk Alerts",
    mod_shap: "SHAP Factors",
    mod_cabinet: "Cabinet Briefs",
    mod_audit: "Audit Trail",
    sso_title: "Or authenticate via National Institutional Identity Services",
    sso_meri_pehchaan: "MeriPehchaan (National SSO)",
    sso_dsc: "Digital Token (e-Sign DSC)",
    sso_sandes: "NIC Sandes OTP",
    breadcrumb_local: "LOCAL / PARCEL",
    breadcrumb_district: "DISTRICT / PROJECT",
    breadcrumb_state: "STATE / NATIONAL",
    perspective_tagline: "One platform • Three administrative perspectives • One objective — timely infrastructure delivery.",
    perspective_data_flow: "DATA → PREDICTION → RISK → ACTION",
    entering_notice: "You are entering the",
    btn_auth_enter: "Authenticate & Enter",
    status_banner_title: "DEMO SYSTEM STATUS:",
    status_engine_online: "Predictive Engine Online",
    status_gis_online: "GIS Services Online",
    status_audit_ready: "Audit Logging Ready",
    footer_terms: "Terms of Use",
    footer_privacy: "Privacy",
    footer_accessibility: "Accessibility",
    footer_helpdesk: "Helpdesk",
    footer_hyperlink: "Hyperlink Policy",
    footer_proto_tag: "SIH Prototype • Designed for Predictive Land Acquisition Governance",
    footer_ux4g_notice: "Designed in accordance with UX4G guidelines for Smart India Hackathon (PS 26017) • Ministry of Road Transport & Highways.",
    ws_field: "Field Operations Workspace",
    ws_district: "District Intelligence Workspace",
    ws_central: "National Strategic PMU Workspace"
  },
  hi: {
    topbar_gov: "भारत सरकार | Government of India",
    topbar_ministry: "सड़क परिवहन एवं राजमार्ग मंत्रालय • पीएम गति शक्ति राष्ट्रीय मास्टर प्लान",
    btn_contrast: "उच्च कंट्रास्ट",
    portal_title: "भूमिदृष्टि",
    badge_proto_head: "एसआइएच प्रोटोटाइप • डेमो वातावरण",
    portal_subtitle: "(भूमि अधिग्रहण विलंब की त्वरित पहचान हेतु पूर्वानुमानात्मक विश्लेषण)",
    portal_meta: "पीएम गति शक्ति एनएमपी • सड़क परिवहन एवं राजमार्ग मंत्रालय • एनआईसी से एकीकृत",
    auth_sso_ready: "जनपरिचय / मेरीपहचान समर्थित",
    auth_authorized_only: "केवल अधिकृत प्रशासनिक कार्मिकों हेतु",
    clock_server_ist: "सर्वर भारतीय मानक समय (IST)",
    main_heading: "अपने भूमिदृष्टि कार्यक्षेत्र तक पहुंचें",
    main_subheading: "सक्रिय अवसंरचना शासन हेतु पूर्वानुमानात्मक भूमि अधिग्रहण आसूचना।",
    flow_pill: "निगरानी • पूर्वानुमान • व्याख्या • कार्रवाई",
    input_label_title: "ईमेल आईडी अथवा मोबाइल नंबर",
    badge_demo: "एसआइएच प्रोटोटाइप • डेमो वातावरण",
    input_placeholder: "a.sharma@gov.in अथवा 9876543210",
    pwd_label_title: "पासवर्ड",
    pwd_required_note: "(अनिवार्य)",
    link_forgot_pwd: "पासवर्ड भूल गए?",
    error_id_required: "आगे बढ़ने से पूर्व कृपया अपना ईमेल आईडी अथवा मोबाइल नंबर दर्ज करें।",
    nic_verification_status: "सरकारी पहचान सेवाओं (स्पैरो / मेरीपहचान / एनआईसी एसएसओ) के साथ एकीकरण हेतु परिकल्पित",
    card1_badge: "फील्ड ऑफिसर",
    card1_title: "भूमि संचालन एवं सर्वेक्षण",
    card1_desc: "स्थल प्रेक्षण दर्ज करें, पार्सल सत्यापित करें एवं अधिग्रहण स्थिति अद्यतन करें।",
    card2_badge: "जिला प्रशासक",
    card2_title: "कलेक्टर / एसएलएओ / सीएएलए",
    card2_desc: "अधिग्रहण प्रगति की निगरानी करें, अड़चनों की पहचान करें एवं हस्तक्षेप को प्राथमिकता दें।",
    card3_badge: "केंद्रीय प्रशासन",
    card3_title: "नीति निर्माता / वरिष्ठ अधिकारी",
    card3_desc: "राष्ट्रीय रुझानों का विश्लेषण करें, क्षेत्रों की तुलना करें एवं प्रणालीगत जोखिमों की पहचान करें।",
    modules_label: "उपलब्ध मॉड्यूल:",
    mod_dashboard: "डैशबोर्ड",
    mod_projects: "परियोजना निर्देशिका",
    mod_cadastral: "भूकर सर्वेक्षण",
    mod_risk: "जोखिम पूर्वानुमान",
    mod_gis_risk: "जीआईएस जोखिम मानचित्र",
    mod_pipeline: "धारा 11/19 पाइपलाइन",
    mod_nat_map: "राष्ट्रीय जीआईएस मानचित्र",
    mod_alerts: "उच्च जोखिम अलर्ट",
    mod_shap: "एसएचएपी कारक",
    mod_cabinet: "कैबिनेट ब्रीफ",
    mod_audit: "ऑडिट ट्रेल",
    sso_title: "अथवा राष्ट्रीय संस्थागत पहचान सेवाओं के माध्यम से प्रमाणित करें",
    sso_meri_pehchaan: "मेरीपहचान (राष्ट्रीय एसएसओ)",
    sso_dsc: "डिजिटल टोकन (ई-साइन डीएससी)",
    sso_sandes: "एनआईसी संदेश ओटीपी",
    breadcrumb_local: "स्थानीय / भूखंड",
    breadcrumb_district: "जिला / परियोजना",
    breadcrumb_state: "राज्य / राष्ट्रीय",
    perspective_tagline: "एक मंच • तीन प्रशासनिक दृष्टिकोण • एक लक्ष्य — समयबद्ध अवसंरचना निर्माण।",
    perspective_data_flow: "डेटा → पूर्वानुमान → जोखिम → कार्रवाई",
    entering_notice: "आप प्रवेश कर रहे हैं:",
    btn_auth_enter: "प्रमाणित करें एवं प्रवेश करें:",
    status_banner_title: "डेमो सिस्टम स्थिति:",
    status_engine_online: "पूर्वानुमान इंजन ऑनलाइन",
    status_gis_online: "जीआईएस सेवाएं ऑनलाइन",
    status_audit_ready: "ऑडिट लॉगिंग तैयार",
    footer_terms: "उपयोग की शर्तें",
    footer_privacy: "गोपनीयता",
    footer_accessibility: "सुगमता",
    footer_helpdesk: "हेल्पडेस्क",
    footer_hyperlink: "हाइपरलिंक नीति",
    footer_proto_tag: "एसआइएच प्रोटोटाइप • पूर्वानुमानात्मक भूमि अधिग्रहण शासन हेतु निर्मित",
    footer_ux4g_notice: "स्मार्ट इंडिया हैकाथॉन (पीएस 26017) हेतु यूएक्स4जी दिशानिर्देशों के अनुसार परिकल्पित • सड़क परिवहन एवं राजमार्ग मंत्रालय।",
    ws_field: "फील्ड ऑपरेशन्स कार्यक्षेत्र",
    ws_district: "जिला इंटेलिजेंस कार्यक्षेत्र",
    ws_central: "राष्ट्रीय सामरिक पीएमयू कार्यक्षेत्र"
  }
};

const roleConfig = {
  'Field Officer': {
    color: 'emerald',
    workspaceKey: 'ws_field',
    dotColor: 'bg-emerald-500',
    btnBg: 'bg-emerald-700 hover:bg-emerald-800 focus:ring-emerald-300',
    cardBorder: 'border-emerald-600 ring-emerald-500/20'
  },
  'District Administrator': {
    color: 'amber',
    workspaceKey: 'ws_district',
    dotColor: 'bg-amber-500',
    btnBg: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-300',
    cardBorder: 'border-amber-600 ring-amber-500/20'
  },
  'Central Administration': {
    color: 'blue',
    workspaceKey: 'ws_central',
    dotColor: 'bg-blue-600',
    btnBg: 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300',
    cardBorder: 'border-blue-600 ring-blue-500/20'
  }
};

export default function Login() {
  const { login } = useAuth();
  const { currentLang, istTime } = useLanguage();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('District Administrator');
  const [emailOrPhone, setEmailOrPhone] = useState('a.sharma@gov.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [toastText, setToastText] = useState('');
  const [showToast, setShowToast] = useState(false);

  const t = translations[currentLang] || translations.en;
  const cfg = roleConfig[selectedRole] || roleConfig['District Administrator'];

  const handleRoleSelect = (roleName) => {
    setSelectedRole(roleName);
    const demoForRole = DEMO_USERS.find((u) => u.role === roleName);
    if (demoForRole) {
      setEmailOrPhone(demoForRole.email);
      setPassword(demoForRole.password);
    }
  };

  const executeAuthLaunch = (e) => {
    if (e) e.preventDefault();

    const inputVal = emailOrPhone.trim();
    if (!inputVal) {
      setShowError(true);
      return;
    }
    setShowError(false);

    // Search DEMO_USERS by email or phone (matching selected role if phone)
    let matchedUser = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === inputVal.toLowerCase()
    );
    if (!matchedUser) {
      matchedUser = DEMO_USERS.find(
        (u) => u.phone === inputVal && u.role === selectedRole
      ) || DEMO_USERS.find((u) => u.phone === inputVal);
    }

    let userObj;
    if (matchedUser) {
      userObj = {
        role: matchedUser.role === 'Central Administration' ? 'Policymaker' : matchedUser.role,
        name: matchedUser.name,
        email: matchedUser.email,
        cadre: matchedUser.cadre,
        designation: matchedUser.designation,
      };
    } else {
      // Derive officer name from custom email or phone
      let derivedName = 'Officer';
      if (inputVal.includes('@')) {
        const usernamePart = inputVal.split('@')[0];
        derivedName = usernamePart
          .split(/[\._]/)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
      } else if (/^\d+$/.test(inputVal)) {
        derivedName = `Officer (${inputVal})`;
      } else {
        derivedName = inputVal;
      }

      userObj = {
        role: selectedRole === 'Central Administration' ? 'Policymaker' : selectedRole,
        name: derivedName,
        email: inputVal,
        cadre: selectedRole === 'District Administrator' ? 'DM Cadre' : selectedRole === 'Field Officer' ? 'Field Cadre' : 'PMU Cadre',
        designation: selectedRole === 'District Administrator' ? 'District Collector / SLAO' : selectedRole === 'Field Officer' ? 'Field Survey & Verification Officer' : 'Senior Policymaker / Central PMU',
      };
    }

    const toastMsg = currentLang === 'hi'
      ? `${userObj.name} के लिए [${cfg.workspaceName}] हेतु प्रमाणन पूर्ण हो रहा है...`
      : `Authenticating ${userObj.name}... Redirecting to ${cfg.workspaceName}`;

    setToastText(toastMsg);
    setShowToast(true);

    setTimeout(() => {
      login(userObj);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden relative gis-cadastral-bg">
      {/* Subtle Cadastral Watermark Coordinate Vector Accents */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.065] select-none transition-opacity duration-300" id="cadastral-svg-container">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cadastral-pattern" width="240" height="240" patternUnits="userSpaceOnUse">
              <path className="grid-line transition-colors duration-200" d="M 0 0 L 240 0 M 0 60 L 240 60 M 0 120 L 240 120 M 0 180 L 240 180 M 0 240 L 240 240" fill="none" strokeDasharray="2,4" strokeWidth="0.75"></path>
              <path className="grid-line transition-colors duration-200" d="M 0 0 L 0 240 M 60 0 L 60 240 M 120 0 L 120 240 M 180 0 L 180 240 M 240 0 L 240 240" fill="none" strokeDasharray="2,4" strokeWidth="0.75"></path>
              <polygon className="parcel-boundary transition-colors duration-200" fill="none" points="20,20 100,35 90,95 30,80" strokeWidth="1.2"></polygon>
              <polygon className="parcel-boundary transition-colors duration-200" fill="none" points="100,35 220,15 205,105 90,95" strokeWidth="1.2"></polygon>
              <polygon className="parcel-boundary transition-colors duration-200" fill="none" points="30,80 90,95 80,180 15,160" strokeWidth="1.2"></polygon>
              <polygon className="parcel-boundary transition-colors duration-200" fill="none" points="90,95 205,105 225,210 110,195 80,180" strokeWidth="1.2"></polygon>
              <path className="corridor-line transition-colors duration-200" d="M -10 140 Q 70 120 140 150 T 250 170" fill="none" strokeDasharray="6,4" strokeWidth="3"></path>
              <text className="map-coord transition-colors duration-200" fontFamily="monospace" fontSize="9" x="35" y="55">KH-412/A</text>
              <text className="map-coord transition-colors duration-200" fontFamily="monospace" fontSize="9" x="125" y="65">KH-413/B</text>
              <text className="map-coord transition-colors duration-200" fontFamily="monospace" fontSize="8" x="130" y="145">28°36'N 77°12'E</text>
            </pattern>
          </defs>
          <rect fill="url(#cadastral-pattern)" height="100%" width="100%"></rect>
        </svg>
      </div>

      {/* Top Accessibility & Utility Bar */}
      <GovTopNavbar />

      {/* Main Header with Branding */}
      <header className="relative z-10 bg-white dark:bg-[#0e172e] border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200" data-purpose="portal-branding">
        <div className="w-full px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 sm:space-x-5">
            <div className="shrink-0 flex items-center justify-center">
              <img
                alt="BhoomiDrishti Official Emblem"
                className="h-16 sm:h-20 w-auto object-contain logo-blend mix-blend-multiply dark:mix-blend-normal transition-transform hover:scale-105 duration-200"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1tmtCuVEHr8W_23odifTpdT2_SkeEm3TjJph2ge7C4SASAe0Z8VChgbyZ2QC0Hibet4oZkfBpOYTTidPBRTxhFR4m22BmnTP3UeEdHtatnKaydS__iwc5yjnJvARs9jEYNf5mFe2lqIyCy3y_0c-_KOAyqMHQtD7OVRQfnUvno4u1wseuuc9_WNj4DldCYYY9br7HMvSVCe9A1iGvqiB6xbnsNnmw1hmHSGHjvRc2bAq_tXFBSgjJRuhDFyQ5Dyr67Q"
              />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white brand-title">{t.portal_title}</span>
                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 rounded-full proto-demo-badge">{t.badge_proto_head}</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-amber-400 brand-subtitle">{t.portal_subtitle}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 brand-meta">{t.portal_meta}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 brand-title flex items-center justify-end gap-1">
                <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path>
                </svg>
                <span>{t.auth_sso_ready}</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 brand-meta">{t.auth_authorized_only}</span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden lg:block"></div>
            <div className="px-3 py-1.5 border rounded text-center transition-colors duration-200 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700" id="server-time-box">
              <span className="text-[10px] uppercase font-bold tracking-wider block transition-colors duration-200 text-slate-500 dark:text-slate-400" id="server-time-label">{t.clock_server_ist}</span>
              <span className="text-xs font-mono font-semibold transition-colors duration-200 text-slate-800 dark:text-slate-200" id="current-ist-time">{istTime || '11:45:00 IST'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full" data-purpose="role-selection-workflow">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-2xl sm:text-3.5xl font-extrabold text-slate-900 dark:text-white tracking-tight hc-title">{t.main_heading}</h1>
          <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed hc-desc max-w-2xl mx-auto">{t.main_subheading}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold tracking-wider hc-pill">
            <span className="text-amber-500">●</span>
            <span>{t.flow_pill}</span>
          </div>
        </div>

        {/* Credentials Card */}
        <form onSubmit={executeAuthLaunch} className={`max-w-xl mx-auto mb-10 bg-white dark:bg-[#111c38] p-6 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm hc-card transition-all duration-200 ${showError ? 'animate-shake' : ''}`} id="identifier-card">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 hc-title" htmlFor="email-or-phone">
              <span>{t.input_label_title}</span> <span className="text-red-500 font-bold">*</span>
            </label>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded-full proto-demo-badge">{t.badge_demo}</span>
          </div>

          <div className="relative rounded-md mb-3" id="input-container-box">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
            <input
              className={`block w-full pl-9 pr-3 py-2.5 sm:text-sm border rounded-md focus:ring-2 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900/80 font-medium transition-colors ${
                showError
                  ? 'ring-2 ring-red-500 border-red-500 focus:ring-red-500 focus:border-red-600'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-amber-500 focus:border-amber-600'
              }`}
              id="email-or-phone"
              onChange={(e) => {
                setEmailOrPhone(e.target.value);
                if (showError && e.target.value.trim()) setShowError(false);
              }}
              placeholder={t.input_placeholder}
              type="text"
              value={emailOrPhone}
            />
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 hc-title" htmlFor="gov-officer-pwd">
                <span>{t.pwd_label_title}</span> <span className="text-red-500 font-bold">*</span> <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 hc-desc">{t.pwd_required_note}</span>
              </label>
            </div>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect height="11" rx="2" ry="2" strokeWidth="2" width="18" x="3" y="11"></rect>
                  <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2"></path>
                </svg>
              </div>
              <input
                className="block w-full pl-9 pr-10 py-2.5 sm:text-sm border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-600 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900/80 font-medium transition-colors"
                id="gov-officer-pwd"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                type={showPassword ? 'text' : 'password'}
                value={password}
              />
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </button>
            </div>
            <div className="mt-1 text-right">
              <a className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-medium" href="#forgot">
                {t.link_forgot_pwd}
              </a>
            </div>
          </div>

          {showError && (
            <p className="mt-2 text-xs font-semibold text-red-600 dark:text-rose-400 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path clipRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" fillRule="evenodd"></path>
              </svg>
              <span>{t.error_id_required}</span>
            </p>
          )}

          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] flex items-center justify-between text-slate-500 dark:text-slate-400 hc-desc">
            <span>{t.nic_verification_status}</span>
          </div>
        </form>

        {/* Roles Section */}
        <fieldset aria-label="Administrative Workspaces" className="space-y-4">
          <legend className="sr-only">Choose Administrative Workspace</legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Field Officer */}
            <div
              className={`role-card relative h-full flex flex-col justify-between bg-white dark:bg-[#111c38] rounded-xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-200 hc-card cursor-pointer border ${
                selectedRole === 'Field Officer'
                  ? 'border-2 ring-2 hc-card-active border-emerald-600 ring-emerald-500/20 dark:border-emerald-500'
                  : 'border-slate-200 dark:border-slate-700/80'
              }`}
              id="card-field-officer"
              onClick={() => handleRoleSelect('Field Officer')}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400 role-icon-box-emerald">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012 2h2a2 2 0 012-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"></path>
                    </svg>
                  </div>
                  {selectedRole === 'Field Officer' && (
                    <span className="role-check-badge w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                      </svg>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 role-badge-emerald">{t.card1_badge}</span>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide hc-desc">TEHSIL / TALUK LEVEL</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight hc-title">{t.card1_title}</h2>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed hc-desc">{t.card1_desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mb-2 hc-badge-label">{t.modules_label}</span>
                <div className="flex flex-wrap gap-1.5 min-h-[52px]">
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded font-medium border border-slate-200 dark:border-slate-700 hc-pill">{t.mod_dashboard}</span>
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded font-medium border border-slate-200 dark:border-slate-700 hc-pill">{t.mod_projects}</span>
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded font-medium border border-slate-200 dark:border-slate-700 hc-pill">{t.mod_cadastral}</span>
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded font-medium border border-slate-200 dark:border-slate-700 hc-pill">{t.mod_risk}</span>
                </div>
              </div>
            </div>

            {/* District Administrator */}
            <div
              className={`role-card relative h-full flex flex-col justify-between bg-white dark:bg-[#111c38] rounded-xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-200 hc-card cursor-pointer border ${
                selectedRole === 'District Administrator'
                  ? 'border-2 ring-2 hc-card-active border-amber-600 ring-amber-500/20 dark:border-amber-500'
                  : 'border-slate-200 dark:border-slate-700/80'
              }`}
              id="card-district-admin"
              onClick={() => handleRoleSelect('District Administrator')}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-400 role-icon-box-amber">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"></path>
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"></path>
                    </svg>
                  </div>
                  {selectedRole === 'District Administrator' && (
                    <span className="role-check-badge w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shadow">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                      </svg>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 role-badge-amber">{t.card2_badge}</span>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide hc-desc">DISTRICT / PROJECT LEVEL</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight hc-title">{t.card2_title}</h2>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed hc-desc">{t.card2_desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mb-2 hc-badge-label">{t.modules_label}</span>
                <div className="flex flex-wrap gap-1.5 min-h-[52px]">
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded font-medium border border-slate-200 dark:border-slate-700 hc-pill">{t.mod_dashboard}</span>
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded font-medium border border-slate-200 dark:border-slate-700 hc-pill">{t.mod_projects}</span>
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded font-medium border border-slate-200 dark:border-slate-700 hc-pill">{t.mod_gis_risk}</span>
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded font-medium border border-slate-200 dark:border-slate-700 hc-pill">{t.mod_pipeline}</span>
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded font-medium border border-slate-200 dark:border-slate-700 hc-pill">{t.mod_risk}</span>
                </div>
              </div>
            </div>

            {/* Central Administration */}
            <div
              className={`role-card relative h-full flex flex-col justify-between bg-white dark:bg-[#111c38] rounded-xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-200 hc-card cursor-pointer border ${
                selectedRole === 'Central Administration'
                  ? 'border-2 ring-2 hc-card-active border-blue-600 ring-blue-500/20 dark:border-blue-500'
                  : 'border-slate-200 dark:border-slate-700/80'
              }`}
              id="card-policymaker"
              onClick={() => handleRoleSelect('Central Administration')}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-400 role-icon-box-blue">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"></path>
                    </svg>
                  </div>
                  {selectedRole === 'Central Administration' && (
                    <span className="role-check-badge w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                      </svg>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 role-badge-blue">{t.card3_badge}</span>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide hc-desc">STATE / NATIONAL LEVEL</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight hc-title">{t.card3_title}</h2>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed hc-desc">{t.card3_desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mb-2 hc-badge-label">{t.modules_label}</span>
                <div className="flex flex-wrap gap-1.5 min-h-[52px]">
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded font-medium border border-slate-200 dark:border-slate-700 hc-pill">{t.mod_dashboard}</span>
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded font-medium border border-slate-200 dark:border-slate-700 hc-pill">{t.mod_projects}</span>
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded font-medium border border-slate-200 dark:border-slate-700 hc-pill">{t.mod_nat_map}</span>
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded font-medium border border-slate-200 dark:border-slate-700 hc-pill">{t.mod_alerts}</span>
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded font-medium border border-slate-200 dark:border-slate-700 hc-pill">{t.mod_cabinet}</span>
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        {/* Workspace Perspective Breadcrumb */}
        <div className="mt-8 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">{t.breadcrumb_local}</span>
            <span className="text-slate-400 dark:text-slate-500">→</span>
            <span className="text-amber-700 dark:text-amber-400 font-bold">{t.breadcrumb_district}</span>
            <span className="text-slate-400 dark:text-slate-500">→</span>
            <span className="text-blue-700 dark:text-blue-400 font-bold">{t.breadcrumb_state}</span>
          </div>
          <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            {t.perspective_tagline}
          </p>
          <p className="mt-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
            {t.perspective_data_flow}
          </p>
        </div>

        {/* Dynamic Launch CTA Section */}
        <div className="mt-6 max-w-xl mx-auto text-center" id="action-launch-zone">
          <div className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className={`w-2 h-2 rounded-full ${cfg.dotColor} animate-pulse`}></span>
            <span>{t.entering_notice} <strong className="text-slate-800 dark:text-white">{t[cfg.workspaceKey]}</strong>.</span>
          </div>

          <button
            className={`w-full py-4 px-6 rounded-xl font-bold text-white text-base shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${cfg.btnBg}`}
            id="btn-launch-workspace"
            onClick={executeAuthLaunch}
            type="button"
          >
            <span>{t.btn_auth_enter} {t[cfg.workspaceKey]}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </button>
        </div>

        {/* National Identity Services Section */}
        <div className="mt-10 max-w-xl mx-auto text-center">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">{t.sso_title}</p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => {
                setEmailOrPhone('a.sharma@gov.in');
                setPassword('password123');
                setSelectedRole('District Administrator');
              }}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs transition-colors cursor-pointer"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>{t.sso_meri_pehchaan}</span>
            </button>
            <button
              onClick={() => {
                setEmailOrPhone('s.mehta@nic.in');
                setPassword('password123');
                setSelectedRole('Central Administration');
              }}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs transition-colors cursor-pointer"
            >
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-xs"></span>
              <span>{t.sso_dsc}</span>
            </button>
            <button
              onClick={() => {
                setEmailOrPhone('r.verma@gov.in');
                setPassword('password123');
                setSelectedRole('Field Officer');
              }}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs transition-colors cursor-pointer"
            >
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs"></span>
              <span>{t.sso_sandes}</span>
            </button>
          </div>
        </div>

        {/* System Status Banner */}
        <div className="mt-8 max-w-2xl mx-auto bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
          <span className="font-bold uppercase tracking-wider text-[11px] text-slate-800 dark:text-white">{t.status_banner_title}</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{t.status_engine_online}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{t.status_gis_online}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>{t.status_audit_ready}</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white dark:bg-[#070d1e] border-t border-slate-200 dark:border-slate-800 text-xs py-4 px-4 sm:px-6 text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 font-medium">
            <a href="#terms" className="hover:text-amber-600 dark:hover:text-amber-400 hover:underline">{t.footer_terms}</a>
            <a href="#privacy" className="hover:text-amber-600 dark:hover:text-amber-400 hover:underline">{t.footer_privacy}</a>
            <a href="#accessibility" className="hover:text-amber-600 dark:hover:text-amber-400 hover:underline">{t.footer_accessibility}</a>
            <a href="#helpdesk" className="hover:text-amber-600 dark:hover:text-amber-400 hover:underline">{t.footer_helpdesk}</a>
            <a href="#hyperlink" className="hover:text-amber-600 dark:hover:text-amber-400 hover:underline">{t.footer_hyperlink}</a>
          </div>
          <div className="text-center md:text-right text-[11px]">
            <span>{t.footer_proto_tag}</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400 dark:text-slate-500">
          <span>{t.footer_ux4g_notice}</span>
          <span>NIC PMU ID: 9482-BHOOMIDRISHTI</span>
        </div>
      </footer>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fade-in">
          <div className={`w-3 h-3 rounded-full ${cfg.dotColor} animate-ping`}></div>
          <span className="text-xs font-semibold">{toastText}</span>
        </div>
      )}
    </div>
  );
}
