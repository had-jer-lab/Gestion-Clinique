const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy API requests to backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'http://localhost:5005',
      changeOrigin: true,
      logLevel: 'debug',
      onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).json({ error: 'Proxy error' });
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying:', req.method, req.path, '->', proxyReq.path);
      }
    })
  );
};