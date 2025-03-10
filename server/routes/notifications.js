const express = require("express");

const { verifyToken } = require("../utils/jwtHelper");
const {
  getNotificationsByUser,
  markNotificationsAsRead,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/notifications/:userId", verifyToken, getNotificationsByUser);
router.put("/markNotificationsAsRead", verifyToken, markNotificationsAsRead);

module.exports = router;
