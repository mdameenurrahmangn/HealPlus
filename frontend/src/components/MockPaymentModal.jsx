import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ShieldCheck, CheckCircle, Info, X } from 'lucide-react';
import CryptoJS from 'crypto-js';

const MockPaymentModal = ({ isOpen, onClose, amount, orderId, onPaymentComplete }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: Success
  const [formData, setFormData] = useState({
    name: '',
    card: '4242 4242 4242 4242',
    expiry: '12/26',
    cvv: '123'
  });

  const handleMockPay = async () => {
    setLoading(true);
    // Simulate payment processing time
    setTimeout(async () => {
      const mockPaymentId = `pay_${Math.random().toString(36).slice(2, 11)}`;
      
      // Generate signature correctly to match backend: shasum.update(`${orderId}|${mockPaymentId}`)
      // Note: We use a fixed synchronized secret for the mock system
      const mockSecret = "HealPlus_Mock_Secret_2024";
      const mockSignature = CryptoJS.HmacSHA256(`${orderId}|${mockPaymentId}`, mockSecret).toString(CryptoJS.enc.Hex);

      onPaymentComplete({
        mock_order_id: orderId,
        mock_payment_id: mockPaymentId,
        mock_signature: mockSignature
      });
      setStep(2);
      setLoading(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative"
        >
          {step === 1 ? (
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Secure Checkout</h3>
                  <p className="text-slate-500 font-medium">Test Payment (Mock Mode)</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-primary-50 dark:bg-primary-900/40 p-6 rounded-3xl mb-8 border-2 border-primary-500/10">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Info className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-primary-900 dark:text-primary-100">Consultation Fee</span>
                   </div>
                   <span className="text-2xl font-black text-primary-600">₹{amount}</span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Card Holder</label>
                  <input 
                    placeholder="Full Name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 transition-all dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                        defaultValue="4242 4242 4242 4242"
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 transition-all dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Expiry</label>
                    <input defaultValue="12/26" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 transition-all dark:text-white font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">CVV</label>
                    <input defaultValue="123" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 transition-all dark:text-white font-mono" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-8 mb-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                <ShieldCheck className="w-4 h-4 text-secondary-500" />
                Payments are secured and encrypted.
              </div>

              <button 
                onClick={handleMockPay}
                disabled={loading}
                className="w-full py-5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full font-bold text-xl shadow-xl hover:bg-primary-600 hover:text-white active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                    </>
                ) : `Pay ₹${amount}`}
              </button>
            </div>
          ) : (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-secondary-100 text-secondary-600 rounded-[2.5rem] flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Payment Authorized!</h3>
              <p className="text-slate-500 font-medium italic mb-8">Confirming your appointment... Please don't refresh.</p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5 }}
                    className="h-full bg-secondary-500"
                />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MockPaymentModal;
