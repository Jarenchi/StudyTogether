const clubModel = require("../../models/clubModel");

const clubAllList = async (req, res) => {
  try {
    const allClubs = await clubModel.aggregate([
      {
        $project: {
          name: 1,
          description: 1,
          picture: 1,
          owner: 1,
          members: 1,
          memberCount: { $size: "$members" },
        },
      },
    ]);
    res.status(200).json({ clubs: allClubs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  clubAllList,
};
