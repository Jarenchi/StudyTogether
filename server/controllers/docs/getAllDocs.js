const clubModel = require("../../models/clubModel");
const docModel = require("../../models/docModel");
const getAllDocs = async (req, res) => {
  const clubId = req.params.clubId;
  try {
    const club = await clubModel.findOne({ _id: clubId }).populate("docs");
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }
    const allDocs = club.docs;
    res.json(allDocs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllDocs,
};
