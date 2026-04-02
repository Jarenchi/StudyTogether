const eventModel = require("../../models/eventModel");

const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, description, date, startTime, endTime, type, location, maxPhysicalParticipants } = req.body;

    const event = await eventModel.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.creator.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updated = await eventModel.findByIdAndUpdate(
      eventId,
      { title, description, date, startTime, endTime, type, location, maxPhysicalParticipants },
      { new: true },
    );
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { updateEvent };
