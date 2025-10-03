-- Business Consultant tracking tables
CREATE TABLE IF NOT EXISTS public.business_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
  business_context JSONB DEFAULT '{}'::jsonb,
  analysis_results JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'in_progress',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.consultation_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES public.business_consultations(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  implementation_status TEXT DEFAULT 'pending',
  expected_impact JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  implemented_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.consultation_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES public.business_consultations(id) ON DELETE CASCADE NOT NULL,
  kpi_name TEXT NOT NULL,
  target_value NUMERIC,
  current_value NUMERIC,
  measurement_date TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_kpis ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_consultations
CREATE POLICY "Users can view their own consultations"
  ON public.business_consultations FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can create their own consultations"
  ON public.business_consultations FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own consultations"
  ON public.business_consultations FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can manage all consultations"
  ON public.business_consultations FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for consultation_recommendations
CREATE POLICY "Users can view their consultation recommendations"
  ON public.consultation_recommendations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.business_consultations
      WHERE id = consultation_recommendations.consultation_id
      AND (user_id = auth.uid() OR auth.uid() IS NULL)
    )
  );

CREATE POLICY "Users can create recommendations for their consultations"
  ON public.consultation_recommendations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.business_consultations
      WHERE id = consultation_recommendations.consultation_id
      AND (user_id = auth.uid() OR auth.uid() IS NULL)
    )
  );

CREATE POLICY "Users can update their consultation recommendations"
  ON public.consultation_recommendations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.business_consultations
      WHERE id = consultation_recommendations.consultation_id
      AND (user_id = auth.uid() OR auth.uid() IS NULL)
    )
  );

CREATE POLICY "Admins can manage all recommendations"
  ON public.consultation_recommendations FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for consultation_kpis
CREATE POLICY "Users can view their consultation KPIs"
  ON public.consultation_kpis FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.business_consultations
      WHERE id = consultation_kpis.consultation_id
      AND (user_id = auth.uid() OR auth.uid() IS NULL)
    )
  );

CREATE POLICY "Users can create KPIs for their consultations"
  ON public.consultation_kpis FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.business_consultations
      WHERE id = consultation_kpis.consultation_id
      AND (user_id = auth.uid() OR auth.uid() IS NULL)
    )
  );

CREATE POLICY "Users can update their consultation KPIs"
  ON public.consultation_kpis FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.business_consultations
      WHERE id = consultation_kpis.consultation_id
      AND (user_id = auth.uid() OR auth.uid() IS NULL)
    )
  );

CREATE POLICY "Admins can manage all KPIs"
  ON public.consultation_kpis FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_business_consultations_updated_at
  BEFORE UPDATE ON public.business_consultations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();