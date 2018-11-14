const mongoose = require ('mongoose');

const incomeSchema = new mongoose.Schema ({
  source: String,
  amount: Number,
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model ('Income', incomeSchema);