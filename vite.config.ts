import { defineConfig } from 'vite';
import stylelint from 'vite-plugin-stylelint';

export default defineConfig({
  build: {
    target: 'es2020',
    modulePreload: true,
    cssMinify: true,
  },
  plugins: [
    stylelint({
      include: ['src/**/*.scss', 'src/**/*.sass']
    }),
  ]
});
