const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const participantSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    picture: {
      type: String,
    },
  },
  { _id: false },
);
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
      type: Number,
    },
    creator: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
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
    physicalParticipants: [participantSchema],
    onlineParticipants: [participantSchema],
    clubId: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
