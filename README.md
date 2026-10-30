# ORBITAL AI — Spectral Earth Rendering & Atmosphere Intelligence

A high-performance dual-domain Earth Observation and Atmospheric Intelligence platform combining Synthetic Aperture Radar (SAR) processing, multi-spectral colorization, AI land cover segmentation, disaster detection, and super-resolution air quality (AQI) downscaling.

---

## 📁 Project Structure

The project is strictly divided into dedicated **frontend** and **backend** modules:

```
├── frontend/                     # Client-Side Application (React 19, Tailwind CSS, Motion, Lucide)
│   └── src/
│       ├── assets/               # Static images and visual assets
│       ├── components/           # Reusable UI components (Sidebar navigation, Voice Assistant HUD, etc.)
│       ├── pages/                # Main application views
│       │   ├── Dashboard.tsx     # Global orbital telemetry & real-time satellite tracking
│       │   ├── SarAnalysis.tsx   # SAR C-Band ingest, colorization, segmentation & disaster detection
│       │   ├── AqiIntelligence.tsx # Atmospheric downscaling, CPCB AQI calculations & CNN-LSTM forecast
│       │   ├── Reports.tsx       # Historical telemetry inspection, PDF export & database purge
│       │   └── About.tsx         # Sensor specs, dataset benchmarks & algorithmic architecture
│       ├── utils/                # Client-side input validators & helpers
│       ├── types.ts              # Global TypeScript interfaces & data contracts
│       ├── App.tsx               # Primary application router & layout shell
│       ├── main.tsx              # React entry point
│       └── index.css             # Tailwind CSS & custom HUD/glassmorphism styling
│
├── backend/                      # Server-Side Engine & ML Pipelines (Node.js, Express, TypeScript)
│   ├── database/                 # Persistent storage
│   │   └── orbital.json          # Telemetry and historical records database
│   ├── database.ts               # Database service layer with CRUD operations
│   ├── mlPipeline.ts             # Satellite & Atmospheric ML simulation & analysis pipelines
│   ├── validators.ts             # Strict SAR & atmospheric raster data validation engine
│   └── server.ts                 # Express API server with endpoints & Vite middleware
│
├── index.html                    # Root HTML entry point
├── package.json                  # Dependencies and build/run scripts
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.ts                # Vite bundler configuration
├── server.ts                     # Root server bootstrap
└── README.md                     # Documentation and run instructions
```

---

## 🚀 How to Run the Application

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher (Node.js 20+ recommended)
- **npm** or **bun** / **yarn**

---

### 2. Install Dependencies
Install all required frontend and backend packages:

```bash
npm install
```

---

### 3. Run in Development Mode
Starts the combined Express API backend and Vite client server on `http://localhost:3000`:

```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` to access the live application.

---

### 4. Build for Production
Compiles the React frontend with Vite into `dist/` and bundles the TypeScript backend with `esbuild` into `dist/server.cjs`:

```bash
npm run build
```

---

### 5. Run in Production Mode
Launches the compiled standalone production server:

```bash
npm start
```

---

### 6. Lint & Type Check
Validates TypeScript types and syntax across the entire codebase:

```bash
npm run lint
```

---

## 🛰️ Core Modules & Capabilities

### 1. Synthetic Aperture Radar (SAR) Pipeline
- **Dual-Pol Ingest**: Sentinel-1 C-Band (5.405 GHz) Level-1 GRD SAR in VV & VH polarizations.
- **Colorization**: SEN12MS-CR Hybrid CNN+GAN model for SAR-to-optical RGB translation.
- **Land Cover Segmentation**: Attention U-Net with ResNet-50 backbone for multi-class land classification.
- **Disaster Detection**: Sen1Floods11 flood inundation mapping, SpaceNet building footprint damage analysis, and NASA FIRMS active thermal fire correlation.
- **Physics-Informed XAI**: Backscatter physics explanations (volume, specular, and double-bounce scattering).

### 2. Atmospheric & AQI Downscaling Pipeline
- **Satellite Ingest**: Sentinel-5P / TROPOMI Level-2 tropospheric NO₂ columns.
- **Ground Calibration**: CPCB Continuous Ambient Air Quality Monitoring Stations (CAAQMS).
- **Spatial Downscaling**: SRCNN/ESRGAN super-resolution downscaling from 10 km satellite footprints to 1 km street-level grids.
- **Temporal Forecast**: Deep CNN-LSTM hybrid forecaster projecting AQI trends over a 6-hour window.

### 3. Analytics, Reports & Export
- **PDF Report Generation**: Instant export of analyzed SAR passes and AQI measurements via `jsPDF`.
- **Telemetry Management**: Inspect detailed telemetry logs and purge records via database endpoints.
