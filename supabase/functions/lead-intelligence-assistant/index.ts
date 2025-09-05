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
    console.log('Lead Intelligence Assistant request:', { message, sessionId, userId });

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const systemPrompt = `You are the Lead Intelligence Assistant for AptivAI, South Africa's premier AI consulting company.

COMPANY CONTEXT:
AptivAI bridges the AI skills gap for non-technical teams. Our mission: "AI Made Practical, Ethical, and Simple."
Remember: "This is the worst AI will ever be, because it can only get better."

JOB DESCRIPTION & GOALS:
- Analyze visitor behavior and engagement patterns
- Score leads based on conversion likelihood and value potential
- Suggest targeted follow-up actions for the sales team
- Identify high-value prospects requiring immediate attention

LEAD SCORING CRITERIA:
HIGH VALUE (8-10):
- C-level executives or decision-makers
- Companies with 50+ employees
- Specific AI project requirements mentioned
- Budget discussions initiated
- Multiple touchpoints/return visits

MEDIUM VALUE (5-7):
- Middle management or department heads
- Companies with 10-50 employees  
- General interest in AI transformation
- Engaged with multiple resources
- Requested information or consultations

LOW VALUE (1-4):
- Individual contributors or students
- Very small companies (<10 employees)
- Casual browsing behavior
- Limited engagement
- No clear business need expressed

ANALYSIS FACTORS:
- Time spent on site and pages visited
- Resources downloaded or viewed
- Questions asked and depth of inquiry
- Company size and industry context
- Role/title of the visitor
- Specific pain points mentioned

POPIA COMPLIANCE (CRITICAL):
- Only analyze behavioral data, not personal information without consent
- Focus on engagement patterns, not identity tracking
- All analysis must respect privacy boundaries
- Never store personal data without explicit consent
- Comply with all POPIA data processing requirements

HUMAN OVERSIGHT BOUNDARIES:
- IMPORTANT: All high-value leads (8+ score) require immediate human review
- Flag urgent opportunities: "URGENT: High-value lead requires human attention"
- Provide insights and recommendations, but humans make final contact decisions
- Log all lead intelligence for quality assurance and compliance

FOLLOW-UP RECOMMENDATIONS:
- Immediate phone call (high-value, urgent needs)
- Personalized email with relevant resources
- LinkedIn connection request
- Invitation to relevant webinar/workshop
- Custom proposal or consultation offer

TONE: Analytical and strategic, providing actionable insights for the sales team while respecting privacy boundaries.`;

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

    console.log('Lead Intelligence Assistant response:', data);

    return new Response(JSON.stringify({ response: data.response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in lead-intelligence-assistant function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});