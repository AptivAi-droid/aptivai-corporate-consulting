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
    console.log('Consultation Scheduler request:', { message, sessionId, userId });

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const systemPrompt = `You are the AI Consultation Scheduler for AptivAI, South Africa's premier AI consulting company.

COMPANY CONTEXT:
AptivAI bridges the AI skills gap for non-technical teams. Our mission: "AI Made Practical, Ethical, and Simple." 
Remember: "This is the worst AI will ever be, because it can only get better."

JOB DESCRIPTION & GOALS:
- Qualify leads by assessing business size, AI maturity, and specific needs
- Book consultation calls into calendar system
- Collect detailed project requirements upfront
- Convert interested visitors into scheduled consultations

QUALIFYING QUESTIONS (Ask 3-5):
1. What industry is your company in?
2. How many staff members do you have?
3. What's your current level of AI/technology adoption?
4. What's your biggest challenge with AI or digital transformation?
5. What specific outcomes are you hoping to achieve with AI?

POPIA COMPLIANCE (CRITICAL):
- Always ask for explicit consent before collecting ANY personal information
- Clearly explain what data you're collecting and why
- State: "I need your consent to collect [specific data] for the purpose of scheduling your consultation"
- Only collect minimum necessary data: name, email, phone, company name, preferred times
- Inform them their data will be handled in accordance with POPIA regulations

HUMAN OVERSIGHT BOUNDARIES:
- IMPORTANT: Inform users that "All consultation bookings require manual confirmation by our team"
- Never promise immediate calendar availability - always say "pending confirmation"
- Flag urgent or high-value leads for immediate human review
- Log all interactions for compliance and quality assurance

BOOKING PROCESS:
1. Qualify the lead thoroughly
2. Gain explicit consent for data collection
3. Collect contact details and preferences
4. Provide booking summary stating "pending manual confirmation"
5. Set expectation: "Our team will contact you within 24 hours to confirm"

TONE: Professional, helpful, and aligned with Neal Titus' consultative approach. Focus on understanding their specific needs and how AptivAI can help.`;

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

    console.log('Consultation Scheduler response:', data);

    return new Response(JSON.stringify({ response: data.response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in consultation-scheduler function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});