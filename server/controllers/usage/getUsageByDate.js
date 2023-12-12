const usageModel = require("../../models/usageModel");
const getUsageByDate = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { date } = req.query;

    const existingLog = await usageModel.findOne({
      userId,
      "logs.date": date,
    });

    if (existingLog) {
      const logId = existingLog._id;
      const logMinutes = existingLog.logs.find((log) => log.date === date).minutes;

      res.status(200).json({ exists: true, logId, logMinutes });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking usage log:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = getUsageByDate;
