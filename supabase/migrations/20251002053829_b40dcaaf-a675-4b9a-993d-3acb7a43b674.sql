-- Create subscription tiers table
CREATE TABLE IF NOT EXISTS public.subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  price_zar DECIMAL(10,2) NOT NULL,
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'quarterly', 'annual')),
  max_learners INTEGER,
  additional_learner_price_zar DECIMAL(10,2),
  access_days INTEGER DEFAULT 90,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tier_id UUID NOT NULL REFERENCES public.subscription_tiers(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'pending')) DEFAULT 'pending',
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  learner_count INTEGER DEFAULT 1,
  total_amount_zar DECIMAL(10,2) NOT NULL,
  payment_provider TEXT CHECK (payment_provider IN ('stripe', 'paystack', 'yoco')),
  external_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id),
  amount_zar DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')) DEFAULT 'pending',
  payment_provider TEXT NOT NULL,
  external_payment_id TEXT,
  payment_method TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_tiers (public read, admin manage)
CREATE POLICY "Everyone can view active subscription tiers"
  ON public.subscription_tiers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage subscription tiers"
  ON public.subscription_tiers FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for subscriptions (users can view their own, admins can manage all)
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions"
  ON public.subscriptions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for payments (users can view their payments, admins can manage)
CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.subscriptions
      WHERE subscriptions.id = payments.subscription_id
      AND subscriptions.user_id = auth.uid()
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can manage all payments"
  ON public.payments FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default subscription tiers
INSERT INTO public.subscription_tiers (name, description, price_zar, billing_cycle, max_learners, additional_learner_price_zar, features) VALUES
  ('Individual Basic', 'Perfect for solo learners', 499.00, 'monthly', 1, NULL, '["Access to core courses", "AI Study Buddy", "Basic support"]'::jsonb),
  ('Individual Premium', 'Advanced learning with personalized coaching', 799.00, 'monthly', 1, NULL, '["All Basic features", "1-on-1 coaching sessions", "Priority support", "Certificate of completion"]'::jsonb),
  ('SME Plan', 'For small to medium enterprises', 7500.00, 'monthly', 20, 350.00, '["Up to 20 learners", "Team dashboard", "Progress tracking", "Dedicated account manager"]'::jsonb),
  ('Corporate Plan', 'Enterprise-grade AI training', 25000.00, 'monthly', 50, 450.00, '["50+ learners", "Custom content", "White-label options", "Executive briefings", "24/7 support"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Create trigger for updated_at
CREATE TRIGGER update_subscription_tiers_updated_at
  BEFORE UPDATE ON public.subscription_tiers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();