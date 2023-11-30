const clubModel = require("../../models/clubModel");
const memberModel = require("../../models/memberModel");

const getAllMembers = async (req, res) => {
  const { clubId } = req.params;

  try {
    const club = await clubModel.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }
    const members = await memberModel.find({ clubId });
    res.status(200).json({ members });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllMembers,
};
