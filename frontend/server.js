const express = require('express');
const app = express();
const path = require('path');

// משתנה סביבה שיגיד ל-Frontend איפה ה-Backend נמצא
const BACKEND_URL = process.env.BACKEND_URL || '';

app.use(express.static('public'));
app.use(express.json());

app.get('/config', (req, res) => {
    res.json({ backendUrl: '' });
});

// Proxy לכל הבקשות ל-/api
const http = require('http');
const https = require('https');

app.all('/api/*', (req, res) => {
    let backendBaseUrl = BACKEND_URL;
    if (!backendBaseUrl) {
        backendBaseUrl = 'http://inventory-backend-service.default.svc.cluster.local:8080';
    }
    const targetUrl = new URL(backendBaseUrl + req.path);
    const protocol = targetUrl.protocol === 'https:' ? https : http;

    console.log('Target URL:', targetUrl.toString(), 'Hostname:', targetUrl.hostname, 'Port:', targetUrl.port);

    const options = {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname,
        method: req.method,
        headers: { 'Content-Type': 'application/json' }
    };

    const proxyReq = protocol.request(options, (proxyRes) => {
        let data = '';
        proxyRes.on('data', (chunk) => { data += chunk; });
        proxyRes.on('end', () => {
            try {
                res.json(JSON.parse(data));
            } catch (e) {
                res.status(500).json({ error: 'Invalid response from backend' });
            }
        });
    });

    if (req.body && Object.keys(req.body).length > 0) {
        proxyReq.write(JSON.stringify(req.body));
    }

    proxyReq.on('error', (error) => {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Failed to connect to backend' });
    });

    proxyReq.end();
});

app.listen(3000, () => {
    console.log('Frontend server running on port 3000');
});