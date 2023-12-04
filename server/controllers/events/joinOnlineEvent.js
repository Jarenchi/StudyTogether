const eventModel = require("../../models/eventModel");
const userModel = require("../../models/userModel");

const joinOnlineEvent = async (req, res) => {
  try {
    const { clubId, eventId } = req.params;
    const { userId, name, picture } = req.body;

    const event = await eventModel.findOneAndUpdate(
      { _id: eventId, clubId },
      {
        $addToSet: {
          onlineParticipants: { userId, name, picture },
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
          events: { eventId, type: "online" },
        },
      },
    );

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  joinOnlineEvent,
};
