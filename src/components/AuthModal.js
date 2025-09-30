import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Tab,
  Tabs,
  IconButton,
  Divider,
} from '@mui/material';
import { Close, Google } from '@mui/icons-material';
import { useAuth } from '../utils/AuthContext';

const AuthModal = ({ open, onClose }) => {
  const [tabValue, setTabValue] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');

  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleClose = () => {
    setError('');
    setResetMode(false);
    setResetSuccess('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setResetEmail('');
    onClose();
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    const result = await signIn(email, password);

    setLoading(false);

    if (result.success) {
      handleClose();
    } else {
      setError(result.error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    const result = await signUp(email, password);

    setLoading(false);

    if (result.success) {
      handleClose();
    } else {
      setError(result.error);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    const result = await signInWithGoogle();

    setLoading(false);

    if (result.success) {
      handleClose();
    } else {
      setError(result.error);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setResetSuccess('');

    const result = await resetPassword(resetEmail);

    setLoading(false);

    if (result.success) {
      setResetSuccess('Password reset email sent! Check your inbox.');
      setResetEmail('');
    } else {
      setError(result.error);
    }
  };

  if (resetMode) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Reset Password</Typography>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {resetSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {resetSuccess}
            </Alert>
          )}

          <form onSubmit={handlePasswordReset}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              sx={{ mb: 2 }}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
            </Button>
          </form>

          <Button
            fullWidth
            variant="text"
            onClick={() => setResetMode(false)}
          >
            Back to Sign In
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Welcome to RAG Chat</Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {tabValue === 0 && (
          <form onSubmit={handleSignIn}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => setResetMode(true)}
              sx={{ mb: 2 }}
            >
              Forgot Password?
            </Button>
          </form>
        )}

        {tabValue === 1 && (
          <form onSubmit={handleSignUp}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
        )}

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<Google />}
          onClick={handleGoogleSignIn}
          disabled={loading}
          sx={{ mb: 1 }}
        >
          Continue with Google
        </Button>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          By signing in, you agree to our terms of service and privacy policy.
          Your data is completely private and secure.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
