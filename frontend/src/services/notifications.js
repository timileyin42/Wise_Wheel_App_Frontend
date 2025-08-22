import api from './api';

export async function fetchNotifications() {
  const res = await api.get('/notifications');
  return res.data;
}

export async function markAllNotificationsRead() {
  const res = await api.post('/notifications/read');
  return res.data;
}

export async function deleteNotification(id) {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
}
