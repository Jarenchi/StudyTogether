require("../../models/clubModel");
const userModel = require("../../models/userModel");
const memberModel = require("../../models/memberModel");
const clubModel = require("../../models/clubModel");

const clubCreate = async (req, res) => {
  try {
    const { name, description, owner, picture } = req.body;

    const newClub = new clubModel({
      name,
      description,
      owner,
      picture,
    });

    const ownerMember = new memberModel({
      userId: owner.id,
      name: owner.name,
      picture: owner.picture,
      clubId: newClub._id,
    });
    newClub.members.push(ownerMember._id);

    const savedClub = await newClub.save();
    await ownerMember.save();
    await userModel.findByIdAndUpdate(owner.id, {
      $push: { clubs: { id: savedClub._id, name: savedClub.name } },
    });

    res.status(201).json({ club: savedClub });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  clubCreate,
};
