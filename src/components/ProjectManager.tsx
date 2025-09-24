import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  User, 
  MessageCircle, 
  Phone, 
  Calendar,
  Star,
  ChevronDown,
  ChevronUp,
  Video,
  Mail,
  Clock,
  CheckCircle,
  Zap,
  Users
} from 'lucide-react';

interface ProjectManagerProps {
  isDark: boolean;
  onStartChat?: () => void;
  onScheduleCall?: () => void;
  onSendEmail?: () => void;
}

export function ProjectManager({ 
  isDark, 
  onStartChat, 
  onScheduleCall, 
  onSendEmail 
}: ProjectManagerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const projectManager = {
    name: 'Daniel Rodriguez',
    title: 'Senior ADU Project Manager',
    avatar: 'DR',
    rating: 4.9,
    projectsCompleted: 127,
    responseTime: '< 2 hours',
    specialties: ['Permits & Zoning', 'Design Review', 'Budget Planning'],
    status: 'online',
    nextAvailable: 'Available now'
  };

  const handleQuickContact = (method: 'chat' | 'call' | 'email' | 'video') => {
    switch (method) {
      case 'chat':
        onStartChat?.();
        break;
      case 'call':
        onScheduleCall?.();
        break;
      case 'email':
        onSendEmail?.();
        break;
      case 'video':
        alert('Video call feature - coming soon! Daniel will be available for video consultations.');
        break;
    }
  };

  return (
    <div className="">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          className="overflow-hidden cursor-pointer"
          style={{
            borderRadius: '16px',
            background: isDark
              ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.85) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.85) 100%)',
            backdropFilter: 'blur(30px)',
            border: `1px solid ${isDark ? 'rgba(6, 182, 212, 0.3)' : 'rgba(6, 182, 212, 0.2)'}`,
            boxShadow: isDark 
              ? '0 12px 30px rgba(0, 0, 0, 0.3)'
              : '0 12px 30px rgba(0, 0, 0, 0.1)',
            width: isExpanded ? '350px' : '240px',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setIsExpanded(!isExpanded)}
        >



          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-3 pb-3">
                  {/* Full Name and Better Buttons */}
                  <div className="mt-3 mb-4">
                    <h3 className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-800'} mb-1`}>
                      {projectManager.name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-cyan-300' : 'text-cyan-600'}`}>
                      {projectManager.title}
                    </p>
                  </div>

                  {/* Expanded Action Buttons */}
                  <div className="flex gap-2 mb-4">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickContact('chat');
                      }}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 text-xs h-8"
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Chat Now
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickContact('call');
                      }}
                      className={`flex-1 text-xs h-8 ${
                        isDark
                          ? 'bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50'
                          : 'bg-white/50 border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mt-4 mb-4">
                    <div className={`text-center p-3 rounded-lg ${
                      isDark ? 'bg-slate-800/50' : 'bg-slate-50'
                    }`}>
                      <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {projectManager.projectsCompleted}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Projects Done
                      </div>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${
                      isDark ? 'bg-slate-800/50' : 'bg-slate-50'
                    }`}>
                      <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {projectManager.responseTime}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Avg Response
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Specialties:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {projectManager.specialties.map((specialty, index) => (
                        <Badge 
                          key={index}
                          className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-400/30 text-xs"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>



                  {/* Contact Options */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickContact('video');
                      }}
                      className={`text-xs ${
                        isDark
                          ? 'bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50'
                          : 'bg-white/50 border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Video className="w-3 h-3 mr-1" />
                      Video Call
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickContact('email');
                      }}
                      className={`text-xs ${
                        isDark
                          ? 'bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50'
                          : 'bg-white/50 border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-3">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Scheduling consultation with Daniel - coming soon!');
                      }}
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-400 hover:to-green-400 text-xs"
                    >
                      <Calendar className="w-3 h-3 mr-2" />
                      Schedule Free Consultation
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Floating notification bubble */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 2, duration: 0.3 }}
              className="absolute -top-3 -right-3"
            >

            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}