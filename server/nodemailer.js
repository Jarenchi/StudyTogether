const nodemailer = require("nodemailer");
require("dotenv").config();
const eventModel = require("./models/eventModel");
const authEmail = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: authEmail,
    pass,
  },
});

const sendMail = async (req, res) => {
  const { clubId, eventId } = req.params;
  const { email } = req.body;
  const event = await eventModel.findOne({ _id: eventId, clubId });
  const html = `
    <h1>${event.title}</h1>
    <p>${event.description}</p>
    <p>Date: ${event.date.toLocaleDateString()}</p>
    <p>Time: ${event.startTime} - ${event.endTime}</p>
    <p>Type: ${event.type}</p>
    ${event.type !== "online" ? `<p>Location: ${event.location}</p>` : ""}
    ${event.type !== "online" ? `<p>Max Participants: ${event.maxPhysicalParticipants}</p>` : ""}
  `;
  await transporter.sendMail({
    from: authEmail,
    to: email,
    subject: `你已報名參加${event.title}`,
    html: html,
  });
};
module.exports = sendMail;
