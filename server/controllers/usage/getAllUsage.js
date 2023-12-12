const usageModel = require("../../models/usageModel");
const getAllUsages = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userUsages = await usageModel.find({ userId });
    res.json({ userUsages });
  } catch (error) {
    console.error("Error fetching user usages:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = getAllUsages;
