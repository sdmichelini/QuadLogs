var mongoose = require('mongoose');

var flightSchema = mongoose.Schema({
  date : {type: Date, default: Date.now }, //Start of the Flight
  duration :{ type: Number, required: true}, //In minutes
  weather : String,
  notes: String
});

module.exports = mongoose.model('Flight', flightSchema);
