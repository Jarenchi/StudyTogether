const clubModel = require("../../models/clubModel");

const updateClubDescription = async (req, res) => {
  try {
    const clubId = req.params.clubId;
    const newDescription = req.body.description;
    if (!newDescription) {
      return res.status(400).json({ error: "Description cannot be empty" });
    }
    const updatedClub = await clubModel.findByIdAndUpdate(clubId, { description: newDescription }, { new: true });

    if (!updatedClub) {
      return res.status(404).json({ error: "Club not found" });
    }

    res.status(200).json(updatedClub);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { updateClubDescription };
