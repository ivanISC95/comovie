// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/comovie/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        id: '/comovie/',
        scope: '/comovie/',
        start_url: '/comovie/',
        name: 'CoMovie - Movie Tracker',
        short_name: 'CoMovie',
        description: 'Lleva el control de tus películas vistas y por ver sin conexión a Internet.',
        theme_color: '#228be6',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/comovie/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/comovie/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/comovie/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: '/comovie/pwa-512x512.png', // O una captura real de tu interfaz de escritorio
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'wide',
            label: 'CoMovie Desktop'
          },
          {
            src: '/comovie/pwa-512x512.png', // O una captura real de tu interfaz móvil
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'CoMovie Mobile'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
});