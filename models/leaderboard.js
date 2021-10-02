var mongoose = require("mongoose");

var leaderboardSchema = new mongoose.Schema({
  socketid: String,
  room: String,
  name: String,
  exercise: String,
  score: String,
});

module.exports = mongoose.model("leaderBoard", leaderboardSchema);
