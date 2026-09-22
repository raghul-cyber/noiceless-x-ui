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
    <div className="w-full font-mono select-none space-y-3 text-xs">
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
            ? 'border-[#00e599] bg-[#00e599]/10 scale-[1.01]'
            : customDataset
            ? 'border-[#00e599]/40 bg-[#08140e] hover:border-[#00e599]'
            : 'border-[#143526] hover:border-[#00e599]/50 bg-[#030906] hover:bg-[#06120b]'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#00e599]/10 border border-[#00e599]/30 flex items-center justify-center text-[#00e599]">
            <Upload className="w-5 h-5" />
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#f0fdf4] tracking-wide">
              {customDataset ? 'REPLACE CUSTOM DATASET (CSV)' : 'IMPORT CUSTOM ACOUSTIC DATASET'}
            </h4>
            <p className="text-[10px] text-[#8ba695] mt-0.5">
              Drag &amp; drop your acoustic telemetry file here or click to browse
            </p>
            <div className="mt-1.5 flex items-center justify-center gap-2 text-[9px]">
              <span className="px-2 py-0.5 rounded bg-[#08140e] border border-[#143526] text-[#00e599] font-bold">
                .CSV FILES ONLY
              </span>
              <span className="text-[#4e6a5b]">Max 50 MB // Client-side Ingested</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons (Demo Data & Download Template) */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-[10px]">
        <button
          onClick={handleLoadDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#08140e] border border-[#00e599]/30 text-[#00e599] hover:border-[#00e599] hover:bg-[#0c1f16] transition-all font-semibold"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00e599]" />
          <span>LOAD DEMO BATTLE DATASET</span>
        </button>

        <button
          onClick={downloadSampleCsvFile}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#08140e] border border-[#143526] text-[#8ba695] hover:border-[#1e4d38] hover:text-[#f0fdf4] transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>DOWNLOAD CSV TEMPLATE</span>
        </button>

        {customDataset && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-950/30 border border-rose-500/40 text-rose-300 hover:bg-rose-900/40 transition-all ml-auto"
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
        <div className="flex items-center gap-2 p-2 rounded-lg bg-[#00e599]/10 border border-[#00e599]/40 text-[#00e599] text-[10px] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#00e599] flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Dataset Summary Cards & Table Preview */}
      {customDataset && (
        <div className="space-y-3 pt-1 border-t border-[#143526] animate-fade-in">
          {/* Active Dataset Status Bar */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#08140e] border border-[#143526]">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#00e599]" />
              <div>
                <span className="text-[11px] font-bold text-[#f0fdf4]">{customDataset.fileName}</span>
                <div className="text-[8px] text-[#8ba695]">
                  {customDataset.rowCount} rows • {(customDataset.fileSize / 1024).toFixed(1)} KB • Uploaded {customDataset.uploadTime}
                </div>
              </div>
            </div>

            <button
              onClick={handleApplyToSimulation}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all ${
                isCustomActive
                  ? 'bg-[#00e599]/20 text-[#00e599] border border-[#00e599] shadow-[0_0_12px_rgba(0,229,153,0.3)]'
                  : 'bg-[#030906] text-[#8ba695] border border-[#143526] hover:border-[#00e599] hover:text-[#00e599]'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isCustomActive ? 'ACTIVE IN SIMULATION' : 'APPLY TO SIMULATION'}</span>
            </button>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9px]">
            <div className="p-2 rounded-lg bg-[#030906] border border-[#143526]">
              <span className="text-[#8ba695] block text-[8px]">PEAK SPL</span>
              <span className="text-xs font-bold text-rose-400 font-mono">{customDataset.summary.peakSpl} dB</span>
              <span className="text-[8px] text-[#4e6a5b] block mt-0.5">Threat Level</span>
            </div>

            <div className="p-2 rounded-lg bg-[#030906] border border-[#143526]">
              <span className="text-[#8ba695] block text-[8px]">AVG ATTENUATION</span>
              <span className="text-xs font-bold text-[#00e599] font-mono">{customDataset.summary.avgAttenuationDb} dB</span>
              <span className="text-[8px] text-[#4e6a5b] block mt-0.5">FxLMS Null</span>
            </div>

            <div className="p-2 rounded-lg bg-[#030906] border border-[#143526]">
              <span className="text-[#8ba695] block text-[8px]">DOMINANT FREQ</span>
              <span className="text-xs font-bold text-amber-400 font-mono">{customDataset.summary.dominantFreq} Hz</span>
              <span className="text-[8px] text-[#4e6a5b] block mt-0.5">Harmonic Peak</span>
            </div>

            <div className="p-2 rounded-lg bg-[#030906] border border-[#143526]">
              <span className="text-[#8ba695] block text-[8px]">SNR GAIN</span>
              <span className="text-xs font-bold text-[#10b981] font-mono">+{customDataset.summary.avgSnrGain} dB</span>
              <span className="text-[8px] text-[#4e6a5b] block mt-0.5">RNNNoise Gain</span>
            </div>
          </div>

          {/* Table Preview (Paginated) */}
          <div className="rounded-lg border border-[#143526] bg-[#020604] overflow-hidden">
            <div className="px-2.5 py-1.5 bg-[#05110a] border-b border-[#143526] flex items-center justify-between text-[9px] text-[#8ba695]">
              <span className="font-bold text-[#f0fdf4]">PARSED ROWS PREVIEW</span>
              <span>
                Page {currentPage + 1} of {Math.ceil(customDataset.records.length / rowsPerPage)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[9px]">
                <thead>
                  <tr className="border-b border-[#143526] text-[#8ba695] bg-[#05110a]">
                    <th className="p-1.5 pl-2 font-semibold">#</th>
                    <th className="p-1.5 font-semibold">TIME</th>
                    <th className="p-1.5 font-semibold">FREQ</th>
                    <th className="p-1.5 font-semibold">AMBIENT (dB)</th>
                    <th className="p-1.5 font-semibold">ANTI-NOISE (dB)</th>
                    <th className="p-1.5 font-semibold">RESIDUAL (dB)</th>
                    <th className="p-1.5 font-semibold">THREAT CLASS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0c1f15] font-mono text-[#d1fae5]">
                  {paginatedRecords.map((r, idx) => (
                    <tr key={idx} className="hover:bg-[#08180f] transition-colors">
                      <td className="p-1.5 pl-2 text-[#4e6a5b]">{currentPage * rowsPerPage + idx + 1}</td>
                      <td className="p-1.5">{r.timestamp}s</td>
                      <td className="p-1.5 text-amber-300 font-mono">{r.frequency_hz} Hz</td>
                      <td className="p-1.5 text-rose-400 font-semibold font-mono">{r.ambient_spl_db}</td>
                      <td className="p-1.5 text-[#00e599] font-mono">{r.anti_noise_spl_db}</td>
                      <td className="p-1.5 text-[#10b981] font-semibold font-mono">{r.residual_error_db}</td>
                      <td className="p-1.5 truncate max-w-[120px] text-[#8ba695]">{r.threat_class || 'Battlefield'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {customDataset.records.length > rowsPerPage && (
              <div className="p-1.5 bg-[#05110a] border-t border-[#143526] flex items-center justify-end gap-1 text-[9px]">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  className="px-2 py-0.5 rounded bg-[#08140e] border border-[#143526] text-[#8ba695] disabled:opacity-40 hover:text-[#f0fdf4] hover:border-[#1e4d38]"
                >
                  PREV
                </button>
                <button
                  disabled={(currentPage + 1) * rowsPerPage >= customDataset.records.length}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-2 py-0.5 rounded bg-[#08140e] border border-[#143526] text-[#8ba695] disabled:opacity-40 hover:text-[#f0fdf4] hover:border-[#1e4d38]"
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
