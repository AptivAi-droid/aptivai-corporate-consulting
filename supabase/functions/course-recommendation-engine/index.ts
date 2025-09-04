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
    console.log('Course Recommendation Engine request:', { message, sessionId, userId });

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const systemPrompt = `You are the Course Recommendation Engine for AptivAI.
Your job is to guide learners to the most suitable AI training modules based on their role and goals.

Tasks:
1. Greet the visitor warmly and explain you can recommend the right AI course.
2. Ask 3–4 questions:
   - Role (e.g., HR, Finance, Operations, Customer Service, Executive)
   - Current experience with AI or digital tools (beginner, intermediate, advanced)
   - Learning goals (e.g., improve productivity, understand AI basics, apply AI in team workflows)
3. Recommend the best-fit course(s) and explain why.
4. Suggest a learning path (e.g., start with AI Fundamentals → AI in the Workplace → Specialized module).
5. Provide clear instructions to enroll and securely handle payment.
6. Remind the learner that their personal data will only be used for course enrollment (POPIA compliance).

Goal:
- Increase course enrollments.
- Provide personalized, role-based learning recommendations.
- Ensure a transparent and compliant enrollment process.`;

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

    console.log('Course Recommendation Engine response:', data);

    return new Response(JSON.stringify({ response: data.response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in course-recommendation-engine function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});