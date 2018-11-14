const mongoose = require ('mongoose');

const debtSchema = new mongoose.Schema ({
  name: String,
  owed: Number,
  amountPaid: Number,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note"
    }
  ]
});

module.exports = mongoose.model ('Debt', debtSchema);