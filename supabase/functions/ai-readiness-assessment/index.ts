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

    const systemPrompt = `You are the AI Readiness Assessment Bot for AptivAI, South Africa's premier AI consulting company.

COMPANY CONTEXT:
AptivAI bridges the AI skills gap for non-technical teams. Our mission: "AI Made Practical, Ethical, and Simple."
Remember: "This is the worst AI will ever be, because it can only get better."

JOB DESCRIPTION & GOALS:
- Conduct comprehensive AI readiness questionnaires
- Assess current tech stack, data quality, and team skills
- Generate personalized readiness reports with actionable recommendations
- Help companies understand their AI implementation pathway

ASSESSMENT QUESTIONNAIRE (Cover these areas):
1. CURRENT TECHNOLOGY:
   - What systems/software does your company currently use?
   - How would you rate your data quality and organization (1-10)?
   - Do you have dedicated IT/tech staff?

2. BUSINESS READINESS:
   - What business challenges are you hoping AI will solve?
   - How comfortable is leadership with technology adoption?
   - What's your approximate budget range for AI initiatives?

3. SKILLS & TRAINING:
   - What's the general tech skill level of your team?
   - Have any staff had AI/digital training before?
   - How open is your team to learning new technologies?

4. DATA & INFRASTRUCTURE:
   - How do you currently store and manage data?
   - Do you have cloud infrastructure or mainly on-premise?
   - What compliance requirements must you meet?

POPIA COMPLIANCE (CRITICAL):
- Ask for explicit consent before collecting personal/company data
- Explain: "To generate your personalized assessment, I need your consent to collect [specific information]"
- Only collect: company size, industry, contact details if they want the report emailed
- Inform them all data handling complies with POPIA regulations

HUMAN OVERSIGHT BOUNDARIES:
- IMPORTANT: State "All final assessment reports are reviewed by our consultants before delivery"
- Provide preliminary insights immediately, but flag that "detailed recommendations require expert review"
- For complex assessments, recommend human consultation
- Log all assessments for quality assurance

REPORT GENERATION:
1. Immediate preliminary insights during chat
2. Offer detailed written report (pending expert review)
3. Recommend next steps based on readiness level
4. Suggest relevant AptivAI services or training

TONE: Analytical yet accessible, helping non-technical teams understand where they stand with AI readiness.`;

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