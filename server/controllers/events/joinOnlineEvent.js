const eventModel = require("../../models/eventModel");
const userModel = require("../../models/userModel");
const sendMail = require("../../nodemailer");

const joinOnlineEvent = async (req, res) => {
  try {
    const { clubId, eventId } = req.params;
    const { userId, name } = req.body;
    const event = await eventModel.findOneAndUpdate(
      { _id: eventId, clubId },
      {
        $addToSet: {
          onlineParticipants: { userId, name },
        },
      },
      { new: true },
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    await userModel.findOneAndUpdate(
      { _id: userId },
      {
        $addToSet: {
          events: event._id,
        },
      },
    );
    await sendMail(req, res);

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  joinOnlineEvent,
};
