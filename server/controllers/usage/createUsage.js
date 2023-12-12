const usageModel = require("../../models/usageModel");

const createUsage = async (req, res) => {
  const userId = req.params.userId;
  const { minutes } = req.body;
  const today = new Date().toISOString().split("T")[0];
  const usage = new usageModel({
    userId: userId,
    logs: [{ date: today, minutes }],
  });

  try {
    await usage.save();
    res.status(201).json({ message: "Usage recorded successfully." });
  } catch (error) {
    console.error("Error recording usage:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = createUsage;
