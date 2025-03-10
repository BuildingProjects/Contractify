const Notification = require("../models/Notification");

// ✅ Fetch unread notifications for a user
const getNotificationsByUser = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
      isRead: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching notifications" });
  }
};

// ✅ Mark notifications as read
const markNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true }
    );
    res
      .status(200)
      .json({ success: true, message: "Notifications marked as read." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error marking notifications as read" });
  }
};

module.exports = { getNotificationsByUser, markNotificationsAsRead };
