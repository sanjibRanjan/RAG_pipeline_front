import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { Close, CloudUpload } from '@mui/icons-material';

const UploadInfoPopup = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloudUpload color="primary" />
            <Typography variant="h6" component="div">
              Upload Information
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
          You can upload PDF/.txt/.zip(WhatsApp chats) files size up to 10MB
        </Typography>
        
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 'medium' }}>
            Supported file types:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • PDF documents (.pdf)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Text files (.txt)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • ZIP archives (.zip) - including WhatsApp chat exports
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontWeight: 'medium' }}>
            Maximum file size: 10MB
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ pt: 1, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            minWidth: 100,
            borderRadius: 2
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadInfoPopup;
