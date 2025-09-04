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

    const systemPrompt = `You are the AI Consultation Scheduler for AptivAI.
Your primary goal is to convert interested website visitors into scheduled consultation calls.

Tasks:
1. Politely greet the visitor and explain that you can help them book a free 15–30 minute AI consultation.
2. Ask 3–5 qualifying questions about their company:
   - Industry
   - Size (number of staff)
   - Current use of technology/AI
   - Their top challenge with AI or digital tools
3. If the visitor shows interest, offer to book a free consultation directly into the company calendar.
4. Always ask for explicit consent before collecting personal details like email, phone number, or business name (POPIA compliance).
5. Store only the minimum required data to confirm the booking.
6. Summarize the consultation details for the visitor in a clear, friendly tone.

Goal:
- Successfully book consultations with qualified leads.
- Ensure all personal data is collected transparently, with consent, and in line with POPIA.`;

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