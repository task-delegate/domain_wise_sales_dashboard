# Copilot Instructions for Dynamic Sales Dashboard

## Project Overview
A **React + TypeScript + Vite** multi-domain sales analytics dashboard that ingests CSV/Excel data from e-commerce platforms (Myntra, Amazon, Flipkart, AJIO, Nykaa) and visualizes KPIs, trends, and insights using AI-powered column mapping (Groq/Gemini) and Supabase for persistence.

## Architecture

### Core Data Flow
1. **Data Ingestion** → [UploadModal.tsx](components/UploadModal.tsx): Users upload CSV/Excel files or provide URLs
2. **Column Mapping** → [utils/gemini.ts](utils/gemini.ts): Groq API analyzes headers + sample data to auto-map 20+ columns (revenue, price, quantity, dates, delivery/cancellation dates, etc.)
3. **Data Normalization** → [UploadModal.tsx](components/UploadModal.tsx): Sanitizes numeric/date fields per domain rules
4. **Persistence** → [utils/supabase.ts](utils/supabase.ts): Stores domain-specific tables (myntra_data, amazon_data, etc.) with user isolation via localStorage UUID
5. **Analysis** → [hooks/useDashboardData.ts](hooks/useDashboardData.ts): Computes KPIs (revenue, order counts, returns, cancellations) with date/brand filtering
6. **Visualization** → [components/DashboardPage.tsx](components/DashboardPage.tsx) + [components/charts/](components/charts/): Renders KPIs, trends, and charts via Recharts

### Key Type Definitions
- **ColumnMapping** ([types.ts](types.ts#L3-L22)): Maps CSV columns to 20+ semantic fields (revenue, customer, city, deliveredDate, returnDate, etc.)
- **DomainData** ([types.ts](types.ts#L24-L27)): Container for domain-specific data and column mapping
- **AllData**: Record of domain → DomainData for multi-domain support

### Service Boundaries
- **Supabase** ([utils/supabase.ts](utils/supabase.ts)): CRUD for domain-specific tables; domain-to-table mapping; data normalization (parseDecimal, parseTimestamp)
- **Groq API** ([utils/gemini.ts](utils/gemini.ts)): CSV header analysis; returns ColumnMapping as JSON
- **React Hooks** ([hooks/useDashboardData.ts](hooks/useDashboardData.ts)): Stateless data aggregation using useMemo; KPI calculations; filtering by date range and brand

## Project-Specific Patterns

### 1. Multi-Domain Architecture
- **Domains**: Fixed list (Myntra, Amazon, Flipkart, AJIO, Nykaa) defined in [DashboardLayout.tsx](components/DashboardLayout.tsx#L18)
- **Domain-to-Table Mapping**: [supabase.ts](utils/supabase.ts#L9-L17) → matches domain names to Supabase table names
- **Unique Identifier Strategy**: Domain-specific logic ([supabase.ts](utils/supabase.ts#L23-L34)) to detect duplicates using order IDs, SKUs, and domain-specific fields
- **Pattern**: When adding a new domain, update `UPLOAD_DOMAINS`, `getDomainTableName()`, and `getUniqueIdentifier()` in supabase.ts

### 2. Column Mapping as Central Orchestration
- **Groq Prompt** ([gemini.ts](utils/gemini.ts#L8-L39)): Lists 20 target fields; provides sample data context
- **Critical Fields**: `deliveredDate`, `cancelledDate`, `returnDate` trigger KPI calculations in [useDashboardData.ts](hooks/useDashboardData.ts)
- **Null Handling**: Unmapped columns are `null`; downstream code filters safely (e.g., `if (mapping.returnDate)`)
- **Usage**: Always validate mapping before calculations; check examples in [UploadModal.tsx](components/UploadModal.tsx#L69-L72)

### 3. Date Parsing Resilience
- **Parser** ([useDashboardData.ts](hooks/useDashboardData.ts#L17-L35)): Handles ISO strings, Excel dates, DD/MM/YYYY, and Date objects
- **Pattern**: Used for filtering by date range ([useDashboardData.ts](hooks/useDashboardData.ts#L59-L70)); always validate date fields before comparison
- **Example**: Date range filtering checks `parseDate()` result; skips rows with null dates

### 4. React Component State Management
- **View Toggle**: [DashboardLayout.tsx](components/DashboardLayout.tsx#L23) uses `currentView` state to switch between Dashboard and PPT views
- **Modal Patterns**: UploadModal and DeleteDataModal lift state to parent ([DashboardLayout.tsx](components/DashboardLayout.tsx#L86-L87))
- **Data Flow**: Parent manages `allData` (Record<domain, DomainData>); passes domain-specific data to child pages
- **Filtering State**: [DashboardPage.tsx](components/DashboardPage.tsx#L61-L62) manages dateRange and selectedBrand locally

### 5. KPI Calculation Pattern
- **Stateless Computing**: [useDashboardData.ts](hooks/useDashboardData.ts) uses useMemo with explicit dependencies (domainData, dateRange, selectedBrand)
- **Conditional Logic**: KPI functions check if mapping field exists before accessing (e.g., `if (!mapping.returnDate) return { returnCount: 0 }`)
- **Revenue Fallback**: Prioritizes `revenue` column; falls back to `price × quantity` ([useDashboardData.ts](hooks/useDashboardData.ts#L7-L16))
- **Currency Formatting**: Indian Rupees with 0 decimals: `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`

### 6. Error Handling & Validation
- **CSV Analysis Errors**: [gemini.ts](utils/gemini.ts#L6-L14) validates API key format (must start with 'gsk_'); provides actionable URLs
- **Data Validation**: [UploadModal.tsx](components/UploadModal.tsx#L62-L69) checks revenue presence; throws if AI can't identify columns
- **Empty Data**: [DashboardPage.tsx](components/DashboardPage.tsx#L40-L50) shows "Intelligence Awaits" placeholder for missing data
- **Supabase Errors**: Wrapped in try-catch; logged to console; user sees generic fallback UI

### 7. Chart Component Pattern
- **Generic Reusable Charts** ([components/charts/GenericCharts.tsx](components/charts/GenericCharts.tsx)): GenericBarChart, GenericPieChart, DailyTrendChart accept data array + configuration
- **CustomTooltip**: Formats values as currency or numbers using Indian locale
- **Null Data Handling**: Charts check `if (!data || !data.length)` before rendering; display "No data" message
- **Styling**: Tailwind + Recharts chart props; dark theme (slate-900 backgrounds, text-slate-400)

## Build, Dev, and Deployment

### Local Development
```bash
npm install
npm run dev          # Vite dev server on port 3000
npm run build        # Production build (outputs to dist/)
npm run preview      # Preview production build locally
```

### Environment Configuration
- **Vite Config** ([vite.config.ts](vite.config.ts)): Loads GEMINI_API_KEY, GROQ_API_KEY from .env.local via loadEnv()
- **Keys Required**: VITE_GROQ_API_KEY (Groq API for column analysis)
- **Supabase**: Hard-coded URL/key in [supabase.ts](utils/supabase.ts) (public key for anon access)

### Build Details
- **Framework**: React 19.2.0 + TypeScript 5.8
- **Build Tool**: Vite 6.2.0
- **Charts**: Recharts 3.5.1
- **Backend**: Supabase (PostgreSQL) for multi-domain table persistence
- **Output**: Single dist/ folder with bundled JS/CSS

## Key Files Reference

| File | Purpose |
|------|---------|
| [App.tsx](App.tsx) | Root component; auth state (LoginPage vs DashboardLayout) |
| [types.ts](types.ts) | ColumnMapping, DomainData, AllData, Kpi, PptContent type definitions |
| [hooks/useDashboardData.ts](hooks/useDashboardData.ts) | Core KPI + filtering logic; stateless, memoized |
| [utils/supabase.ts](utils/supabase.ts) | Domain table CRUD; deduplication logic; data transformation |
| [utils/gemini.ts](utils/gemini.ts) | Groq API calls for CSV column mapping |
| [components/DashboardLayout.tsx](components/DashboardLayout.tsx) | Main layout; domain selection; modal orchestration |
| [components/DashboardPage.tsx](components/DashboardPage.tsx) | Analytics view; KPI display + charts |
| [components/UploadModal.tsx](components/UploadModal.tsx) | File/URL ingestion; data sanitization; column mapping trigger |
| [components/charts/GenericCharts.tsx](components/charts/GenericCharts.tsx) | Reusable chart components (bar, pie, line, area) |
| [components/PPTGeneratorPage.tsx](components/PPTGeneratorPage.tsx) | Generate PowerPoint presentations from dashboard data |

## Testing & Debugging Tips
- **Column Mapping**: Test with [gemini.ts](utils/gemini.ts) by checking console logs for parsed ColumnMapping
- **Date Parsing**: Verify `parseDate()` in [useDashboardData.ts](hooks/useDashboardData.ts) handles your CSV date formats
- **KPI Calculations**: Enable dev tools → Network → check Supabase queries for data correctness
- **Supabase RLS**: If data doesn't persist, verify user UUID matches; check Supabase dashboard for row-level policies
- **Styling**: Tailwind classes applied directly; check dark mode (bg-gray-900, text-gray-100) in [App.tsx](App.tsx#L20)

## AI Agent Workflow
1. **Start**: Read [types.ts](types.ts) for data structures; understand ColumnMapping as the "translation layer"
2. **Adding Features**: Identify affected domain → check supabase.ts, useDashboardData.ts, then components
3. **Debugging Data**: Trace: UploadModal → gemini.ts (mapping) → supabase.ts (storage) → useDashboardData.ts (calculations) → DashboardPage.tsx (display)
4. **Multi-Domain Changes**: Update all three: domain list, table mapping, and dedup logic in supabase.ts
5. **Charts**: Copy GenericBarChart pattern; pass filtered data array + config; handle null data gracefully
