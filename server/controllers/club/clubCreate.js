const clubModel = require("../../models/clubModel");

const clubCreate = async (req, res) => {
  try {
    const { name, description, owner, members, picture } = req.body;
    const newClub = new clubModel({
      name,
      description,
      owner,
      members,
      picture,
    });
    const savedClub = await newClub.save();
    res.status(201).json({ club: savedClub });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  clubCreate,
};
