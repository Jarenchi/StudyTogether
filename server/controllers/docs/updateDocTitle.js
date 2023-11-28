const clubModel = require("../../models/clubModel");

const updateDocTitle = async (req, res) => {
  const { clubId, docId } = req.params;
  const { title } = req.body;
  try {
    const updatedClub = await clubModel.findOneAndUpdate(
      { _id: clubId, "docs._id": docId },
      { $set: { "docs.$.title": title } },
      { new: true },
    );

    if (!updatedClub) {
      return res.status(404).json({ message: "Club or Document not found" });
    }

    res.status(200).json({ message: "標題已成功更新" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { updateDocTitle };
