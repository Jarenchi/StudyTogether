const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clubSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: "Club",
    },
    name: {
      type: String,
    },
  },
  { _id: false },
);

const eventSchema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
  },
  type: {
    type: String,
    enum: ["online", "offline"],
  },
  name: {
    type: String,
  },
});

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      default: "",
    },
    points: {
      type: Number,
      default: 0,
    },
    clubs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Club",
      },
    ],
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
