const userModel = require("../../models/userModel");

const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel
      .findById(userId)
      .populate("clubs")
      .populate({
        path: "events",
        populate: {
          path: "clubId",
          model: "Club",
        },
      });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUserProfile,
};
