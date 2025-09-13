'use client';

import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Card } from '../../components/ui/card';
import { Eye, EyeOff, Shield, Zap, Home, Building, Building2, Castle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface LoginCardProps {
  onForgotPassword: () => void;
  onSuccess?: () => void;
}

interface ForgotPasswordCardProps {
  onBackToLogin: () => void;
}

export default function LoginPage() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  const handleLoginSuccess = () => {
    // Сохраняем токен аутентификации
    localStorage.setItem('authToken', 'demo-token-' + Date.now());
    
    // Redirect to onboarding page
    window.location.href = '/onboarding';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {showForgotPassword ? (
        <ForgotPasswordCard onBackToLogin={handleBackToLogin} />
      ) : (
        <LoginCard onForgotPassword={handleForgotPassword} onSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

function LoginCard({ onForgotPassword, onSuccess }: LoginCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const texts = {
    title: "360° House Viewer",
    subtitle: "Enter the future of house visualization",
    email: "Email Address",
    password: "Password",
    emailPlaceholder: "your.email@domain.com",
    passwordPlaceholder: "Enter secure password",
    forgot: "Forgot Password?",
    remember: "Keep me signed in",
    login: "Access Dashboard",
    loginLoading: "Authenticating...",
    emailError: "Please enter a valid email address.",
    passwordError: "Password is required.",
    invalidCredentials: "Invalid credentials"
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

    let hasError = false;

    if (!email || !validateEmail(email)) {
      setEmailError(texts.emailError);
      hasError = true;
    }

    if (!password) {
      setPasswordError(texts.passwordError);
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Accept any valid email and any password
      toast.success('Welcome to the future!', {
        duration: 3000,
      });
      // Navigate to Collections Hub
      if (onSuccess) onSuccess();
    }, 1500);
  };

  const handleForgotPassword = () => {
    onForgotPassword();
  };

  return (
    <div className="relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse" 
             style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-20 right-16 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse" 
             style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-blue-400/20 rounded-full animate-pulse" 
             style={{ animationDelay: '2s', animationDuration: '5s' }} />
        <div className="absolute bottom-20 right-12 w-1.5 h-1.5 bg-teal-400/30 rounded-full animate-pulse" 
             style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
      </div>

      <Card className="w-full max-w-[650px] mx-auto relative overflow-hidden" 
            style={{ 
              borderRadius: '32px', 
              padding: '48px',
              background: 'linear-gradient(135deg, rgba(2, 6, 23, 0.98) 0%, rgba(15, 23, 42, 0.95) 25%, rgba(30, 41, 59, 0.92) 75%, rgba(51, 65, 85, 0.90) 100%)',
              backdropFilter: 'blur(40px)',
              border: '2px solid transparent',
              backgroundClip: 'padding-box',
              boxShadow: `
                0 0 0 1px rgba(148, 163, 184, 0.1),
                0 32px 64px -12px rgba(0, 0, 0, 0.8),
                0 0 100px -20px rgba(6, 182, 212, 0.15),
                0 0 60px -15px rgba(147, 51, 234, 0.1) inset
              `
            }}>
        
        {/* Ultra futuristic glow effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/8 via-blue-500/5 via-purple-500/8 to-pink-500/6 pointer-events-none animate-pulse" 
             style={{ animationDuration: '8s' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-96 bg-gradient-conic from-cyan-400/15 via-blue-500/10 via-purple-500/15 to-cyan-400/15 blur-3xl pointer-events-none opacity-30" />
        
        {/* Scanning line effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse"
               style={{
                 top: '20%',
                 animationDuration: '6s',
                 animationDelay: '1s'
               }} />
        </div>

        {/* Hexagonal pattern overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='0.4'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '60px 60px'
             }} />
        
        <div className="relative flex flex-col gap-8">
          {/* Logo and Header */}
          <div className="text-center mb-6">
            <div className="w-32 h-32 mx-auto mb-8 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-purple-400/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500" />
              <div className="absolute inset-2 bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative w-full h-full flex items-center justify-center">
                <Image 
                  src="/logo.png" 
                  alt="360° House Viewer Logo" 
                  width={200} 
                  height={200}
                  className="drop-shadow-2xl filter  rounded-full group-hover:brightness-110 transition-all duration-500 object-contain"
                  priority
                />
              </div>
              {/* Rotating ring around logo */}
              <div className="absolute inset-0 border-2 border-cyan-400/20 rounded-full animate-spin" 
                   style={{ animationDuration: '20s' }} />
              <div className="absolute inset-4 rounded-full animate-spin overflow-hidden" 
                   style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                {/* Multi-layered animated border */}
                <div className="absolute inset-0 rounded-full border border-purple-400/20 animate-pulse" 
                     style={{ animationDuration: '3s' }} />
                <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-cyan-400/30 via-purple-400/40 via-blue-400/30 to-cyan-400/30 animate-pulse"
                     style={{ 
                       animationDuration: '4s',
                       backgroundClip: 'border-box',
                       WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       WebkitMaskComposite: 'xor',
                       maskComposite: 'exclude'
                     }} />
                {/* Rotating ADU property particles */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-pulse"
                     style={{ animationDuration: '2s', filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))' }}>
                  <Home className="w-3 h-3 text-cyan-400" />
                </div>
                <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 animate-pulse"
                     style={{ animationDuration: '2.5s', filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.8))' }}>
                  <Building2 className="w-3 h-3 text-purple-400" />
                </div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 animate-pulse"
                     style={{ animationDuration: '3s', filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' }}>
                  <Building className="w-3 h-3 text-blue-400" />
                </div>
                <div className="absolute right-0 bottom-1/2 transform translate-y-1/2 animate-pulse"
                     style={{ animationDuration: '2.2s', filter: 'drop-shadow(0 0 8px rgba(20, 184, 166, 0.8))' }}>
                  <Castle className="w-3 h-3 text-teal-400" />
                </div> 
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-white mb-2 relative">
                <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
                  {texts.title}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/20 via-blue-300/20 to-purple-300/20 blur-sm -z-10" />
              </h1>
              <p className="text-slate-300 relative">
                <Zap className="inline w-4 h-4 mr-2 text-cyan-400" />
                {texts.subtitle}
              </p>
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-4">
            <Label htmlFor="email" className="text-slate-200 text-xs uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              {texts.email}
            </Label>
            <div className="relative group">
              <Input
                id="email"
                type="email"
                placeholder={texts.emailPlaceholder}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                className={`
                  bg-slate-900/40 border-slate-600/30 text-white placeholder:text-slate-500 
                  focus:border-cyan-400/60 focus:ring-cyan-400/20 focus:bg-slate-900/60
                  transition-all duration-500 backdrop-blur-sm
                  group-hover:border-cyan-400/40 relative z-10
                  ${emailError ? 'border-red-400/60 focus:border-red-400/60 focus:ring-red-400/20' : ''}
                `}
                style={{ 
                  minHeight: '56px',
                  fontSize: '16px',
                  borderRadius: '16px'
                }}
              />
              {/* Glow effect on focus */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10" />
            </div>
            {emailError && (
              <div className="flex items-center gap-3 text-red-400 text-sm animate-pulse">
                <div className="w-5 h-5 rounded-full bg-red-400/20 flex items-center justify-center border border-red-400/30">
                  <span className="text-xs font-bold">!</span>
                </div>
                <span>{emailError}</span>
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-200 text-xs uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                {texts.password}
              </Label>
              <button 
                onClick={handleForgotPassword}
                className="text-cyan-400 hover:text-cyan-300 text-sm transition-all duration-300 hover:underline hover:scale-105 flex items-center gap-1"
              >
                <Zap className="w-3 h-3" />
                {texts.forgot}
              </button>
            </div>
            <div className="relative group">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={texts.passwordPlaceholder}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                className={`
                  bg-slate-900/40 border-slate-600/30 text-white placeholder:text-slate-500 
                  focus:border-cyan-400/60 focus:ring-cyan-400/20 focus:bg-slate-900/60
                  transition-all duration-500 backdrop-blur-sm pr-16
                  group-hover:border-cyan-400/40 relative z-10
                  ${passwordError ? 'border-red-400/60 focus:border-red-400/60 focus:ring-red-400/20' : ''}
                `}
                style={{ 
                  minHeight: '56px',
                  fontSize: '16px',
                  borderRadius: '16px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
                style={{ minWidth: '48px', minHeight: '48px' }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {/* Glow effect on focus */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10" />
            </div>
            {passwordError && (
              <div className="flex items-center gap-3 text-red-400 text-sm animate-pulse">
                <div className="w-5 h-5 rounded-full bg-red-400/20 flex items-center justify-center border border-red-400/30">
                  <span className="text-xs font-bold">!</span>
                </div>
                <span>{passwordError}</span>
              </div>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-4 py-3">
            <Switch
              id="remember"
              checked={rememberMe}
              onCheckedChange={setRememberMe}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-purple-500 scale-110"
            />
            <Label htmlFor="remember" className="text-slate-300 cursor-pointer hover:text-white transition-colors duration-300">
              {texts.remember}
            </Label>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              minHeight: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #0891b2 0%, #3b82f6 25%, #8b5cf6 75%, #d946ef 100%)',
              border: 'none',
              boxShadow: '0 10px 30px -5px rgba(6, 182, 212, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.3) inset'
            }}
          >
            {/* Animated background layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="absolute inset-0 bg-black/10 group-active:bg-black/20 transition-colors rounded-[20px]" />
            
            <span className="relative z-10 text-white font-semibold tracking-wide text-lg flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {texts.loginLoading}
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  {texts.login}
                </>
              )}
            </span>
          </Button>
        </div>
      </Card>
    </div>
  );
}

function ForgotPasswordCard({ onBackToLogin }: ForgotPasswordCardProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const texts = {
    title: "Password Recovery",
    subtitle: "Reset your access credentials",
    email: "Email Address",
    emailPlaceholder: "Enter your registered email",
    sendReset: "Send Reset Link",
    sendingReset: "Sending quantum signal...",
    backToLogin: "Back to Login",
    successTitle: "Reset Link Sent",
    successMessage: "Check your email for password reset instructions",
    emailError: "Please enter a valid email address.",
    description: "Enter your email address and we'll send you a secure link to reset your password."
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendReset = async () => {
    setEmailError('');

    if (!email || !validateEmail(email)) {
      setEmailError(texts.emailError);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast.success('Password reset link sent successfully!', {
        duration: 4000,
      });
    }, 2000);
  };

  const handleBackToLogin = () => {
    setIsSuccess(false);
    setEmail('');
    setEmailError('');
    onBackToLogin();
  };

  return (
    <div className="relative">
      {/* Same background effects as LoginCard */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse" 
             style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-20 right-16 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse" 
             style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-blue-400/20 rounded-full animate-pulse" 
             style={{ animationDelay: '2s', animationDuration: '5s' }} />
        <div className="absolute bottom-20 right-12 w-1.5 h-1.5 bg-teal-400/30 rounded-full animate-pulse" 
             style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
      </div>

      <Card className="w-full max-w-[650px] mx-auto relative overflow-hidden" 
            style={{ 
              borderRadius: '32px', 
              padding: '48px',
              background: 'linear-gradient(135deg, rgba(2, 6, 23, 0.98) 0%, rgba(15, 23, 42, 0.95) 25%, rgba(30, 41, 59, 0.92) 75%, rgba(51, 65, 85, 0.90) 100%)',
              backdropFilter: 'blur(40px)',
              border: '2px solid transparent',
              backgroundClip: 'padding-box',
              boxShadow: `
                0 0 0 1px rgba(148, 163, 184, 0.1),
                0 32px 64px -12px rgba(0, 0, 0, 0.8),
                0 0 100px -20px rgba(6, 182, 212, 0.15),
                0 0 60px -15px rgba(147, 51, 234, 0.1) inset
              `
            }}>
        
        {/* Same effects as LoginCard */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/8 via-blue-500/5 via-purple-500/8 to-pink-500/6 pointer-events-none animate-pulse" 
             style={{ animationDuration: '8s' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-96 bg-gradient-conic from-cyan-400/15 via-blue-500/10 via-purple-500/15 to-cyan-400/15 blur-3xl pointer-events-none opacity-30" />
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse"
               style={{
                 top: '20%',
                 animationDuration: '6s',
                 animationDelay: '1s'
               }} />
        </div>

        <div className="absolute inset-0 opacity-5 pointer-events-none"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='0.4'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '60px 60px'
             }} />
        
        <div className="relative flex flex-col gap-8">
          {/* Back Button */}
          <button
            onClick={handleBackToLogin}
            className="absolute -top-4 -left-4 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">{texts.backToLogin}</span>
          </button>

          {/* Logo and Header */}
          <div className="text-center mb-6">
            <div className="w-32 h-32 mx-auto mb-8 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-purple-400/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500" />
              <div className="absolute inset-2 bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative w-full h-full flex items-center justify-center">
                <Image 
                  src="/Website.png" 
                  alt="360° House Viewer Logo" 
                  width={64} 
                  height={64}
                  className="drop-shadow-2xl filter group-hover:brightness-110 transition-all duration-500 object-contain"
                  priority
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-white mb-2 relative">
                <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
                  {texts.title}
                </span>
              </h1>
              <p className="text-slate-300 relative">
                <Zap className="inline w-4 h-4 mr-2 text-cyan-400" />
                {texts.subtitle}
              </p>
              <p className="text-slate-400 text-sm">
                {texts.description}
              </p>
            </div>
          </div>

          {!isSuccess ? (
            <>
              {/* Email Field */}
              <div className="space-y-4">
                <Label htmlFor="email" className="text-slate-200 text-xs uppercase tracking-widest flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  {texts.email}
                </Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    placeholder={texts.emailPlaceholder}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    className={`
                      bg-slate-900/40 border-slate-600/30 text-white placeholder:text-slate-500 
                      focus:border-cyan-400/60 focus:ring-cyan-400/20 focus:bg-slate-900/60
                      transition-all duration-500 backdrop-blur-sm
                      group-hover:border-cyan-400/40 relative z-10
                      ${emailError ? 'border-red-400/60 focus:border-red-400/60 focus:ring-red-400/20' : ''}
                    `}
                    style={{ 
                      minHeight: '56px',
                      fontSize: '16px',
                      borderRadius: '16px'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10" />
                </div>
                {emailError && (
                  <div className="flex items-center gap-3 text-red-400 text-sm animate-pulse">
                    <div className="w-5 h-5 rounded-full bg-red-400/20 flex items-center justify-center border border-red-400/30">
                      <span className="text-xs font-bold">!</span>
                    </div>
                    <span>{emailError}</span>
                  </div>
                )}
              </div>

              {/* Send Reset Button */}
              <Button
                onClick={handleSendReset}
                disabled={isLoading}
                className="w-full relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                style={{ 
                  minHeight: '64px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #0891b2 0%, #3b82f6 25%, #8b5cf6 75%, #d946ef 100%)',
                  border: 'none',
                  boxShadow: '0 10px 30px -5px rgba(6, 182, 212, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.3) inset'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <span className="relative z-10 text-white font-semibold tracking-wide text-lg flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {texts.sendingReset}
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      {texts.sendReset}
                    </>
                  )}
                </span>
              </Button>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-400 mb-2">{texts.successTitle}</h2>
                <p className="text-slate-300">{texts.successMessage}</p>
              </div>
              <Button
                onClick={handleBackToLogin}
                className="bg-slate-700 hover:bg-slate-600 text-white"
              >
                {texts.backToLogin}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}