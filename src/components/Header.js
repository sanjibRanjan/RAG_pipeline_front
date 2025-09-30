import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Chip,
  Button,
  Menu,
  MenuItem,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Psychology,
  SmartToy,
  Description,
  AccountCircle,
  Logout,
  Person,
  Security
} from '@mui/icons-material';
import { useAuth } from '../utils/AuthContext';

const Header = ({ onShowAuthModal, onShowProfile }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialog, setLogoutDialog] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setLogoutDialog(false);
    handleClose();
    await logout();
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.displayName || user.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <AppBar position="static" elevation={2} sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Psychology sx={{ mr: 1, color: 'primary.contrastText' }} />
            <SmartToy sx={{ color: 'secondary.light' }} />
          </Box>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.contrastText' }}>
            RAG Chat
          </Typography>

          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={<Description />}
                label="Document AI"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: 'primary.contrastText',
                  '& .MuiChip-icon': { color: 'secondary.light' }
                }}
              />

              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'secondary.main',
                    fontSize: '0.875rem'
                  }}
                >
                  {getUserInitials()}
                </Avatar>
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { handleClose(); onShowProfile(); }}>
                  <Person sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); setLogoutDialog(true); }}>
                  <Logout sx={{ mr: 1 }} />
                  Sign Out
                </MenuItem>
              </Menu>

              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', ml: 1 }}>
                Welcome, {getUserDisplayName()}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={<Description />}
                label="Document AI"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: 'primary.contrastText',
                  '& .MuiChip-icon': { color: 'secondary.light' }
                }}
              />
              <Button
                color="inherit"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'primary.contrastText',
                  '&:hover': {
                    borderColor: 'primary.contrastText',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
                onClick={onShowAuthModal}
              >
                Sign In
              </Button>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                AI-Powered Q&A
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialog}
        onClose={() => setLogoutDialog(false)}
        maxWidth="sm"
      >
        <DialogTitle>Sign Out</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to sign out? Your documents and conversations will remain secure.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialog(false)}>Cancel</Button>
          <Button onClick={handleLogout} variant="contained" color="primary">
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
