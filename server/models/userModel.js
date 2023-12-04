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

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
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
    clubs: [clubSchema],
    events: [
      {
        eventId: {
          type: Schema.Types.ObjectId,
          ref: "Event",
        },
        type: {
          type: String,
          enum: ["online", "offline", "hybrid"],
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
