import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.8b36b94fe632405da47e42cebc8f1862',
  appName: 'Turbo Racer 3D',
  webDir: 'dist',
  server: {
    url: 'https://8b36b94f-e632-405d-a47e-42cebc8f1862.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-1494865781139465~9543412824',
      testMode: false
    }
  }
};

export default config;
