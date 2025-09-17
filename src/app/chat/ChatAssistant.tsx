'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Heart, 
  HeartHandshake,
  ThumbsUp,
  Star,
  Sparkles,
  ArrowRight,
  GripVertical,
  Plus,
  ImageIcon,
  Settings,
  Eye,
  Zap,
  Lightbulb
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

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachedModels?: ModelData[];
}

interface LikedModel {
  modelId: string;
  timestamp: Date;
  reason?: string;
}

interface ChatAssistantProps {
  models: ModelData[];
  onModelSelect: (modelId: string) => void;
  onStartConfiguration: (modelId: string) => void;
  onContactProjectManager?: () => void;
}

const DraggableModelCard: React.FC<{
  model: ModelData;
  onDrop: (model: ModelData) => void;
  isLiked: boolean;
  onToggleLike: (modelId: string) => void;
}> = ({ model, onDrop, isLiked, onToggleLike }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'model',
    item: { model },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        onDrop(item.model);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <motion.div
      ref={drag as any}
      className={`relative cursor-grab active:cursor-grabbing transition-all duration-300 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'
      }`}
      style={{
        transform: isDragging ? 'rotate(5deg)' : 'rotate(0deg)'
      }}
    >
      <Card 
        className="overflow-hidden group"
        style={{
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(6, 182, 212, 0.2)'
        }}
      >
        {/* Drag indicator */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <GripVertical className="w-4 h-4 text-cyan-400" />
        </div>

        {/* Like button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 left-2 z-10 p-1 h-auto"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(model.id);
          }}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isLiked ? 'text-red-500 fill-current' : 'text-slate-400 hover:text-red-400'
            }`} 
          />
        </Button>

        {/* Model image */}
        <div className="relative h-24">
          <img 
            src={model.heroImage}
            alt={model.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Quick stats */}
          <div className="absolute bottom-1 left-1 flex gap-1">
            <Badge className="bg-slate-900/80 text-cyan-300 border-cyan-400/50 text-xs">
              {model.area}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <h4 className="text-white font-medium text-sm mb-1">{model.name}</h4>
          <p className="text-slate-400 text-xs mb-2">
            {model.bedrooms}BR / {model.bathrooms}BA
          </p>
          <div className="text-cyan-400 font-bold text-sm">
            ${model.basePrice.toLocaleString()}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const ChatDropZone: React.FC<{
  onDrop: (model: ModelData) => void;
  children: React.ReactNode;
}> = ({ onDrop, children }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'model',
    drop: (item: { model: ModelData }) => {
      onDrop(item.model);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div 
      ref={drop as any}
      className={`transition-all duration-300 ${
        isOver ? 'bg-cyan-500/10 border-cyan-400/50' : ''
      }`}
      style={{
        borderRadius: '8px',
        border: isOver ? '2px dashed rgba(6, 182, 212, 0.5)' : '2px dashed transparent'
      }}
    >
      {children}
    </div>
  );
};

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  models,
  onModelSelect,
  onStartConfiguration,
  onContactProjectManager
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your ADU design assistant. I can help you find the perfect model for your needs. Try dragging a model here to get started, or ask me anything about our collection!",
      timestamp: new Date(),
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [likedModels, setLikedModels] = useState<LikedModel[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Load liked models from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem('adu-liked-models');
    if (savedLikes) {
      setLikedModels(JSON.parse(savedLikes));
    }
  }, []);

  // Save liked models to localStorage
  useEffect(() => {
    localStorage.setItem('adu-liked-models', JSON.stringify(likedModels));
  }, [likedModels]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Great question! Let me help you find the perfect ADU model. Based on your needs, I'd recommend looking at our Skyline collection.",
        "I can see you're interested in maximizing space efficiency. Our models are designed with smart layouts that make every square foot count.",
        "For your budget and requirements, I'd suggest checking out the Walnut or Oak models. Both offer excellent value and modern design.",
        "That's a great choice! This model features energy-efficient design and premium finishes. Would you like me to show you similar options?",
        "I can help you compare different models. What's most important to you - size, budget, or specific features like office space?"
      ];

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleModelDrop = (model: ModelData) => {
    const assistantMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `Great choice! The ${model.name} is one of our popular models. Here's what makes it special:\n\n• ${model.area} of thoughtfully designed space\n• ${model.bedrooms} bedroom${model.bedrooms > 1 ? 's' : ''} and ${model.bathrooms} bathroom${model.bathrooms > 1 ? 's' : ''}\n• Starting at $${model.basePrice.toLocaleString()}\n• ${model.features.slice(0, 2).join('\n• ')}\n\nWould you like to see similar models or configure this one?`,
      timestamp: new Date(),
      attachedModels: [model]
    };

    setMessages(prev => [...prev, assistantMessage]);
    toast.success(`Added ${model.name} to chat`);
  };

  const toggleLike = (modelId: string) => {
    const isCurrentlyLiked = likedModels.some(like => like.modelId === modelId);
    
    if (isCurrentlyLiked) {
      setLikedModels(prev => prev.filter(like => like.modelId !== modelId));
      toast.success('Removed from favorites');
    } else {
      const newLike: LikedModel = {
        modelId,
        timestamp: new Date(),
        reason: 'User favorited'
      };
      setLikedModels(prev => [...prev, newLike]);
      toast.success('Added to favorites ❤️');
    }
  };

  const getSimilarModels = (model: ModelData) => {
    return models
      .filter(m => m.id !== model.id)
      .filter(m => 
        Math.abs(m.basePrice - model.basePrice) < 50000 ||
        m.bedrooms === model.bedrooms ||
        m.collection === model.collection
      )
      .slice(0, 3);
  };

  const likedModelIds = likedModels.map(like => like.modelId);

  return (
      <div className="fixed bottom-6 right-6 z-[55]">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-16 right-0 mb-4"
            >
              <Card 
                className="w-96 h-[600px] flex flex-col"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)',
                  backdropFilter: 'blur(40px)',
                  border: '1px solid rgba(6, 182, 212, 0.3)'
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500">
                      <Bot className="w-4 h-4 text-white" />
                    </Avatar>
                    <div>
                      <h3 className="text-white font-medium">AI Assistant</h3>
                      <p className="text-slate-400 text-xs">ADU Design Expert</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Messages */}
                <ChatDropZone onDrop={handleModelDrop}>
                  <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                            <Avatar className={`w-6 h-6 mt-1 ${
                              message.type === 'user' 
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                                : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                            }`}>
                              {message.type === 'user' ? (
                                <User className="w-3 h-3 text-white" />
                              ) : (
                                <Bot className="w-3 h-3 text-white" />
                              )}
                            </Avatar>
                            
                            <div className={`rounded-lg p-3 ${
                              message.type === 'user'
                                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30'
                                : 'bg-slate-800/50 border border-slate-700/50'
                            }`}>
                              <p className="text-white text-sm whitespace-pre-line">
                                {message.content}
                              </p>
                              
                              {/* Attached models */}
                              {message.attachedModels && (
                                <div className="mt-3 space-y-2">
                                  {message.attachedModels.map((model) => (
                                    <div key={model.id} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                                      <div className="flex items-center gap-3">
                                        <img 
                                          src={model.heroImage}
                                          alt={model.name}
                                          className="w-12 h-12 rounded object-cover"
                                        />
                                        <div className="flex-1">
                                          <h4 className="text-white font-medium text-sm">{model.name}</h4>
                                          <p className="text-cyan-400 text-sm">${model.basePrice.toLocaleString()}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="flex gap-2 mt-3">
                                        <Button
                                          size="sm"
                                          className="flex-1 bg-slate-800/50 hover:bg-slate-700/50 text-white"
                                          onClick={() => onModelSelect(model.id)}
                                        >
                                          <Eye className="w-3 h-3 mr-1" />
                                          View
                                        </Button>
                                        <Button
                                          size="sm"
                                          className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300"
                                          onClick={() => onStartConfiguration(model.id)}
                                        >
                                          <Settings className="w-3 h-3 mr-1" />
                                          Configure
                                        </Button>
                                      </div>

                                      {/* Similar models */}
                                      {getSimilarModels(model).length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-slate-700/30">
                                          <p className="text-slate-400 text-xs mb-2 flex items-center gap-1">
                                            <Lightbulb className="w-3 h-3" />
                                            Similar models you might like:
                                          </p>
                                          <div className="flex gap-2">
                                            {getSimilarModels(model).map((similarModel) => (
                                              <div
                                                key={similarModel.id}
                                                className="text-center cursor-pointer group"
                                                onClick={() => onModelSelect(similarModel.id)}
                                              >
                                                <img 
                                                  src={similarModel.heroImage}
                                                  alt={similarModel.name}
                                                  className="w-8 h-8 rounded object-cover group-hover:scale-110 transition-transform"
                                                />
                                                <p className="text-white text-xs mt-1 group-hover:text-cyan-400">
                                                  {similarModel.name}
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <p className="text-slate-500 text-xs mt-2">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start"
                        >
                          <div className="flex gap-2">
                            <Avatar className="w-6 h-6 mt-1 bg-gradient-to-r from-cyan-500 to-blue-500">
                              <Bot className="w-3 h-3 text-white" />
                            </Avatar>
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </ChatDropZone>

                {/* Input */}
                <div className="p-4 border-t border-slate-700/50">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Ask about ADU models..."
                      className="flex-1 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <p className="text-slate-500 text-xs mt-2 text-center">
                    💡 Drag any model here to get personalized recommendations
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>



        {/* Floating model sidebar when chat is open */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="absolute bottom-16 right-[400px] mb-4"
            >
              <Card 
                className="w-64 h-[500px] p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)',
                  backdropFilter: 'blur(40px)',
                  border: '1px solid rgba(6, 182, 212, 0.3)'
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-white font-medium text-sm">Drag Models</h3>
                </div>
                
                <ScrollArea className="h-[420px]">
                  <div className="grid grid-cols-1 gap-3">
                    {models.slice(0, 6).map((model) => (
                      <DraggableModelCard
                        key={model.id}
                        model={model}
                        onDrop={handleModelDrop}
                        isLiked={likedModelIds.includes(model.id)}
                        onToggleLike={toggleLike}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};