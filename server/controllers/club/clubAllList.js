const clubModel = require("../../models/clubModel");

const clubAllList = async (req, res) => {
  try {
    const allClubs = await clubModel.find();
    res.status(200).json({ clubs: allClubs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  clubAllList,
};
