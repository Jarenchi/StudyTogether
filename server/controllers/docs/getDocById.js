const clubModel = require("../../models/clubModel");

const getDocById = async (req, res) => {
  const clubId = req.params.clubId;
  const docId = req.params.docId;

  try {
    const club = await clubModel.findOne({ _id: clubId }).populate("docs");
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    const foundDoc = club.docs.find((doc) => doc._id.toString() === docId);
    if (!foundDoc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // 此时 foundDoc 是完整的文档对象
    const selectedDoc = {
      title: foundDoc.title,
      content: foundDoc.content,
    };

    res.json(selectedDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getDocById,
};
