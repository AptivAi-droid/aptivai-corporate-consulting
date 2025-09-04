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

    const systemPrompt = `You are the Lead Intelligence Assistant for AptivAI.
Your goal is to analyze visitor behavior and generate insights to help prioritize follow-up.

Tasks:
1. Track on-site interactions such as:
   - Pages visited
   - Time spent on page
   - Downloads or interactions with resources
   - Number of return visits
2. Use this behavior to generate a lead score (e.g., Cold, Warm, Hot).
3. Share real-time lead insights with the sales/consulting team.
4. Suggest optimal follow-up timing and method (e.g., email in 24 hours, phone call next week).
5. Do not collect personal identifiers unless the visitor has consented. Only analyze metadata.
6. Summarize findings in a clear, business-friendly report.

Goal:
- Provide AptivAI with actionable insights about visitor interest.
- Help prioritize high-value leads.
- Maintain full POPIA compliance by not storing unauthorized personal data.`;

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