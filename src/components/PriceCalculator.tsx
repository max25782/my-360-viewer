import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Calculator, TrendingUp, Percent, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface PriceBreakdown {
  basePrice: number;
  floorPlanAdjustment: number;
  exteriorOptionsTotal: number;
  interiorDesignAdjustment: number;
  upgradesTotal: number;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  permitFees: number;
  deliveryFee: number;
  installationFee: number;
  totalPrice: number;
}

interface PriceCalculatorProps {
  priceBreakdown: PriceBreakdown;
  collectionColors: {
    border: string;
    gradient: string;
    accent: string;
    bg: string;
  };
  className?: string;
}

export function PriceCalculator({ priceBreakdown, collectionColors, className = '' }: PriceCalculatorProps) {
  const {
    basePrice,
    floorPlanAdjustment,
    exteriorOptionsTotal,
    interiorDesignAdjustment,
    upgradesTotal,
    subtotal,
    taxRate,
    taxAmount,
    permitFees,
    deliveryFee,
    installationFee,
    totalPrice
  } = priceBreakdown;

  const savings = Math.max(0, (basePrice * 0.1) - upgradesTotal);
  const hasDiscount = savings > 0;

  const LineItem = ({ 
    label, 
    amount, 
    isPositive = false, 
    isSubtotal = false, 
    isFinal = false,
    description 
  }: {
    label: string;
    amount: number;
    isPositive?: boolean;
    isSubtotal?: boolean;
    isFinal?: boolean;
    description?: string;
  }) => (
    <div className={`flex justify-between items-center py-2 ${
      isSubtotal || isFinal ? 'border-t border-slate-600/30 pt-3 mt-2' : ''
    }`}>
      <div>
        <span className={`${
          isFinal ? 'text-white font-bold text-lg' : 
          isSubtotal ? 'text-white font-semibold' : 
          'text-slate-300'
        }`}>
          {label}
        </span>
        {description && (
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        )}
      </div>
      <span className={`font-semibold ${
        isFinal ? `${collectionColors.accent} text-xl` :
        isSubtotal ? 'text-white text-lg' :
        isPositive ? 'text-green-400' :
        amount === 0 ? 'text-slate-400' :
        'text-white'
      }`}>
        {amount === 0 ? 'Included' : 
         amount > 0 ? `+$${amount.toLocaleString()}` : 
         `-$${Math.abs(amount).toLocaleString()}`}
      </span>
    </div>
  );

  return (
    <Card 
      className={`p-6 ${className}`}
      style={{
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(17, 25, 39, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
        backdropFilter: 'blur(40px)',
        border: `1px solid ${collectionColors.border}30`,
        boxShadow: `0 0 40px -10px ${collectionColors.border}20`
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl ${collectionColors.bg} flex items-center justify-center`}>
          <Calculator className={`w-5 h-5 ${collectionColors.accent}`} />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">Price Breakdown</h3>
          <p className="text-slate-400 text-sm">Detailed cost analysis</p>
        </div>
      </div>

      <div className="space-y-1">
        {/* Base Price */}
        <LineItem 
          label="Base Model" 
          amount={0}
          description={`Starting at $${basePrice.toLocaleString()}`}
        />

        {/* Floor Plan Adjustment */}
        {floorPlanAdjustment !== 0 && (
          <LineItem 
            label="Floor Plan Upgrade" 
            amount={floorPlanAdjustment}
            description="Enhanced layout configuration"
          />
        )}

        {/* Exterior Options */}
        {exteriorOptionsTotal > 0 && (
          <LineItem 
            label="Exterior Upgrades" 
            amount={exteriorOptionsTotal}
            description="Premium materials and finishes"
          />
        )}

        {/* Interior Design */}
        {interiorDesignAdjustment !== 0 && (
          <LineItem 
            label="Interior Design Package" 
            amount={interiorDesignAdjustment}
            description="Professional interior styling"
          />
        )}

        {/* Upgrades */}
        {upgradesTotal > 0 && (
          <LineItem 
            label="Technology & Upgrades" 
            amount={upgradesTotal}
            description="Smart home and premium features"
          />
        )}

        {/* Subtotal */}
        <LineItem 
          label="Subtotal" 
          amount={0}
          isSubtotal={true}
          description={`$${subtotal.toLocaleString()}`}
        />

        {/* Discount/Savings */}
        {hasDiscount && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/10 border border-green-400/30 rounded-lg p-3 my-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-semibold">Package Savings</span>
              </div>
              <span className="text-green-400 font-bold">-${savings.toLocaleString()}</span>
            </div>
            <p className="text-xs text-green-300 mt-1">
              Multi-upgrade discount applied
            </p>
          </motion.div>
        )}

        {/* Tax */}
        <LineItem 
          label={`Sales Tax (${(taxRate * 100).toFixed(1)}%)`}
          amount={taxAmount}
          description="Local tax rate applied"
        />

        {/* Additional Fees */}
        <div className="space-y-1 mt-4">
          <p className="text-slate-400 text-sm font-medium mb-2">Additional Services</p>
          
          <LineItem 
            label="Permit Support" 
            amount={permitFees}
            description="Full permit assistance included"
          />
          
          <LineItem 
            label="Delivery & Crane" 
            amount={deliveryFee}
            description="Professional delivery service"
          />
          
          <LineItem 
            label="Installation & Setup" 
            amount={installationFee}
            description="Complete installation service"
          />
        </div>

        <Separator className="my-4" />

        {/* Final Total */}
        <LineItem 
          label="Total Investment" 
          amount={0}
          isFinal={true}
          description={`$${totalPrice.toLocaleString()}`}
        />

        {/* Financing Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 p-4 bg-slate-800/30 rounded-lg border border-slate-600/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-semibold text-sm">Financing Available</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Est. Monthly Payment</p>
              <p className="text-white font-semibold">
                ${Math.round((totalPrice * 0.045) / 12).toLocaleString()}/mo
              </p>
              <p className="text-xs text-slate-500">4.5% APR, 15 years</p>
            </div>
            <div>
              <p className="text-slate-400">Down Payment (20%)</p>
              <p className="text-white font-semibold">
                ${Math.round(totalPrice * 0.2).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">Flexible options</p>
            </div>
          </div>
        </motion.div>

        {/* ROI Estimate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-3 p-4 bg-green-500/10 rounded-lg border border-green-400/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-semibold text-sm">Investment Return</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-green-300">Property Value Increase</p>
              <p className="text-white font-semibold">
                +${Math.round(totalPrice * 1.2).toLocaleString()}
              </p>
              <p className="text-xs text-green-400">Est. 20% value add</p>
            </div>
            <div>
              <p className="text-green-300">Rental Income Potential</p>
              <p className="text-white font-semibold">
                ${Math.round(totalPrice * 0.006).toLocaleString()}/mo
              </p>
              <p className="text-xs text-green-400">Market rate estimate</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Card>
  );
}