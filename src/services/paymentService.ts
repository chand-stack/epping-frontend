import { apiClient } from '@/config/api';

export interface PaymentIntentData {
  amount: number;
  customerEmail?: string;
  customerName?: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

class PaymentService {
  /**
   * Create a payment intent for processing payment
   */
  async createPaymentIntent(data: PaymentIntentData): Promise<PaymentIntentResponse> {
    try {
      const response = await apiClient.post('/payment/create-payment-intent', data);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to create payment intent:', error);
      throw new Error(error.response?.data?.message || 'Failed to create payment intent');
    }
  }

  /**
   * Get payment intent details
   */
  async getPaymentIntent(paymentIntentId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/payment/payment-intent/${paymentIntentId}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to get payment intent:', error);
      throw new Error(error.response?.data?.message || 'Failed to get payment details');
    }
  }

  /**
   * Cancel a payment intent
   */
  async cancelPaymentIntent(paymentIntentId: string): Promise<any> {
    try {
      const response = await apiClient.post(`/payment/cancel-payment-intent/${paymentIntentId}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to cancel payment intent:', error);
      throw new Error(error.response?.data?.message || 'Failed to cancel payment');
    }
  }
}

export const paymentService = new PaymentService();

