const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memberSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    clubId: {
      type: Schema.Types.ObjectId,
      ref: "Club",
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
  { timestamps: true },
);

module.exports = mongoose.model("Member", memberSchema);
