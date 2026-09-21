import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.js'],
      exclude: [
        '**/node_modules/**',
        '**/test/**',
        '**/__tests__/**',
        'src/config/**',
        'src/middlewares/**',
        'src/server.js',
        'src/app.js',
        'src/views/**',
        'src/public/**'
      ]
    }
  }
});
