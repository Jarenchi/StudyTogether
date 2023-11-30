const clubModel = require("../../models/clubModel");
const docModel = require("../../models/docModel");

const deleteDoc = async (req, res) => {
  const { clubId, docId } = req.params;

  try {
    const updatedClub = await clubModel.updateOne({ _id: clubId }, { $pull: { docs: docId } });

    if (updatedClub.nModified === 0) {
      return res.status(404).json({ message: "Can't find club or doc isn't deleted" });
    }

    const deletedDoc = await docModel.findByIdAndDelete(docId);

    if (!deletedDoc) {
      console.log("在 Doc 表中找不到doc");
    }

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { deleteDoc };
