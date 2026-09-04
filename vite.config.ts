import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

import fs from 'fs';

function uploadPlugin() {
  return {
    name: 'upload-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/upload', (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const { name, data } = JSON.parse(body);
              const base64Data = data.replace(/^data:.*?;base64,/, '');
              const buffer = Buffer.from(base64Data, 'base64');
              const uniqueName = `${Date.now()}-${name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
              const filePath = path.resolve(__dirname, 'public/uploads', uniqueName);
              
              if (!fs.existsSync(path.resolve(__dirname, 'public/uploads'))) {
                fs.mkdirSync(path.resolve(__dirname, 'public/uploads'), { recursive: true });
              }
              
              fs.writeFileSync(filePath, buffer);
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ url: `/uploads/${uniqueName}` }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to upload' }));
            }
          });
        } else if (req.method === 'DELETE') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const { url } = JSON.parse(body);
              if (url && url.startsWith('/uploads/')) {
                const fileName = path.basename(url);
                const filePath = path.resolve(__dirname, 'public/uploads', fileName);
                if (fs.existsSync(filePath)) {
                  fs.unlinkSync(filePath);
                }
              }
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to delete' }));
            }
          });
        }
      });
    }
  };
}

function dataPlugin() {
  return {
    name: 'data-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/presets', (req: any, res: any) => {
        const dataDir = path.resolve(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        if (req.method === 'GET') {
          const files = fs.readdirSync(dataDir).filter((f: string) => f.endsWith('.json'));
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(files));
        }
      });

      server.middlewares.use('/api/data', (req: any, res: any) => {
        const urlObj = new URL(req.originalUrl || req.url || '/', `http://${req.headers.host || 'localhost'}`);
        const fileName = urlObj.searchParams.get('file') || 'data.json';
        const safeFileName = path.basename(fileName);
        
        const dataDir = path.resolve(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        const dataPath = path.resolve(dataDir, safeFileName);
        
        if (req.method === 'GET') {
          if (fs.existsSync(dataPath)) {
            const data = fs.readFileSync(dataPath, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(null)); // Indica que no hay datos
          }
        } else if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              fs.writeFileSync(dataPath, body, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to save data' }));
            }
          });
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), uploadPlugin(), dataPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/data/data.json']
      },
    },
  };
});
