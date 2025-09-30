import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from './firebase';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch user profile from backend
        try {
          const idToken = await firebaseUser.getIdToken();
          const response = await axios.get(`${process.env.REACT_APP_API_URL || ''}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${idToken}`,
            },
          });

          if (response.data.success) {
            setUserProfile(response.data.data);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // If profile fetch fails, still keep the user but without profile data
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Get Firebase ID token for API calls
  const getIdToken = async () => {
    if (!user) return null;
    return await user.getIdToken();
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Sign up with email and password
  const signUp = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Send password reset email
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Refresh user profile data
  const refreshUserProfile = async () => {
    if (!user) return;

    try {
      const idToken = await user.getIdToken();
      const response = await axios.get(`${process.env.REACT_APP_API_URL || ''}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (response.data.success) {
        setUserProfile(response.data.data);
      }
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    getIdToken,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
    refreshUserProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


