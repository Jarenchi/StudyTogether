const clubModel = require("../../models/clubModel");
const docModel = require("../../models/docModel");

const updateDocContent = async (req, res) => {
  const { clubId, docId } = req.params;
  const { content } = req.body;
  try {
    const clubExists = await clubModel.exists({ _id: clubId });
    if (!clubExists) {
      return res.status(404).json({ message: "Club not found" });
    }

    const updatedDoc = await docModel.findOneAndUpdate(
      { _id: docId, clubId: clubId },
      { $set: { content: content } },
      { new: true },
    );

    if (!updatedDoc) {
      return res.status(404).json({ message: "Document not found in the specified club" });
    }

    res.status(200).json({ message: "內容已成功更新" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = { updateDocContent };
