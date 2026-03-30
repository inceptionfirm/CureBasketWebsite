# Dynamic API Service Structure

This folder contains the dynamic API integration for FlyCanary website.

## Structure

```
api/
├── config.js          # API configuration (base URL, headers, etc.)
├── base.js            # Base API service class (handles HTTP requests)
├── authApi.js         # Authentication API endpoints
├── medicineApi.js      # Medicine API endpoints (✅ Implemented)
├── categoryApi.js      # Category API endpoints (TODO)
├── bannerApi.js       # Banner API endpoints (TODO)
├── blogApi.js         # Blog API endpoints (TODO)
├── prescriptionApi.js # Prescription API endpoints (TODO)
└── index.js           # Main export file
```

## Usage

### Import the main API service:
```javascript
import apiService from '../services/api';
```

### Or import specific services:
```javascript
import { medicineApi, authApi } from '../services/api';
```

## Medicine API Example

```javascript
// Get all medicines
const response = await apiService.getMedicines({
  page: 0,
  size: 10,
  sortBy: 'name',
  active: true
});

// Get medicine by ID
const medicine = await apiService.getMedicine(1);

// Search medicines
const results = await apiService.searchMedicines('paracetamol', 10);
```

## Configuration

**Default API base:** **`https://api.curebasket.com`** (signup/login use this host in the Network tab).

**Local dev:** if the browser blocks cross-origin calls, create `.env.local` with `VITE_API_BASE_URL=/api` so requests go through the Vite proxy (`vite.config.js`).

Optional `.env`:

```
# Force full URL in dev (only if API CORS is fixed)
# VITE_API_BASE_URL=https://api.curebasket.com
VITE_PUBLIC_API_KEY=<website static JWT>
```

Catalog calls (medicine, category, blog, banner) use **`usePublicToken: true`**. Cart, cart-order endpoints (`/customer/cart/all`, `search`, `mark-shipment`), and prescriptions use the **customer** JWT when logged in.

## Token Management

The API service automatically:
- Reads token from localStorage (`flycanary_token` or `authToken`)
- Adds `Authorization: Bearer <token>` header to requests
- Saves token after login
- Removes token on logout
