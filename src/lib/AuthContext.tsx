import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { auth, googleProvider, OWNER_EMAIL } from './firebase';
import { 
  checkIsAdmin, 
  syncCustomerAfterAuth, 
  updateCustomerProfileData 
} from './firestoreService';
import { CustomerProfile } from '../types';

export function formatAuthError(err: any, email?: string): string {
  if (!err) return 'Authentication failed. Please verify your credentials.';
  const code = err.code || '';

  switch (code) {
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please verify your email and password. If you originally registered with Google, use "Continue with Google" or click "Forgot Password?" below to set an email password.';
    case 'auth/user-not-found':
      return 'No customer account found with this email address. Please check your email or click "Create Account".';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again or click "Forgot Password?" to reset it.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Access to this account has been temporarily disabled due to multiple failed login attempts. Please try again later or reset your password.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection and try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. If you previously registered using Google, please use "Continue with Google" or click "Forgot Password?" on the Sign In tab to set a password.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'Email & Password authentication is currently not enabled in this Firebase project. Please sign in with "Continue with Google" or enable the Email/Password provider in the Firebase Console (Authentication → Sign-in method).';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing authentication.';
    case 'auth/popup-blocked':
      return 'The Google sign-in popup was blocked by your browser. Please allow popups for this site.';
    default:
      return err.message || 'Authentication error encountered. Please try again.';
  }
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isCustomer: boolean;
  customerProfile: CustomerProfile | null;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  // Customer Auth
  signInCustomerWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpCustomerWithEmail: (email: string, pass: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signInCustomerWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  sendCustomerPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  // Admin Auth
  signInAdminWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signInAdminWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  // Legacy / Direct helpers for existing AdminLogin
  signInWithGoogle: () => Promise<boolean>;
  signInWithEmail: (email: string, pass: string) => Promise<boolean>;
  signUpWithEmail: (email: string, pass: string) => Promise<boolean>;
  // Profile update & Sign out
  refreshCustomerProfile: () => Promise<void>;
  updateCustomerProfile: (name: string, phone?: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  ownerEmail: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchAndSyncProfile = async (currentUser: User, explicitProvider?: string) => {
    try {
      const detectedProvider = explicitProvider || currentUser.providerData?.[0]?.providerId || 'password';
      const profile = await syncCustomerAfterAuth(
        currentUser.uid,
        currentUser.email || '',
        currentUser.displayName,
        detectedProvider
      );
      setCustomerProfile(profile as CustomerProfile);
    } catch (err) {
      console.warn('Customer profile sync note:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        try {
          const adminStatus = await checkIsAdmin(currentUser.uid, currentUser.email);
          setIsAdmin(adminStatus);
          await fetchAndSyncProfile(currentUser);
        } catch (err) {
          console.error('Failed to verify admin status or profile:', err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
        setCustomerProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearAuthError = () => setAuthError(null);

  const refreshCustomerProfile = async () => {
    if (user && user.email) {
      await fetchAndSyncProfile(user);
    }
  };

  // -------------------------------------------------------------
  // CUSTOMER AUTHENTICATION METHODS
  // -------------------------------------------------------------
  const signInCustomerWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const adminStatus = await checkIsAdmin(result.user.uid, result.user.email);
      setIsAdmin(adminStatus);
      await fetchAndSyncProfile(result.user, 'password');
      return { success: true };
    } catch (err: any) {
      const msg = formatAuthError(err, email);
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const signUpCustomerWithEmail = async (
    email: string, 
    pass: string, 
    name?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (name && name.trim()) {
        try {
          await firebaseUpdateProfile(result.user, { displayName: name.trim() });
        } catch (nameErr) {
          console.warn('Update displayName note:', nameErr);
        }
      }
      const adminStatus = await checkIsAdmin(result.user.uid, result.user.email);
      setIsAdmin(adminStatus);
      const profile = await syncCustomerAfterAuth(
        result.user.uid,
        result.user.email || '',
        name?.trim() || result.user.displayName,
        'password'
      );
      setCustomerProfile(profile as CustomerProfile);
      return { success: true };
    } catch (err: any) {
      const msg = formatAuthError(err, email);
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const signInCustomerWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const adminStatus = await checkIsAdmin(result.user.uid, result.user.email);
      setIsAdmin(adminStatus);
      await fetchAndSyncProfile(result.user, 'google.com');
      return { success: true };
    } catch (err: any) {
      const msg = formatAuthError(err);
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const sendCustomerPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    setAuthError(null);
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      const errorMsg = 'Please enter a valid email address.';
      return { success: false, message: errorMsg };
    }

    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return {
        success: true,
        message: 'Password reset email sent. Please check your inbox.'
      };
    } catch (err: any) {
      let msg = 'Unable to send password reset email. Please try again later.';
      if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/Password sign-in is not enabled in the Firebase Console. Please sign in using Google or enable Email/Password under Authentication → Sign-in method.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/user-not-found') {
        msg = 'No customer account found with this email address.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many requests. Please wait a few minutes before trying again.';
      } else if (err.code === 'auth/network-request-failed') {
        msg = 'Network connection issue. Please check your internet connection.';
      }
      return { success: false, message: msg };
    }
  };

  // -------------------------------------------------------------
  // ADMIN AUTHENTICATION METHODS (STRICT ZERO-TRUST RBAC)
  // -------------------------------------------------------------
  const signInAdminWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const adminStatus = await checkIsAdmin(result.user.uid, result.user.email);
      setIsAdmin(adminStatus);
      if (!adminStatus) {
        const errorMsg = `Account "${result.user.email}" authenticated, but does not have administrator privileges for NOVORA DIGITAL.`;
        setAuthError(errorMsg);
        return { success: false, error: errorMsg };
      }
      return { success: true };
    } catch (err: any) {
      const msg = err.code === 'auth/operation-not-allowed'
        ? 'Email/Password authentication is disabled in Firebase Console. Use Google Admin sign-in or enable Email/Password.'
        : 'Admin credentials verification failed. Check email and password.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const signInAdminWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const adminStatus = await checkIsAdmin(result.user.uid, result.user.email);
      setIsAdmin(adminStatus);
      if (!adminStatus) {
        const errorMsg = `Account "${result.user.email}" authenticated, but is not authorized as an administrator for NOVORA DIGITAL.`;
        setAuthError(errorMsg);
        return { success: false, error: errorMsg };
      }
      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'Admin Google authentication was cancelled or failed.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // Legacy helpers for existing AdminLogin component compatibility
  const signInWithGoogle = async (): Promise<boolean> => {
    const res = await signInAdminWithGoogle();
    return res.success;
  };

  const signInWithEmail = async (email: string, pass: string): Promise<boolean> => {
    const res = await signInAdminWithEmail(email, pass);
    return res.success;
  };

  const signUpWithEmail = async (email: string, pass: string): Promise<boolean> => {
    const res = await signUpCustomerWithEmail(email, pass);
    return res.success;
  };

  // Customer Profile Update
  const updateCustomerProfile = async (name: string, phone?: string): Promise<boolean> => {
    if (!user) return false;
    try {
      await updateCustomerProfileData(user.uid, user.email || '', { name, phone });
      if (auth.currentUser && name) {
        try {
          await firebaseUpdateProfile(auth.currentUser, { displayName: name });
        } catch (e) {
          console.warn('Profile name sync note:', e);
        }
      }
      setCustomerProfile((prev) => prev ? { ...prev, name, phone } : null);
      return true;
    } catch (err) {
      console.error('Failed to update customer profile:', err);
      return false;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setIsAdmin(false);
    setCustomerProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isCustomer: !!user && !isAdmin,
        customerProfile,
        loading,
        signInCustomerWithEmail,
        signUpCustomerWithEmail,
        signInCustomerWithGoogle,
        sendCustomerPasswordReset,
        signInAdminWithEmail,
        signInAdminWithGoogle,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        refreshCustomerProfile,
        updateCustomerProfile,
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

