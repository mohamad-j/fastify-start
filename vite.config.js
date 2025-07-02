import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url';
import vue from '@vitejs/plugin-vue';
import { existsSync } from 'fs';

// Extract custom arguments from process.argv
const hasVueJsArg = process.env.npm_config_vue;

// https://vitejs.dev/config/
export default defineConfig( ( { command, mode } )=>{

  let app = process.env.npm_config_src;
  if( !app ) {
    app = 'main';
  }

  // Check if the app has Vue files
  const appPath = `frontend/apps/${app}`;
  const hasVueFiles = existsSync(`${appPath}/App.vue`) || existsSync(`${appPath}/app.vue`);

  let config = {
    plugins: [],
    root:`frontend/apps/${app}`,
    build:{
        outDir: `${process.cwd()}/backend/public/views/${app}`,
        minify: true,
        rollupOptions: {
            input: `frontend/apps/${app}/index.html`
        },
        emptyOutDir: true,
        target: 'es2015'
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./frontend', import.meta.url)),
        '~': fileURLToPath(new URL('./node_modules', import.meta.url))
      },
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    }
  }

  // Auto-detect Vue.js apps or use explicit flag
  if( hasVueJsArg || hasVueFiles ) {
    config.plugins.push( vue() );
  }
  
  return config;
});