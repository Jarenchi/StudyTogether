const clubModel = require("../../models/clubModel");

const clubSearch = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const regex = new RegExp(keyword, "i");
    const searchResults = await clubModel.aggregate([
      {
        $match: {
          $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }, { owner: { $regex: regex } }],
        },
      },
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

    res.status(200).json({ clubs: searchResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  clubSearch,
};
