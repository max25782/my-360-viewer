'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { MessageCircle, Sparkles, Hammer, Clock } from 'lucide-react';

interface ChatComingSoonProps {
  onClose: () => void;
  isDark?: boolean;
  onScheduleCall?: () => void;
  onSendEmail?: () => void;
}

export function ChatComingSoon({ onClose, isDark = true, onScheduleCall, onSendEmail }: ChatComingSoonProps) {
  return (
    <div className={`w-full h-full flex items-center justify-center ${isDark ? 'text-white' : 'text-slate-900'}`}
      style={{
        background: isDark
          ? 'radial-gradient(circle at 20% 20%, rgba(56,189,248,0.10), transparent 40%), radial-gradient(circle at 80% 30%, rgba(168,85,247,0.10), transparent 40%), radial-gradient(circle at 50% 80%, rgba(16,185,129,0.10), transparent 40%), #0b1220'
          : 'radial-gradient(circle at 20% 20%, rgba(56,189,248,0.12), transparent 40%), radial-gradient(circle at 80% 30%, rgba(168,85,247,0.12), transparent 40%), radial-gradient(circle at 50% 80%, rgba(16,185,129,0.12), transparent 40%), #f8fafc'
      }}
    >
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Card className={`relative overflow-hidden border ${isDark ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white/70 border-slate-200/70'} backdrop-blur-2xl w-[92vw] max-w-2xl`} style={{ borderRadius: 24 }}>
          {/* Decorative gradient bar */}
          <div className="absolute inset-x-0 top-0 h-1" style={{
            background: 'linear-gradient(90deg, #22d3ee 0%, #a78bfa 50%, #34d399 100%)'
          }} />

          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #22d3ee 0%, #a78bfa 100%)', boxShadow: '0 10px 30px rgba(167, 139, 250, 0.35)' }}
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Live Chat — Coming Soon</h2>
                <div className="mt-1 flex items-center gap-2">
                  <Badge className="bg-cyan-500/15 text-cyan-300 border-cyan-400/30">Preview</Badge>
                  <Badge className="bg-purple-500/15 text-purple-300 border-purple-400/30">Under Construction</Badge>
                </div>
              </div>
            </div>

            <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              We are crafting an intelligent experience where you can chat with Daniel, compare models, and instantly get tailored offers — all in one place.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-slate-50/80 border border-slate-200/80'}`}>
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span className="text-sm">Smart suggestions</span>
              </div>
              <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-slate-50/80 border border-slate-200/80'}`}>
                <Hammer className="w-4 h-4 text-cyan-300" />
                <span className="text-sm">Model configuration</span>
              </div>
              <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-slate-50/80 border border-slate-200/80'}`}>
                <Clock className="w-4 h-4 text-emerald-300" />
                <span className="text-sm">Quick responses</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => onScheduleCall ? onScheduleCall() : onClose()}
                className="w-full sm:w-auto text-white"
                style={{ background: 'linear-gradient(135deg, #22d3ee 0%, #a78bfa 100%)' }}
              >
                Notify me when ready
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Close
              </Button>
            </div>

            <div className={`mt-5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Tip: Meanwhile, you can explore models and 360° tours — the chat will seamlessly connect to your selections when it launches.
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}


