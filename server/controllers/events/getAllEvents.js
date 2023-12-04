const clubModel = require("../../models/clubModel");
const eventModel = require("../../models/eventModel");
const getAllEvents = async (req, res) => {
  try {
    const { clubId } = req.params;

    const club = await clubModel.findById(clubId);

    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }
    const events = await eventModel.find({ clubId });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllEvents,
};
