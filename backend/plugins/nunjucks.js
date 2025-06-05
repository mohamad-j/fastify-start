import fp from 'fastify-plugin';
import nunjucks from 'nunjucks';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

export default fp(async function (fastify, options) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  
  // Default options that can be overridden with app-level configuration
  const config = {
    viewsFolder: path.join(__dirname, '..', 'views'),
    autoescape: true,
    watch: process.env.NODE_ENV !== 'production',
    noCache: process.env.NODE_ENV !== 'production',
    globals: {
      appName: 'My Fastify App',
      year: new Date().getFullYear(),
      renderScripts:( p_path )=>{
        /// Check if any .js files are present in the given path
        const scriptsPath = path.join(__dirname, '..', 'public', p_path, 'assets');
        if (fs.existsSync(scriptsPath)) {
          const files = fs.readdirSync(scriptsPath);
          const jsFiles = files.filter(file => file.endsWith('.js'));
          
          if (jsFiles.length > 0) {
            return jsFiles.map(file => `<script src="public/${p_path}/assets/${file}"></script>`).join('\n');
          }
        }
        
      },
      renderStyles:( p_path )=>{
        /// Check if any .css files are present in the given path
        const stylesPath = path.join(__dirname, '..', 'public', p_path, 'assets');
        if (fs.existsSync(stylesPath)) {
          const files = fs.readdirSync(stylesPath);
          const cssFiles = files.filter(file => file.endsWith('.css'));
          
          if (cssFiles.length > 0) {
            return cssFiles.map(file => `<link rel="stylesheet" href="public/${p_path}/assets/${file}">`).join('\n');
          }
        }
      }
    },
    filters: {
      uppercase: (str) => str.toUpperCase()
    },
    ...options
  };

  // Configure Nunjucks environment
  const env = nunjucks.configure(config.viewsFolder, {
    autoescape: config.autoescape,
    watch: config.watch,
    noCache: config.noCache
  });

  // Add custom globals
  Object.entries(config.globals).forEach(([key, value]) => {
    env.addGlobal(key, value);
  });

  // Add custom filters
  Object.entries(config.filters).forEach(([key, value]) => {
    env.addFilter(key, value);
  });

  fastify.addHook('onRequest', async (request, reply) => {
    if( !/[a-z]*\.(.*)/.test(request.raw.url) ) {
      const view_public_path = ( request.raw.url === '/' ) ? 'views/main' : 'views/'+request.raw.url;
      env.addGlobal('view_public_path', view_public_path);

      
    }
    
  });

  // Decorate fastify with render function
  fastify.decorateReply('render', function(template, data = {}) {
    const self = this;
    
    return new Promise((resolve, reject) => {
      env.render(template, { ...data, request: self.request }, (err, html) => {
        if (err) {
          reject(err);
          return;
        }
        
        self.header('Content-Type', 'text/html; charset=utf-8');
        self.send(html);
        resolve();
      });
    });
  });

  // Add view helper function to fastify instance
  fastify.decorate('view', function(template, data) {
    return new Promise((resolve, reject) => {
      env.render(template, data, (err, html) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve(html);
      });
    });
  });
  
}, { name: 'nunjucks' });