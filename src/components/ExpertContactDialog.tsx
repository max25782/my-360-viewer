import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { 
  X, 
  MessageCircle, 
  Phone, 
  Calendar, 
  Mail, 
  User, 
  MapPin, 
  Clock,
  Sparkles,
  Send,
  Check,
  Star,
  Shield,
  Zap
} from 'lucide-react';
// Minimal model shape used in the dialog (decoupled from external types)
interface ModelData {
  id: string;
  name: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  basePrice: number;
  heroImage: string;
}

interface ExpertContactDialogProps {
  open: boolean;
  onClose: () => void;
  model?: ModelData;
  isDark: boolean;
}

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  preferredContact: 'phone' | 'email' | 'whatsapp';
  urgency: 'asap' | 'this-week' | 'this-month' | 'flexible';
  serviceType: 'consultation' | 'site-visit' | 'quote' | 'design';
}

export function ExpertContactDialog({ open, onClose, model, isDark }: ExpertContactDialogProps) {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: '',
    preferredContact: 'phone',
    urgency: 'flexible',
    serviceType: 'consultation'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitted(true);
    setIsSubmitting(false);

    // Auto close after success
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3000);
  };

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = formData.name && formData.email && formData.phone;

  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent 
          className="max-w-md p-0 border-0 bg-transparent"
          style={{ backgroundColor: 'transparent' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <Card 
              className="p-8 text-center"
              style={{
                borderRadius: '24px',
                background: isDark
                  ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
                backdropFilter: 'blur(40px)',
                border: `1px solid ${isDark ? 'rgba(6, 182, 212, 0.3)' : 'rgba(6, 182, 212, 0.2)'}`
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center"
              >
                <Check className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Message Sent Successfully!
              </h3>
              
              <p className={`mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Our ADU expert will contact you within 2 hours to discuss your {model?.name} project.
              </p>

              <div className="space-y-3">
                <div className={`flex items-center justify-center gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Clock className="w-4 h-4" />
                  <span>Response time: 2 hours or less</span>
                </div>
                <div className={`flex items-center justify-center gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Shield className="w-4 h-4" />
                  <span>Free consultation included</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl p-0 border-0 bg-transparent max-h-[90vh] overflow-hidden"
        style={{ backgroundColor: 'transparent' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Card 
            className="overflow-hidden"
            style={{
              borderRadius: '24px',
              background: isDark
                ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
              backdropFilter: 'blur(40px)',
              border: `1px solid ${isDark ? 'rgba(6, 182, 212, 0.3)' : 'rgba(6, 182, 212, 0.2)'}`
            }}
          >
            {/* Header */}
            <div 
              className="p-6 border-b"
              style={{
                borderColor: isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.15)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
                    <User className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <DialogTitle className={`text-xl ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      Connect with ADU Expert
                    </DialogTitle>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Get personalized guidance for your {model?.name} project
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800'}`}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Model Info */}
              {model && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-4 p-4 rounded-lg"
                  style={{
                    background: isDark 
                      ? 'rgba(6, 182, 212, 0.1)' 
                      : 'rgba(6, 182, 212, 0.05)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={model.heroImage} 
                      alt={model.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {model.name}
                      </h4>
                      <div className={`flex items-center gap-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <span>{model.area}</span>
                        <span>•</span>
                        <span>{model.bedrooms}BR/{model.bathrooms}BA</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          ${(model.basePrice || 0).toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Form Content */}
            <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Type Selection */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    What can we help you with?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'consultation', label: 'Free Consultation', icon: MessageCircle, desc: 'General questions' },
                      { id: 'site-visit', label: 'Site Assessment', icon: MapPin, desc: 'On-site evaluation' },
                      { id: 'quote', label: 'Detailed Quote', icon: Star, desc: 'Project pricing' },
                      { id: 'design', label: 'Custom Design', icon: Sparkles, desc: 'Tailored solutions' }
                    ].map((service) => {
                      const Icon = service.icon;
                      const isSelected = formData.serviceType === service.id;
                      
                      return (
                        <motion.div
                          key={service.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`p-4 cursor-pointer transition-all duration-200 ${
                              isSelected 
                                ? `ring-2 ${isDark ? 'ring-cyan-400/50 bg-cyan-500/10' : 'ring-cyan-500/50 bg-cyan-50'}`
                                : `hover:scale-105 ${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`
                            }`}
                            style={{
                              background: isSelected 
                                ? isDark
                                  ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)'
                                  : 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)'
                                : isDark
                                  ? 'rgba(30, 41, 59, 0.6)'
                                  : 'rgba(255, 255, 255, 0.8)',
                              border: `1px solid ${
                                isSelected 
                                  ? isDark ? 'rgba(6, 182, 212, 0.5)' : 'rgba(6, 182, 212, 0.3)'
                                  : isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.5)'
                              }`
                            }}
                            onClick={() => handleInputChange('serviceType', service.id)}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`w-5 h-5 ${
                                isSelected ? 'text-cyan-400' : isDark ? 'text-slate-300' : 'text-slate-600'
                              }`} />
                              <div>
                                <h4 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                  {service.label}
                                </h4>
                                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                  {service.desc}
                                </p>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      Full Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your full name"
                      className={`${isDark ? 'bg-slate-800/50 border-slate-600' : 'bg-white/80 border-slate-300'}`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                      className={`${isDark ? 'bg-slate-800/50 border-slate-600' : 'bg-white/80 border-slate-300'}`}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      className={`${isDark ? 'bg-slate-800/50 border-slate-600' : 'bg-white/80 border-slate-300'}`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      Project Address (Optional)
                    </label>
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Property address"
                      className={`${isDark ? 'bg-slate-800/50 border-slate-600' : 'bg-white/80 border-slate-300'}`}
                    />
                  </div>
                </div>

                {/* Urgency & Contact Preference */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      Timeline
                    </label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                      className={`w-full p-3 rounded-lg border ${
                        isDark 
                          ? 'bg-slate-800/50 border-slate-600 text-white' 
                          : 'bg-white/80 border-slate-300 text-slate-800'
                      }`}
                    >
                      <option value="flexible">Flexible timeline</option>
                      <option value="this-month">This month</option>
                      <option value="this-week">This week</option>
                      <option value="asap">ASAP</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      Preferred Contact
                    </label>
                    <select
                      value={formData.preferredContact}
                      onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                      className={`w-full p-3 rounded-lg border ${
                        isDark 
                          ? 'bg-slate-800/50 border-slate-600 text-white' 
                          : 'bg-white/80 border-slate-300 text-slate-800'
                      }`}
                    >
                      <option value="phone">Phone call</option>
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Tell us about your project
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Share any details about your ADU project, lot size, goals, or specific questions..."
                    rows={4}
                    className={`${isDark ? 'bg-slate-800/50 border-slate-600' : 'bg-white/80 border-slate-300'}`}
                  />
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg" style={{
                  background: isDark ? 'rgba(6, 182, 212, 0.05)' : 'rgba(6, 182, 212, 0.02)'
                }}>
                  <div className="text-center">
                    <Clock className={`w-6 h-6 mx-auto mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                    <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      2hr response
                    </p>
                  </div>
                  <div className="text-center">
                    <Shield className={`w-6 h-6 mx-auto mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                    <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      No obligation
                    </p>
                  </div>
                  <div className="text-center">
                    <Zap className={`w-6 h-6 mx-auto mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                    <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Free consultation
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed h-12"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Connect with Expert
                    </>
                  )}
                </Button>
              </form>
            </div>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}