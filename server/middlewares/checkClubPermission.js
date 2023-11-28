// middleware/checkClubWritePermission.js

const clubModel = require("../models/clubModel");

async function checkClubPermission(req, res, next) {
  try {
    const { clubId } = req.params;
    console.log(req.body);
    const userId = req.body.creater.id;
    const club = await clubModel.findById(clubId);
    const userPermission = club.members.find((member) => member.id.equals(userId));

    if (!userPermission) {
      return res.status(403).json({ message: "Permission denied" });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = checkClubPermission;
