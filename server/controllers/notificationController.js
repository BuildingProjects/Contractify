const Notification = require("../models/Notification");

const getNotificationsByUser = async (req, res) => {
  try {
    console.log("User object from token:", req.user);
    const userId = req.user.id;

    console.log("Fetching notifications for recipient ID:", userId);

    const notifications = await Notification.find({ recipient: userId });

    console.log("Notifications found:", notifications);

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const markNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotificationsByUser, markNotificationsAsRead };
