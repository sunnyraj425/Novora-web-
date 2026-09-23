import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
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

  const fetchAndSyncProfile = async (currentUser: User) => {
    try {
      const profile = await syncCustomerAfterAuth(
        currentUser.uid,
        currentUser.email || '',
        currentUser.displayName
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
      await fetchAndSyncProfile(result.user);
      return { success: true };
    } catch (err: any) {
      let msg = 'Invalid credentials. Please verify your email and password.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        msg = 'No customer account found with these credentials. Please check your email or sign up.';
      } else if (err.code === 'auth/wrong-password') {
        msg = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Account temporarily locked for security. Please try again later.';
      }
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
        name || result.user.displayName
      );
      setCustomerProfile(profile as CustomerProfile);
      return { success: true };
    } catch (err: any) {
      let msg = 'Account registration failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please log in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 6 characters with letters and numbers.';
      }
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
      await fetchAndSyncProfile(result.user);
      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'Google authentication was cancelled or failed.';
      setAuthError(msg);
      return { success: false, error: msg };
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
      const msg = 'Admin credentials verification failed. Check email and password.';
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
