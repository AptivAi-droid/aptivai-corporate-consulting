import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { responses, userId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Prepare assessment prompt
    const assessmentPrompt = `You are an AI readiness consultant. Analyze these responses and provide:
1. An AI readiness score (0-100)
2. Key strengths (3-5 points)
3. Areas for improvement (3-5 points)
4. Recommended next steps (3-5 actionable items)
5. Priority level (low, medium, high, critical)

Responses:
${JSON.stringify(responses, null, 2)}

Provide analysis in JSON format with keys: score, strengths (array), improvements (array), recommendations (array), priority, summary (brief paragraph).`;

    // Call Lovable AI Gateway
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert AI readiness consultant for businesses. Provide practical, actionable insights.' },
          { role: 'user', content: assessmentPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0].message.content;
    
    // Parse AI response
    let analysis;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      // Fallback analysis
      analysis = {
        score: 50,
        strengths: ['Recognizing need for AI', 'Willing to assess readiness'],
        improvements: ['Need detailed evaluation', 'Require structured approach'],
        recommendations: ['Book consultation', 'Start with AI foundations course', 'Assess team capabilities'],
        priority: 'medium',
        summary: 'Initial assessment completed. Further evaluation recommended.'
      };
    }

    // Store assessment in database
    const { data: assessment, error: dbError } = await supabase
      .from('ai_assessments')
      .insert({
        user_id: userId || null,
        assessment_type: 'ai_readiness',
        questions: responses,
        answers: responses,
        score: analysis.score,
        recommendations: analysis,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    // Store lead intelligence
    if (userId) {
      await supabase
        .from('lead_intelligence')
        .upsert({
          user_id: userId,
          ai_readiness_score: analysis.score,
          priority_level: analysis.priority,
          recommended_solutions: analysis.recommendations,
          last_interaction: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        assessment,
        analysis 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-readiness-assessment:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
