const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  webpack: (config) => {
    // See https://webpack.js.org/configuration/resolve/#resolvealias
    config.resolve.alias = {
      ...config.resolve.alias,
      "onnxruntime-web": path.join(__dirname, 'node_modules/onnxruntime-web/dist/ort.all.min.js'),
      "sharp$": false,
      "onnxruntime-node$": false, 

    }
    config.experiments.asyncWebAssembly = true
    return config;
  },
}

module.exports = nextConfig