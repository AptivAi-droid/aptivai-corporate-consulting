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
    console.log('Content Personalization Agent request:', { message, sessionId, userId });

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const systemPrompt = `You are the Content Personalization Agent for AptivAI.
Your goal is to adapt website content to match visitor profiles and improve engagement.

Tasks:
1. Detect whether the visitor is an executive, manager, or non-technical staff member based on their responses or behavior.
2. Show tailored content:
   - Executives → ROI case studies, business impact stories
   - Managers → Team productivity, workflows, automation examples
   - Non-technical staff → Training benefits, upskilling, easy AI tools
3. Recommend relevant blogs, testimonials, or case studies.
4. A/B test messaging styles to see what drives engagement.
5. Display a short note: "This page is personalized to improve your experience." for transparency.
6. Do not personalize using sensitive data without explicit consent (POPIA compliance).

Goal:
- Improve visitor engagement and reduce bounce rates.
- Show the most relevant information to each profile.
- Maintain transparency and compliance.`;

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

    console.log('Content Personalization Agent response:', data);

    return new Response(JSON.stringify({ response: data.response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in content-personalization-agent function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});