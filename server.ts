

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { nexusApiHandler } from './api/nexus-express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support large report content in requests

// API route
app.post('/api/nexus', nexusApiHandler);

// Serve static files from the root directory
app.use('/', express.static(__dirname));

// Handle SPA routing by sending index.html for any unhandled routes
app.get('*', (req: express.Request, res: express.Response) => {
    // Check if the request is for an API-like path and return 404
    if (req.path.startsWith('/api/')) {
        return res.status(404).send('API endpoint not found');
    }
    // Otherwise, serve the main app
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`BWGA Nexus AI server listening at http://localhost:${port}`);
});