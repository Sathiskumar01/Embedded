const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Render ML model API URL
const mlModelUrl = 'https://your-render-app-url.com/predict';  // Replace with your Render ML API URL

// Receive data from Arduino
app.post('/receive-data', async (req, res) => {
  const { temperature, humidity } = req.body;

  console.log(`Received from Arduino - Temp: ${temperature}, Humidity: ${humidity}`);

  try {
    // Send data to the Render ML model
    const response = await axios.post(mlModelUrl, {
      temperature: temperature,
      humidity: humidity
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    // Log the response from the ML model
    console.log('Prediction from ML Model:', response.data);

    // Respond back to the Arduino with the ML model result
    res.send(response.data);

  } catch (error) {
    console.error('Error sending data to ML model:', error.message);
    res.status(500).send('Error in ML model prediction');
  }
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
