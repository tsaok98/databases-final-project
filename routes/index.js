const express = require('express');
//const db = require('../app.js');
const router = express.Router();


router.get('/', function(req, res) {
  let query =
      "SELECT latitude, longitude, arithmetic_mean, parameter_name, metric_used, units_of_measure, year, city_name, state_name " +
      "FROM air_quality WHERE arithmetic_mean != 0 AND city_name!=\"\" LIMIT 1000";
  db.query(query, (err, result) => {
    if(err) {
      return res.status(400).send({error: 'Mysql query error: ' + err});
    }
    let mapData = [];
    result.forEach(point => {
      mapData.push({
        city_name: point.city_name,
        state_name: point.state_name,
        latitude: point.latitude,
        longitude: point.longitude,
        arithmetic_mean: point.arithmetic_mean,
        parameter_name: point.parameter_name,
        metric_used: point.metric_used,
        units_of_measure: point.units_of_measure,
        year: point.year
      });
    });
    res.render('index.ejs', {
      title: `Databases Final Project Landing Page!`,
      mapData: mapData
    });
  });

});

module.exports = router;
