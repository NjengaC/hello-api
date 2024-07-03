// api/index.js
const express = require('express');
const request = require('request'); // Import the request package
const app = express();

const PORT = process.env.PORT || 3000;

// Function to fetch client's location based on IP using IP Geolocation API
function fetchLocationData(ipAddress, callback) {
  const apiUrl = `https://freegeoip.app/json/${ipAddress}`;

  request(apiUrl, { json: true }, (err, res, body) => {
    if (err) {
      return callback(err, null);
    }
    if (body.error) {
      return callback(new Error(body.error.message), null);
    }

    const location = `${body.city}, ${body.region_name}, ${body.country_name}`;
    callback(null, location);
  });
}

// Function to fetch current weather based on location using Weather API
function fetchWeatherData(location, callback) {
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${location}`;

  request(apiUrl, { json: true }, (err, res, body) => {
    if (err) {
      return callback(err, null);
    }
    if (body.error) {
      return callback(new Error(body.error.message), null);
    }

    const temperature = `${body.current.temp_c} degrees Celsius`;
    callback(null, temperature);
  });
}

// Define your API endpoint
app.get('/api/hello', (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
  const clientIP = req.ip === '::1' ? '127.0.0.1' : req.ip;

  // Fetch client's location based on IP
  fetchLocationData(clientIP, (err, location) => {
    if (err) {
      console.error('Error fetching location:', err.message);
      location = 'Nairobi, Kenya';
    }

    // Fetch weather data based on location
    fetchWeatherData(location, (err, temperature) => {
      if (err) {
        console.error('Error fetching weather data:', err.message);
        temperature = 'unknown';
      }

      const greeting = `Hello, ${visitorName}!, the temperature is ${temperature} in ${location}`;

      const responseData = {
        client_ip: clientIP,
        location: location,
        greeting: greeting
      };

      res.json(responseData);
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
