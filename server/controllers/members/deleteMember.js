const userModel = require("../../models/userModel");
const clubModel = require("../../models/clubModel");
const memberModel = require("../../models/memberModel");

const deleteMember = async (req, res) => {
  try {
    const { userId, clubId } = req.params;
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

    const isMemberIndex = club.members.indexOf(userId);
    if (isMemberIndex === -1) {
      return res.status(400).json({ error: "User is not a member of the club" });
    }
    club.members.splice(isMemberIndex, 1);
    findUser.clubs = findUser.clubs.filter((club) => club.id.toString() !== clubId);
    await memberModel.findOneAndDelete({ userId, clubId });

    await Promise.all([club.save(), findUser.save()]);

    res.status(200).json({ message: "User removed from the club successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  deleteMember,
};
