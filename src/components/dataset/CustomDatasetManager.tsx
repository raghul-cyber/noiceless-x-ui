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
  Crosshair,
  Target
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
      setErrorMsg('FORMAT REJECTED: System strictly ingests RFC-4180 .csv acoustic files only.');
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

        setSuccessMsg(`ACOUSTIC INGESTION VERIFIED: ${parsed.rowCount} threat records loaded from ${file.name}`);
        setCurrentPage(0);
      } catch (err: any) {
        setErrorMsg(err.message || 'INGESTION ERROR: Failed to parse CSV headers. Required: frequency_hz, ambient_spl_db, anti_noise_spl_db, residual_error_db.');
      }
    };
    reader.onerror = () => {
      setErrorMsg('HARDWARE FAULT: Failed to read file buffer from local storage.');
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
    setSuccessMsg('TACTICAL DEMO LOADED: 15 Battlefield Acoustic Threat Records Armed!');
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
    setSuccessMsg('SIMULATION LINKED: 3D Acoustic & DSP engine actively processing custom dataset!');
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
        className={`mil-corner-bracket border-2 border-dashed rounded p-4 text-center cursor-pointer transition-all duration-150 ${
          dragOver
            ? 'border-[#22e565] bg-[#22e565]/10 scale-[1.01]'
            : customDataset
            ? 'border-[#22e565]/40 bg-[#0b120c] hover:border-[#22e565]'
            : 'border-[#223425] hover:border-[#22e565]/60 bg-[#070e09] hover:bg-[#0c160e]'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded bg-[#22e565]/10 border border-[#22e565]/40 flex items-center justify-center text-[#22e565]">
            <Upload className="w-5 h-5" />
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#f0fdf4] font-stencil tracking-wider uppercase">
              {customDataset ? 'OVERWRITE BATTLEFIELD DATASET (.CSV)' : 'INGEST BATTLEFIELD THREAT ACOUSTIC DATASET'}
            </h4>
            <p className="text-[10px] text-[#8ba695] mt-0.5">
              Drag &amp; drop mission acoustic CSV or click to browse secure file storage
            </p>
            <div className="mt-1.5 flex items-center justify-center gap-2 text-[9px]">
              <span className="px-2 py-0.5 rounded bg-[#0b120c] border border-[#223425] text-[#22e565] font-bold">
                .CSV COMPLIANT ONLY
              </span>
              <span className="text-[#4e6a5b]">Client-Side Ingestion // Zero Network Upload</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons (Demo Data & Download Template) */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-[10px]">
        <button
          onClick={handleLoadDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0b120c] border border-[#22e565]/40 text-[#22e565] hover:border-[#22e565] hover:bg-[#22e565]/10 transition-all font-stencil font-bold"
        >
          <Target className="w-3.5 h-3.5 text-[#22e565]" />
          <span>LOAD DEMO BATTLEFIELD TELEMETRY</span>
        </button>

        <button
          onClick={downloadSampleCsvFile}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0b120c] border border-[#223425] text-[#8ba695] hover:border-[#2e4632] hover:text-[#f0fdf4] transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>DOWNLOAD CSV TEMPLATE</span>
        </button>

        {customDataset && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-red-950/40 border border-red-500/40 text-red-300 hover:bg-red-900/50 transition-all ml-auto font-bold"
            title="Purge Dataset"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>PURGE</span>
          </button>
        )}
      </div>

      {/* Feedback Messages */}
      {errorMsg && (
        <div className="flex items-start gap-2 p-2.5 rounded bg-red-950/40 border border-red-500/50 text-red-300 text-[10px] animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 p-2 rounded bg-[#22e565]/10 border border-[#22e565]/40 text-[#22e565] text-[10px] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#22e565] flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Dataset Summary Cards & Table Preview */}
      {customDataset && (
        <div className="space-y-2.5 pt-1 border-t border-[#223425] animate-fade-in">
          {/* Active Dataset Status Bar */}
          <div className="mil-corner-bracket flex items-center justify-between p-2.5 rounded bg-[#0b120c] border border-[#223425]">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#22e565]" />
              <div>
                <span className="text-[11px] font-bold font-stencil text-[#f0fdf4]">{customDataset.fileName}</span>
                <div className="text-[8px] text-[#8ba695]">
                  {customDataset.rowCount} threat records • {(customDataset.fileSize / 1024).toFixed(1)} KB • Ingested {customDataset.uploadTime}
                </div>
              </div>
            </div>

            <button
              onClick={handleApplyToSimulation}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-stencil font-bold text-[10px] transition-all ${
                isCustomActive
                  ? 'bg-[#22e565]/20 text-[#22e565] border border-[#22e565] shadow-[0_0_12px_rgba(34,229,101,0.3)]'
                  : 'bg-[#070e09] text-[#8ba695] border border-[#223425] hover:border-[#22e565] hover:text-[#22e565]'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isCustomActive ? 'ARMED IN SIMULATION' : 'ENGAGE IN SIMULATION'}</span>
            </button>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9px]">
            <div className="p-2 rounded bg-[#070e09] border border-[#223425]">
              <span className="text-[#8ba695] block text-[8px] uppercase">MAX THREAT SPL</span>
              <span className="text-xs font-bold text-red-400 font-stencil">{customDataset.summary.peakSpl} dB</span>
              <span className="text-[8px] text-[#4e6a5b] block mt-0.5">Peak Acoustic Pulse</span>
            </div>

            <div className="p-2 rounded bg-[#070e09] border border-[#223425]">
              <span className="text-[#8ba695] block text-[8px] uppercase">ACTIVE NULL ATTEN</span>
              <span className="text-xs font-bold text-[#22e565] font-stencil">{customDataset.summary.avgAttenuationDb} dB</span>
              <span className="text-[8px] text-[#4e6a5b] block mt-0.5">FxLMS 180° Anti-Wave</span>
            </div>

            <div className="p-2 rounded bg-[#070e09] border border-[#223425]">
              <span className="text-[#8ba695] block text-[8px] uppercase">DOMINANT FREQ</span>
              <span className="text-xs font-bold text-[#f59e0b] font-stencil">{customDataset.summary.dominantFreq} Hz</span>
              <span className="text-[8px] text-[#4e6a5b] block mt-0.5">Rotor / Engine Peak</span>
            </div>

            <div className="p-2 rounded bg-[#070e09] border border-[#223425]">
              <span className="text-[#8ba695] block text-[8px] uppercase">NET SNR DELTA</span>
              <span className="text-xs font-bold text-[#22e565] font-stencil">+{customDataset.summary.avgSnrGain} dB</span>
              <span className="text-[8px] text-[#4e6a5b] block mt-0.5">DeepFilterNet3 Fidelity</span>
            </div>
          </div>

          {/* Table Preview (Paginated) */}
          <div className="rounded border border-[#223425] bg-[#060a07] overflow-hidden">
            <div className="px-2.5 py-1.5 bg-[#070e09] border-b border-[#223425] flex items-center justify-between text-[9px] text-[#8ba695]">
              <span className="font-bold font-stencil text-[#f0fdf4]">PARSED THREAT ACOUSTIC SAMPLES</span>
              <span>
                Page {currentPage + 1} of {Math.ceil(customDataset.records.length / rowsPerPage)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[9px]">
                <thead>
                  <tr className="border-b border-[#223425] text-[#8ba695] bg-[#070e09]">
                    <th className="p-1.5 pl-2 font-semibold">#</th>
                    <th className="p-1.5 font-semibold">TIME</th>
                    <th className="p-1.5 font-semibold">FREQ</th>
                    <th className="p-1.5 font-semibold">AMBIENT</th>
                    <th className="p-1.5 font-semibold">ANTI-NOISE</th>
                    <th className="p-1.5 font-semibold">RESIDUAL</th>
                    <th className="p-1.5 font-semibold">THREAT CLASS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b2b1d] font-mono text-[#d1fae5]">
                  {paginatedRecords.map((r, idx) => (
                    <tr key={idx} className="hover:bg-[#0c160e] transition-colors">
                      <td className="p-1.5 pl-2 text-[#4e6a5b]">{currentPage * rowsPerPage + idx + 1}</td>
                      <td className="p-1.5">{r.timestamp}s</td>
                      <td className="p-1.5 text-[#f59e0b] font-bold">{r.frequency_hz} Hz</td>
                      <td className="p-1.5 text-red-400 font-bold">{r.ambient_spl_db} dB</td>
                      <td className="p-1.5 text-[#22e565]">{r.anti_noise_spl_db} dB</td>
                      <td className="p-1.5 text-[#22e565] font-bold">{r.residual_error_db} dB</td>
                      <td className="p-1.5 truncate max-w-[120px] text-[#8ba695] uppercase font-stencil">
                        {r.threat_class || 'BATTLEFIELD'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {customDataset.records.length > rowsPerPage && (
              <div className="p-1.5 bg-[#070e09] border-t border-[#223425] flex items-center justify-end gap-1 text-[9px]">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  className="px-2 py-0.5 rounded bg-[#0b120c] border border-[#223425] text-[#8ba695] disabled:opacity-40 hover:text-[#f0fdf4] hover:border-[#2e4632]"
                >
                  PREV
                </button>
                <button
                  disabled={(currentPage + 1) * rowsPerPage >= customDataset.records.length}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-2 py-0.5 rounded bg-[#0b120c] border border-[#223425] text-[#8ba695] disabled:opacity-40 hover:text-[#f0fdf4] hover:border-[#2e4632]"
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
