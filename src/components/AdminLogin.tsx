import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { NovoraLogo } from './NovoraLogo';
import { Lock, Mail, Key, ShieldCheck, ArrowRight, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
  onNavigateToCustomerLogin?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ 
  onLoginSuccess, 
  onBackToStore,
  onNavigateToCustomerLogin 
}) => {
  const { 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    authError, 
    clearAuthError, 
    ownerEmail,
    loading 
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();
    setIsSubmitting(true);

    try {
      let ok = false;
      if (mode === 'signin') {
        ok = await signInWithEmail(email, password);
      } else {
        ok = await signUpWithEmail(email, password);
      }
      if (ok) {
        onLoginSuccess();
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError(null);
    clearAuthError();
    setIsSubmitting(true);
    try {
      const ok = await signInWithGoogle();
      if (ok) {
        onLoginSuccess();
      }
    } catch (err: any) {
      setLocalError(err.message || 'Google sign-in error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreFillOwner = () => {
    setEmail(ownerEmail);
  };

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col justify-center items-center px-4 py-12 selection:bg-[#D4AF37] selection:text-black">
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#D4AF3715_0%,transparent_60%)] pointer-events-none" />

      {/* Return to Store Link */}
      <button
        onClick={onBackToStore}
        className="mb-8 flex items-center gap-2 text-xs font-mono tracking-widest text-[#A8A8A8] hover:text-[#F5D76E] transition-colors uppercase cursor-pointer z-10"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Return to Storefront
      </button>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#080808] border border-[#D4AF37]/30 rounded-2xl p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] z-10 relative overflow-hidden backdrop-blur-xl">
        
        {/* Top Gold Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <NovoraLogo variant="vertical" size="md" />
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 mt-6 mb-2">
            <Lock className="w-3 h-3 text-[#F5D76E]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
              Command & Control Center
            </span>
          </div>

          <h2 className="font-serif text-2xl font-light text-white tracking-tight">
            {mode === 'signin' ? 'Administrative Sign-In' : 'Provision Admin Credential'}
          </h2>
          <p className="text-xs text-[#888] font-light mt-1">
            Restricted access portal for authorized NOVORA executives.
          </p>
        </div>

        {/* Error Notification */}
        {(authError || localError) && (
          <div className="mb-6 p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{authError || localError}</span>
          </div>
        )}

        {/* One-Click Google Authentication */}
        <button
          onClick={handleGoogleLogin}
          disabled={isSubmitting || loading}
          className="w-full py-3 px-4 rounded-xl border border-[#D4AF37]/30 bg-[#0C0C0C] hover:bg-[#151515] hover:border-[#D4AF37] transition-all flex items-center justify-center gap-3 group cursor-pointer shadow-sm mb-6 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
            />
          </svg>
          <span className="text-xs font-semibold tracking-wider text-white uppercase group-hover:text-[#F5D76E] transition-colors">
            Sign In with Google
          </span>
        </button>

        {/* Separator */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-[1px] bg-white/10" />
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#666]">
            Or With Email
          </span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#A8A8A8]">
                Administrator Email
              </label>
              <button
                type="button"
                onClick={handlePreFillOwner}
                className="text-[10px] text-[#D4AF37] hover:underline"
              >
                Auto-fill Owner
              </button>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#666] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={ownerEmail}
                className="w-full bg-[#040404] border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A8A8A8] mb-1.5">
              Security Key / Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#666] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#040404] border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#C9A227] text-black font-semibold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Authenticating...' : (mode === 'signin' ? 'Authorize & Enter' : 'Create Admin Account')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Mode Toggle */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center space-y-2">
          {mode === 'signin' ? (
            <button
              onClick={() => setMode('signup')}
              className="text-[11px] text-[#A8A8A8] hover:text-[#D4AF37] transition-colors"
            >
              First time owner setup? <span className="underline text-white">Create initial credentials</span>
            </button>
          ) : (
            <button
              onClick={() => setMode('signin')}
              className="text-[11px] text-[#A8A8A8] hover:text-[#D4AF37] transition-colors"
            >
              Already configured? <span className="underline text-white">Sign In</span>
            </button>
          )}

          {onNavigateToCustomerLogin && (
            <div className="pt-2 border-t border-white/5">
              <button
                onClick={onNavigateToCustomerLogin}
                className="text-[11px] text-[#D4AF37] hover:text-[#F5D76E] transition-colors font-medium"
              >
                Customer looking for your account? Sign in to Customer Panel →
              </button>
            </div>
          )}
        </div>

        {/* Security badge */}
        <div className="mt-6 p-3 rounded-lg bg-[#040404] border border-[#D4AF37]/15 flex items-center gap-2.5 text-[11px] text-[#888]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
          <span>Zero-Trust RBAC: Session tokens enforced by Firebase Firestore security rules.</span>
        </div>

      </div>

    </div>
  );
};
