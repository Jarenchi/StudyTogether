const docModel = require("../../models/docModel");
const clubModel = require("../../models/clubModel");

const createDoc = async (req, res) => {
  try {
    const { title, content, creater } = req.body;
    const clubId = req.params.clubId;

    const newDoc = new docModel({
      title,
      content,
      creater: {
        id: creater.id,
        name: creater.name,
        picture: creater.picture,
      },
      clubId: clubId,
      permissions: [{ userId: creater.id, role: "owner" }],
    });

    const savedDoc = await newDoc.save();

    await clubModel.findByIdAndUpdate(clubId, { $push: { docs: savedDoc._id } }, { new: true });

    res.status(201).json(savedDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createDoc };
