import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  isRealFirebase, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  FirebaseUser
} from './firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isDemoMode: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  createAccount: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  setError: (err: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Storage key for demo local accounts and mock logged in user state
  const DEMO_USER_KEY = 'resume_builder_sandbox_user';
  const DEMO_ACCOUNTS_KEY = 'resume_builder_sandbox_accounts';

  useEffect(() => {
    if (isRealFirebase && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Sandbox fallback
      const savedUser = localStorage.getItem(DEMO_USER_KEY);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Failed to parse sandboxed user', e);
        }
      }
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      if (isRealFirebase && auth) {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } else {
        // Sandbox Mock: Sign in with simulated Google user
        const mockUser: AuthUser = {
          uid: 'google-sandbox-uid-' + Math.random().toString(36).substring(2, 9),
          email: 'user.google@gmail.com',
          displayName: 'Demo Google User',
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'
        };
        setUser(mockUser);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google authentication failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      if (isRealFirebase && auth) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Fetch accounts registered in sandbox mock
        const accountsJson = localStorage.getItem(DEMO_ACCOUNTS_KEY);
        const accounts = accountsJson ? JSON.parse(accountsJson) : [];
        
        const matched = accounts.find((acc: any) => acc.email.toLowerCase() === email.toLowerCase());
        
        if (!matched) {
          throw new Error('No account found with this email in the sandbox. Please create one!');
        }
        
        if (matched.password !== password) {
          throw new Error('Incorrect password. Please try again.');
        }

        const mockUser: AuthUser = {
          uid: matched.uid,
          email: matched.email,
          displayName: matched.name || 'Sandbox Member',
          photoURL: null
        };
        
        setUser(mockUser);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Login failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (email: string, password: string, name: string) => {
    setError(null);
    setLoading(true);
    try {
      if (isRealFirebase && auth) {
        // For actual Firebase Account creation, register is straightforward
        // (Vite's UI can let them fill display name in their Profile if needed, or updateProfile)
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        // Note: Real Firebase User displayName could be updated using updateProfile
        setUser({
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: name || 'New Account',
          photoURL: null
        });
      } else {
        // Sandbox Mock: Save locally in accounts list
        const accountsJson = localStorage.getItem(DEMO_ACCOUNTS_KEY);
        const accounts = accountsJson ? JSON.parse(accountsJson) : [];
        
        const alreadyExists = accounts.some((acc: any) => acc.email.toLowerCase() === email.toLowerCase());
        if (alreadyExists) {
          throw new Error('An account with this email already exists in the sandbox.');
        }

        const newUid = 'sandbox-uid-' + Math.random().toString(36).substring(2, 9);
        const newAccount = {
          uid: newUid,
          email: email.toLowerCase(),
          password,
          name
        };

        accounts.push(newAccount);
        localStorage.setItem(DEMO_ACCOUNTS_KEY, JSON.stringify(accounts));

        // Sign them in instantly
        const mockUser: AuthUser = {
          uid: newUid,
          email: email,
          displayName: name,
          photoURL: null
        };
        
        setUser(mockUser);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create account.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    setLoading(true);
    try {
      if (isRealFirebase && auth) {
        await signOut(auth);
      } else {
        localStorage.removeItem(DEMO_USER_KEY);
        setUser(null);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Logout failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isDemoMode: !isRealFirebase,
      loginWithGoogle,
      loginWithEmail,
      createAccount,
      logout,
      error,
      setError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
