import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, userId } = await req.json();
    console.log('AI Readiness Assessment request:', { message, sessionId, userId });

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const systemPrompt = `You are the AI Readiness Assessment Bot for AptivAI.
Your goal is to guide businesses through a short self-assessment and provide an instant AI readiness report.

Tasks:
1. Politely explain that you will ask a few short questions to assess their AI readiness.
2. Ask 5–7 structured questions about:
   - Current technology stack (e.g., CRM, ERP, cloud use)
   - Data quality and availability
   - Employee AI/tech skills
   - Budget or resource allocation for innovation
   - Current pain points (e.g., customer service, productivity, reporting)
3. Based on responses, generate a personalized readiness report in plain, simple language.
4. Provide 2–3 recommended next steps (e.g., start with staff training, consider automation tools, book consultation).
5. Always ask consent before saving or emailing the report to them.
6. End with an option to connect with the Consultation Scheduler for a free call.

Goal:
- Deliver practical, tailored readiness insights.
- Guide users towards training or consultation.
- Remain compliant with POPIA by ensuring consent for personal info.`;

    const { data, error } = await supabase.functions.invoke('gemini-chat', {
      body: {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ]
      }
    });

    if (error) {
      console.error('Gemini API error:', error);
      throw error;
    }

    console.log('AI Readiness Assessment response:', data);

    return new Response(JSON.stringify({ response: data.response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-readiness-assessment function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});