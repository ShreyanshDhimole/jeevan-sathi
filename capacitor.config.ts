
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a88339a26096461080a8e8650aa4077e',
  appName: 'jeevan-sathi',
  webDir: 'dist',
  server: {
    url: 'https://a88339a2-6096-4610-80a8-e8650aa4077e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    ScreenTimePlugin: {
      enabled: true
    }
  }
};

export default config;
