import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { paymentService } from '@/services/paymentService';

// Initialize Stripe with publishable key from environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  customerEmail: string;
  customerName: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
}

// Payment Form Component that uses Stripe Elements
const PaymentForm: React.FC<{
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}> = ({ amount, onSuccess, onError, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        onError(error.message || 'Payment failed');
        toast.error(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!');
        onSuccess(paymentIntent.id);
      }
    } catch (error: any) {
      const message = error.message || 'An unexpected error occurred';
      setErrorMessage(message);
      onError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-6">
        <div className="flex-1 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Amount to pay</span>
              <span className="text-2xl font-bold text-gray-900">£{amount.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500">Secure payment powered by Stripe</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lock className="w-4 h-4" />
              <span>Your payment information is encrypted and secure</span>
            </div>
            
            <PaymentElement />
          </div>

          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Fixed button area at bottom */}
        <div className="flex-shrink-0 pt-4 border-t">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!stripe || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay £{amount.toFixed(2)}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  customerEmail,
  customerName,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && amount > 0) {
      createPaymentIntent();
    }
  }, [isOpen, amount]);

  const createPaymentIntent = async () => {
    setIsLoading(true);
    try {
      const response = await paymentService.createPaymentIntent({
        amount,
        customerEmail,
        customerName,
        metadata: {
          customer_name: customerName,
          customer_email: customerEmail,
        },
      });
      setClientSecret(response.clientSecret);
    } catch (error: any) {
      console.error('Failed to create payment intent:', error);
      toast.error('Failed to initialize payment. Please try again.');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setClientSecret(null);
    onClose();
  };

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0F172A',
      borderRadius: '8px',
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] flex flex-col mx-auto">
        <DialogHeader className="flex-shrink-0 px-1">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="w-5 h-5" />
            Complete Payment
          </DialogTitle>
          <DialogDescription className="text-sm">
            Enter your card details to complete your order
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Initializing payment...</p>
            </div>
          ) : clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
              <PaymentForm
                amount={amount}
                onSuccess={onPaymentSuccess}
                onError={onPaymentError}
                onCancel={handleClose}
              />
            </Elements>
          ) : (
            <div className="text-center py-8">
              <p className="text-red-600">Failed to initialize payment</p>
              <Button onClick={createPaymentIntent} className="mt-4">
                Retry
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;

