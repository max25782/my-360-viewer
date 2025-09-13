"use client";

import React, { useEffect, useState } from "react";
import { SmartOnboarding, type UserProfile } from "../../components/SmartOnboarding";
import type { ModelData } from "../../data/realModelsData";

export default function OnboardingPage() {
  const [isDark, setIsDark] = useState(true);
  const [models, setModels] = useState<ModelData[]>([]);

  useEffect(() => {
    const cached = localStorage.getItem("cachedModels");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) setModels(parsed);
      } catch {}
    }
  }, []);

  function handleComplete(recs?: any, profile?: UserProfile) {
    try {
      if (recs) localStorage.setItem("onboardingRecommendations", JSON.stringify(recs));
      if (profile) localStorage.setItem("userProfile", JSON.stringify(profile));
      localStorage.setItem("onboardingCompleted", "true");
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



