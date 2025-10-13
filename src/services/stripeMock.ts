// Mock Stripe service for local development

export interface CreatePaymentIntentParams {
  amount: number; // in pounds
  currency?: 'gbp';
  description?: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResult {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  error?: string;
}

class StripeMockService {
  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
    // Simulate latency
    await new Promise((r) => setTimeout(r, 600));

    // Very basic validation
    if (!params.amount || params.amount <= 0) {
      return { success: false, error: 'Invalid amount' };
    }

    const id = `pi_${Math.random().toString(36).slice(2, 12)}`;
    const clientSecret = `${id}_secret_${Math.random().toString(36).slice(2, 10)}`;

    return {
      success: true,
      clientSecret,
      paymentIntentId: id,
    };
  }
}

export const stripeMock = new StripeMockService();


