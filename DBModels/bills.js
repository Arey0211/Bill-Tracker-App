const mongoose = require ('mongoose');

const billSchema = new mongoose.Schema ({
  name: String,
  amountDue: Number,
  amountPaid: Number,
  minDue: Number,
  dueDay: Number,
  paid: String
});

module.exports = mongoose.model ('Bills', billSchema);