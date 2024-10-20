const express = require('express');
const bodyParser = require('body-parser');
const { RandomForestClassifier } = require('ml-random-forest');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Expanded dummy training data (temperature, humidity, rain_yes or rain_no)
const trainingData = [
  { temperature: 25, humidity: 60, rain: 0 },  // No rain
  { temperature: 30, humidity: 50, rain: 0 },  // No rain
  { temperature: 20, humidity: 80, rain: 1 },  // Rain
  { temperature: 18, humidity: 85, rain: 1 },  // Rain
  { temperature: 35, humidity: 40, rain: 0 },  // No rain
  { temperature: 22, humidity: 75, rain: 1 },  // Rain
  { temperature: 28, humidity: 65, rain: 0 },  // No rain
  { temperature: 24, humidity: 82, rain: 1 },  // Rain
  { temperature: 32, humidity: 45, rain: 0 },  // No rain
  { temperature: 19, humidity: 90, rain: 1 },  // Rain
  { temperature: 27, humidity: 70, rain: 0 },  // No rain
  { temperature: 21, humidity: 88, rain: 1 },  // Rain
  { temperature: 33, humidity: 48, rain: 0 },  // No rain
  { temperature: 29, humidity: 72, rain: 0 },  // No rain
  { temperature: 17, humidity: 95, rain: 1 },  // Rain
  { temperature: 23, humidity: 80, rain: 1 },  // Rain
  { temperature: 26, humidity: 65, rain: 0 },  // No rain
  { temperature: 31, humidity: 55, rain: 0 },  // No rain
  { temperature: 20, humidity: 77, rain: 1 },  // Rain
  { temperature: 30, humidity: 60, rain: 0 },  // No rain
  { temperature: 22, humidity: 78, rain: 1 },  // Rain
  { temperature: 19, humidity: 82, rain: 1 },  // Rain
  { temperature: 21, humidity: 65, rain: 0 },  // No rain
  { temperature: 25, humidity: 85, rain: 1 },  // Rain
];

// Prepare the training data for the RandomForest model
const inputs = trainingData.map(d => [d.temperature, d.humidity]);
const outputs = trainingData.map(d => d.rain);

// Create and train the RandomForest model
const model = new RandomForestClassifier();
model.train(inputs, outputs);

// Define a route to handle predictions from Arduino or Postman
app.post('/predict', (req, res) => {
  const { temperature, humidity } = req.body;

  // Validate if temperature and humidity are present and are numbers
  if (typeof temperature !== 'number' || typeof humidity !== 'number') {
    return res.status(400).send('Invalid input: Temperature and humidity must be numeric.');
  }

  console.log(`Received data - Temperature: ${temperature}, Humidity: ${humidity}`);

  try {
    // Predict rain (1 for rain, 0 for no rain) based on the input data
    const prediction = model.predict([[temperature, humidity]])[0];

    // Return the prediction result
    res.send(prediction === 1 ? "rain" : "no_Rain");
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).send('Error during prediction');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
