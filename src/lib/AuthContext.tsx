import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth, googleProvider, OWNER_EMAIL } from './firebase';
import { checkIsAdmin } from './firestoreService';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<boolean>;
  signInWithEmail: (e: string, p: string) => Promise<boolean>;
  signUpWithEmail: (e: string, p: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
  ownerEmail: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);
      if (currentUser) {
        try {
          const adminStatus = await checkIsAdmin(currentUser.uid, currentUser.email);
          setIsAdmin(adminStatus);
        } catch (err) {
          console.error('Failed to verify admin status:', err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearAuthError = () => setAuthError(null);

  const signInWithGoogle = async (): Promise<boolean> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const adminStatus = await checkIsAdmin(result.user.uid, result.user.email);
      setIsAdmin(adminStatus);
      if (!adminStatus) {
        setAuthError(`Account "${result.user.email}" authenticated, but is not authorized as an administrator for NOVORA.`);
        return false;
      }
      return true;
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setAuthError(err.message || 'Google authentication failed.');
      return false;
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const adminStatus = await checkIsAdmin(result.user.uid, result.user.email);
      setIsAdmin(adminStatus);
      if (!adminStatus) {
        setAuthError(`Account "${result.user.email}" authenticated, but does not have NOVORA owner/admin privileges.`);
        return false;
      }
      return true;
    } catch (err: any) {
      console.error('Email Sign-In Error:', err);
      setAuthError(err.message || 'Email authentication failed. Please check your credentials.');
      return false;
    }
  };

  const signUpWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const adminStatus = await checkIsAdmin(result.user.uid, result.user.email);
      setIsAdmin(adminStatus);
      if (!adminStatus) {
        setAuthError(`Account "${result.user.email}" created, but is awaiting owner authorization.`);
        return false;
      }
      return true;
    } catch (err: any) {
      console.error('Email Sign-Up Error:', err);
      setAuthError(err.message || 'Account registration failed.');
      return false;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        authError,
        clearAuthError,
        ownerEmail: OWNER_EMAIL
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
