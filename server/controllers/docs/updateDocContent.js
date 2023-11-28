const clubModel = require("../../models/clubModel");

const updateDocContent = async (req, res) => {
  const { clubId, docId } = req.params;
  const { content } = req.body;
  try {
    const updatedClub = await clubModel.findOneAndUpdate(
      { _id: clubId, "docs._id": docId },
      { $set: { "docs.$.content": content } },
      { new: true },
    );
    if (!updatedClub) {
      return res.status(404).json({ message: "Club or Document not found" });
    }
    res.status(200).json({ message: "內容已成功更新" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = { updateDocContent };
