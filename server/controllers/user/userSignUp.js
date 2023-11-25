const { hashPassword } = require("../../utils/util");
const userModel = require("../../models/userModel");

const userSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = hashPassword(password);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  userSignUp,
};
