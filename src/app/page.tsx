'use client';

"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NeoHousesListWrapper from "../components/Neo/NeoHousesListWrapper";
import SkylineHousesListWrapper from "../components/Skyline/SkylineHousesListWrapper";
import PremiumHousesListWrapper from "../components/Premium/PremiumHousesListWrapper";
import PWAInitializer from "../components/PWAInitializer";
import { Sun, MessageCircle, Search, ChevronDown } from "lucide-react";
import AuthGuard from "../components/AuthGuard";

export default function Home() {
const [darkToggle] = useState(true);
const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

// Временные карточки коллекций (визуал). Можешь заменить на данные из JSON.
const collections = [
{ code: "SLN-7X", name: "SKYLINE", count: 6, id: "skyline" },
{ code: "NEO-9A", name: "NEO", count: 2, id: "neo" },
{ code: "PRM-5E", name: "PREMIUM", count: 2, id: "premium" },
{ code: "SVD-1C", name: "SAVED", count: 0, id: "saved" },
];

const handleCollectionClick = (collectionId: string) => {
  setSelectedCollection(collectionId);
};

  return (
    <AuthGuard>
      <div className="min-h-screen text-white relative overflow-hidden"
           style={{
             background: 'linear-gradient(135deg, rgba(2, 6, 23, 0.98) 0%, rgba(15, 23, 42, 0.95) 25%, rgba(30, 41, 59, 0.92) 75%, rgba(51, 65, 85, 0.90) 100%)',
             backdropFilter: 'blur(40px)'
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
        
        <div className="relative z-10">
<PWAInitializer />


{/* HERO БЛОК С ГРАДИЕНТАМИ */}
<section className="relative overflow-hidden">
{/* фоновые пятна */}
<div
className="absolute inset-0 opacity-90 -z-10"
style={{
background:
"radial-gradient(1200px 600px at 10% -10%, rgba(32,165,236,.35), transparent 60%), radial-gradient(1000px 500px at 90% -10%, rgba(168,85,247,.30), transparent 60%)",
}}
/>
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
{/* верхняя строка статуса */}
<div className="flex items-center justify-between py-6">
<div className="flex items-center gap-3 text-sm text-emerald-300/90">
<span className="size-2 rounded-full bg-emerald-400" />
<span className="hidden sm:block">Connected to:</span>
<button className="font-semibold underline-offset-2 hover:underline text-emerald-200">
Michael Chen
</button>
<span className="text-emerald-300/70 hidden md:inline">
• 2847 Pine Street, Seattle, WA 98101
</span>
</div>
<button
aria-label="Toggle theme"
className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
>
<Sun className="size-5" />
</button>
</div>

{/* титул + CTA чат */}
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-8">
<div className="flex items-center gap-3">
<div className="relative">
<div className="absolute inset-0 blur-2xl bg-cyan-500/30 rounded-full" />
<div className="relative size-12 rounded-full bg-gradient-to-b from-cyan-400/40 to-purple-500/40 border border-white/20" />
</div>
<div>
<h1 className="text-4xl md:text-5xl font-semibold leading-tight">
<span className="text-cyan-300">Seattle</span>{" "}
<span className="text-white">ADU</span>
</h1>
<p className="text-slate-300/90 mt-1">
Premium Accessory Dwelling Units
</p>
</div>
</div>

<div className="text-right">
<div className="text-slate-200/90">
Transform Your Property Today
</div>
<div className="text-slate-400 text-sm">
Seattle&apos;s #1 ADU Builder | 200+ Happy Clients
</div>
<div className="mt-3 flex items-center justify-end gap-3">
<div className="hidden md:block text-right">
<div className="text-sm text-slate-300/90">Ask DANIEL</div>
<div className="text-xs text-slate-400">
Your Project Manager
</div>
</div>
<button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.7)]">
<MessageCircle className="size-4" /> Start Chat
</button>
</div>
</div>
</div>

{/* Плашки коллекций (визуал блока из макета) */}
<div className="pb-10">
<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
{collections.map((c, i) => (
<button
key={c.name}
onClick={() => handleCollectionClick(c.id)}
className={`relative rounded-2xl p-5 text-left backdrop-blur-md border transition-colors ${
selectedCollection === c.id || (selectedCollection === null && i === 0)
? "bg-white/10 border-white/20"
: "bg-white/5 border-white/10 hover:bg-white/10"
}`}
>
<div className="text-[10px] tracking-widest text-slate-300/80 mb-2">
{c.code}
</div>
<div className="text-lg font-semibold tracking-wide">
{c.name}
</div>
<div className="mt-3 text-[11px] text-slate-300/80">
MODELS{" "}
<span className="ml-1 inline-block rounded-md bg-white/10 px-2 py-0.5">
{c.count.toString().padStart(2, "0")}
</span>
</div>
<div className="absolute inset-0 -z-10 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),_0_20px_60px_-20px_rgba(59,130,246,0.35)]" />
</button>
))}
</div>
</div>
</div>
</section>

{/* БАР ФИЛЬТРОВ (узкая панель как в макете) */}
<section className="px-4 sm:px-6 lg:px-8">
<div className="max-w-7xl mx-auto">
<div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4 flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="size-9 rounded-xl bg-cyan-400/15 grid place-content-center">
<Search className="size-5 text-cyan-300" />
</div>
<div>
<div className="font-medium">Skyline Collection Filters</div>
<div className="text-sm text-slate-300/80">
Customize your ADU search preferences
</div>
</div>
</div>
<button className="text-slate-300 hover:text-white">
<ChevronDown className="size-5" />
</button>
</div>
</div>
</section>

{/* СЕКЦИЯ КАТЕГОРИЙ (твой динамический компонент) */}
<section className="py-12">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="text-center mb-8">
<h2 className="text-3xl font-bold">Showing models</h2>
<p className="text-lg text-slate-300/80">
Pick a collection to explore plans & 360 tours
</p>
</div>

{selectedCollection === "premium" ? (
<PremiumHousesListWrapper />
) : selectedCollection === "skyline" ? (
<SkylineHousesListWrapper />
) : selectedCollection === "neo" ? (
<NeoHousesListWrapper />
) : selectedCollection === "saved" ? (
<div className="text-center py-12">
<p className="text-slate-400 text-lg">No saved models yet</p>
</div>
) : (
<div className="text-center py-12">
<p className="text-slate-400 text-lg">Select a collection to view models</p>
</div>
)}
</div>
</section>

        <Footer />
        </div>
      </div>
    </AuthGuard>
  );
}