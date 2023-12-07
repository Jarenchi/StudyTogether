const clubModel = require("../../models/clubModel");

const updateClub = async (req, res) => {
  try {
    const clubId = req.params.clubId;
    const { name, description, picture, owner } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (picture) updateFields.picture = picture;
    if (owner) updateFields.owner = owner;

    const updatedClub = await clubModel.findByIdAndUpdate(clubId, updateFields, { new: true });

    if (!updatedClub) {
      return res.status(404).json({ error: "Club not found" });
    }

    res.status(200).json(updatedClub);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { updateClub };
