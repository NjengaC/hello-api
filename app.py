import os
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Define a function to get the location based on IP
def get_location(ip):
    url = f"http://ip-api.com/json/{ip}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data["city"]
    else:
        return "Unknown"

@app.route('/api/hello', methods=['GET'])
def hello():
    visitor_name = request.args.get('visitor_name', 'Guest')
    client_ip = request.remote_addr
    location = get_location(client_ip)
    
    # Example temperature (you can use a weather API for real-time data)
    temperature = 11  # Celsius
    
    message = f"Hello, {visitor_name}! The temperature is {temperature} degrees Celsius in {location}"
    
    return jsonify({
        "client_ip": client_ip,
        "location": location,
        "greeting": message
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
