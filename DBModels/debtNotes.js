const mongoose = require ('mongoose');

const debtNotesSchema = new mongoose.Schema ({
  body: String,
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model ('Note', debtNotesSchema);