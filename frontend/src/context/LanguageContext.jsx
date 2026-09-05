import React, { createContext, useContext, useState, useEffect } from 'react';
import { Sun, Moon, Eye } from 'lucide-react';

export const dictionary = {
  en: {
    gov_title: "Government of India | Ministry of Road Transport & Highways • PM Gati Shakti National Master Plan",
    topbar_gov: "भारत सरकार | Government of India",
    topbar_ministry: "Ministry of Road Transport & Highways • PM Gati Shakti National Master Plan",
    btn_contrast: "High Contrast",
    btn_standard: "Standard Mode",
    mode_dark: "Dark Mode",
    mode_light: "Light Mode",
    sih_badge_banner: "SIH PROTOTYPE • DEMO ENVIRONMENT",
    main_sub: "AI & XGBoost/LightGBM SHAP-driven predictive decision support system for Indian infrastructure projects",
    
    // Layout & Navigation
    nav_menu: "Navigation Menu",
    nav_dashboard: "Dashboard",
    nav_directory: "Project Directory",
    nav_gis: "GIS Cadastral Map",
    nav_alerts: "High-Risk Alerts",
    nav_predictor: "Risk Predictor",
    predict_risk: "Predict New Risk",
    btn_logout: "Logout",
    model_accuracy: "Model Accuracy",
    active_perspective: "ACTIVE PERSPECTIVE",
    
    // Roles & Designations
    role_district_admin: "District Administrator & SLAO",
    role_field_officer: "Field Survey & Verification Officer",
    role_central_admin: "Central Policymaker & PMU",
    desig_district: "District Collector / SLAO (Mysuru & Mandya)",
    desig_field: "Field Survey & Verification Officer",
    desig_central: "Senior Policymaker / Central PMU",
    cadre_dm: "DM Cadre",
    cadre_field: "Field Cadre",
    cadre_pmu: "PMU Cadre",

    // Titles
    title_dashboard: "National Land Acquisition Intelligence",
    title_projects: "Infrastructure Project Directory",
    title_project_detail: "Project Risk & Explainability Deep-Dive",
    title_map: "GIS Risk & Acquisition Heatmap",
    title_alerts: "Critical Intervention & High-Risk Alerts",
    title_predict: "Live Proposal Risk Assessment Engine",
    subtitle_main: "Predictive land-acquisition intelligence for proactive infrastructure governance",
    dir_sub: "AI & XGBoost SHAP-driven predictive decision support system for Indian infrastructure projects",

    // Dashboard & Stats
    kpi_total_projects: "Total Active Projects",
    kpi_high_risk: "High Risk Projects",
    kpi_med_risk: "Medium Risk Projects",
    kpi_low_risk: "Low Risk Projects",
    chart_state_risk: "State-wise Risk Distribution",
    chart_sector_risk: "Risk Breakdown by Project Type",
    table_priority_interventions: "Priority Interventions Required",
    col_project_id: "Project ID / Name",
    col_state: "State",
    col_sector: "Sector",
    col_risk_score: "Risk Score",
    col_risk_category: "Risk Level",
    col_actions: "Actions",
    btn_view_details: "View Details",
    
    // Projects Directory
    search_placeholder: "Search project ID, name, district or state...",
    filter_all_risks: "All Risk Levels",
    filter_high_risk: "High Risk (60-100)",
    filter_med_risk: "Medium Risk (30-59)",
    filter_low_risk: "Low Risk (0-29)",
    filter_all_sectors: "All Sectors",
    col_land_required: "Land Area (ha)",
    col_comp_disbursed: "Comp. Disbursed",
    col_pending_days: "Pending Days",
    
    // Alerts
    escalation_summary: "Escalation Summary",
    alerts_window: "72-Hour Rolling Window",
    notif_channel: "Notification Channel",
    send_email: "Send Email Report",
    send_sms: "Send SMS Alert",
    btn_escalate: "Escalate to MoRTH",

    // Predictor & SHAP
    shap_top_drivers: "Top SHAP Contributing Risk Drivers",
    ai_recs: "AI Actionable Policy Recommendations",
    dept_performance: "Department Performance",
    stakeholder_responsiveness: "Stakeholder Responsiveness",

    // Actions & Table Labels
    btn_inspect: "Inspect",
    btn_details: "Details",
    label_days: "days",
    label_showing: "Showing",
    label_to: "to",
    label_of: "of",
    label_projects_unit: "projects",
    label_page: "Page",
    btn_prev: "Previous",
    btn_next: "Next",

    // Telemetry & Sovereign Compliance Footer
    pm_gati_status: "PM Gati Shakti Alignment",
    ml_engine_active: "ML Engine: Active",
    terms: "Terms of Use",
    hyperlink: "Hyperlink Policy",
    privacy: "Privacy Statement",
    gigw: "GIGW 3.0 Compliance",
    helpdesk: "Helpdesk / Grievance Cell",
    stqc: "STQC Certification Status",
    footer_hosting: "Designed and developed in accordance with UX4G (User Experience for Government) guidelines. Hosted on National Cloud (MeitY) by National Informatics Centre (NIC).",
    sih_badge: "SIH Prototype (PS 26017) • Designed for Predictive Land Acquisition Governance",
    bc_root: "BhoomiDrishti",
    bc_ws: "Workspaces",
  },
  hi: {
    gov_title: "भारत सरकार | सड़क परिवहन एवं राजमार्ग मंत्रालय • पीएम गति शक्ति राष्ट्रीय मास्टर प्लान",
    topbar_gov: "भारत सरकार | Government of India",
    topbar_ministry: "सड़क परिवहन एवं राजमार्ग मंत्रालय • पीएम गति शक्ति राष्ट्रीय मास्टर प्लान",
    btn_contrast: "उच्च कंट्रास्ट",
    btn_standard: "मानक मोड",
    mode_dark: "डार्क मोड",
    mode_light: "लाइट मोड",
    sih_badge_banner: "एसआइएच प्रोटोटाइप • डेमो वातावरण",
    main_sub: "भारतीय अवसंरचना परियोजनाओं हेतु एआई एवं एक्सजीबूस्ट एसएचएपी-आधारित पूर्वानुमानात्मक निर्णय सहायता प्रणाली",
    
    // Layout & Navigation
    nav_menu: "नेविगेशन मेनू",
    nav_dashboard: "डैशबोर्ड",
    nav_directory: "परियोजना निर्देशिका",
    nav_gis: "जीआईएस भूकर मानचित्र",
    nav_alerts: "उच्च जोखिम अलर्ट",
    nav_predictor: "जोखिम पूर्वानुमान",
    predict_risk: "नया जोखिम पूर्वाकलन",
    btn_logout: "लॉगआउट",
    model_accuracy: "मॉडल सटीकता",
    active_perspective: "सक्रिय दृष्टिकोण",
    
    // Roles & Designations
    role_district_admin: "जिला प्रशासक एवं एसएलएओ",
    role_field_officer: "क्षेत्र सर्वेक्षण एवं सत्यापन अधिकारी",
    role_central_admin: "केंद्रीय नीति निर्माता एवं पीएमयू",
    desig_district: "जिला कलेक्टर / एसएलएओ (मैसूर एवं मांड्या)",
    desig_field: "क्षेत्र सर्वेक्षण एवं सत्यापन अधिकारी",
    desig_central: "वरिष्ठ नीति निर्माता / केंद्रीय पीएमयू",
    cadre_dm: "डीएम कैडर",
    cadre_field: "फील्ड कैडर",
    cadre_pmu: "पीएमयू कैडर",

    // Titles
    title_dashboard: "राष्ट्रीय भूमि अधिग्रहण बुद्धिमत्ता",
    title_projects: "बुनियादी ढांचा परियोजना निर्देशिका",
    title_project_detail: "परियोजना जोखिम एवं व्याख्यात्मक विश्लेषण",
    title_map: "जीआईएस जोखिम एवं अधिग्रहण हीटमैप",
    title_alerts: "गंभीर हस्तक्षेप एवं उच्च जोखिम अलर्ट",
    title_predict: "सजीव प्रस्ताव जोखिम मूल्यांकन इंजन",
    subtitle_main: "सक्रिय अवसंरचना शासन हेतु पूर्वानुमानात्मक भूमि अधिग्रहण आसूचना",
    dir_sub: "भारतीय बुनियादी ढांचा परियोजनाओं में रियल-टाइम भूमि अधिग्रहण जोखिम निगरानी।",

    // Dashboard & Stats
    kpi_total_projects: "कुल सक्रिय परियोजनाएं",
    kpi_high_risk: "उच्च जोखिम परियोजनाएं",
    kpi_med_risk: "मध्यम जोखिम परियोजनाएं",
    kpi_low_risk: "कम जोखिम परियोजनाएं",
    chart_state_risk: "राज्यवार जोखिम वितरण",
    chart_sector_risk: "परियोजना प्रकार अनुसार जोखिम",
    table_priority_interventions: "प्राथमिकता हस्तक्षेप आवश्यक",
    col_project_id: "परियोजना आईडी / नाम",
    col_state: "राज्य",
    col_sector: "क्षेत्र (सेक्टर)",
    col_risk_score: "जोखिम स्कोर",
    col_risk_category: "जोखिम स्तर",
    col_actions: "कार्रवाई",
    btn_view_details: "विवरण देखें",
    
    // Projects Directory
    search_placeholder: "परियोजना आईडी, नाम, जिला या राज्य खोजें...",
    filter_all_risks: "सभी जोखिम स्तर",
    filter_high_risk: "उच्च जोखिम (60-100)",
    filter_med_risk: "मध्यम जोखिम (30-59)",
    filter_low_risk: "कम जोखिम (0-29)",
    filter_all_sectors: "सभी क्षेत्र",
    col_land_required: "आवश्यक भूमि (हेक्टेयर)",
    col_comp_disbursed: "वितरित मुआवजा",
    col_pending_days: "लंबित दिन",
    
    // Alerts
    escalation_summary: "एस्केलेशन सारांश",
    alerts_window: "72-घंटे रोलिंग विंडो",
    notif_channel: "अधिसूचना चैनल",
    send_email: "ईमेल रिपोर्ट भेजें",
    send_sms: "एसएमएस अलर्ट भेजें",
    btn_escalate: "सड़क परिवहन मंत्रालय को भेजें",

    // Predictor & SHAP
    shap_top_drivers: "शीर्ष एसएचएपी जोखिम कारक",
    ai_recs: "एआई कार्रवाई योग्य नीति सिफारिशें",
    dept_performance: "विभाग प्रदर्शन",
    stakeholder_responsiveness: "हितधारक प्रतिक्रियाशीलता",

    // Actions & Table Labels
    btn_inspect: "निरीक्षण करें",
    btn_details: "विवरण देखें",
    label_days: "दिन",
    label_showing: "दर्शा रहे हैं",
    label_to: "से",
    label_of: "में से",
    label_projects_unit: "परियोजनाएं",
    label_page: "पृष्ठ",
    btn_prev: "पिछला",
    btn_next: "अगला",

    // Telemetry & Sovereign Compliance Footer
    pm_gati_status: "पीएम गति शक्ति संरेखण",
    ml_engine_active: "एमएल इंजन: सक्रिय",
    terms: "उपयोग की शर्तें",
    hyperlink: "हाइपरलिंक नीति",
    privacy: "गोपनीयता कथन",
    gigw: "GIGW 3.0 अनुपालन",
    helpdesk: "हेल्पडेस्क / शिकायत निवारण कक्ष",
    stqc: "एसटीक्यूसी प्रमाणन स्थिति",
    footer_hosting: "यूएक्स4जी (UX4G) दिशानिर्देशों के अनुसार डिज़ाइन एवं विकसित। राष्ट्रीय सूचना विज्ञान केंद्र (NIC) द्वारा नेशनल क्लाउड (MeitY) पर होस्ट किया गया।",
    sih_badge: "एसआइएच प्रोटोटाइप (PS 26017) • पूर्वानुमानात्मक भूमि अधिग्रहण शासन हेतु निर्मित",
    bc_root: "भूमिदृष्टि",
    bc_ws: "कार्यक्षेत्र (वर्कस्पेस)",
  }
};

// State mapping dictionary
export const stateMapHi = {
  'Maharashtra': 'महाराष्ट्र',
  'Uttar Pradesh': 'उत्तर प्रदेश',
  'Tamil Nadu': 'तमिलनाडु',
  'Gujarat': 'गुजरात',
  'Karnataka': 'कर्नाटक',
  'Rajasthan': 'राजस्थान',
  'Andhra Pradesh': 'आंध्र प्रदेश',
  'Odisha': 'ओडिशा',
  'Madhya Pradesh': 'मध्य प्रदेश',
  'West Bengal': 'पश्चिम बंगाल',
  'Bihar': 'बिहार',
  'Haryana': 'हरियाणा',
  'Punjab': 'पंजाब',
  'Kerala': 'केरल',
  'Assam': 'असम',
  'Telangana': 'तेलंगाना',
  'Jharkhand': 'झारखंड',
  'Chhattisgarh': 'छत्तीसगढ़',
  'Uttarakhand': 'उत्तराखंड',
  'Himachal Pradesh': 'हिमाचल प्रदेश'
};

export const translationPhrasesHi = {
  'National Highway Greenfield Expressway': 'राष्ट्रीय राजमार्ग ग्रीनफील्ड एक्सप्रेसवे',
  '4-Laning Economic Corridor': '4-लेनिंग आर्थिक गलियारा',
  'Bharatmala Ring Road': 'भारतमाला रिंग रोड',
  'State Highway Upgrade': 'राज्य राजमार्ग उन्नयन',
  'New Broad Gauge Railway Line': 'नई ब्रॉड गेज रेलवे लाइन',
  'Dedicated Freight Corridor (DFCCIL)': 'समर्पित माल ढुलाई गलियारा (DFCCIL)',
  'Dedicated Freight Corridor': 'समर्पित माल ढुलाई गलियारा',
  'Railway Line Doubling & Electrification': 'रेलवे लाइन दोहरीकरण एवं विद्युतीकरण',
  'High Speed Rail Link': 'हाई स्पीड रेल लिंक',
  'New AIIMS / Healthcare Infrastructure': 'नया एम्स / स्वास्थ्य सेवा अवसंरचना',
  'Super Specialty Hospital & Research Institute': 'सुपर स्पेशलिटी अस्पताल एवं अनुसंधान संस्थान',
  'Regional Medical College': 'क्षेत्रीय मेडिकल कॉलेज',
  'River Interlinking Feeder Canal': 'नदी जोड़ो फीडर नहर',
  'Major Barrage & Lift Irrigation Network': 'प्रमुख बैराज एवं लिफ्ट सिंचाई नेटवर्क',
  'Reservoir Submergence & Dam Land': 'जलाशय जलमग्नता एवं बांध भूमि',
  'Industrial Node & Multi-Modal Logistics Park': 'औद्योगिक नोड एवं मल्टी-मॉडल लॉजिस्टिक्स पार्क',
  'National Investment & Manufacturing Zone': 'राष्ट्रीय निवेश एवं विनिर्माण क्षेत्र',
  'Special Economic Zone (SEZ)': 'विशेष आर्थिक क्षेत्र (SEZ)',
  'Special Economic Zone': 'विशेष आर्थिक क्षेत्र',
  '765kV Green Energy Transmission Line': '765kV ग्रीन एनर्जी ट्रांसमिशन लाइन',
  'HVDC Power Corridor Right-of-Way': 'एचवीडीसी पावर कॉरिडोर राइट-ऑफ-वे',
  'Solar Grid Substation Land': 'सौर ग्रिड सबस्टेशन भूमि',
  'Smart City Arterial Ring Expressway': 'स्मार्ट सिटी आर्टेरियल रिंग एक्सप्रेसवे',
  'Metropolitan Elevated Transit Network': 'मेट्रोपॉलिटन एलिवेटेड ट्रांजिट नेटवर्क',
  'Central Water & Sewage Site': 'केंद्रीय जल एवं सीवेज स्थल',
  'Bhoomi Rashi Live Highway Gazette Notification': 'भूमि राशि लाइव हाईवे गजट अधिसूचना',
  'All India Institute of Medical Sciences': 'अखिल भारतीय आयुर्विज्ञान संस्थान',
  'Super Specialty Medical College & Hospital': 'सुपर स्पेशलिटी मेडिकल कॉलेज एवं अस्पताल',
  'Pune-Nashik Industrial Expressway Corridor': 'पुणे-नासिक औद्योगिक एक्सप्रेसवे गलियारा',
  'NH-44 Hyderabad-Bengaluru Economic Corridor Expressway': 'एनएच-44 हैदराबाद-बेंगलुरु आर्थिक गलियारा एक्सप्रेसवे',
  'Eastern Dedicated Freight Corridor': 'पूर्वी समर्पित माल ढुलाई गलियारा',
  'Western Dedicated Freight Corridor': 'पश्चिमी समर्पित माल ढुलाई गलियारा',

  'Industrial Corridor': 'औद्योगिक गलियारा',
  'Power Transmission': 'विद्युत पारेषण',
  'Urban Infrastructure': 'शहरी अवसंरचना',
  'Healthcare Infrastructure': 'स्वास्थ्य सेवा अवसंरचना',
  'Healthcare': 'स्वास्थ्य सेवा',
  'Highway': 'राजमार्ग',
  'Railway': 'रेलवे',
  'Irrigation': 'सिंचाई',
  'Section 3A': 'धारा 3A',
  'Package': 'पैकेज',
  'Section': 'खंड',
  'Campus': 'परिसर',
  'Tehsil Section': 'तहसील खंड',
  'Rail Section': 'रेल खंड',
  'Tehsil': 'तहसील',
  'Phase 1': 'चरण 1',
  'Phase 2': 'चरण 2',
  'Phase 3': 'चरण 3',
  'Phase A': 'चरण A',
  'Phase B': 'चरण B',
  'Phase C': 'चरण C',

  'Ahmedabad': 'अहमदाबाद',
  'Dholera': 'धोलेरा',
  'Varanasi': 'वाराणसी',
  'Panchkroshi': 'पंचक्रोशी',
  'Hazaribagh': 'हजारीबाग',
  'Katkamsandi': 'कटकमसांडी',
  'Hooghly': 'हुगली',
  'Singur': 'सिंगूर',
  'Dankuni': 'दानकुनी',
  'Sonnagar': 'सोननगर',
  'Pune': 'पुणे',
  'Thane': 'ठाणे',
  'Nagpur': 'नागपुर',
  'Lucknow': 'लखनऊ',
  'Agra': 'आगरा',
  'Bankura': 'बांकुरा',
  'Kolkata': 'कोलकाता',
  'Darbhanga': 'दरभंगा',
  'Patna': 'पटना',
  'Muzaffarpur': 'मुजफ्फरपुर',
  'Surat': 'सूरत',
  'Bengaluru Urban': 'बेंगलुरु शहरी',
  'Mysuru': 'मैसूर',
  'Ranchi': 'राँची',
  'Chennai': 'चेन्नई',
  'Coimbatore': 'कोयंबटूर',
  'Khordha': 'खोर्धा',
  'Sambalpur': 'संबलपुर',
  'Vadodara': 'वडोदरा',
  'Jaipur': 'जयपुर',
  'Jodhpur': 'जोधपुर',
  'Udaipur': 'उदयपुर',
  'Visakhapatnam': 'विशाखापट्टनम',
  'Vijayawada': 'विजयवाड़ा',
  'Guntur': 'गुंटूर',
  'Bhopal': 'भोपाल',
  'Indore': 'इंदौर',
  'Gwalior': 'ग्वालियर',
  'Howrah': 'हावड़ा',
  'Haveli': 'हवेली',
  'Mulshi': 'मुल्शी',
  'Shirur': 'शिरूर',
  'Maval': 'मावल',
  'Bhiwandi': 'भिवंडी',
  'Kalyan': 'कल्याण',
  'Hingna': 'हिंगणा',
  'Kamptee': 'कामठी',
  'Umred': 'उमरेड',
  'Pindra': 'पिंडरा',
  'Raja Talab': 'राजा तालाब',
  'Sarojini Nagar': 'सरोजिनी नगर',
  'Bakshi Ka Talab': 'बक्षी का तालाब',
  'Mohanlalganj': 'मोहनलालगंज',
  'Etmadpur': 'एत्मादपुर',
  'Kiraoli': 'किरावली',
  'Fatehabad': 'फतेहाबाद',
  'Goghat': 'गोघाट',
  'Arambagh': 'आरामबाग',
  'Chinsurah': 'चुंचुड़ा',
  'Bishnupur': 'विष्णुपुर',
  'Khatra': 'खातरा',
  'Bahadurpur': 'बहादुरपुर',
  'Keoti': 'केवटी',
  'Hayaghat': 'हायाघाट',
  'Danapur': 'दानापुर',
  'Phulwari Sharif': 'फुलवारी शरीफ',
  'Bihta': 'बिहटा',
  'Kanti': 'कांटी',
  'Motipur': 'मोतीपुर',
  'Marwan': 'मरवन',
  'Sanand': 'साणंद',
  'Bavla': 'बावला',
  'Choryasi': 'चौरासी',
  'Palsana': 'पलसाना',
  'Olpad': 'ओलपाड',
  'Anekal': 'अनेकल',
  'Yelahanka': 'येलहंका',
  'Bengaluru South': 'बेंगलुरु दक्षिण',
  'Nanjangud': 'नंजनगुड',
  'Hunsur': 'हुंसूर',
  'Barkagaon': 'बड़कागांव',
  'Kanke': 'कांके',
  'Namkum': 'नामकुम',
  'Ambattur': 'अंबत्तूर',
  'Guindy': 'गिंडी',
  'Sriperumbudur': 'श्रीपेरंबुदूर',
  'Sulur': 'सुलूर',
  'Pollachi': 'पोल्लाची',
  'Jatani': 'जटनी',
  'Bhubaneswar': 'भुवनेश्वर',
  'Rengali': 'रेंगली',
  'Maneswar': 'मनेश्वर'
};

const sortedPhraseKeys = Object.keys(translationPhrasesHi).sort((a, b) => b.length - a.length);

const translateTextHi = (str) => {
  if (!str) return str;
  let result = String(str);
  for (const key of sortedPhraseKeys) {
    if (result.includes(key)) {
      result = result.split(key).join(translationPhrasesHi[key]);
    }
  }
  return result;
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('bhoomi_lang') || 'en';
  });

  // Default to Dark Mode so BhoomiDrishti theme is active by default
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('bhoomi_theme');
    return saved ? saved === 'dark' : true;
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('bhoomi_contrast') === 'true';
  });

  const [currentZoom, setCurrentZoom] = useState(100);
  const [istTime, setIstTime] = useState('');

  // Sync dark mode class on document element & body automatically
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('bhoomi_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('bhoomi_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync high contrast mode class across document root and body
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
      document.documentElement.classList.add('high-contrast');
      localStorage.setItem('bhoomi_contrast', 'true');
    } else {
      document.body.classList.remove('high-contrast');
      document.documentElement.classList.remove('high-contrast');
      localStorage.setItem('bhoomi_contrast', 'false');
    }
  }, [highContrast]);

  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('bhoomi_lang', lang);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleContrast = () => {
    setHighContrast((prev) => !prev);
  };

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setIstTime(`${h}:${m}:${s} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const adjustFontSize = (step) => {
    const nextZoom = Math.min(Math.max(currentZoom + step * 5, 90), 120);
    setCurrentZoom(nextZoom);
    document.documentElement.style.fontSize = `${nextZoom}%`;
  };

  const resetFontSize = () => {
    setCurrentZoom(100);
    document.documentElement.style.fontSize = '100%';
  };

  const t = (key, fallback) => {
    const langDict = dictionary[currentLang] || dictionary.en;
    if (langDict[key]) return langDict[key];
    if (dictionary.en[key]) return dictionary.en[key];
    return fallback || key;
  };

  const locState = (val) => {
    if (!val) return val;
    if (currentLang === 'hi') {
      if (stateMapHi[val]) return stateMapHi[val];
      return translateTextHi(val);
    }
    return val;
  };

  const locDistrict = (val) => {
    if (!val) return val;
    if (currentLang === 'hi') {
      return translateTextHi(val);
    }
    return val;
  };

  const locSector = (val) => {
    if (!val) return val;
    if (currentLang === 'hi') {
      return translateTextHi(val);
    }
    return val;
  };

  const locProjectName = (val) => {
    if (!val) return val;
    if (currentLang === 'hi') {
      return translateTextHi(val);
    }
    return val;
  };

  const locRisk = (category) => {
    if (currentLang === 'hi') {
      if (category === 'High' || category === 'High Risk') return 'उच्च जोखिम';
      if (category === 'Medium' || category === 'Medium Risk') return 'मध्यम जोखिम';
      if (category === 'Low' || category === 'Low Risk') return 'कम जोखिम';
    }
    return category;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        changeLanguage,
        isDarkMode,
        toggleDarkMode,
        highContrast,
        toggleContrast,
        currentZoom,
        adjustFontSize,
        resetFontSize,
        istTime,
        t,
        locState,
        locDistrict,
        locSector,
        locProjectName,
        locRisk,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function GovTopNavbar() {
  const {
    currentLang,
    changeLanguage,
    isDarkMode,
    toggleDarkMode,
    highContrast,
    toggleContrast,
    adjustFontSize,
    resetFontSize,
    t,
  } = useLanguage();

  return (
    <>
      {/* Top Sovereign Utility Strip */}
      <header className="w-full bg-white dark:bg-[#0b1329] border-b border-slate-200 dark:border-slate-800 text-xs py-1.5 px-4 md:px-6 transition-colors duration-200" data-purpose="utility-header">
        <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left Gov Identifiers */}
          <div className="flex items-center gap-3 font-medium text-slate-600 dark:text-slate-300">
            <span className="tracking-wide">
              {t('gov_title', 'Government of India | Ministry of Road Transport & Highways • PM Gati Shakti National Master Plan')}
            </span>
          </div>

          {/* Right Gov Utilities */}
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            {/* Text Size Controls */}
            <div aria-label="Font sizing" className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/60">
              <button onClick={() => adjustFontSize(-1)} className="hover:text-amber-600 dark:hover:text-amber-400 font-bold px-1 cursor-pointer" title="Decrease font size" type="button">A-</button>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <button onClick={resetFontSize} className="hover:text-amber-600 dark:hover:text-amber-400 font-bold px-1 cursor-pointer" title="Default font size" type="button">A</button>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <button onClick={() => adjustFontSize(1)} className="hover:text-amber-600 dark:hover:text-amber-400 font-bold px-1 cursor-pointer" title="Increase font size" type="button">A+</button>
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Toggle Dark/Light Theme"
              type="button"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-medium text-[11px] text-slate-200">{t('mode_light', 'Light Mode')}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span className="font-medium text-[11px] text-slate-700">{t('mode_dark', 'Dark Mode')}</span>
                </>
              )}
            </button>

            {/* Language Selector */}
            <div className="relative inline-block">
              <select
                value={currentLang}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent border-0 text-xs font-medium pr-6 py-0.5 focus:ring-0 cursor-pointer text-slate-700 dark:text-slate-200"
              >
                <option className="bg-white dark:bg-slate-900" value="en">English</option>
                <option className="bg-white dark:bg-slate-900" value="hi">हिन्दी</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Tricolor Sovereign Bar below utility header */}
      <div
        className="w-full shrink-0 select-none tricolor-stripe"
        style={{
          height: '4px',
          background: 'linear-gradient(90deg, #ea580c 0%, #ea580c 33.33%, #1d4ed8 33.33%, #1d4ed8 66.66%, #16a34a 66.66%, #16a34a 100%)'
        }}
        data-purpose="tricolor-strip"
      />
    </>
  );
}
