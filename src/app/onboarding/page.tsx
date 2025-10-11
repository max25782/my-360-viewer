"use client";

import React, { useEffect, useState } from "react";
import { SmartOnboarding, type UserProfile } from "../../components/SmartOnboarding";
import type { ModelData } from "../../data/realModelsData";

export default function OnboardingPage() {
  const [isDark, setIsDark] = useState(true);
  const [models, setModels] = useState<ModelData[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const emailSentRef = React.useRef(false); // Защита от двойной отправки

  useEffect(() => {
    // Force clear ALL onboarding data - including Service Worker cache
    const clearOnboardingData = async () => {
      try {
        // Clear localStorage
        localStorage.removeItem("onboardingCompleted");
        localStorage.removeItem("onboardingAnswers");
        localStorage.removeItem("onboardingRecommendations");
        
        // Clear Service Worker cache for onboarding
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          for (const name of cacheNames) {
            const cache = await caches.open(name);
            await cache.delete('/onboarding');
          }
        }
      } catch (e) {
        console.error('Failed to clear onboarding cache:', e);
      }
      
      // Show onboarding after clearing
      setShowOnboarding(true);
    };
    
    clearOnboardingData();
    
    const cached = localStorage.getItem("cachedModels");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) setModels(parsed);
      } catch {}
    }
  }, []);

  if (!showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  async function handleComplete(recs?: any, profile?: UserProfile) {
    try {
      // Save to localStorage (but NOT onboardingCompleted - we want to show it every time)
      if (recs) localStorage.setItem("onboardingRecommendations", JSON.stringify(recs));
      if (profile) localStorage.setItem("userProfile", JSON.stringify(profile));

      // Send email with onboarding results (только один раз)
      if (!emailSentRef.current) {
        emailSentRef.current = true;
        const answers = JSON.parse(localStorage.getItem("onboardingAnswers") || "{}");
        
        await fetch('/api/send-onboarding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers,
            recommendations: recs,
            profile,
          }),
        }).catch(err => {
          console.error('Failed to send onboarding email:', err);
          // Don't block user navigation if email fails
        });
      }
    } catch {}
    window.location.href = "/";
  }

  return (
    <SmartOnboarding
      models={models}
      onComplete={handleComplete}
      onSkip={() => (window.location.href = "/")}
      onModelSelect={() => {}}
      isDark={isDark}
      onToggleTheme={() => setIsDark((v) => !v)}
    />
  );
}



