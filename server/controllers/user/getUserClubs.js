const userModel = require("../../models/userModel");

const getUserClubs = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userClubs = user.clubs;
    res.json({ clubs: userClubs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUserClubs,
};
