import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  Play,
  Activity,
  Sparkles,
  Layers,
  Database,
  RefreshCw
} from 'lucide-react';
import { CustomDataset } from '../../types/simulation';
import { parseAcousticCsv, downloadSampleCsvFile, createDemoCustomDataset } from '../../utils/csvParser';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import { useAppStore } from '../../store/useAppStore';

interface CustomDatasetManagerProps {
  store?: ReturnType<typeof useAppStore>;
  onClose?: () => void;
  compact?: boolean;
}

export const CustomDatasetManager: React.FC<CustomDatasetManagerProps> = ({
  store,
  onClose,
  compact = false
}) => {
  const { customDataset, noiseScenario } = useViewerStore();
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCustomActive = noiseScenario === 'custom_dataset';

  const handleProcessFile = (file: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    // Only CSV files supported
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setErrorMsg('Invalid file format. This system strictly accepts .csv files only.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseAcousticCsv(file.name, file.size, text);

        // Update viewer store & app store
        viewerStore.setCustomDataset(parsed);
        if (store) {
          store.setCustomDataset(parsed);
        }

        setSuccessMsg(`Successfully parsed ${parsed.rowCount} acoustic records from ${file.name}!`);
        setCurrentPage(0);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to parse CSV file. Ensure valid acoustic header columns.');
      }
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read file from local device.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleLoadDemo = () => {
    setErrorMsg(null);
    const demo = createDemoCustomDataset();
    viewerStore.setCustomDataset(demo);
    if (store) store.setCustomDataset(demo);
    setSuccessMsg('Loaded Tactical Battlefield Telemetry Demo Dataset (15 records)!');
    setCurrentPage(0);
  };

  const handleClear = () => {
    viewerStore.setCustomDataset(null);
    if (store) store.setCustomDataset(null);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleApplyToSimulation = () => {
    if (!customDataset) return;
    viewerStore.setScenario('custom_dataset');
    setSuccessMsg('Active simulation & DSP pipeline now running with custom dataset!');
  };

  const rowsPerPage = 6;
  const paginatedRecords = customDataset
    ? customDataset.records.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)
    : [];

  return (
    <div className="w-full font-mono select-none space-y-3">
      {/* Hidden File Input (strictly accepts .csv only) */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload Zone / Drop Target */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? 'border-[#00e5ff] bg-[#00e5ff]/10 scale-[1.01]'
            : customDataset
            ? 'border-emerald-500/40 bg-[#08121a]/60 hover:border-emerald-400'
            : 'border-slate-700 hover:border-[#00e5ff]/50 bg-[#060a12]/70 hover:bg-[#091220]/70'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff]">
            <Upload className="w-5 h-5" />
          </div>

          <div>
            <h4 className="text-xs font-bold text-white tracking-wide">
              {customDataset ? 'REPLACE CUSTOM DATASET (CSV)' : 'IMPORT CUSTOM ACOUSTIC DATASET'}
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Drag &amp; drop your acoustic telemetry file here or click to browse
            </p>
            <div className="mt-1 flex items-center justify-center gap-2 text-[9px] text-slate-500">
              <span className="px-2 py-0.5 rounded bg-[#101826] border border-[#1e293b] text-emerald-400 font-bold">
                .CSV FILES ONLY
              </span>
              <span>Max 50 MB // Client-side Processed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons (Demo Data & Download Template) */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-[10px]">
        <button
          onClick={handleLoadDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1726] border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 hover:bg-[#132238] transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00e5ff]" />
          <span>LOAD DEMO BATTLE DATASET</span>
        </button>

        <button
          onClick={downloadSampleCsvFile}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1726] border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>DOWNLOAD CSV TEMPLATE</span>
        </button>

        {customDataset && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-950/30 border border-red-500/40 text-red-300 hover:bg-red-900/40 transition-all ml-auto"
            title="Remove dataset"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>CLEAR</span>
          </button>
        )}
      </div>

      {/* Feedback Messages */}
      {errorMsg && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/50 text-rose-300 text-[10px] animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-[10px] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Dataset Summary Cards & Table Preview */}
      {customDataset && (
        <div className="space-y-3 pt-1 border-t border-[#1c293d] animate-fade-in">
          {/* Active Dataset Status Bar */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#09101c] border border-emerald-500/30">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[11px] font-bold text-white">{customDataset.fileName}</span>
                <div className="text-[8px] text-slate-400">
                  {customDataset.rowCount} rows • {(customDataset.fileSize / 1024).toFixed(1)} KB • Uploaded {customDataset.uploadTime}
                </div>
              </div>
            </div>

            <button
              onClick={handleApplyToSimulation}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all ${
                isCustomActive
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                  : 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff] hover:bg-[#00e5ff]/30 shadow-[0_0_12px_rgba(0,229,255,0.3)]'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isCustomActive ? 'ACTIVE IN SIMULATION' : 'APPLY TO SIMULATION'}</span>
            </button>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9px]">
            <div className="p-2 rounded-lg bg-[#070b13] border border-[#162234]">
              <span className="text-slate-400 block text-[8px]">PEAK SPL</span>
              <span className="text-xs font-bold text-rose-400">{customDataset.summary.peakSpl} dB</span>
              <span className="text-[8px] text-slate-500 block mt-0.5">Threat Pressure</span>
            </div>

            <div className="p-2 rounded-lg bg-[#070b13] border border-[#162234]">
              <span className="text-slate-400 block text-[8px]">AVG ATTENUATION</span>
              <span className="text-xs font-bold text-[#00e5ff]">{customDataset.summary.avgAttenuationDb} dB</span>
              <span className="text-[8px] text-slate-500 block mt-0.5">FxLMS Nullification</span>
            </div>

            <div className="p-2 rounded-lg bg-[#070b13] border border-[#162234]">
              <span className="text-slate-400 block text-[8px]">DOMINANT FREQ</span>
              <span className="text-xs font-bold text-amber-400">{customDataset.summary.dominantFreq} Hz</span>
              <span className="text-[8px] text-slate-500 block mt-0.5">Spectral Center</span>
            </div>

            <div className="p-2 rounded-lg bg-[#070b13] border border-[#162234]">
              <span className="text-slate-400 block text-[8px]">SNR GAIN</span>
              <span className="text-xs font-bold text-emerald-400">+{customDataset.summary.avgSnrGain} dB</span>
              <span className="text-[8px] text-slate-500 block mt-0.5">DeepFilterNet2 AI</span>
            </div>
          </div>

          {/* Table Preview (Paginated) */}
          <div className="rounded-lg border border-[#162234] bg-[#050810] overflow-hidden">
            <div className="px-2.5 py-1.5 bg-[#090e18] border-b border-[#162234] flex items-center justify-between text-[9px] text-slate-400">
              <span className="font-bold text-slate-200">PARSED ROWS PREVIEW</span>
              <span>
                Page {currentPage + 1} of {Math.ceil(customDataset.records.length / rowsPerPage)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[9px]">
                <thead>
                  <tr className="border-b border-[#141e2e] text-slate-400 bg-[#070c16]">
                    <th className="p-1.5 pl-2 font-semibold">#</th>
                    <th className="p-1.5 font-semibold">TIME</th>
                    <th className="p-1.5 font-semibold">FREQ</th>
                    <th className="p-1.5 font-semibold">AMBIENT (dB)</th>
                    <th className="p-1.5 font-semibold">ANTI-NOISE (dB)</th>
                    <th className="p-1.5 font-semibold">RESIDUAL (dB)</th>
                    <th className="p-1.5 font-semibold">THREAT CLASS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#101827] font-mono text-slate-300">
                  {paginatedRecords.map((r, idx) => (
                    <tr key={idx} className="hover:bg-[#0b1322] transition-colors">
                      <td className="p-1.5 pl-2 text-slate-500">{currentPage * rowsPerPage + idx + 1}</td>
                      <td className="p-1.5">{r.timestamp}s</td>
                      <td className="p-1.5 text-amber-300">{r.frequency_hz} Hz</td>
                      <td className="p-1.5 text-rose-400 font-semibold">{r.ambient_spl_db}</td>
                      <td className="p-1.5 text-cyan-400">{r.anti_noise_spl_db}</td>
                      <td className="p-1.5 text-emerald-400 font-semibold">{r.residual_error_db}</td>
                      <td className="p-1.5 truncate max-w-[120px] text-slate-400">{r.threat_class || 'Battlefield'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {customDataset.records.length > rowsPerPage && (
              <div className="p-1.5 bg-[#070c16] border-t border-[#141e2e] flex items-center justify-end gap-1 text-[9px]">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  className="px-2 py-0.5 rounded bg-[#0d1422] border border-[#1e2a3c] disabled:opacity-40 hover:text-white"
                >
                  PREV
                </button>
                <button
                  disabled={(currentPage + 1) * rowsPerPage >= customDataset.records.length}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-2 py-0.5 rounded bg-[#0d1422] border border-[#1e2a3c] disabled:opacity-40 hover:text-white"
                >
                  NEXT
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
