const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventModule = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ["online", "offline"],
    },
    place: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventModule);
