// Utility to resolve API URLs for both web and native mobile environments
const PRODUCTION_URL = 'https://ais-pre-3oz4h3oxywvdrbpwrfgc2j-379668985169.asia-southeast1.run.app';

export function getApiUrl(endpoint: string): string {
  // Check if running inside mobile native app wrapper (Capacitor/Cordova)
  const isCapacitor = 
    window.location.origin.startsWith('capacitor://') || 
    window.location.protocol === 'file:' ||
    (window.location.origin.startsWith('http://localhost') && !window.location.port);

  if (isCapacitor) {
    // Prefix endpoints with the fully hosted secure production server URL
    return `${PRODUCTION_URL}${endpoint}`;
  }

  // Otherwise, use standard relative paths for the web deployment
  return endpoint;
}
