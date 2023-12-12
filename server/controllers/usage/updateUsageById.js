const usageModel = require("../../models/usageModel");
const updateUsageById = async (req, res) => {
  try {
    const { id } = req.params;
    const { minutes } = req.body;

    const existingLog = await usageModel.findById(id);

    if (existingLog) {
      const today = new Date().toISOString().split("T")[0];
      const todayLog = existingLog.logs.find((log) => log.date === today);
      todayLog.minutes += minutes;

      await existingLog.save();

      res.json({ message: "Usage log updated successfully." });
    } else {
      res.status(404).json({ message: "Usage log not found." });
    }
  } catch (error) {
    console.error("Error updating usage log:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};
module.exports = updateUsageById;
