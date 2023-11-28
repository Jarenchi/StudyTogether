const mongoose = require("mongoose");
const docSchema = require("./docModel").schema;
const Schema = mongoose.Schema;

const memberSchema = new Schema(
  {
    id: {
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
  { _id: false },
);

const clubSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      default: "",
    },
    owner: {
      id: {
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
    members: [memberSchema],
    docs: [docSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Club", clubSchema);
