const userModel = require("../../models/userModel");
const { generateAccessToken, checkValidPassword } = require("../../utils/util");

const userSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = checkValidPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const maxAge = 60 * 60 * 6; //6 hours
    const response = {
      data: {
        access_token: accessToken,
        access_expired: maxAge,
        user: {
          id: user._id,
          provider: "native",
          name: user.name,
          email: user.email,
          picture: user.picture,
        },
      },
    };
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  userSignIn,
};
