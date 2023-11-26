const User = require("../../models/userModel");
const Club = require("../../models/clubModel");

const clubJoin = async (req, res) => {
  try {
    const { userId, clubId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }
    const isMember = club.members && club.members.some((member) => member.id.equals(userId));
    if (isMember) {
      return res.status(400).json({ error: "User is already a member of the club" });
    }
    club.members.push({
      id: user._id,
      name: user.name,
      picture: user.picture,
    });
    user.clubs.push({
      id: club._id,
      name: club.name,
    });
    await Promise.all([user.save(), club.save()]);
    res.status(200).json({ message: "User joined the club successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  clubJoin,
};
