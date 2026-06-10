import { preview } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startPreviewServer() {
    try {
        const server = await preview({
            // Point to your project root or keep it default
            root: __dirname,

            // Tell Vite where your production build directory is located
            build: {
                outDir: 'dist',
            },

            // Configure the preview server options
            preview: {
                host: true,       // Exposes the server to the local network (0.0.0.0)
                open: true,       // Opens the browser automatically on start
            }
        });

        // Outputs the local and network URLs to the console
        server.printUrls();

        // Enables default CLI short-cuts (e.g., press 'h' for help, 'q' to quit)
        server.bindCLIShortcuts({ print: true });

    } catch (error) {
        console.error('Error starting Vite preview server:', error);
        process.exit(1);
    }
}

startPreviewServer();