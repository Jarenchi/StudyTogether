const clubModel = require("../../models/clubModel");
const eventModel = require("../../models/eventModel");
const getEventById = async (req, res) => {
  try {
    const { clubId, eventId } = req.params;

    const club = await clubModel.findById(clubId);

    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }
    const event = await eventModel.findOne({ _id: eventId, clubId });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getEventById,
};
