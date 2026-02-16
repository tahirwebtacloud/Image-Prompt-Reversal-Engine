import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Post Analyzer',
    short_name: 'PostAnalyzer',
    description: 'AI-powered social media post design analysis',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0f1a',
    theme_color: '#0A66C2',
    icons: [
      {
        src: '/icon',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
