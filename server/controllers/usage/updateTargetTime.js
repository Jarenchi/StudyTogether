const usageModel = require("../../models/usageModel");

const updateTargetTime = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetTime } = req.body;

    if (typeof targetTime !== "number" || targetTime < 0) {
      return res.status(400).json({ message: "targetTime must be a non-negative number." });
    }

    const usage = await usageModel.findByIdAndUpdate(id, { targetTime }, { new: true });

    if (!usage) {
      return res.status(404).json({ message: "Usage record not found." });
    }

    res.json({ message: "Target time updated.", targetTime: usage.targetTime });
  } catch (error) {
    console.error("Error updating target time:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = updateTargetTime;
