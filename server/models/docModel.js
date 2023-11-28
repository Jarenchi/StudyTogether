const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const permissionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    role: {
      type: String,
      enum: ["read", "write", "owner"],
      default: "read",
    },
  },
  { _id: false },
);

const docSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    creater: {
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
    status: {
      type: String,
      default: "pending",
    },
    content: {
      type: String,
      default: "",
    },
    club: {
      type: Schema.Types.ObjectId,
      ref: "Club",
    },
    permissions: [permissionSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Doc", docSchema);
