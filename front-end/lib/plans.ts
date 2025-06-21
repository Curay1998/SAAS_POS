import { apiClient } from './api';

export interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  billing_period: 'monthly' | 'yearly';
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  is_archived: boolean;
  max_users: number;
  storage: string;
  support: string;
  stripe_price_id: string | null;
  stripe_product_id: string | null;
  has_trial: boolean;
  trial_days: number;
  trial_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionStatus {
  has_subscription: boolean;
  subscription_active: boolean;
  current_plan: Plan | null;
  subscription: any;
  trial_active: boolean;
  trial_ends_at: string | null;
  trial_days_remaining: number | null;
}

export interface TrialSubscriptionRequest {
  plan_id: number;
  payment_method: string;
  trial_days?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const planService = {
  async getPlans(): Promise<Plan[]> {
    try {
      const response = await apiClient.get<ApiResponse<Plan[]>>('/plans');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch plans from API:', error);
      // Return empty array so UI can handle gracefully
      return [];
    }
  },

  async getPlan(id: number): Promise<Plan> {
    const response = await apiClient.get<ApiResponse<Plan>>(`/plans/${id}`);
    return response.data;
  },

  async subscribe(planId: number, paymentMethodId: string) {
    return apiClient.post('/subscription/subscribe', {
      plan_id: planId,
      payment_method: paymentMethodId,
    });
  },

  async changePlan(planId: number, paymentMethodId?: string) {
    return apiClient.post('/subscription/change-plan', {
      plan_id: planId,
      payment_method: paymentMethodId,
    });
  },

  async cancelSubscription() {
    return apiClient.post('/subscription/cancel');
  },

  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    const response = await apiClient.get<ApiResponse<SubscriptionStatus>>('/subscription/status');
    return response.data;
  },

  async startHostedCheckout(planId: number) {
    return apiClient.post<ApiResponse<{url:string}>>('/subscription/checkout-session', { plan_id: planId });
  },

  async confirmCheckoutSession(sessionId: string) {
    return apiClient.post<ApiResponse<{}>>('/subscription/confirm-checkout', { session_id: sessionId });
  },

  async subscribeWithTrial(data: TrialSubscriptionRequest) {
    return apiClient.post('/subscription/start-trial', data);
  },

  async convertTrialToPaid(planId: number) {
    return apiClient.post('/subscription/convert-trial', {
      plan_id: planId,
    });
  },

  async cancelTrial() {
    return apiClient.post('/subscription/cancel-trial');
  },
};