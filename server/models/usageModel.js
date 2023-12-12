const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  targetTime: { type: Number, default: 0 },
  logs: [
    {
      date: String,
      minutes: { type: Number, default: 0 },
    },
  ],
});

module.exports = mongoose.model("Usage", usageSchema);
