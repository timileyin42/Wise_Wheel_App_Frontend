import { useState, useRef } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Avatar, 
  IconButton,
  CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, uploadProfilePhoto } from '../../services/profile';
import { toast } from 'react-hot-toast';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '70%', md: '500px' },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto'
};

export default function EditProfileModal({ open, onClose }) {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files[0]) return;
    
    try {
      setUploading(true);
      const { url } = await uploadProfilePhoto(fileInputRef.current.files[0]);
      await updateUser({ profile_image: url });
      toast.success('Profile photo updated!');
      setPreviewImage(null);
    } catch (error) {
      toast.error('Upload failed: ' + (error.response?.data?.detail || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const updatedUser = await updateProfile(formData);
      updateUser(updatedUser);
      toast.success('Profile updated successfully!');
      onClose();
    } catch (error) {
      toast.error('Update failed: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" gutterBottom>
          Edit Profile
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2
          }}>
            <Avatar
              src={previewImage || user?.profile_image}
              sx={{ 
                width: 120, 
                height: 120,
                position: 'relative'
              }}
            >
              <IconButton
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                <EditIcon sx={{ color: 'white' }} />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </IconButton>
            </Avatar>

            {previewImage && (
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={handleUpload}
                disabled={uploading}
                size="small"
              >
                {uploading ? <CircularProgress size={24} /> : 'Upload Photo'}
              </Button>
            )}
          </Box>

          <TextField
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            fullWidth
          />

          <TextField
            label="Email"
            type="email"
            value={formData.email}
            disabled
            fullWidth
          />

          <TextField
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
