import React, { useState, useRef, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, Alert, Snackbar , Typography} from '@mui/material';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import { AuthProvider, useAuth } from './utils/AuthContext';


const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// AppContent component that uses auth context
function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: 'Welcome to RAG Chat! Upload documents and ask questions about them.',
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [authRequiredAlert, setAuthRequiredAlert] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show auth modal if user tries to interact without being authenticated
  // Reset messages to initial state when user logs out
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Reset messages to initial welcome message
      setMessages([
        {
          id: 1,
          type: 'system',
          content: 'Welcome to RAG Chat! Upload documents and ask questions about them.',
          timestamp: new Date(),
        }
      ]);
      // Reset other state
      setIsLoading(false);
      setSessionId(null);

      const timer = setTimeout(() => {
        setShowAuthModal(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, isAuthenticated]);

  const handleShowAuthModal = () => {
    setShowAuthModal(true);
  };

  const handleShowProfile = () => {
    setShowProfile(true);
  };

  // Show authentication required alert for API failures
  const handleAuthError = () => {
    setAuthRequiredAlert(true);
    setShowAuthModal(true);
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: 'background.default'
      }}>
        <Header
          onShowAuthModal={handleShowAuthModal}
          onShowProfile={handleShowProfile}
        />
        <Box sx={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden'
        }}>
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '1200px',
            mx: 'auto',
            width: '100%',
            height: '100%',
            p: 2
          }}>
            {!isAuthenticated && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Please sign in to upload documents and ask questions. Your data will be completely private and secure.
                </Typography>
              </Alert>
            )}

            <ChatInterface
              messages={messages}
              setMessages={setMessages}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              sessionId={sessionId}
              setSessionId={setSessionId}
              messagesEndRef={messagesEndRef}
              onAuthRequired={handleAuthError}
            />
          </Box>
        </Box>
      </Box>

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <UserProfile
        open={showProfile}
        onClose={() => setShowProfile(false)}
      />

      <Snackbar
        open={authRequiredAlert}
        autoHideDuration={6000}
        onClose={() => setAuthRequiredAlert(false)}
      >
        <Alert
          onClose={() => setAuthRequiredAlert(false)}
          severity="warning"
          sx={{ width: '100%' }}
        >
          Authentication required. Please sign in to continue.
        </Alert>
      </Snackbar>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
