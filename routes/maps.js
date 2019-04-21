const express = require('express');
// const { L } = require('/public/leaflet/leaflet');
// const { HeatmapOverlay } = require('/public/leaflet/leaflet-heatmap');
const router = express.Router();

/* GET maps listing. */
router.get('/:name', function(req, res) {
  let parameter_name = req.params.name;
  parameter_name = parameter_name.split('+').join(' ');
  let query =
      "SELECT latitude, longitude, arithmetic_mean, parameter_name, metric_used, units_of_measure, year\n" +
      "FROM air_quality WHERE parameter_name=\"" + parameter_name + "\" LIMIT 1000";
  console.log(query);
  db.query(query, (err, result) => {
    if(err) {
      return res.status(400).send({error: 'Mysql query error: ' + err});
    }
    let mapData = [];
    result.forEach(point => {
      mapData.push({
        latitude: point.latitude,
        longitude: point.longitude,
        arithmetic_mean: point.arithmetic_mean
      });
    });

    let description = {
      "sulfur dioxide" : "Sulfur dioxide (SO2) is a colorless, reactive air pollutant with a strong odor. This gas can be a threat to human health, animal health, and plant life.\n" +
          "The main sources of sulfur dioxide emissions are from fossil fuel combustion and natural volcanic activity. Sulfur dioxide irritates the skin and mucous membranes of the eyes, nose, throat, and lungs. High concentrations of SO2 can cause inflammation and irritation of the respiratory system, especially during heavy physical activity. The resulting symptoms can include pain when taking a deep breath, coughing, throat irritation, and breathing difficulties. High concentrations of SO2 can affect lung function, worsen asthma attacks, " +
          "and worsen existing heart disease in sensitive groups.",
      "PM10 total 0-10um STP" : "PM10 describes inhalable particles, with diameters that are generally 10 micrometers" +
          " and smaller.\n PM10 particles are so small that they effectively act as a gas. " +
          "When breathed in they penetrate deep into the lungs. Exposure to high concentrations of PM10 can result in a " +
          "number of health impacts ranging from coughing and wheezing to asthma attacks and bronchitis to high blood pressure, " +
          "heart attack, strokes and premature death.",
      "PM2.5 - local conditions" : "PM2.5 refers to atmospheric particulate matter (PM) that have a diameter of less than 2.5 micrometers, which is about 3% the diameter of a human hair.\n" +
          "\n" +
          "Commonly written as PM2.5, particles in this category are so small that they can only be detected with an electron microscope. " +
          "They are even smaller than their counterparts PM10, which are particles that are 10 micrometres or less, and " +
          "are also called fine particles. Since they are so small and light, fine particles tend to stay longer in the air than heavier particles. This increases the chances of humans and animals inhaling them into the bodies. Owing to their minute size, particles smaller than 2.5 micrometers are able to bypass the nose and throat and penetrate deep into the lungs and some may even enter the circulatory system.\n" +
          "\n" +
          "Studies have found a close link between exposure to fine particles and premature death from heart and lung disease. " +
          "Fine particles are also known to trigger or worsen chronic disease such as asthma, heart attack, " +
          "bronchitis and other respiratory problems."
    };

    res.render('maps.ejs', {
      title: `Map for pollutant: ${parameter_name}`,
      name: parameter_name,
      mapData: mapData,
      descriptor: description[parameter_name]
    });
  });
});

module.exports = router;
