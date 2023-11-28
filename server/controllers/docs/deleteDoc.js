const clubModel = require("../../models/clubModel");

const deleteDoc = async (req, res) => {
  const { clubId, docId } = req.params;

  try {
    const updatedClub = await clubModel.findOneAndUpdate(
      { _id: clubId },
      { $pull: { docs: { _id: docId } } },
      { new: true },
    );

    if (!updatedClub) {
      return res.status(404).json({ message: "Club not found" });
    }

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { deleteDoc };
