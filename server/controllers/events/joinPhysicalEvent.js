const mongoose = require("mongoose");
const eventModel = require("../../models/eventModel");
const userModel = require("../../models/userModel");
const sendMail = require("../../nodemailer");

const joinPhysicalEvent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { eventId } = req.params;
    const { userId, name } = req.body;
    const event = await eventModel.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    if (event.maxPhysicalParticipants && event.physicalParticipants.length >= event.maxPhysicalParticipants) {
      throw new Error("Maximum participants reached");
    }
    event.physicalParticipants.push({ userId, name });
    await event.save();

    await userModel.findOneAndUpdate(
      { _id: userId },
      {
        $addToSet: {
          events: event._id,
        },
      },
      { session },
    );
    await sendMail(req, res);
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json(event);
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  joinPhysicalEvent,
};
