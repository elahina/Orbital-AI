import fs from 'fs';
import path from 'path';
import { UploadHistoryRecord } from '../src/types';

const DB_DIR = path.join(process.cwd(), '.orbital_data');
const DB_FILE = path.join(DB_DIR, 'orbital.json');

// Ensure database folder exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initial seed data with SQLite-compatible schema storage
const initialSeed: UploadHistoryRecord[] = [
  {
    id: 'sar-init-001',
    module: 'SAR',
    filename: 'Sentinel1_IW_GRDH_Kerala_20180816.tif',
    timestamp: '2026-08-28 14:32:10 UTC',
    summary: 'SEN12MS-CR Colorization & Sen1Floods11 Flood Analysis — 18.4 km² inundation detected',
    data: {
      id: 'sar-init-001',
      timestamp: '2026-08-28 14:32:10 UTC',
      filename: 'Sentinel1_IW_GRDH_Kerala_20180816.tif',
      originalImage: '',
      colorizedImage: '',
      segmentationMaskImage: '',
      gradCamHeatmapImage: '',
      landCover: {
        vegetation: 46.2,
        water: 31.8,
        buildings: 14.5,
        bareLand: 7.5,
        other: 0.0,
      },
      detections: [
        { id: 'b1', label: 'Urban_Cluster (0.89)', type: 'building', confidence: 0.89, box: [22, 15, 48, 42] },
        { id: 'r1', label: 'Road_Corridor (0.93)', type: 'road', confidence: 0.93, box: [35, 10, 42, 88] },
        { id: 'f1', label: 'Forestry_Canopy (0.91)', type: 'forestry', confidence: 0.91, box: [55, 50, 90, 85] }
      ],
      disaster: {
        flood: {
          detected: true,
          confidence: 94.2,
          areaKm2: 18.4,
          affectedPixelPercentage: 31.8,
          severity: 'HIGH',
          statusText: 'Flood inundation pattern confirmed by Sen1Floods11 U-Net (Threshold > 0.45)',
          datasetSource: 'Sen1Floods11 (Sentinel-1 SAR)',
          thresholdApplied: 0.45,
        },
        urbanDestruction: {
          detected: false,
          confidence: 24.1,
          areaKm2: 0,
          severity: 'NONE',
          statusText: 'Insufficient temporal information for reliable damage assessment. (Single-phase SAR)',
          temporalStatus: 'xBD dual-phase pre/post optical pair required for validated damage classification.',
          datasetSource: 'xBD / xView2',
        },
        wildfire: {
          detected: false,
          confidence: 12.0,
          areaKm2: 0,
          severity: 'NONE',
          statusText: 'No active-fire evidence detected for the analyzed area/time.',
          thermalReferenceSource: 'NASA FIRMS MODIS/VIIRS Active Fire Layer',
        }
      },
      xaiInterpretation: {
        vegetation: 'Volume scattering in dense canopies produces moderate, diffuse backscatter with cross-polarization (VH) sensitivity.',
        water: 'Specular reflection on smooth open water causes low radar backscatter (dark pixels, σ⁰ < -18 dB).',
        buildingsAndRoads: 'Double-bounce corner reflection between vertical structures and horizontal ground yields high backscatter (bright pixels, σ⁰ > -5 dB).',
        bareLand: 'Rough surface scattering generates intermediate backscatter levels dependent on soil moisture and dielectric constant.',
        backscatterPhysics: 'Synthetic Aperture Radar penetrates cloud cover at C-band (5.405 GHz). Co-polarization (VV) and cross-polarization (VH) capture surface roughness & volumetric texture.',
        vvVhRatio: 'VV/VH ratio calculated at 4.82 dB, consistent with partially submerged alluvial terrain.'
      },
      modelMetadata: {
        colorizationModel: 'SEN12MS-CR Hybrid CNN+GAN (Pix2PixHD with perceptual loss)',
        segmentationModel: 'SEN12MS Attention U-Net with ResNet50 encoder',
        floodModel: 'Sen1Floods11 Deep U-Net (Validated IoU: 0.892, Threshold: 0.45)',
        buildingRoadModel: 'SpaceNet Building & Road Extractor (F1: 0.865)',
        xaiGradCam: 'Layer4 Backscatter Activation Mapping (Gradient-weighted Class Activation)',
      }
    }
  },
  {
    id: 'aqi-init-002',
    module: 'AQI',
    filename: 'Sentinel5P_TROPOMI_NO2_Bengaluru.nc',
    timestamp: '2026-08-28 11:15:00 UTC',
    summary: 'CPCB & Sentinel-5P Atmosphere Downscaling — AQI 128 (Moderate) in Bengaluru Urban',
    data: {
      id: 'aqi-init-002',
      city: 'Bengaluru, India',
      coordinates: { lat: 12.9716, lng: 77.5946 },
      timestamp: '2026-08-28 11:15:00 UTC',
      currentPollutants: {
        aqi: 128,
        pm25: 42.6,
        no2: 38.4,
        co: 1.12,
        ozone: 31.5,
        pm10: 88.0,
        so2: 14.2,
        category: 'Moderate',
        categoryColor: '#eab308',
        prominentPollutant: 'PM2.5'
      },
      satelliteData: {
        sensor: 'Sentinel-5P / TROPOMI (Offline Level-2 NO2 Product)',
        tropoNo2Column: 4.82,
        cloudFraction: 0.12,
        solarZenithAngle: 28.4
      },
      groundStation: {
        source: 'CPCB Ground Continuous Ambient Air Quality Monitoring Station (CAAQMS)',
        stationId: 'KA_BLR_BTM_01',
        distanceKm: 2.4,
        confidence: 96.8
      },
      downscaling: {
        model: 'SRCNN / ESRGAN-based Atmosphere Super-Resolution (10km → 1km)',
        resolution: '10km Satellite → 1km Street-Level Grid',
        riskZoneDetected: true,
        highRiskZoneSummary: 'High Risk Zone Detected in Outer Ring Road / Silk Board Corridor (PM2.5: 68 µg/m³)',
        safeZoneSummary: 'Safe Zone: 4km North near Cubbon Park green canopy (PM2.5: 24 µg/m³)',
        grid: []
      },
      forecast: {
        model: 'Deep CNN-LSTM Temporal Forecaster (6-Hour Window)',
        points: []
      }
    }
  }
];

export class Database {
  private static load(): UploadHistoryRecord[] {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error reading database file, resetting to seed', e);
    }
    this.save(initialSeed);
    return initialSeed;
  }

  private static save(records: UploadHistoryRecord[]) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(records, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving database file', e);
    }
  }

  public static getSarHistory(): UploadHistoryRecord[] {
    return this.load().filter(r => r.module === 'SAR');
  }

  public static getAqiHistory(): UploadHistoryRecord[] {
    return this.load().filter(r => r.module === 'AQI');
  }

  public static addRecord(record: UploadHistoryRecord): UploadHistoryRecord {
    const list = this.load();
    // Insert at beginning
    const updated = [record, ...list];
    this.save(updated);
    return record;
  }

  public static deleteRecord(id: string): boolean {
    const list = this.load();
    const filtered = list.filter(r => r.id !== id);
    if (filtered.length !== list.length) {
      this.save(filtered);
      return true;
    }
    return false;
  }

  public static clearHistory(): void {
    this.save([]);
  }
}
