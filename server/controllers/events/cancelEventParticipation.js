const eventModel = require("../../models/eventModel");
const userModel = require("../../models/userModel");

const cancelEventParticipation = async (req, res) => {
  try {
    const { clubId, eventId } = req.params;
    const { userId } = req.body;
    const event = await eventModel.findOneAndUpdate(
      { _id: eventId, clubId },
      {
        $pull: {
          onlineParticipants: { userId },
          physicalParticipants: { userId },
        },
      },
      { new: true },
    );
    console.log(event);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    await userModel.findOneAndUpdate(
      { _id: userId },
      {
        $pull: {
          events: { eventId },
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
  cancelEventParticipation,
};
