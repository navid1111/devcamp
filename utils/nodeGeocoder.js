const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'openstreetmap',
  // No apiKey needed for OpenStreetMap
  httpAdapter: 'https',
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;