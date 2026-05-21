export function addNotification(userId, message, type = "info") {
  const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
  const newNotif = {
    id: Date.now().toString(),
    userId,
    message,
    type,
    isRead: false,
    createdAt: new Date().toLocaleDateString("ru-RU"),
  };
  notifications.push(newNotif);
  localStorage.setItem("notifications", JSON.stringify(notifications));
}

export function getNotifications(userId) {
  const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
  return notifications.filter(n => n.userId === userId);
}

export function markAsRead(notificationId) {
  const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
  const updated = notifications.map(n => 
    n.id === notificationId ? { ...n, isRead: true } : n
  );
  localStorage.setItem("notifications", JSON.stringify(updated));
}
