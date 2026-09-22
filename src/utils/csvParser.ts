import { CustomDataset, CustomDatasetRecord } from '../types/simulation';

/**
 * Robust CSV parser for tactical acoustic and telemetry datasets.
 * Supports comma, semicolon, and tab delimiters, quoted values, and flexible column headers.
 */
export function parseAcousticCsv(fileName: string, fileSize: number, csvText: string): CustomDataset {
  const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('CSV file must contain at least a header row and one data row.');
  }

  // Detect delimiter: comma, semicolon, or tab
  const headerLine = lines[0];
  let delimiter = ',';
  if (headerLine.includes(';') && !headerLine.includes(',')) delimiter = ';';
  else if (headerLine.includes('\t')) delimiter = '\t';

  // Split headers and clean
  const rawHeaders = splitCsvLine(headerLine, delimiter).map((h) => h.trim().replace(/^["']|["']$/g, ''));
  const normalizedHeaders = rawHeaders.map((h) => h.toLowerCase().replace(/[^a-z0-9_]/g, '_'));

  // Header column index mapping
  const colMap: Record<string, number> = {};
  normalizedHeaders.forEach((h, idx) => {
    if (h.includes('time') || h === 't' || h === 'sec' || h === 's') colMap['timestamp'] = idx;
    else if (h.includes('freq') || h.includes('hz')) colMap['frequency_hz'] = idx;
    else if (h.includes('anti') || h.includes('speaker') || h.includes('cancel')) colMap['anti_noise_spl_db'] = idx;
    else if (h.includes('ambient') || (h.includes('spl') && !h.includes('anti')) || (h.includes('noise') && !h.includes('anti'))) colMap['ambient_spl_db'] = idx;
    else if (h.includes('res') || h.includes('err') || h.includes('in_ear')) colMap['residual_error_db'] = idx;
    else if (h.includes('threat') || h.includes('class') || h.includes('type') || h.includes('label')) colMap['threat_class'] = idx;
    else if (h.includes('intel') || h.includes('pesq') || h.includes('stoi')) colMap['intelligibility_pct'] = idx;
    else if (h.includes('snr')) colMap['snr_db'] = idx;
  });

  const records: CustomDatasetRecord[] = [];
  let totalAmbientSpl = 0;
  let peakSpl = 0;
  let totalResidual = 0;
  let totalFreq = 0;
  let validFreqCount = 0;
  const threatClassCounts: Record<string, number> = {};

  for (let i = 1; i < lines.length; i++) {
    const rowValues = splitCsvLine(lines[i], delimiter).map((v) => v.trim().replace(/^["']|["']$/g, ''));
    if (rowValues.length === 0 || (rowValues.length === 1 && rowValues[0] === '')) continue;

    const rec: CustomDatasetRecord = { id: i };

    // Standard columns
    rawHeaders.forEach((rawH, idx) => {
      const val = rowValues[idx];
      const numVal = parseFloat(val);
      rec[rawH] = !isNaN(numVal) && isFinite(numVal) ? numVal : val;
    });

    // Mapped standard telemetry
    if (colMap['timestamp'] !== undefined) {
      rec.timestamp = rowValues[colMap['timestamp']];
    } else {
      rec.timestamp = (i * 0.05).toFixed(2);
    }

    if (colMap['frequency_hz'] !== undefined) {
      const f = parseFloat(rowValues[colMap['frequency_hz']]);
      if (!isNaN(f)) {
        rec.frequency_hz = f;
        totalFreq += f;
        validFreqCount++;
      }
    } else {
      rec.frequency_hz = 250 + (i % 8) * 120;
    }

    if (colMap['ambient_spl_db'] !== undefined) {
      const spl = parseFloat(rowValues[colMap['ambient_spl_db']]);
      if (!isNaN(spl)) {
        rec.ambient_spl_db = spl;
        totalAmbientSpl += spl;
        if (spl > peakSpl) peakSpl = spl;
      }
    } else {
      // Default estimation
      const spl = 105 + (i % 6) * 4;
      rec.ambient_spl_db = spl;
      totalAmbientSpl += spl;
      if (spl > peakSpl) peakSpl = spl;
    }

    if (colMap['anti_noise_spl_db'] !== undefined) {
      const anti = parseFloat(rowValues[colMap['anti_noise_spl_db']]);
      rec.anti_noise_spl_db = !isNaN(anti) ? anti : -((rec.ambient_spl_db || 110) * 0.98);
    } else {
      rec.anti_noise_spl_db = -((rec.ambient_spl_db || 110) * 0.98);
    }

    if (colMap['residual_error_db'] !== undefined) {
      const res = parseFloat(rowValues[colMap['residual_error_db']]);
      if (!isNaN(res)) {
        rec.residual_error_db = res;
        totalResidual += res;
      }
    } else {
      const res = Math.max(68, (rec.ambient_spl_db || 110) - 34.6);
      rec.residual_error_db = res;
      totalResidual += res;
    }

    if (colMap['threat_class'] !== undefined && rowValues[colMap['threat_class']]) {
      const tc = rowValues[colMap['threat_class']];
      rec.threat_class = tc;
      threatClassCounts[tc] = (threatClassCounts[tc] || 0) + 1;
    }

    if (colMap['intelligibility_pct'] !== undefined) {
      const intel = parseFloat(rowValues[colMap['intelligibility_pct']]);
      rec.intelligibility_pct = !isNaN(intel) ? intel : 98.4;
    } else {
      rec.intelligibility_pct = 98.4;
    }

    records.push(rec);
  }

  const rowCount = records.length;
  if (rowCount === 0) {
    throw new Error('CSV contained no valid data rows.');
  }

  const avgAmbientSpl = totalAmbientSpl / rowCount;
  const avgResidual = totalResidual / rowCount;
  const avgAttenuationDb = Math.max(0, avgAmbientSpl - avgResidual);
  const dominantFreq = validFreqCount > 0 ? Math.round(totalFreq / validFreqCount) : 340;

  // Find most frequent threat class
  let dominantThreat = 'Battlefield Custom Telemetry';
  let maxCount = 0;
  for (const [tc, cnt] of Object.entries(threatClassCounts)) {
    if (cnt > maxCount) {
      maxCount = cnt;
      dominantThreat = tc;
    }
  }

  return {
    fileName,
    fileSize,
    uploadTime: new Date().toLocaleTimeString(),
    rowCount,
    headers: rawHeaders,
    records,
    summary: {
      avgAmbientSpl: parseFloat(avgAmbientSpl.toFixed(1)),
      peakSpl: parseFloat(peakSpl.toFixed(1)),
      avgAttenuationDb: parseFloat(avgAttenuationDb.toFixed(1)),
      dominantFreq,
      threatClass: dominantThreat,
      avgSnrGain: parseFloat((avgAttenuationDb * 0.88).toFixed(1)),
    },
  };
}

/**
 * Split CSV line respecting quotes
 */
function splitCsvLine(line: string, delimiter: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      values.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  values.push(currentValue);
  return values;
}

/**
 * Generate sample CSV template for download
 */
export function generateSampleCsvContent(): string {
  return `timestamp_s,frequency_hz,ambient_spl_db,anti_noise_spl_db,residual_error_db,threat_class,intelligibility_pct
0.00,120,112.4,-111.8,74.2,Heavy Rotor Blade Slap,98.2
0.05,240,115.8,-115.1,75.1,Heavy Rotor Blade Slap,98.5
0.10,380,118.2,-117.4,76.4,Turboshaft Engine Bleed,97.9
0.15,850,142.1,-139.5,82.6,Supersonic Ballistic Shock,94.2
0.20,1200,138.4,-136.2,80.1,Muzzle Blast Resonance,95.6
0.25,450,108.6,-107.9,73.8,Turbulent Rotor Vortex,98.8
0.30,160,114.2,-113.7,74.5,Exhaust Jet Rumble,98.1
0.35,320,110.8,-110.1,73.9,Transmission Gear Clatter,98.7
0.40,680,126.5,-124.8,77.3,Automatic Rifle Burst,96.8
0.45,920,131.2,-129.4,78.9,Close-Quarter Small Arms,96.1
0.50,180,113.6,-113.0,74.1,High-Torque Diesel Hum,98.4
0.55,340,111.5,-110.9,73.7,Turbine Compressor Whine,98.6
0.60,490,109.8,-109.2,74.0,Airframe Resonant Shudder,98.5
0.65,750,122.3,-120.9,76.8,Mortar Shockwave Bleed,97.1
0.70,1100,135.0,-132.8,79.5,Ballistic Overpressure,95.8`;
}

/**
 * Trigger download of the sample CSV template
 */
export function downloadSampleCsvFile() {
  const content = generateSampleCsvContent();
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'noiseless_x_acoustic_dataset_template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Pre-packaged demo dataset ready for immediate 1-click loading
 */
export function createDemoCustomDataset(): CustomDataset {
  const content = generateSampleCsvContent();
  return parseAcousticCsv('tactical_battlefield_telemetry.csv', 1420, content);
}
