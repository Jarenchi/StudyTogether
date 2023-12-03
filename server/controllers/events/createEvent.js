const clubModel = require("../../models/clubModel");
const eventModel = require("../../models/eventModel");

const createEvent = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { title, description, date, startTime, endTime, type, location, maxPhysicalParticipants, creator } = req.body;
    console.log(creator);
    const club = await clubModel.findById(clubId);

    if (!club) {
      console.log("Couldn't find club");
      return res.status(404).json({ error: "Club not found" });
    }

    const newEvent = new eventModel({
      title,
      description,
      date,
      startTime,
      endTime,
      type,
      location,
      maxPhysicalParticipants,
      creator: {
        userId: creator.id,
        name: creator.name,
        picture: creator.picture,
      },
      clubId,
    });

    const savedEvent = await newEvent.save();

    club.events.push(savedEvent._id);
    await club.save();

    res.status(201).json(savedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createEvent,
};
