import { store } from '../config/store.js';

export const getNotifications = (req, res) => {
  const notifs = store.notifications.filter((n) => n.userId === req.user._id);
  res.status(200).json({
    success: true,
    count: notifs.length,
    unreadCount: notifs.filter((n) => !n.read).length,
    data: notifs,
  });
};

export const markAsRead = (req, res) => {
  const { id } = req.params;
  const notif = store.notifications.find((n) => n._id === id);

  if (notif) {
    notif.read = true;
  }

  res.status(200).json({ success: true, message: 'Notification marked as read.' });
};

export const markAllAsRead = (req, res) => {
  store.notifications
    .filter((n) => n.userId === req.user._id)
    .forEach((n) => {
      n.read = true;
    });

  res.status(200).json({ success: true, message: 'All notifications marked as read.' });
};
