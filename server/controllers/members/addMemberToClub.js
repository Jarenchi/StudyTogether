const userModel = require("../../models/userModel");
const clubModel = require("../../models/clubModel");
const memberModel = require("../../models/memberModel");

const addMemberToClub = async (req, res) => {
  try {
    const { userId, clubId } = req.body;

    // Check if the user exists
    const findUser = await userModel.findById(userId);
    if (!findUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the club exists
    const club = await clubModel.findById(clubId);
    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }

    // Check if the user is already a member of the club
    const isMember = club.members.some((member) => member.userId.equals(userId));
    if (isMember) {
      return res.status(400).json({ error: "User is already a member of the club" });
    }

    // Create a new member
    const newMember = new memberModel({
      userId: userId,
      name: findUser.name,
      picture: findUser.picture,
      clubId: clubId,
    });

    // Add the user to the club's members array
    club.members.push(newMember);

    // Add the club to the user's clubs array
    findUser.clubs.push({ id: club._id, name: club.name });

    // Save changes to the database
    await Promise.all([club.save(), newMember.save(), findUser.save()]);

    res.status(200).json({ message: "User joined the club successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addMemberToClub,
};
