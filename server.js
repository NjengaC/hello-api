const express = require('express');
const requestIp = require('request-ip');
const request = require('request');

app.use(requestIp.mw());

function fetchLocationData(ipAddress, callback) {
  if (!ipAddress || ipAddress === '::1' || ipAddress === '127.0.0.1') {
    const defaultLocation = 'Nairobi';
    return callback(null, defaultLocation);
  }

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

app.get('/api/hello', (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
  const clientIP = req.clientIp || '127.0.0.1';

  fetchLocationData(clientIP, (err, location) => {
    if (err) {
      console.error('Error fetching location:', err.message);
      location = 'Nairobi';
    }

    const temperature = '11 degrees Celcius';

    const greeting = `Hello, ${visitorName}!, the temperature is ${temperature} in ${location}`;

    const responseData = {
      client_ip: clientIP,
      location: location,
      greeting: greeting
    };

    res.json(responseData);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

