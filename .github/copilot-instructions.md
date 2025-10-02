# NetMob - AI Coding Instructions

## Project Overview
NetMob is a React Native Expo app for validating and editing GPS trajectory and visit data. Users review transport modes (bus, car, walk, bicycle) for trip segments and purposes (HOME, WORK, LEISURE, PURCHASE, OTHER) for visit locations. Data flows: API → Context → Screens (index → transport_map → purpose_map → finish).

## Architecture Patterns

### Data Flow & State Management
- **Single Source of Truth**: `DataContext` wraps the entire app in `app/_layout.tsx` and uses `useTransportData` hook for all state
- **API Integration**: `ApiService` in `utils/apiService.ts` uses hardcoded base URL (`http://192.168.1.83:8000`) with 5s timeout via `fetchWithTimeout`
- **Dual Data Structures**: `visits[]` (server model with uid/visit_number) and `trajectories[]`/`visitPoints[]` (UI model with composite IDs like "123-1")
- **Update Pattern**: UI changes update both structures immediately, then `submitUpdates()` sends `visits[]` to backend via PUT
- **Composite Keys**: 
  - Trajectories: `${uid}-${trip_number}` where trip_number matches the destination visit's visit_number
  - VisitPoints: `${uid}-${visit_number}`
  - When updating from trajectory, parse the ID and match trip_number to visit_number

### Component Hierarchy
```
BaseMap (reusable map core)
├── TransportMap (shows polylines/trajectories)
└── PurposeMap (shows markers only)
    └── PurposePointMap (alternative impl, less used)
```
- `BaseMap.tsx` is the foundation: configurable with `showLines` prop (true = trajectories, false = points only)
- Both specialized maps use `BaseMap` props: `trajectories`, `modeButtons`, `onModeChange`, `showLines`, `children`, `renderMarker`
- Navigation buttons (Continue/Submit) passed as `children` render in absolute positioned container

### Map Interaction Pattern (Critical)
**Two-step selection flow**:
1. User taps item (polyline/marker) → sets `selectedItem`
2. User taps mode button → sets `selectedMode`
3. When BOTH selected → calls `onModeChange(itemId, newMode, newColor)` → resets selections

This pattern is identical in `BaseMap`, `TransportMap`, and `PurposeMap`. Selections stored in local state, cleared after mode change.

### Routing & Navigation
- File-based routing via expo-router: `app/index.tsx` → `app/transport_map.tsx` → `app/purpose_map.tsx` → `app/finish.tsx`
- Use `router.push('/screen_name')` not `navigate()`
- `_layout.tsx` defines Stack navigation with `headerShown: false` and `animation: 'slide_from_right'`

## Configuration & Environment

### Environment Configuration
- **Setup**: Copy `.env.example` to `.env` and configure for your environment
- **Google Maps API**: `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env` (referenced in `app.json` for iOS and Android)
- **Backend URL**: `EXPO_PUBLIC_API_BASE_URL` in `.env` (defaults to `http://192.168.1.83:8000`)
- **Device-specific URLs**:
  - Physical device: Use your machine's local network IP (find via `ipconfig`/`ifconfig`)
  - Android Emulator: `http://10.0.2.2:8000` (special alias for host)
  - iOS Simulator: `http://localhost:8000`
- **Important**: Restart Expo dev server after changing `.env` values

### Path Aliases
- `@/` resolves to project root via `tsconfig.json` paths
- Import like: `import { ThemedView } from '@/components/ThemedView'`

### Colors & Icons
- Transport colors: `#FF5733` (bus), `#3498DB` (car), `#2ECC71` (bicycle), `#9B59B6` (walk)
- Purpose colors: `#4CAF50` (HOME), `#2196F3` (WORK), `#FF9800` (LEISURE), `#9C27B0` (PURCHASE), `#607D8B` (OTHER)
- Icons in `assets/icons/` loaded via `require('../assets/icons/bus.png')`
- Color maps in `useTransportData.tsx` (`getPurposeColor`) and sample data files

## Development Workflow

### Running the App
```bash
npm install
npx expo start        # Development server
npm run android       # Run on Android
npm run ios          # Run on iOS
```

### Backend Dependency
- Backend URL configured via `EXPO_PUBLIC_API_BASE_URL` in `.env`
- API URL is logged on startup - check console if having connection issues
- Endpoints: `GET /trajectories/` (fetch data), `PUT /trajectories/` (update visits), `GET /` (health check)
- Health check runs on app start (`index.tsx` useEffect) to warn if server unreachable
- 5s timeout on all requests (adjust `TIMEOUT_MS` in `apiService.ts` if needed)

### API Data Contract
**VisitData**: `{ uid, visit_number, arrive_time, depart_time, latitude, longitude, purpose, mode_of_transport, validated, created_at }`
**TrajectoryData**: `{ uid, trip_number, trajectory_points[], point_count }`
  - Note: `trip_number` in trajectory corresponds to the destination visit's `visit_number`
  - Trajectory with `trip_number: N` represents the path TO visit N
**TrajectoryPoint**: `{ uid, latitude, longitude, timestamp }`

## Common Tasks

### Adding a New Purpose/Transport Mode
1. Add to `data/purpose_sample.ts` or `data/transport_sample.ts` with id, mode, iconPath, color
2. Add icon PNG to `assets/icons/`
3. Add color to map in `useTransportData.tsx` (`getPurposeColor` or equivalent)

### Creating a New Map Screen
1. Extend `BaseMapComponent` or compose `BaseMap`
2. Pass `modeButtons`, `trajectories` or points, `onModeChange` callback
3. Set `showLines={true}` for trajectories, `false` for points only
4. Implement `onModeChange` to update context state via `updateTrajectoryMode` or `updateVisitPurposeOnMap`

### Modifying UI Position
- Mode buttons: `styles.overlayButtonsContainer` (bottom: 160-180, absolute positioned)
- Navigation buttons: `styles.navigationButtonContainer` (bottom: 50-75)
- Map fills entire screen, buttons layered on top

## Pitfalls & Gotchas
- **Don't break composite IDs**: 
  - Trajectories use `${uid}-${trip_number}` 
  - VisitPoints use `${uid}-${visit_number}`
  - trip_number in trajectory = visit_number of destination visit
- **API Naming Inconsistency**: Trajectories use `trip_number`, Visits use `visit_number` - they correspond to each other
- **Update both data structures**: Changing mode/purpose must update both UI state (trajectories/visitPoints) and server model (visits)
- **Handle empty data gracefully**: All screens check for `loading`, `error`, and empty arrays before rendering maps
- **Timeout on API calls**: Default 5s timeout can fail on slow networks - adjust `TIMEOUT_MS` if needed
- **MapView requires Google provider**: Android needs API key in `android/app/src/main/AndroidManifest.xml` (auto-configured by expo)

## Testing Strategies
- No formal test suite exists
- Manual testing workflow: Start backend → Run app → Test data loading → Test mode changes → Test submission
- Check console logs for API responses (`console.log` statements in `ApiService` and `useTransportData`)
- Use Expo Dev Tools network tab to inspect API calls
