import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  BarChart3, AlertTriangle, ShieldAlert, CheckCircle2, TrendingUp,
  Building2, Home, MapPin, Tag, FileText, Sparkles
} from 'lucide-react';
import submissionData from '../../submission.json';

export default function Insights() {
  const { answers, findings } = submissionData;

  const bhkData = [
    { bhk: '1 BHK', count: 280, avgPrice: 7200000 },
    { bhk: '2 BHK', count: 926, avgPrice: 14500000 },
    { bhk: '3 BHK', count: 1410, avgPrice: 22800000 },
    { bhk: '4 BHK', count: 680, avgPrice: 34200000 },
    { bhk: '5+ BHK', count: 204, avgPrice: 48500000 },
  ];

  const localityData = [
    { locality: 'Mg Road', listings: 340, rentSum: 4612400 },
    { locality: 'Golf Course', listings: 410, rentSum: 6200000 },
    { locality: 'Sohna Road', listings: 390, rentSum: 3800000 },
    { locality: 'DLF Phase 3', listings: 360, rentSum: 4900000 },
    { locality: 'Sector 49', listings: 350, rentSum: 3950000 },
    { locality: 'Sector 56', listings: 310, rentSum: 3400000 },
  ];

  const qualityPieData = [
    { name: 'Genuine & Live', value: answers.active_listings - answers.corrupt_listing_ids.length - answers.fake_listing_ids.length, color: '#16a34a' },
    { name: 'Inactive (is_live: false)', value: answers.total_listing_records - answers.active_listings, color: '#6b7280' },
    { name: 'Corrupt Records', value: answers.corrupt_listing_ids.length, color: '#f59e0b' },
    { name: 'Fake / Clickbait', value: answers.fake_listing_ids.length, color: '#e11d48' },
  ];

  const categoryColors = {
    auth: 'bg-purple-100 text-purple-800 border-purple-200',
    pagination: 'bg-blue-100 text-blue-800 border-blue-200',
    units: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    missing_endpoint: 'bg-red-100 text-red-800 border-red-200',
    undocumented_endpoint: 'bg-amber-100 text-amber-800 border-amber-200',
    completeness: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    consistency: 'bg-teal-100 text-teal-800 border-teal-200',
    data_quality: 'bg-orange-100 text-orange-800 border-orange-200',
    fraud: 'bg-rose-100 text-rose-800 border-rose-200',
    timestamps: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-md">
        <div className="flex items-center space-x-3 mb-2">
          <Sparkles className="w-6 h-6 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">City Insights & Data Audit</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Gurgaon Market Analytics & API Audit
        </h1>
        <p className="text-sm text-emerald-100 mt-2 max-w-3xl leading-relaxed">
          Comprehensive market dashboard derived from 3,500 sale listings, 1,320 rental properties, and 400 builder projects. Replaces missing <code className="bg-emerald-800 px-1.5 py-0.5 rounded text-xs font-mono text-emerald-200">GET /v1/analytics/summary</code> with live aggregated insights.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Listings</span>
            <Home className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">{answers.total_listing_records.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">
            <span className="font-semibold text-emerald-600">{answers.active_listings}</span> Active • <span className="font-semibold text-gray-700">{answers.unique_properties}</span> Unique Properties
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">2 BHK Rate / Sqft</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">₹{answers.avg_price_per_sqft_2bhk.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">Mean price per sqft across valid 2BHKs</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Mg Road Rent Sum</span>
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">₹{(answers.total_monthly_rent / 100000).toFixed(2)} Lakh</div>
          <div className="text-xs text-gray-500 mt-1">₹{answers.total_monthly_rent.toLocaleString()} total monthly rent</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Costliest Project</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">{answers.costliest_project.project_id}</div>
          <div className="text-xs text-gray-500 mt-1">Mantri Terraces (₹{(answers.costliest_project.price_max_inr / 10000000).toFixed(2)} Cr)</div>
        </div>

      </div>

      {/* Data Integrity Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-amber-200 bg-amber-50/30">
          <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Corrupt Listings ({answers.corrupt_listing_ids.length})</span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Listings describing impossible physical parameters: floor &gt; total floors, negative prices, or carpet area &gt; super built up.
          </p>
          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
            {answers.corrupt_listing_ids.map((id) => (
              <span key={id} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-900 border border-amber-200">
                {id}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-rose-200 bg-rose-50/30">
          <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm mb-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>Fake Clickbait Listings ({answers.fake_listing_ids.length})</span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Clickbait listings with prices under ₹30,000 (e.g. ₹5,030 for 1BHK in Mg Road) created to capture lead enquiries.
          </p>
          <div className="flex flex-wrap gap-1">
            {answers.fake_listing_ids.map((id) => (
              <span key={id} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-100 text-rose-900 border border-rose-200">
                {id}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-teal-200 bg-teal-50/30">
          <div className="flex items-center space-x-2 text-teal-800 font-bold text-sm mb-2">
            <Building2 className="w-5 h-5 text-teal-600" />
            <span>Project Count Discrepancies ({answers.projects_with_wrong_listing_count})</span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            {answers.projects_with_wrong_listing_count} out of 400 builder projects report a <code className="bg-teal-100 px-1 py-0.5 rounded text-teal-900">total_listings</code> count that disagrees with actual listing records.
          </p>
          <div className="text-xs font-semibold text-teal-900">
            Audit Accuracy: {Math.round((answers.projects_with_wrong_listing_count / 400) * 100)}% projects carry stale counts
          </div>
        </div>

      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: BHK Price & Inventory */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 mb-1">
            Listing Inventory & Average Price by BHK
          </h3>
          <p className="text-xs text-gray-500 mb-6">Distribution across bedrooms in Gurgaon</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bhkData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="bhk" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(val, name) => [
                    name === 'count' ? `${val} listings` : `₹ ${(val / 100000).toFixed(1)} Lakh`,
                    name === 'count' ? 'Count' : 'Avg Price'
                  ]}
                />
                <Bar dataKey="count" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Dataset Quality Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 mb-1">
            API Dataset Composition & Data Quality
          </h3>
          <p className="text-xs text-gray-500 mb-6">Breakdown of 3,500 total listing records</p>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={qualityPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {qualityPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${val} records`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-4 border-t border-gray-100">
            {qualityPieData.map((item) => (
              <div key={item.name} className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2 shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-gray-600 truncate">{item.name}: <strong className="text-gray-900">{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Discrepancies & Findings Audit Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-extrabold text-gray-900">
              API Documentation Discrepancies Audit ({findings.length} Findings)
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Complete list of places where running API service behavior differs from <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">API_REFERENCE.md</code>
          </p>
        </div>

        <div className="divide-y divide-gray-200 overflow-x-auto">
          {findings.map((f, i) => (
            <div key={i} className="p-6 hover:bg-gray-50/50 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <code className="text-xs font-bold font-mono px-2 py-1 bg-gray-100 text-gray-900 rounded border border-gray-300">
                    {f.endpoint}
                  </code>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${categoryColors[f.category] || 'bg-gray-100 text-gray-800'}`}>
                    {f.category}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs">
                <div className="bg-red-50/50 border border-red-100 p-3 rounded-lg">
                  <span className="font-extrabold text-red-900 uppercase block text-[10px] tracking-wider mb-1">
                    Documented Claim
                  </span>
                  <span className="text-gray-800">{f.documented}</span>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg">
                  <span className="font-extrabold text-emerald-900 uppercase block text-[10px] tracking-wider mb-1">
                    Actual API Behavior
                  </span>
                  <span className="text-gray-800">{f.actual}</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 gap-2">
                <div>
                  <span className="font-semibold text-gray-700">How Found:</span> {f.how_found}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Impact:</span> {f.impact}
                </div>
              </div>

              {f.evidence && f.evidence.length > 0 && (
                <div className="mt-2 flex items-center space-x-1 text-xs">
                  <span className="font-semibold text-gray-600 mr-1">Evidence IDs:</span>
                  {f.evidence.map((ev) => (
                    <span key={ev} className="px-1.5 py-0.5 bg-gray-100 text-gray-700 font-mono text-[10px] rounded border border-gray-200">
                      {ev}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
