import React, { useState } from 'react';
import { NovoraLogo } from './NovoraLogo';
import { useAuth } from '../lib/AuthContext';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface CustomerAuthProps {
  initialMode?: 'login' | 'signup';
  onSuccess: () => void;
  onBackToStore: () => void;
  onNavigateToAdminLogin: () => void;
}

export const CustomerAuth: React.FC<CustomerAuthProps> = ({
  initialMode = 'login',
  onSuccess,
  onBackToStore,
  onNavigateToAdminLogin
}) => {
  const { 
    signInCustomerWithEmail, 
    signUpCustomerWithEmail, 
    signInCustomerWithGoogle,
    authError, 
    clearAuthError 
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setFormError(null);
    clearAuthError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearAuthError();

    if (!email || !email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setFormError('Passwords do not match. Please re-enter.');
        return;
      }
      if (!name.trim()) {
        setFormError('Please enter your full name for your member certificate.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await signInCustomerWithEmail(email, password);
        if (res.success) {
          onSuccess();
        } else {
          setFormError(res.error || 'Authentication failed.');
        }
      } else {
        const res = await signUpCustomerWithEmail(email, password, name.trim());
        if (res.success) {
          onSuccess();
        } else {
          setFormError(res.error || 'Account registration failed.');
        }
      }
    } catch (err: any) {
      setFormError(err?.message || 'Authentication error encountered.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError(null);
    clearAuthError();
    setLoading(true);
    try {
      const res = await signInCustomerWithGoogle();
      if (res.success) {
        onSuccess();
      } else {
        setFormError(res.error || 'Google authentication was not completed.');
      }
    } catch (err: any) {
      setFormError(err?.message || 'Google sign-in error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between selection:bg-[#D4AF37] selection:text-black">
      {/* Top Header */}
      <header className="border-b border-[#D4AF37]/15 bg-[#050505]/95 backdrop-blur-md px-4 sm:px-8 py-4 flex items-center justify-between">
        <button
          onClick={onBackToStore}
          className="flex items-center gap-2 text-xs font-medium text-[#A8A8A8] hover:text-[#D4AF37] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Store</span>
        </button>

        <div onClick={onBackToStore} className="cursor-pointer">
          <NovoraLogo variant="compact" size="sm" />
        </div>

        <div className="text-[11px] font-mono text-[#777] hidden sm:block">
          CUSTOMER ACCESS PORTAL
        </div>
      </header>

      {/* Main Centered Authentication Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#080808] border border-[#D4AF37]/25 rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-6">
          
          {/* Header Title */}
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block">
              {mode === 'login' ? 'Executive Membership' : 'Create Customer Account'}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-white font-light">
              {mode === 'login' ? 'Welcome to NOVORA' : 'Join the Sovereign Circle'}
            </h1>
            <p className="text-xs text-[#888] leading-relaxed">
              {mode === 'login' 
                ? 'Sign in to access your digital library, purchased monographs, and order records.'
                : 'Register to manage your acquired blueprints, DRM-free downloads, and order receipts.'}
            </p>
          </div>

          {/* Tab Switcher: Login vs Sign Up */}
          <div className="grid grid-cols-2 p-1 bg-[#040404] border border-[#D4AF37]/20 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`py-2 rounded transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#C9A227] text-black shadow-md'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`py-2 rounded transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#C9A227] text-black shadow-md'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Google Fast Sign In */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-[#0F0F0F] hover:bg-[#161616] border border-white/10 hover:border-[#D4AF37]/50 text-white text-xs font-medium flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#080808] px-3 text-[10px] uppercase tracking-wider text-[#666] font-mono">
              or with email
            </span>
          </div>

          {/* Error Banner */}
          {(formError || authError) && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{formError || authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A8A8A8] mb-1 font-mono">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#777] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#050505] border border-white/15 focus:border-[#D4AF37] focus:outline-none text-xs text-white placeholder-[#555] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A8A8A8] mb-1 font-mono">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#777] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="executive@domain.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#050505] border border-white/15 focus:border-[#D4AF37] focus:outline-none text-xs text-white placeholder-[#555] transition-colors"
                />
              </div>
            </div>

            {/* Phone (Optional on Sign Up) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A8A8A8] mb-1 font-mono">
                  Phone (Optional for Order SMS / WhatsApp)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#777] absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#050505] border border-white/15 focus:border-[#D4AF37] focus:outline-none text-xs text-white placeholder-[#555] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] uppercase tracking-wider text-[#A8A8A8] font-mono">
                  Password
                </label>
                {mode === 'login' && (
                  <span className="text-[10px] text-[#A8A8A8] hover:text-[#D4AF37] transition-colors">
                    Min. 6 chars
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#777] absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-[#050505] border border-white/15 focus:border-[#D4AF37] focus:outline-none text-xs text-white placeholder-[#555] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-[#777] hover:text-white absolute right-3 top-2.5 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A8A8A8] mb-1 font-mono">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#777] absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#050505] border border-white/15 focus:border-[#D4AF37] focus:outline-none text-xs text-white placeholder-[#555] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#C9A227] text-black font-semibold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>{mode === 'login' ? 'Access Customer Account' : 'Complete Registration'}</span>
              )}
            </button>
          </form>

          {/* Privacy & Security Footnote */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#777]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>256-Bit SSL Auth</span>
            </div>
            
            {/* Separate Admin Portal Link */}
            <button
              onClick={onNavigateToAdminLogin}
              className="text-[#888] hover:text-[#D4AF37] transition-colors underline font-mono text-[10px]"
            >
              Admin Portal →
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 px-4 text-center text-[10px] text-[#555] font-mono">
        NOVORA DIGITAL • EXECUTIVE DIGITAL COMMERCE SYSTEM • SECURED BY FIREBASE
      </footer>
    </div>
  );
};
