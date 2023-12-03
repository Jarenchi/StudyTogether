const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      required: true,
    },
    location: {
      type: String,
    },
    maxPhysicalParticipants: {
      type: String,
    },
    creator: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User", // Make sure you have a User model
      },
      name: {
        type: String,
        required: true,
      },
      picture: {
        type: String,
        default: "",
      },
    },
    physicalParticipants: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        name: {
          type: String,
        },
      },
    ],
    onlineParticipants: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        name: {
          type: String,
        },
      },
    ],
    clubId: {
      type: Schema.Types.ObjectId,
      ref: "Club", // Make sure you have a Club model
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
