
import { useEffect, useState } from 'react';
import { fetchNotifications, markAllNotificationsRead, deleteNotification } from '../../services/notifications';
import { Box, Typography, IconButton, Button, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, CircularProgress } from '@mui/material';
import { Delete, NotificationsActive, CheckCircle } from '@mui/icons-material';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      toast.error('Failed to fetch notifications');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    setMarking(true);
    try {
      await markAllNotificationsRead();
      toast.success('All notifications marked as read');
      loadNotifications();
    } catch {
      toast.error('Failed to mark as read');
    }
    setMarking(false);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteNotification(id);
      toast.success('Notification deleted');
      loadNotifications();
    } catch {
      toast.error('Failed to delete notification');
    }
    setDeletingId(null);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: { xs: 0, md: 1 }, px: 2 }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        mb: 2,
        pl: { xs: 0, md: 0 },
        ml: { xs: 0, md: -8 },
        mt: { xs: 0, md: -2 }
      }}>
        <Typography variant="h4" sx={{ fontWeight: 500, mr: 2 }}>
          Notifications
        </Typography>
        {(!loading && notifications.length > 0) && (
          <Button 
            variant="contained" 
            startIcon={<NotificationsActive />} 
            onClick={handleMarkAllRead} 
            disabled={marking}
            sx={{ boxShadow: 1, ml: 2 }}
          >
            {marking ? <CircularProgress size={20} color="inherit" /> : 'Mark All as Read'}
          </Button>
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 600 }}>
          <List>
            {loading && <Box sx={{ p: 2, textAlign: 'center' }}><CircularProgress /></Box>}
            {!loading && notifications.length === 0 && (
              <Typography sx={{ textAlign: 'center', mt: 4 }}>No notifications found.</Typography>
            )}
            {notifications.map((n) => (
              <Box key={n.id}>
                <ListItem sx={{ opacity: n.read ? 0.6 : 1 }}>
                  <ListItemText
                    primary={n.title}
                    secondary={n.message}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                    {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                  </Typography>
                  {n.read && <CheckCircle color="success" fontSize="small" sx={{ mr: 1 }} />}
                  <ListItemSecondaryAction>
                    <IconButton edge="end" color="error" onClick={() => handleDelete(n.id)} disabled={deletingId === n.id}>
                      {deletingId === n.id ? <CircularProgress size={20} color="error" /> : <Delete />}
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
}
