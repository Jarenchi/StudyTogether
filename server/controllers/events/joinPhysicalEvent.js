const eventModel = require("../../models/eventModel");
const userModel = require("../../models/userModel");

const joinPhysicalEvent = async (req, res) => {
  try {
    const { clubId, eventId } = req.params;
    const { userId, name, picture } = req.body;
    const event = await eventModel.findById(eventId);
    if (event.maxPhysicalParticipants && event.physicalParticipants.length >= event.maxPhysicalParticipants) {
      return res.status(400).json({ error: "Maximum participants reached" });
    }

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    event.physicalParticipants.push({ userId, name, picture });
    await event.save();

    await userModel.findOneAndUpdate(
      { _id: userId },
      {
        $addToSet: {
          events: { eventId, type: "physical" },
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
  joinPhysicalEvent,
};