'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Check, X, Lock, CheckCircle2 } from 'lucide-react';

const plans = [
  {
    id: 'free_trial',
    name: 'Free Trial',
    price: '$0',
    period: '14 days',
    description: 'Get started with basic features',
    features: [
      { text: 'Up to 3 projects', included: true },
      { text: 'Residential projects only', included: true },
      { text: 'Basic dashboard', included: true },
      { text: 'Commercial projects', included: false },
      { text: 'Data export', included: false },
      { text: 'Priority support', included: false },
    ],
    accent: 'border-gray-200',
    button: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$29',
    period: '/month',
    description: 'For growing engineering teams',
    features: [
      { text: 'Up to 20 projects', included: true },
      { text: 'All project types', included: true },
      { text: 'Full dashboard', included: true },
      { text: 'Commercial projects', included: true },
      { text: 'Data export', included: true },
      { text: 'Priority support', included: false },
    ],
    accent: 'border-blue-500',
    button: 'bg-blue-600 text-white hover:bg-blue-700',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'For large organizations',
    features: [
      { text: 'Unlimited projects', included: true },
      { text: 'All project types', included: true },
      { text: 'Full dashboard', included: true },
      { text: 'Commercial projects', included: true },
      { text: 'Data export', included: true },
      { text: 'Priority support', included: true },
    ],
    accent: 'border-purple-500',
    button: 'bg-purple-600 text-white hover:bg-purple-700',
  },
];

export default function SubscriptionPage() {
  const { user, checkAuth } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formatted.substring(0, 19));
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setCardExpiry(value.substring(0, 5));
  };

  const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCardCvv(value.substring(0, 4));
  };

  const handleUpgradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
      toast.error('Please fill out all payment details.');
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await api.put('/auth/subscription', { subscription: selectedPlan.id });
      await checkAuth();

      setIsSuccess(true);
      toast.success(`Successfully subscribed to ${selectedPlan.name}!`);

      setTimeout(() => {
        setIsSuccess(false);
        setSelectedPlan(null);
        setCardNumber('');
        setCardName('');
        setCardExpiry('');
        setCardCvv('');
      }, 2500);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Payment processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Choose the plan that fits your project needs.
        </p>
        {user && (
          <p className="mt-2 text-sm text-gray-600">
            Current plan:{' '}
            <span className="font-semibold text-blue-600 capitalize">
              {user.subscription.replace('_', ' ')}
            </span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {plans.map((plan) => {
          const isCurrent = user?.subscription === plan.id;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-xl border-2 flex flex-col p-5 relative ${
                isCurrent ? 'border-blue-500' : plan.accent
              }`}
            >
              {plan.popular && !isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full">
                  Popular
                </span>
              )}

              {isCurrent && (
                <span className="absolute -top-3 right-4 px-3 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                  <CheckCircle2 size={11} /> Active
                </span>
              )}

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{plan.description}</p>

                <div className="mt-4 mb-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-400 text-sm ml-1">{plan.period}</span>
                </div>

                <hr className="border-gray-100 mb-4" />

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      {feature.included ? (
                        <Check size={14} className="text-green-500 flex-shrink-0" />
                      ) : (
                        <X size={14} className="text-gray-300 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setSelectedPlan(plan)}
                disabled={isCurrent}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${plan.button}`}
              >
                {isCurrent ? 'Current Plan' : 'Select Plan'}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 text-center">
        You can switch plans or cancel at any time under settings.
      </p>

      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Checkout</h3>
                <p className="text-xs text-gray-400">
                  {selectedPlan.name} — {selectedPlan.price}
                  {selectedPlan.period}
                </p>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                disabled={isProcessing}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 size={40} className="text-green-500 mb-3" />
                  <h4 className="font-semibold text-gray-900">Payment Successful</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    Upgraded to {selectedPlan.name}.
                  </p>
                </div>
              ) : isProcessing ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4" />
                  <p className="text-sm text-gray-500">Processing payment...</p>
                </div>
              ) : (
                <form onSubmit={handleUpgradeSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        required
                        value={cardCvv}
                        onChange={handleCardCvvChange}
                        placeholder="•••"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer mt-2"
                  >
                    <Lock size={13} />
                    Pay {selectedPlan.price}
                  </button>

                  <p className="text-[11px] text-center text-gray-400 flex items-center justify-center gap-1">
                    <Lock size={10} /> SSL encrypted
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}