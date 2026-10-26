import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { glob } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import SortCss from 'postcss-sort-media-queries';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function htmlEntries() {
  return Object.fromEntries(
    glob.sync('./src/**/*.html', { ignore: './src/partials/**' }).map(file => {
      const relativePath = path.relative('src', file).replace(/\\/g, '/');
      const entryName = relativePath.replace(/\.html$/, '').replace(/\//g, '-');

      return [entryName, path.resolve(projectRoot, file)];
    })
  );
}

function cleanPageUrls() {
  const rewrite = (req, _res, next) => {
    const [pathname, search = ''] = (req.url ?? '').split('?');
    const page = pathname.replace(/^\/|\/$/g, '');

    const query = search ? `?${search}` : '';

    if (page === 'gallery') {
      req.url = `/gallery/index.html${query}`;
    }

    if (page === 'form') {
      req.url = `/2-form.html${query}`;
    }

    next();
  };

  return {
    name: 'clean-page-urls',
    configureServer(server) {
      server.middlewares.use(rewrite);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
  };
}

export default defineConfig(({ command }) => {
  return {
    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },
    appType: 'mpa',
    root: 'src',
    build: {
      sourcemap: true,
      rollupOptions: {
        input: htmlEntries(),
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          entryFileNames: chunkInfo => {
            if (chunkInfo.name === 'commonHelpers') {
              return 'commonHelpers.js';
            }
            return '[name].js';
          },
          assetFileNames: assetInfo => {
            if (assetInfo.name && assetInfo.name.endsWith('.html')) {
              return '[name].[ext]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      outDir: '../dist',
      emptyOutDir: true,
    },
    plugins: [
      cleanPageUrls(),
      injectHTML(),
      FullReload(['./src/**/**.html']),
      SortCss({
        sort: 'mobile-first',
      }),
    ],
  };
});
