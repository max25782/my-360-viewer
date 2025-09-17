'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Send, 
  Bot, 
  User, 
  Star,
  Sparkles,
  ArrowRight,
  Plus,
  ImageIcon,
  Settings,
  Eye,
  Zap,
  Lightbulb,
  Home,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  Camera,
  DollarSign
} from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/ui/avatar';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';
import { ModelData } from '../../data/realModelsData';
import { useDrag, useDrop } from 'react-dnd';
import { toast } from 'sonner';
import { ChatOffersDisplay } from '../coupon/ChatOffersDisplay';
import { CouponCard } from '../coupon/CouponCard';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'daniel';
  timestamp: Date;
  type?: 'text' | 'model' | 'system' | 'offers' | 'coupon';
  modelData?: ModelData;
  couponData?: {
    offer: any;
    couponCode: string;
  };
}

interface ChatPageProps {
  models: ModelData[];
  onBack: () => void;
  onModelSelect?: (modelId: string) => void;
  onStartConfiguration?: (modelId: string) => void;
  isDark?: boolean;
  initialMessage?: string | null;
}

// Pre-defined responses from Daniel
const DANIEL_RESPONSES = [
  "Hi! I'm Daniel Rodriguez, your dedicated project manager at Seattle ADU. I'm here to help you find the perfect ADU solution for your property.",
  "Great choice! This model is very popular among our clients. Would you like me to schedule a site visit to discuss the specifics?",
  "I can help you with permitting, financing options, and construction timeline. What aspect interests you most?",
  "Based on your preferences, I'd recommend looking at our Skyline collection. Let me show you some options that might work well for your property.",
  "Absolutely! I can connect you with our financing partners who specialize in ADU projects. The typical approval process takes 2-3 weeks.",
  "The construction timeline for this model is typically 12-16 weeks from permit approval. I'll keep you updated every step of the way.",
  "I'd be happy to schedule a call to discuss your project in detail. When would be a good time for you?",
  "Let me pull up some similar projects we've completed in your area. I think you'll find them inspiring!",
];

const ModelCard: React.FC<{ model: ModelData; onSelect: () => void; isDark?: boolean }> = ({ 
  model, 
  onSelect,
  isDark 
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'model',
    item: { model },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <motion.div
      ref={drag as any}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`cursor-pointer ${isDragging ? 'opacity-50' : ''}`}
      onClick={onSelect}
    >
      <Card className={`p-3 ${
        isDark ? 'bg-slate-800/60 border-slate-600/30' : 'bg-white/60 border-slate-300/30'
      } backdrop-blur-lg transition-all duration-300 hover:shadow-lg`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden">
            <img 
              src={model.gallery?.[0] || model.heroImage || '/placeholder-model.jpg'} 
              alt={model.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h4 className={`text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {model.name}
            </h4>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {model.bedrooms} bed • {model.bathrooms} bath • {model.sqft} sq ft
            </p>
            <p className={`text-xs ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              {model.priceRange}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export const ChatPage: React.FC<ChatPageProps> = ({
  models,
  onBack,
  onModelSelect,
  onStartConfiguration,
  isDark = true,
  initialMessage
}) => {
  // Load chat history from localStorage
  const loadChatHistory = (): ChatMessage[] => {
    try {
      const saved = localStorage.getItem('daniel-chat-history');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
    
    // Default welcome message if no history
    return [
      {
        id: '1',
        content: "Hi! I'm Daniel Rodriguez, your dedicated project manager at Seattle ADU. I'm here to help you find the perfect ADU solution for your property. How can I assist you today? 👋",
        sender: 'daniel',
        timestamp: new Date(),
        type: 'text'
      }
    ];
  };

  const [messages, setMessages] = useState<ChatMessage[]>(loadChatHistory());
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModels, setSelectedModels] = useState<ModelData[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save chat history whenever messages change
  const saveChatHistory = (newMessages: ChatMessage[]) => {
    try {
      localStorage.setItem('daniel-chat-history', JSON.stringify(newMessages));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  // Enhanced setMessages that also saves to localStorage
  const updateMessages = (updater: ((prev: ChatMessage[]) => ChatMessage[]) | ChatMessage[]) => {
    setMessages(prev => {
      const newMessages = typeof updater === 'function' ? updater(prev) : updater;
      saveChatHistory(newMessages);
      return newMessages;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add initial message if provided
  useEffect(() => {
    if (initialMessage && typeof initialMessage === 'string' && initialMessage.trim()) {
      const userMessage: ChatMessage = {
        id: 'initial-' + Date.now().toString(),
        content: initialMessage,
        sender: 'user',
        timestamp: new Date(),
        type: 'text'
      };
      
      updateMessages(prev => [...prev, userMessage]);
      
      // Daniel's response to the offer claim
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const response: ChatMessage = {
            id: 'initial-response-' + Date.now().toString(),
            content: "Great! I've received your offer request. This is an excellent opportunity - I'll personally make sure you get the best value from this promotion. Let me pull up the details and we can discuss how to move forward. Would you like to schedule a quick call to finalize everything?",
            sender: 'daniel',
            timestamp: new Date(),
            type: 'text'
          };
          updateMessages(prev => [...prev, response]);
        }, 1500);
      }, 800);
    }
  }, [initialMessage]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'model',
    drop: (item: { model: ModelData }) => {
      handleModelDrop(item.model);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleModelDrop = (model: ModelData) => {
    if (!selectedModels.find(m => m.id === model.id)) {
      setSelectedModels(prev => [...prev, model]);
      
      // Add model to chat
      const modelMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `I'd like to know more about the ${model.name}`,
        sender: 'user',
        timestamp: new Date(),
        type: 'model',
        modelData: model
      };
      
      updateMessages(prev => [...prev, modelMessage]);
      
      // Daniel's response
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const response: ChatMessage = {
            id: (Date.now() + 1).toString(),
            content: `Excellent choice! The ${model.name} is one of our most popular models. It features ${model.bedrooms} bedroom${model.bedrooms > 1 ? 's' : ''}, ${model.bathrooms} bathroom${model.bathrooms > 1 ? 's' : ''}, and ${model.sqft} square feet of living space. Would you like me to schedule a consultation to discuss how this model would work on your property?`,
            sender: 'daniel',
            timestamp: new Date(),
            type: 'text'
          };
          updateMessages(prev => [...prev, response]);
        }, 1500);
      }, 500);
      
      toast.success(`Added ${model.name} to conversation`);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    updateMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate Daniel's response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: DANIEL_RESPONSES[Math.floor(Math.random() * DANIEL_RESPONSES.length)],
        sender: 'daniel',
        timestamp: new Date(),
        type: 'text'
      };
      updateMessages(prev => [...prev, response]);
    }, 1000 + Math.random() * 2000);
  };

  const handleClaimOffer = (offerData: any) => {
    // Handle different data types properly
    let parsedOffer;
    let couponCode;
    let contactMessage = '';
    
    if (typeof offerData === 'string') {
      // Extract offer info from the formatted message string
      const lines = offerData.split('\n');
      const titleLine = lines.find(line => line.includes('Hi Daniel! I want to claim the'));
      const title = titleLine ? titleLine.match(/"([^"]+)"/)?.[1] || 'Special Offer' : 'Special Offer';
      
      // Generate coupon code based on title
      couponCode = `ADU${title.replace(/[^A-Z0-9]/g, '').substring(0, 10)}${new Date().getFullYear()}`;
      contactMessage = offerData;
      
      // Create a simple offer object for fallback
      parsedOffer = {
        id: 'parsed-offer',
        title: title || 'Special Offer',
        description: 'Exclusive Seattle ADU offer',
        value: '$15K+',
        originalPrice: 'Limited Time',
        color: 'emerald',
        badge: 'Exclusive Deal',
        features: ['Professional consultation', 'Priority scheduling', 'Best available pricing'],
        terms: 'Subject to qualification and availability',
        expiryDate: 'December 31, 2025'
      };
    } else if (offerData.contactMessage) {
      // From CouponCard - has both offer data and contact message
      parsedOffer = offerData.offer;
      couponCode = offerData.couponCode;
      contactMessage = offerData.contactMessage;
    } else {
      // From ChatOffersDisplay - has offer and couponCode
      parsedOffer = offerData.offer || offerData;
      couponCode = offerData.couponCode || `ADU${parsedOffer.id.toUpperCase().replace(/-/g, '')}${new Date().getFullYear()}`;
      contactMessage = `I want to claim the "${parsedOffer.title}" offer`;
    }

    // Add user's claim request as a text message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: contactMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    updateMessages(prev => [...prev, userMessage]);

    // Daniel's response with the actual coupon
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      // First, Daniel's text response
      const textResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "🔥 FANTASTIC! I've received your coupon activation request and I'm processing it right now! Here's your official Seattle ADU coupon:",
        sender: 'daniel',
        timestamp: new Date(),
        type: 'text'
      };

      // Then, the coupon itself
      const couponMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        content: "Your Exclusive Seattle ADU Coupon",
        sender: 'daniel',
        timestamp: new Date(),
        type: 'coupon',
        couponData: {
          offer: parsedOffer,
          couponCode: couponCode
        }
      };

      // Finally, follow-up message
      const followUpMessage: ChatMessage = {
        id: (Date.now() + 3).toString(),
        content: "🎯 This coupon has been generated specifically for YOU and is valid until December 31, 2025. I'll personally ensure you get the maximum value from this exclusive offer. Ready to schedule that priority consultation call? What's the best phone number to reach you at?",
        sender: 'daniel',
        timestamp: new Date(),
        type: 'text'
      };

      updateMessages(prev => [...prev, textResponse, couponMessage, followUpMessage]);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      'schedule-call': "I'd like to schedule a call to discuss my ADU project",
      'site-visit': "Can we arrange a site visit to assess my property?",
      'financing': "What financing options are available for ADU projects?",
      'timeline': "What's the typical timeline for an ADU project?",
      'permits': "Can you help me understand the permitting process?",
      'models': "Can you show me some model recommendations?",
      'offers': "What special offers do you have available right now?"
    };

    if (actionMessages[action as keyof typeof actionMessages]) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: actionMessages[action as keyof typeof actionMessages],
        sender: 'user',
        timestamp: new Date(),
        type: 'text'
      };
      updateMessages(prev => [...prev, userMessage]);

      // Daniel's specific responses
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        
        if (action === 'offers') {
          // For offers, add a special offers message instead of text
          const offersMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            content: "Here are our current exclusive offers available for Seattle ADU projects:",
            sender: 'daniel',
            timestamp: new Date(),
            type: 'offers'
          };
          updateMessages(prev => [...prev, offersMessage]);
          return;
        }

        let response = '';
        
        switch (action) {
          case 'schedule-call':
            response = "🔥 YES! I'm excited to speak with you personally! Let me get you on my priority schedule. What's the best phone number to reach you at? And what times work best for you this week - morning (9-11 AM), afternoon (1-3 PM), or evening (5-7 PM)? I guarantee we'll have your ADU project mapped out within our first conversation!";
            break;
          case 'site-visit':
            response = "⚡ PERFECT! Site visits are game-changers - seeing your property in person allows me to maximize your ADU's potential and value. I can visit your property this week to assess placement options, discuss setbacks, and show you exactly how we'll transform your space. What day and time works best for you? Morning or afternoon?";
            break;
          case 'financing':
            response = "💰 EXCELLENT question! We have exclusive partnerships with ADU-specialized lenders offering rates as low as 6.2%. Options include: Construction-to-Perm loans, HELOC, Cash-out refinance, and our NEW Zero-Down program! I can connect you with pre-qualified lenders TODAY. What's your property's estimated value so I can get you the best rates?";
            break;
          case 'timeline':
            response = "🚀 I LOVE this question because it means you're ready to move forward! Here's our FAST-TRACK timeline: Design & Permits (4-6 weeks - I expedite everything), Foundation & Framing (3-4 weeks), Systems & Finishes (6-8 weeks), Final Inspections (1 week). Total: 14-19 weeks from permit approval. Want to start the design phase THIS WEEK?";
            break;
          case 'permits':
            response = "🎯 YES! Permitting is my specialty - I handle EVERYTHING so you don't have to stress! This includes: Architectural drawings, structural engineering, utility coordination, city submissions, and inspector relationships. I have a 99% approval rate and fast-track most permits in 4-6 weeks. Ready to start the permit process?";
            break;
          case 'models':
            response = "🏠 FANTASTIC! I'd love to show you the perfect options for your property! You can drag any model from the sidebar into our chat, OR tell me: What's your lot size? How do you plan to use the ADU? (rental income, family member, office?) And what's your target monthly rental income? This way I can recommend the MOST PROFITABLE models for you!";
            break;
          default:
            response = DANIEL_RESPONSES[Math.floor(Math.random() * DANIEL_RESPONSES.length)];
        }

        const danielResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: response,
          sender: 'daniel',
          timestamp: new Date(),
          type: 'text'
        };
        updateMessages(prev => [...prev, danielResponse]);
      }, 1500);
    }
  };

  return (
    <div 
      className="h-screen flex"
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, #0B0F14 0%, #1E293B 50%, #334155 100%)'
          : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #CBD5E1 100%)'
      }}
    >
      {/* Models Sidebar */}
      <div className={`w-80 ${isDark ? 'bg-slate-900/50' : 'bg-white/50'} backdrop-blur-xl border-r ${isDark ? 'border-slate-700/50' : 'border-slate-300/50'}`}>
        <div className="p-6">
          <h3 className={`text-lg mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            🏠 Available Models
          </h3>
          <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Drag models into the chat to discuss them with Daniel
          </p>
          
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-3">
              {models.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  onSelect={() => handleModelDrop(model)}
                  isDark={isDark}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col" ref={drop as any}>
        {/* Header */}
        <div className={`p-6 ${isDark ? 'bg-slate-800/30' : 'bg-white/30'} backdrop-blur-xl border-b ${isDark ? 'border-slate-700/50' : 'border-slate-300/50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800'}`}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white">
                      DR
                    </div>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
                    <div className="w-full h-full bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>
                
                <div>
                  <h2 className={`text-xl ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Daniel Rodriguez
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    🎯 Project Manager • Online now
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('schedule-call')}
                className={`${isDark ? 'border-slate-600 text-slate-300' : 'border-slate-300 text-slate-600'}`}
              >
                <Phone className="w-4 h-4 mr-2" />
                Schedule Call
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('site-visit')}
                className={`${isDark ? 'border-slate-600 text-slate-300' : 'border-slate-300 text-slate-600'}`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Site Visit
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`p-4 ${isDark ? 'bg-slate-800/20' : 'bg-white/20'} border-b ${isDark ? 'border-slate-700/50' : 'border-slate-300/50'}`}>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'financing', label: '💰 Financing Options', icon: DollarSign },
              { id: 'timeline', label: '⏰ Project Timeline', icon: Clock },
              { id: 'permits', label: '📋 Permits & Process', icon: FileText },
              { id: 'models', label: '🏠 Model Recommendations', icon: Home },
              { id: 'offers', label: '🎁 Special Offers', icon: Zap },
            ].map((action) => (
              <Button
                key={action.id}
                variant="ghost"
                size="sm"
                onClick={() => handleQuickAction(action.id)}
                className={`${isDark ? 'hover:bg-slate-700/50 text-slate-300' : 'hover:bg-slate-100/50 text-slate-600'} transition-all duration-200`}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 ${message.type === 'offers' || message.type === 'coupon' ? 'max-w-[95%]' : 'max-w-[85%]'} ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
                    {message.sender === 'daniel' ? (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-xs font-medium">
                        DR
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`${(message.type === 'offers' || message.type === 'coupon') ? 'p-0 bg-transparent shadow-none' : `rounded-2xl p-4 shadow-lg ${
                      message.sender === 'user'
                        ? isDark 
                          ? 'bg-blue-600/90 text-white' 
                          : 'bg-blue-500 text-white'
                        : isDark
                          ? 'bg-slate-700/90 text-slate-100 border border-slate-600/50'
                          : 'bg-white text-slate-800 border border-slate-200/50'
                    }`} backdrop-blur-sm`}>
                      {message.type === 'offers' ? (
                        <div>
                          <p className={`text-sm leading-relaxed break-words mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {message.content}
                          </p>
                          <ChatOffersDisplay 
                            isDark={isDark}
                            onClaimOffer={handleClaimOffer}
                          />
                        </div>
                      ) : message.type === 'coupon' && message.couponData ? (
                        <div>
                          <p className={`text-sm leading-relaxed break-words mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {message.content}
                          </p>
                          <CouponCard 
                            offer={message.couponData.offer}
                            couponCode={message.couponData.couponCode}
                            isDark={isDark}
                            onContactDaniel={(data) => {
                              // Handle the data properly - check if it's an object with contactMessage
                              let messageContent = '';
                              if (typeof data === 'string') {
                                messageContent = data;
                              } else if (data.contactMessage) {
                                messageContent = data.contactMessage;
                              } else {
                                messageContent = 'I want to activate this coupon and schedule a consultation.';
                              }

                              const userMessage: ChatMessage = {
                                id: Date.now().toString(),
                                content: messageContent,
                                sender: 'user',
                                timestamp: new Date(),
                                type: 'text'
                              };
                              updateMessages(prev => [...prev, userMessage]);
                              
                              // Daniel's enthusiastic response
                              setIsTyping(true);
                              setTimeout(() => {
                                setIsTyping(false);
                                const response: ChatMessage = {
                                  id: (Date.now() + 1).toString(),
                                  content: "🔥 FANTASTIC! You're taking action - I love it! Let me get your contact details so we can fast-track your project. I'll personally ensure you get the maximum value from this exclusive coupon. What's the best phone number to reach you at? And what times work best for you this week - morning, afternoon, or evening?",
                                  sender: 'daniel',
                                  timestamp: new Date(),
                                  type: 'text'
                                };
                                updateMessages(prev => [...prev, response]);
                              }, 1500);
                            }}
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm leading-relaxed break-words">{message.content}</p>
                          
                          {message.type === 'model' && message.modelData && (
                            <div className="mt-3 p-3 rounded-xl bg-black/10 backdrop-blur-sm border border-white/10">
                              <div className="flex flex-col sm:flex-row items-start gap-3">
                                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                  <img 
                                    src={message.modelData.gallery?.[0] || message.modelData.heroImage || '/placeholder-model.jpg'} 
                                    alt={message.modelData.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-white font-medium text-sm mb-1">
                                    {message.modelData.name}
                                  </h4>
                                  <div className="flex flex-wrap gap-2 text-xs text-white/80">
                                    <span>{message.modelData.bedrooms} bed</span>
                                    <span>•</span>
                                    <span>{message.modelData.bathrooms} bath</span>
                                    <span>•</span>
                                    <span>{message.modelData.sqft} sq ft</span>
                                  </div>
                                  <div className="mt-2 flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => onModelSelect?.(message.modelData!.id)}
                                      className="text-xs h-7 border-white/20 text-white hover:bg-white/10"
                                    >
                                      <Eye className="w-3 h-3 mr-1" />
                                      View Details
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => onStartConfiguration?.(message.modelData!.id)}
                                      className="text-xs h-7 bg-cyan-500 hover:bg-cyan-400 text-white"
                                    >
                                      <Settings className="w-3 h-3 mr-1" />
                                      Configure
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    <div className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-right' : 'text-left'
                    } ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-3 max-w-[85%]">
                    <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
                      <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-xs font-medium">
                        DR
                      </div>
                    </Avatar>
                    
                    <div className={`rounded-2xl p-4 shadow-lg ${
                      isDark
                        ? 'bg-slate-700/90 text-slate-100 border border-slate-600/50'
                        : 'bg-white text-slate-800 border border-slate-200/50'
                    } backdrop-blur-sm`}>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs ml-2 text-emerald-500">Daniel is typing...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className={`p-6 ${isDark ? 'bg-slate-800/30' : 'bg-white/30'} backdrop-blur-xl border-t ${isDark ? 'border-slate-700/50' : 'border-slate-300/50'}`}>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message to Daniel..."
                className={`pr-12 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400' 
                    : 'bg-white/50 border-slate-300/50 text-slate-900 placeholder-slate-500'
                } backdrop-blur-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {isOver && (
            <div className={`mt-3 p-3 rounded-lg border-2 border-dashed ${
              isDark ? 'border-cyan-400/50 bg-cyan-500/10' : 'border-cyan-500/50 bg-cyan-50'
            } text-center`}>
              <p className={`text-sm ${isDark ? 'text-cyan-300' : 'text-cyan-600'}`}>
                Drop a model here to discuss it with Daniel
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};