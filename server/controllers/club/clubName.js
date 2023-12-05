const clubModel = require("../../models/clubModel");

const clubName = async (req, res) => {
  try {
    const club = await clubModel.findById(req.params.clubId);

    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }

    res.json({ name: club.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  clubName,
};
