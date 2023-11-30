const userModel = require("../../models/userModel");
const clubModel = require("../../models/clubModel");
const memberModel = require("../../models/memberModel");

const clubJoin = async (req, res) => {
  try {
    const { user, clubId } = req.body;
    const findUser = await userModel.findById(user.id);
    if (!findUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const club = await clubModel.findById(clubId);
    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }
    const isMember = club.members.includes(user.id);
    if (isMember) {
      return res.status(400).json({ error: "User is already a member of the club" });
    }

    const newMember = new memberModel({
      userId: user.id,
      name: user.name,
      picture: user.picture,
      clubId: clubId,
    });
    club.members.push(user.id);
    await userModel.findByIdAndUpdate(user.id, {
      $push: { clubs: { id: club._id, name: club.name } },
    });
    await Promise.all([club.save(), newMember.save()]);
    res.status(200).json({ message: "User joined the club successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  clubJoin,
};
