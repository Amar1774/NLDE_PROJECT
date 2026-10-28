import React, { useState } from 'react';
import {
  Database,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Table as TableIcon,
  Search,
  Filter,
  BarChart,
  ShieldCheck,
  RefreshCcw
} from 'lucide-react';
import {
  PatientRecord,
  FEATURE_NAMES,
  FEATURE_DETAILS,
  ZERO_AS_MISSING_COLS,
  FeatureKey
} from '../../ml/mlpEngine.ts';

interface DatasetPageProps {
  dataset: PatientRecord[];
  onUploadDataset: (newRecords: PatientRecord[]) => void;
  onResetToDefault: () => void;
  isCustomDataset: boolean;
  testRatio: number;
  seed: number;
}

export const DatasetPage: React.FC<DatasetPageProps> = ({
  dataset,
  onUploadDataset,
  onResetToDefault,
  isCustomDataset,
  testRatio,
  seed
}) => {
  const [activeTab, setActiveTab] = useState<'records' | 'zeros' | 'stats' | 'distribution'>('records');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<'all' | '0' | '1'>('all');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [selectedFeatureForDist, setSelectedFeatureForDist] = useState<FeatureKey>('Glucose');

  const totalSamples = dataset.length;
  const class0Count = dataset.filter(r => r.Outcome === 0).length;
  const class1Count = dataset.filter(r => r.Outcome === 1).length;
  const class0Pct = ((class0Count / totalSamples) * 100).toFixed(1);
  const class1Pct = ((class1Count / totalSamples) * 100).toFixed(1);

  // Compute Zero-Value Anomaly Stats
  const zeroStats = FEATURE_NAMES.map(feat => {
    const zeroCount = dataset.filter(r => r[feat] === 0).length;
    const isInvalid = ZERO_AS_MISSING_COLS.includes(feat);
    const zeroPct = ((zeroCount / totalSamples) * 100).toFixed(1);
    return {
      feature: feat,
      meta: FEATURE_DETAILS[feat],
      zeroCount,
      zeroPct,
      isInvalid,
      status: isInvalid && zeroCount > 0 ? 'Invalid Zero (Missing Value)' : (isInvalid ? 'No Zero' : 'Valid Zero (e.g. 0 Pregnancies)')
    };
  });

  // Descriptive Statistics Calculation
  const stats = FEATURE_NAMES.map(feat => {
    const vals = dataset.map(r => r[feat]).sort((a, b) => a - b);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const min = vals[0];
    const max = vals[vals.length - 1];
    const p25 = vals[Math.floor(vals.length * 0.25)];
    const median = vals[Math.floor(vals.length * 0.5)];
    const p75 = vals[Math.floor(vals.length * 0.75)];
    const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / vals.length;
    const std = Math.sqrt(variance);

    return {
      feature: feat,
      label: FEATURE_DETAILS[feat].label,
      mean: mean.toFixed(2),
      std: std.toFixed(2),
      min: min.toFixed(1),
      p25: p25.toFixed(1),
      median: median.toFixed(1),
      p75: p75.toFixed(1),
      max: max.toFixed(1)
    };
  });

  // Filtered dataset for table
  const filtered = dataset.filter(r => {
    if (filterClass !== 'all' && r.Outcome.toString() !== filterClass) return false;
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      return (
        r.Age.toString().includes(term) ||
        r.Glucose.toString().includes(term) ||
        r.BMI.toString().includes(term)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const pagedRecords = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // CSV File Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length < 2) {
          alert('CSV file is empty or missing headers.');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const requiredHeaders = [...FEATURE_NAMES, 'Outcome'];
        const missing = requiredHeaders.filter(h => !headers.includes(h));

        if (missing.length > 0) {
          alert(`CSV missing required columns: ${missing.join(', ')}`);
          return;
        }

        const parsed: PatientRecord[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => parseFloat(c.trim()));
          if (cols.length >= headers.length) {
            const row: any = {};
            headers.forEach((h, idx) => {
              row[h] = cols[idx];
            });
            parsed.push({
              Pregnancies: row['Pregnancies'] ?? 0,
              Glucose: row['Glucose'] ?? 0,
              BloodPressure: row['BloodPressure'] ?? 0,
              SkinThickness: row['SkinThickness'] ?? 0,
              Insulin: row['Insulin'] ?? 0,
              BMI: row['BMI'] ?? 0,
              DiabetesPedigreeFunction: row['DiabetesPedigreeFunction'] ?? 0,
              Age: row['Age'] ?? 0,
              Outcome: Math.round(row['Outcome'] ?? 0)
            });
          }
        }

        if (parsed.length > 0) {
          onUploadDataset(parsed);
          setPage(1);
        } else {
          alert('No valid numerical records could be parsed.');
        }
      } catch (err: any) {
        alert('Error parsing CSV file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Source Attribution */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Database className="w-4 h-4" />
            Stage 2: Exploratory Data Analysis & Leakage-Free Preprocessing
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {isCustomDataset ? 'Custom Uploaded Dataset' : 'Pima Indians Diabetes Benchmark Database'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK). Donated by Vincent Sigillito et al. (Johns Hopkins University).
          </p>
        </div>

        {/* Upload & Reset Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer transition">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            Upload Compatible CSV
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>

          {isCustomDataset && (
            <button
              onClick={onResetToDefault}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-semibold transition"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              Reset to Default (Pima)
            </button>
          )}
        </div>
      </div>

      {/* Dataset Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
          <div className="text-xs uppercase text-slate-400 font-medium">Total Instances</div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">{totalSamples}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Patient observations</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
          <div className="text-xs uppercase text-slate-400 font-medium">Feature Variables</div>
          <div className="text-2xl font-extrabold text-blue-400 mt-1">8</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Continuous clinical metrics</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
          <div className="text-xs uppercase text-slate-400 font-medium">Class 0 (Non-Diabetic)</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{class0Count}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{class0Pct}% of cohort</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
          <div className="text-xs uppercase text-slate-400 font-medium">Class 1 (Diabetic)</div>
          <div className="text-2xl font-extrabold text-rose-400 mt-1">{class1Count}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{class1Pct}% of cohort</div>
        </div>
      </div>

      {/* Leakage-Free Preprocessing Explanation */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-900/60 rounded-xl p-4 sm:p-5 flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-cyan-400 shrink-0 mt-1" />
        <div className="text-xs sm:text-sm text-slate-300 space-y-1">
          <div className="font-bold text-white text-sm">
            Strict Leakage-Free Preprocessing Architecture (Academic Standard)
          </div>
          <p className="leading-relaxed">
            1. <strong>Stratified Split:</strong> Dataset is split into <strong>Train ({(100 - testRatio * 100).toFixed(0)}%)</strong> and <strong>Test ({(testRatio * 100).toFixed(0)}%)</strong> first with seed <code>{seed}</code> to maintain the 65:35 outcome ratio.
          </p>
          <p className="leading-relaxed">
            2. <strong>Median Imputation:</strong> Columns with biological zeros (Glucose, BP, Skinfold, Insulin, BMI) are imputed using medians computed <em>exclusively from the training split</em>.
          </p>
          <p className="leading-relaxed">
            3. <strong>StandardScaler (Z-Score Normalization):</strong> Feature scaling ($\mu=0, \sigma=1$) is fitted strictly on the imputed training data, then used to transform the test set without leaking test statistics.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition flex items-center gap-1.5 ${
            activeTab === 'records'
              ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TableIcon className="w-3.5 h-3.5" />
          Raw Patient Records
        </button>
        <button
          onClick={() => setActiveTab('zeros')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition flex items-center gap-1.5 ${
            activeTab === 'zeros'
              ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          Zero-Value Anomaly Analysis
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition flex items-center gap-1.5 ${
            activeTab === 'stats'
              ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart className="w-3.5 h-3.5" />
          Summary Statistics
        </button>
        <button
          onClick={() => setActiveTab('distribution')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition flex items-center gap-1.5 ${
            activeTab === 'distribution'
              ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          Feature Distributions
        </button>
      </div>

      {/* Tab 1: Records Table */}
      {activeTab === 'records' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search glucose, BMI, age..."
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-cyan-500 w-52 sm:w-64"
                />
              </div>

              <select
                value={filterClass}
                onChange={e => { setFilterClass(e.target.value as any); setPage(1); }}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Classes</option>
                <option value="0">Class 0 (Non-Diabetic)</option>
                <option value="1">Class 1 (Diabetic)</option>
              </select>
            </div>

            <div className="text-xs text-slate-400">
              Showing {filtered.length} matches (Page {page} of {totalPages || 1})
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-300 font-semibold">
                  <th className="p-2.5">ID</th>
                  <th className="p-2.5">Pregnancies</th>
                  <th className="p-2.5">Glucose</th>
                  <th className="p-2.5">BloodPressure</th>
                  <th className="p-2.5">Skinfold</th>
                  <th className="p-2.5">Insulin</th>
                  <th className="p-2.5">BMI</th>
                  <th className="p-2.5">Pedigree</th>
                  <th className="p-2.5">Age</th>
                  <th className="p-2.5">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {pagedRecords.map((r, idx) => {
                  const id = (page - 1) * rowsPerPage + idx + 1;
                  return (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="p-2.5 text-slate-500">#{id}</td>
                      <td className="p-2.5 text-slate-200">{r.Pregnancies}</td>
                      <td className="p-2.5">
                        <span className={r.Glucose === 0 ? 'text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded' : 'text-slate-200'}>
                          {r.Glucose}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <span className={r.BloodPressure === 0 ? 'text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded' : 'text-slate-200'}>
                          {r.BloodPressure}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <span className={r.SkinThickness === 0 ? 'text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded' : 'text-slate-200'}>
                          {r.SkinThickness}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <span className={r.Insulin === 0 ? 'text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded' : 'text-slate-200'}>
                          {r.Insulin}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <span className={r.BMI === 0 ? 'text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded' : 'text-slate-200'}>
                          {r.BMI.toFixed(1)}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-200">{r.DiabetesPedigreeFunction.toFixed(3)}</td>
                      <td className="p-2.5 text-slate-200">{r.Age}</td>
                      <td className="p-2.5 font-sans">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.Outcome === 1
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
                            : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                        }`}>
                          {r.Outcome === 1 ? 'Class 1 (Diabetic)' : 'Class 0 (Non-Diabetic)'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              Page {page} of {totalPages || 1}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs text-slate-200 rounded-lg transition"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs text-slate-200 rounded-lg transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Zero Anomaly */}
      {activeTab === 'zeros' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Biological 'Zero as Missing' Phenomenon</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              In clinical medicine, measurements like blood pressure, blood glucose, or BMI cannot be zero in a living patient.
              In this historical dataset, missing laboratory tests were recorded as literal zeros. Our pipeline detects these invalid values
              and replaces them with the feature median derived strictly from the training partition.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-300 font-semibold">
                  <th className="p-3">Feature Name</th>
                  <th className="p-3">Zero Count</th>
                  <th className="p-3">Zero Percentage</th>
                  <th className="p-3">Clinical Viability</th>
                  <th className="p-3">Imputation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {zeroStats.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-slate-200">
                      {item.feature}
                      <div className="text-[10px] text-slate-500 font-normal">{item.meta.label} ({item.meta.unit})</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-200">{item.zeroCount}</td>
                    <td className="p-3 font-mono">
                      <span className={item.isInvalid && item.zeroCount > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                        {item.zeroPct}%
                      </span>
                    </td>
                    <td className="p-3">
                      {item.isInvalid ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/60">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          Physiologically Impossible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/60">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Clinically Valid
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-300">
                      {item.isInvalid && item.zeroCount > 0 ? (
                        <span className="text-cyan-400 font-mono text-[11px]">
                          Imputed with Train Median
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Preserved (No Imputation)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Descriptive Statistics */}
      {activeTab === 'stats' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Feature Descriptive Statistics</h3>
            <p className="text-xs text-slate-300 mt-1">
              Parametric (Mean, Standard Deviation) and Non-Parametric (Quartiles, Median) summary distributions for all 8 input features.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-300 font-sans font-semibold">
                  <th className="p-3">Feature</th>
                  <th className="p-3">Mean</th>
                  <th className="p-3">Std Dev (σ)</th>
                  <th className="p-3">Min</th>
                  <th className="p-3">25% (Q1)</th>
                  <th className="p-3">Median (Q2)</th>
                  <th className="p-3">75% (Q3)</th>
                  <th className="p-3">Max</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="p-3 font-sans font-semibold text-slate-200">
                      {s.feature}
                    </td>
                    <td className="p-3 text-cyan-300 font-bold">{s.mean}</td>
                    <td className="p-3 text-slate-400">{s.std}</td>
                    <td className="p-3 text-slate-300">{s.min}</td>
                    <td className="p-3 text-slate-300">{s.p25}</td>
                    <td className="p-3 text-emerald-300 font-bold">{s.median}</td>
                    <td className="p-3 text-slate-300">{s.p75}</td>
                    <td className="p-3 text-slate-300">{s.max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Feature Distributions */}
      {activeTab === 'distribution' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Feature Distribution Analysis</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Compare values between Non-Diabetic (Class 0) and Diabetic (Class 1) cohorts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Select Feature:</span>
              <select
                value={selectedFeatureForDist}
                onChange={e => setSelectedFeatureForDist(e.target.value as FeatureKey)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
              >
                {FEATURE_NAMES.map(f => (
                  <option key={f} value={f}>
                    {FEATURE_DETAILS[f].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Simple Distribution Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/60">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                Class 0: Non-Diabetic (n={class0Count})
              </div>
              {(() => {
                const c0Vals = dataset.filter(r => r.Outcome === 0).map(r => r[selectedFeatureForDist]);
                const c0Mean = (c0Vals.reduce((a, b) => a + b, 0) / c0Vals.length).toFixed(1);
                const c0Sorted = [...c0Vals].sort((a, b) => a - b);
                const c0Med = c0Sorted[Math.floor(c0Sorted.length / 2)].toFixed(1);
                return (
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Mean:</span>
                      <span className="font-mono font-bold text-white">{c0Mean} {FEATURE_DETAILS[selectedFeatureForDist].unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Median:</span>
                      <span className="font-mono font-bold text-emerald-300">{c0Med} {FEATURE_DETAILS[selectedFeatureForDist].unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Normal Clinical Range:</span>
                      <span className="text-slate-400 text-[11px]">{FEATURE_DETAILS[selectedFeatureForDist].normalRange}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/60">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
                Class 1: Diabetic (n={class1Count})
              </div>
              {(() => {
                const c1Vals = dataset.filter(r => r.Outcome === 1).map(r => r[selectedFeatureForDist]);
                const c1Mean = (c1Vals.reduce((a, b) => a + b, 0) / c1Vals.length).toFixed(1);
                const c1Sorted = [...c1Vals].sort((a, b) => a - b);
                const c1Med = c1Sorted[Math.floor(c1Sorted.length / 2)].toFixed(1);
                return (
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Mean:</span>
                      <span className="font-mono font-bold text-white">{c1Mean} {FEATURE_DETAILS[selectedFeatureForDist].unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Median:</span>
                      <span className="font-mono font-bold text-rose-300">{c1Med} {FEATURE_DETAILS[selectedFeatureForDist].unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Normal Clinical Range:</span>
                      <span className="text-slate-400 text-[11px]">{FEATURE_DETAILS[selectedFeatureForDist].normalRange}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
