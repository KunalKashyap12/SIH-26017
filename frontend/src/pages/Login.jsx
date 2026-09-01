import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  ShieldCheck,
  MapPin,
  ClipboardList,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

const ROLES = [
  {
    id: 'Policymaker',
    title: 'Policymaker / Senior Official',
    description: 'National-level strategic oversight, policy interventions, high-risk alert stream & complete analytics access.',
    icon: ShieldCheck,
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    iconBg: 'bg-rose-600 text-white',
    modules: ['Dashboard', 'Projects Directory', 'GIS Risk Map', 'High-Risk Alerts', 'Risk Predictor'],
  },
  {
    id: 'District Administrator',
    title: 'District Administrator',
    description: 'District-level acquisition monitoring, regional heatmaps & proposal delay risk evaluation.',
    icon: MapPin,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    iconBg: 'bg-amber-600 text-white',
    modules: ['Dashboard', 'Projects Directory', 'GIS Risk Map', 'Risk Predictor'],
  },
  {
    id: 'Field Officer',
    title: 'Field Officer',
    description: 'Operational site inspections, title verification tracking & field proposal risk calculator.',
    icon: ClipboardList,
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    iconBg: 'bg-teal-600 text-white',
    modules: ['Dashboard', 'Projects Directory', 'Risk Predictor'],
  },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('Policymaker');
  const [name, setName] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const finalName = name.trim() || (selectedRole === 'Policymaker' ? 'Dr. A. Sharma' : selectedRole === 'District Administrator' ? 'Collector V. Kumar' : 'Inspector R. Singh');
    login(selectedRole, finalName);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 md:p-8 font-sans">
      {/* Top Header Logo */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              N-LAPS <span className="text-xs font-normal px-2 py-0.5 bg-teal-950 text-teal-300 border border-teal-700/50 rounded-full">v1.0</span>
            </h1>
            <p className="text-xs text-slate-400">National Land Acquisition Delay Predictor System</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>PM Gati Shakti Administrative Portal</span>
        </div>
      </div>

      {/* Main Login Form */}
      <div className="max-w-4xl mx-auto w-full my-8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Select Your Administrative Role
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Choose an administrative role to access customized views, analytics modules, and ML risk evaluation tools.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Optional Name Input */}
          <div className="max-w-md mx-auto">
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Official Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Dr. A. Sharma, IAS"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`
                    p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden
                    ${
                      isSelected
                        ? 'bg-slate-800/90 border-teal-500 shadow-xl shadow-teal-950/40 ring-2 ring-teal-500/20'
                        : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                    }
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 text-teal-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${role.iconBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border mb-2 ${role.badgeColor}`}>
                        {role.id}
                      </span>
                      <h3 className="text-lg font-bold text-white tracking-tight">{role.title}</h3>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{role.description}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-700/60">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-2">Visible Modules:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {role.modules.map((m) => (
                        <span key={m} className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="px-8 py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-950/50 transition-all inline-flex items-center gap-2"
            >
              <span>Enter N-LAPS Portal as {selectedRole}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
        Ministry of Infrastructure & Revenue • Government of India • PM Gati Shakti Analytics
      </div>
    </div>
  );
}
