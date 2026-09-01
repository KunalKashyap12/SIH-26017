import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { MapPin, AlertTriangle, Layers, ExternalLink, RefreshCw, Info } from 'lucide-react';

export default function RiskMap() {
  const navigate = useNavigate();
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const fetchDistrictStats = () => {
    setLoading(true);
    setError(null);
    client
      .get('/stats/by-district')
      .then((data) => {
        setDistricts(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load GIS district stats:', err);
        setError('Failed to load GIS map data.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDistrictStats();
  }, []);

  const getDominantCategory = (dist) => {
    const { High, Medium, Low } = dist;
    if (High >= Medium && High >= Low) return 'High';
    if (Medium >= High && Medium >= Low) return 'Medium';
    return 'Low';
  };

  const filteredDistricts = districts.filter((dist) => {
    const dominant = getDominantCategory(dist);
    if (selectedFilter === 'HIGH') return dominant === 'High';
    if (selectedFilter === 'MEDIUM') return dominant === 'Medium';
    if (selectedFilter === 'LOW') return dominant === 'Low';
    return true;
  });

  return (
    <div className="space-y-6 pb-8">
      {/* HEADER CONTROLS */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600" />
            GIS District Risk Heatmap
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Geospatial map centered on India displaying dominant risk levels per district
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedFilter === 'ALL' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Districts ({districts.length})
          </button>
          <button
            onClick={() => setSelectedFilter('HIGH')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedFilter === 'HIGH' ? 'bg-rose-600 text-white font-bold shadow-2xs' : 'text-rose-700 hover:bg-rose-100'
            }`}
          >
            High Risk
          </button>
          <button
            onClick={() => setSelectedFilter('MEDIUM')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedFilter === 'MEDIUM' ? 'bg-amber-500 text-white font-bold shadow-2xs' : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            Medium Risk
          </button>
          <button
            onClick={() => setSelectedFilter('LOW')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedFilter === 'LOW' ? 'bg-emerald-600 text-white font-bold shadow-2xs' : 'text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Low Risk
          </button>
        </div>
      </div>

      {/* MAP & SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaflet Map (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden h-[540px] relative">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-50">
              <div className="flex items-center space-x-2 text-slate-500 text-sm font-medium">
                <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading GIS Map Layer...</span>
              </div>
            </div>
          ) : error ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-rose-50 p-6 text-center">
              <AlertTriangle className="w-10 h-10 text-rose-500 mb-2" />
              <p className="text-sm font-bold text-rose-900">{error}</p>
              <button
                onClick={fetchDistrictStats}
                className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Loading Map
              </button>
            </div>
          ) : (
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              scrollWheelZoom={true}
              className="w-full h-full z-10"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {filteredDistricts.map((dist) => {
                const dominant = getDominantCategory(dist);
                const markerColor =
                  dominant === 'High' ? '#ef4444' : dominant === 'Medium' ? '#f59e0b' : '#10b981';

                const radius = Math.min(Math.max(dist.total_projects * 0.7, 10), 22);

                return (
                  <CircleMarker
                    key={`${dist.state}-${dist.district}`}
                    center={[dist.lat, dist.lng]}
                    radius={radius}
                    pathOptions={{
                      color: markerColor,
                      fillColor: markerColor,
                      fillOpacity: 0.7,
                      weight: 2,
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                      <div className="font-bold text-xs">{dist.district}, {dist.state}</div>
                      <div className="text-[11px] text-slate-600">Avg Risk: {dist.avg_risk_score}</div>
                    </Tooltip>

                    <Popup>
                      <div className="p-1 space-y-2 text-xs min-w-[210px]">
                        <div className="border-b border-slate-200 pb-1.5">
                          <h4 className="font-bold text-slate-900 text-sm">{dist.district}</h4>
                          <span className="text-slate-500">{dist.state} Jurisdiction</span>
                        </div>

                        <div className="space-y-1.5 font-medium">
                          <div className="flex justify-between text-slate-700">
                            <span>Total Projects:</span>
                            <strong className="text-slate-900">{dist.total_projects}</strong>
                          </div>
                          <div className="flex justify-between text-slate-700">
                            <span>Avg Risk Score:</span>
                            <strong className="text-slate-900">{dist.avg_risk_score} / 100</strong>
                          </div>
                          <div className="flex justify-between text-slate-700">
                            <span>Dominant Risk:</span>
                            <strong
                              className={
                                dominant === 'High'
                                  ? 'text-rose-600 font-bold'
                                  : dominant === 'Medium'
                                  ? 'text-amber-600 font-bold'
                                  : 'text-emerald-600 font-bold'
                              }
                            >
                              {dominant} Risk
                            </strong>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            navigate(
                              `/projects?state=${encodeURIComponent(dist.state)}&district=${encodeURIComponent(dist.district)}`
                            )
                          }
                          className="w-full mt-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-md text-[11px] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          Filter Projects in {dist.district} <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          )}

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-slate-200 shadow-md text-xs space-y-1.5">
            <span className="font-bold text-slate-800 block mb-1">Risk Legend</span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 border border-rose-600"></span>
              <span className="text-slate-700 font-medium">High Risk Dominant</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600"></span>
              <span className="text-slate-700 font-medium">Medium Risk Dominant</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600"></span>
              <span className="text-slate-700 font-medium">Low Risk Dominant</span>
            </div>
          </div>
        </div>

        {/* District List Sidebar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[540px]">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              District Summary List
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Click to view matching projects directory</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {filteredDistricts.map((dist, idx) => {
              const dominant = getDominantCategory(dist);
              return (
                <div
                  key={dist.district}
                  onClick={() =>
                    navigate(
                      `/projects?state=${encodeURIComponent(dist.state)}&district=${encodeURIComponent(dist.district)}`
                    )
                  }
                  className="p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-colors">
                      {idx + 1}
                    </span>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 group-hover:text-teal-700 transition-colors">
                        {dist.district}
                      </h5>
                      <span className="text-[11px] text-slate-500">{dist.state}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        dominant === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : dominant === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {dist.avg_risk_score} score
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-medium">{dist.total_projects} projects</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
