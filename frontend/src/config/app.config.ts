// Centralized app configuration
// All external URLs and environment-dependent config live here.

export const APP_CONFIG = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'JobPortal',
  APP_TAGLINE: process.env.NEXT_PUBLIC_APP_TAGLINE || 'Find Opportunities. Hire Great Talent.',
  
  // Replace this with your real Play Store URL via NEXT_PUBLIC_PLAY_STORE_URL env variable
  PLAY_STORE_URL: process.env.NEXT_PUBLIC_PLAY_STORE_URL || 'https://play.google.com/store',
  
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  
  SOCIAL: {
    TWITTER: 'https://twitter.com',
    LINKEDIN: 'https://linkedin.com',
    FACEBOOK: 'https://facebook.com',
    INSTAGRAM: 'https://instagram.com',
  },
} as const;

export default APP_CONFIG;
