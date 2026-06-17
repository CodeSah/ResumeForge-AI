import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { Mail, Lock, User, LogIn, UserPlus, Sparkles, AlertCircle, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPanel() {
  const { 
    loginWithGoogle, 
    loginWithEmail, 
    createAccount, 
    isDemoMode, 
    error: authError, 
    setError 
  } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setError(null);

    // Validation
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setLocalError('Please fill in all credentials.');
      return;
    }

    if (trimmedPassword.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (isSignUp && !trimmedName) {
      setLocalError('Please provide your name.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await createAccount(trimmedEmail, trimmedPassword, trimmedName);
      } else {
        await loginWithEmail(trimmedEmail, trimmedPassword);
      }
    } catch (err: any) {
      // Error handled in context, but let's log locally
      console.log('Authentication error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.log('Google Sign-In failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeError = localError || authError;

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-50 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Banner with subtle glow */}
        <div className="relative bg-slate-900 px-6 py-8 text-center text-white overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-slate-900 to-indigo-950 opacity-90 z-0"></div>
          
          {/* Neon accents */}
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-indigo-500/20 blur-xl z-0"></div>
          <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-emerald-500/10 blur-xl z-0"></div>

          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-indigo-400 border border-white/10">
              <Sparkles size={24} className="animate-pulse text-indigo-300" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">ResumeForge AI</h2>
            <p className="text-xs text-slate-300 font-medium">Create outstanding ATS-Vetted resumes in minutes</p>
          </div>
        </div>

        {/* Form Body section */}
        <div className="p-6 md:p-8 space-y-5">
          
          {activeError && (
            <div className="flex gap-2.5 items-start p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-700 font-medium animate-in slide-in-from-top-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-500" />
              <div className="leading-normal">{activeError}</div>
            </div>
          )}

          {/* Combined Login Options */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">Your Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    disabled={loading}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white text-xs font-medium outline-hidden transition"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  disabled={loading}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white text-xs font-medium outline-hidden transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                {!isSignUp && (
                  <button 
                    type="button" 
                    onClick={() => alert("Standard offline account recovery: Enter any password or create a brand new account!")}
                    className="text-[10px] text-indigo-600 hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white text-xs font-medium outline-hidden transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white rounded-xl py-2.5 px-4 text-xs font-bold hover:bg-slate-800 transition active:scale-98 shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : isSignUp ? (
                <>
                  <UserPlus size={14} />
                  Create Career Account
                </>
              ) : (
                <>
                  <LogIn size={14} />
                  Login to Builder Dashboard
                </>
              )}
            </button>
          </form>

          {/* Interactive footer switch section */}
          <div className="pt-2 text-center text-xs">
            <span className="text-slate-500 font-medium font-sans">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setLocalError(null);
              }}
              className="text-indigo-600 hover:underline font-bold font-sans cursor-pointer focus:outline-hidden"
            >
              {isSignUp ? 'Login Here' : 'Create Account Now'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
