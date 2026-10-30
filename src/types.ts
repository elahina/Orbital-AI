export interface LandCoverBreakdown {
  vegetation: number; // percentage
  water: number;
  buildings: number;
  bareLand: number;
  other: number;
}

export interface ObjectDetectionBox {
  id: string;
  label: string; // e.g. 'Road (0.94)', 'Urban_Cluster (0.88)', 'Building (0.91)'
  type: 'building' | 'road' | 'forestry' | 'waterbody' | 'industrial';
  confidence: number;
  box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] relative 0-100%
}

export interface DisasterDetectionResult {
  flood: {
    detected: boolean;
    confidence: number;
    areaKm2: number;
    affectedPixelPercentage: number;
    severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'NONE';
    statusText: string;
    datasetSource: string; // 'Sen1Floods11'
    thresholdApplied: number;
  };
  urbanDestruction: {
    detected: boolean;
    confidence: number;
    areaKm2: number;
    severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'NONE';
    statusText: string;
    temporalStatus: string; // e.g. 'Single-phase SAR processed (xBD paired verification required)'
    datasetSource: string; // 'xBD / xView2'
  };
  wildfire: {
    detected: boolean;
    confidence: number;
    areaKm2: number;
    severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'NONE';
    statusText: string;
    thermalReferenceSource: string; // 'NASA FIRMS MODIS/VIIRS Active Fire Layer'
  };
}

export interface SarAnalysisResponse {
  id: string;
  timestamp: string;
  filename: string;
  originalImage: string;
  colorizedImage: string;
  segmentationMaskImage: string;
  gradCamHeatmapImage: string;
  opticalComparisonImage?: string;
  landCover: LandCoverBreakdown;
  detections: ObjectDetectionBox[];
  disaster: DisasterDetectionResult;
  xaiInterpretation: {
    vegetation: string;
    water: string;
    buildingsAndRoads: string;
    bareLand: string;
    backscatterPhysics: string;
    vvVhRatio: string;
  };
  modelMetadata: {
    colorizationModel: string; // 'SEN12MS-CR Hybrid CNN+GAN'
    segmentationModel: string; // 'SEN12MS Attention U-Net'
    floodModel: string; // 'Sen1Floods11 U-Net (Validated threshold = 0.45)'
    buildingRoadModel: string; // 'SpaceNet Feature Extractor'
    xaiGradCam: string; // 'Layer4 Backscatter Activation Mapping'
  };
}

export interface PollutantMeasurement {
  aqi: number;
  pm25: number; // µg/m³
  no2: number; // ppb
  co: number; // ppm
  ozone: number; // ppb
  pm10: number; // µg/m³
  so2: number; // µg/m³
  category: 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
  categoryColor: string;
  prominentPollutant: string;
}

export interface ForecastPoint {
  time: string;
  aqi: number;
  pm25: number;
  no2: number;
  confidenceUpper: number;
  confidenceLower: number;
}

export interface HeatmapGridCell {
  x: number;
  y: number;
  lat: number;
  lng: number;
  pm25: number;
  aqi: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export interface VirtualSensorDonorStation {
  stationKey: string;
  stationId: string;
  stationName: string;
  cityName: string;
  lat: number;
  lng: number;
  distanceKm: number;
  bearingDeg: number;
  compassDirection: string;
  idwWeight: number;
  idwWeightPercent: number;
  observationTime: string;
  readings: {
    aqi: number;
    category: PollutantMeasurement['category'];
    categoryColor: string;
    pm25: number;
    pm10: number;
    no2: number;
    co: number;
    ozone: number;
  };
}

export interface VirtualSensorExternalReading {
  key: string;
  label: string;
  available: boolean;
  value: number | null;
  displayValue: string;
  unit: string;
  timestamp: string | null;
  source: string;
  usedInNumericalPrediction: boolean;
  missingReason?: string;
}

export interface VirtualSensorValidationSummary {
  methodName: string;
  idwPower: number;
  donorCount: number;
  maxNearestDistanceKm: number;
  maxThirdStationDistanceKm: number;
  trainingStationsCount: number;
  trainingDatesCount: number;
  trainingEvaluationsCount: number;
  heldOutStationsCount: number;
  heldOutDatesCount: number;
  heldOutEvaluationsCount: number;
  heldOutRejectedIsolatedCount: number;
  aqiMae: number;
  aqiRmse: number;
  aqiMedianAe: number;
  aqiR2: number;
  pm25Mae: number;
  pm25Rmse: number;
  categoryExactMatchPct: number;
  conformalTargetCoveragePct: number;
  conformalEmpiricalCoveragePct: number;
  conformalQuantileScore: number;
}

export interface VirtualSensorUncertainty {
  available: boolean;
  method: string;
  nominalCoveragePct: number;
  empiricalCoveragePct: number;
  halfWidthAqi: number;
  lowerAqi: number;
  upperAqi: number;
  donorAqiSpread: number;
  nearestStationDistanceKm: number;
}

export interface VirtualSensorDetails {
  status: 'ESTIMATED' | 'UNAVAILABLE';
  disclaimerLabel: string;
  city: string;
  state: string;
  coordinates: { lat: number; lng: number };
  evaluatedAt: string;
  unavailabilityReason?: string;
  eligibilityChecks: {
    sufficientStations: boolean;
    withinValidatedDistance: boolean;
    validTimestamps: boolean;
    cpcbMinimumPollutantsMet: boolean;
    details: string;
  };
  estimatedSubIndices?: {
    pm25: number;
    pm10: number;
    no2: number;
    co: number;
    ozone: number;
  };
  nearbyStations: VirtualSensorDonorStation[];
  satelliteObservations: {
    status: 'AVAILABLE' | 'PARTIAL' | 'UNAVAILABLE';
    sourceSummary: string;
    usedInNumericalPrediction: boolean;
    items: VirtualSensorExternalReading[];
    missingInputs: string[];
  };
  weatherReadings: {
    status: 'AVAILABLE' | 'PARTIAL' | 'UNAVAILABLE';
    sourceSummary: string;
    usedInNumericalPrediction: boolean;
    windDirectionDeg: number | null;
    windSpeedMs: number | null;
    items: VirtualSensorExternalReading[];
    missingInputs: string[];
  };
  estimationMethod: {
    name: string;
    formulaSummary: string;
    concentrationFirstNote: string;
    externalInputsRoleNote: string;
    steps: string[];
  };
  uncertainty: VirtualSensorUncertainty | null;
  validationSummary: VirtualSensorValidationSummary;
}

export interface VirtualSensorUnavailableResponse {
  valid: boolean;
  isVirtualSensor: true;
  estimateAvailable: false;
  city: string;
  coordinates: { lat: number; lng: number };
  timestamp: string;
  virtualSensor: VirtualSensorDetails;
}

export interface AqiIntelligenceResponse {
  id: string;
  city: string;
  coordinates: { lat: number; lng: number };
  timestamp: string;
  currentPollutants: PollutantMeasurement;
  satelliteData: {
    sensor: string; // 'Sentinel-5P / TROPOMI'
    tropoNo2Column: number; // 10^15 molec/cm²
    cloudFraction: number;
    solarZenithAngle: number;
  };
  groundStation: {
    source: string; // 'CPCB / Ground Monitoring Network'
    stationId: string;
    distanceKm: number;
    confidence: number;
  };
  downscaling: {
    model: string; // 'SRCNN / ESRGAN-based Atmosphere Super-Resolution'
    resolution: string; // '10km Satellite → 1km Street-Level Grid'
    riskZoneDetected: boolean;
    highRiskZoneSummary: string;
    safeZoneSummary: string;
    grid: HeatmapGridCell[];
  };
  forecast: {
    model: string; // 'Deep CNN-LSTM Temporal Forecaster'
    points: ForecastPoint[];
  };
  isVirtualSensor?: boolean;
  virtualSensor?: VirtualSensorDetails;
}

export interface UploadHistoryRecord {
  id: string;
  module: 'SAR' | 'AQI';
  filename: string;
  timestamp: string;
  summary: string;
  data: SarAnalysisResponse | AqiIntelligenceResponse;
}

export interface BenchmarkModelInfo {
  task: string;
  datasetName: string;
  datasetSource: string;
  preprocessing: string;
  split: string;
  architecture: string;
  lossFunction: string;
  optimizer: string;
  epochs: number;
  batchSize: number;
  metrics: Record<string, string>;
  thresholdConfig: string;
}

export interface UploadHistoryItem {
  id: string;
  filename: string;
  timestamp: string;
  status: string;
  analysisResult?: SarAnalysisResponse;
}

export interface AqiLogItem {
  id: string;
  city: string;
  timestamp: string;
  aqi: number;
  category: string;
  pm25: number;
  no2: number;
  co: number;
  ozone: number;
  details?: AqiIntelligenceResponse;
}

export interface SarPresetConfig {
  name: string;
  filename: string;
  description: string;
  presetType: string;
}

export interface SarValidationResult {
  valid: boolean;
  data_type: 'SAR' | 'sar_raster' | 'unknown' | 'optical_photo' | 'pollution_raster' | 'aqi_raster' | 'invalid_format' | string;
  source?: string | null;
  polarization?: string | null;
  sensor?: string | null;
  reason?: string | null;
  checks: {
    fileFormat: { passed: boolean; message: string; format?: string };
    geospatialRaster: { passed: boolean; message: string; crs?: string; dimensions?: string };
    polarizationBands: { passed: boolean; message: string; bandsDetected?: string[] };
    backscatterPhysics: { passed: boolean; message: string; meanBackscatterDb?: string; dynamicRange?: string };
  };
}

export interface AqiValidationResult {
  valid: boolean;
  data_type: string;
  classification?: string;
  relevanceConfidence?: number;
  relevancePercentage?: string;
  pollutant?: string | null;
  source?: string | null;
  reason?: string | null;
  inputCategory?: 'SCIENTIFIC_POLLUTION_RASTER' | 'VISUAL_AQI_MAP' | 'REJECTED';
  checks: {
    fileFormat: { passed: boolean; message: string; format?: string };
    aqiContent?: { passed: boolean; message: string };
    geospatialRaster: { passed: boolean; message: string; crs?: string; bounds?: string };
    pollutantVariable: { passed: boolean; message: string; variableDetected?: string; units?: string };
    rasterValues: { passed: boolean; message: string; physicalRange?: string };
    confidenceCheck?: { passed: boolean; message: string; score?: string };
  };
}

