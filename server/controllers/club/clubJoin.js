const userModel = require("../../models/userModel");
const clubModel = require("../../models/clubModel");
const memberModel = require("../../models/memberModel");

const clubJoin = async (req, res) => {
  try {
    const { userId, clubId } = req.body;
    const findUser = await userModel.findById(userId);
    if (!findUser) {
      console.log("user not found");
      return res.status(404).json({ error: "User not found" });
    }
    const club = await clubModel.findById(clubId);
    if (!club) {
      console.log("club not found");
      return res.status(404).json({ error: "Club not found" });
    }
    const isMember = club.members.includes(userId);
    if (isMember) {
      return res.status(400).json({ error: "User is already a member of the club" });
    }

    const newMember = new memberModel({
      userId: userId,
      name: findUser.name,
      picture: findUser.picture,
      clubId: clubId,
    });
    club.members.push(userId);
    findUser.clubs.push(club._id);
    await Promise.all([club.save(), newMember.save(), findUser.save()]);
    res.status(200).json({ message: "User joined the club successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  clubJoin,
};
