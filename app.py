#!/usr/bin/python3
"""
This module creates a basic web server using Flask
"""

from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)


ipstack_api_key = os.getenv('IPSTACK_API_KEY')
weatherapi_key = os.getenv('WEATHERAPI_KEY')

def get_location_from_ip(ip):
    response = requests.get(f'http://api.ipstack.com/{ip}?access_key={ipstack_api_key}')
    data = response.json()
    if data:
        city = data.get('city', 'Unknown City')
        return city
    return None

def get_temperature(city):
    response = requests.get(f'http://api.weatherapi.com/v1/current.json?key={weatherapi_key}&q={city}')
    return response.json().get('current', {}).get('temp_c')

@app.route('/api/hello', methods=['GET'])
def hello():
    visitor_name = request.args.get('visitor_name', 'Guest')
    client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)

    try:
        location = get_location_from_ip(client_ip)
        temperature = get_temperature(location)

        response = {
            "client_ip": client_ip,
            "location": location,
            "greeting": f"Hello, {visitor_name}! The temperature is {temperature} degrees Celsius in {location}"
        }
    except Exception as e:
        response = {"error": str(e)}

    return jsonify(response)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
