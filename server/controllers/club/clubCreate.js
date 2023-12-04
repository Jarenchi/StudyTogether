const userModel = require("../../models/userModel");
const memberModel = require("../../models/memberModel");
const clubModel = require("../../models/clubModel");
const { ImgurClient } = require("imgur");

const uploadImageToImgur = async (file) => {
  try {
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENTID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });
    const response = await client.upload({
      image: file.buffer.toString("base64"),
      type: "base64",
      album: process.env.IMGUR_ALBUM_ID,
    });
    return response.data.link;
  } catch (e) {
    console.error(e);
    throw new Error("Picture upload error");
  }
};

const clubCreate = async (req, res) => {
  try {
    const { name, description, owner } = req.body;
    console.log(owner);
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImageToImgur(req.file);
    }
    const newClub = new clubModel({
      name,
      description,
      owner,
      picture: imageUrl,
    });

    const ownerMember = new memberModel({
      userId: owner.id,
      name: owner.name,
      picture: owner.picture,
      clubId: newClub._id,
    });
    newClub.members.push(owner.id);

    const savedClub = await newClub.save();
    await ownerMember.save();
    await userModel.findByIdAndUpdate(owner.id, {
      $push: { clubs: { id: savedClub._id, name: savedClub.name } },
    });

    res.status(201).json({ club: savedClub });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  clubCreate,
};
