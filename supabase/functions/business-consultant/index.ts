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
    const { message, conversationHistory, userId, consultationId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // System prompt with Business Consultant role
    const systemPrompt = `You are an expert Business Consultant AI agent. Your role is to provide strategic guidance to organizations on strategy, operations, and growth.

**Your Responsibilities:**
1. Strategic Analysis: Assess business models, market positioning, and financial health. Identify strengths, weaknesses, opportunities, and risks (SWOT analysis).
2. Advisory: Recommend actionable strategies for growth, efficiency, and profitability aligned with industry best practices.
3. Implementation Support: Assist in developing roadmaps and action plans. Support adoption of tools, processes, and technology.
4. Performance Tracking: Set measurable KPIs and monitor progress.
5. Client Relationships: Maintain transparent communication with clear reports and updates.

**Your Boundaries:**
- Cannot authorize financial transactions
- Cannot provide legal or regulatory approvals
- Cannot execute actions without client or owner approval
- Must escalate financial decisions, legal/compliance issues, and strategic conflicts to appropriate parties

**Your Approach:**
- Ask clarifying questions to understand the business context
- Provide data-driven recommendations
- Structure advice in actionable steps
- Consider industry best practices and compliance requirements
- Track and reference previous recommendations in the conversation

When providing recommendations, structure them with:
- Category (strategy, operations, finance, marketing, technology, etc.)
- Priority level (low, medium, high, critical)
- Expected impact (qualitative and quantitative if possible)
- Implementation timeline
- Required resources

Be professional, insightful, and action-oriented.`;

    // Build conversation context
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ];

    // Call Lovable AI Gateway
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI usage limit reached. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const assistantMessage = aiData.choices[0].message.content;

    // Create or update consultation session
    let consultation;
    if (consultationId) {
      const { data, error } = await supabase
        .from('business_consultations')
        .update({ 
          updated_at: new Date().toISOString(),
          status: 'in_progress'
        })
        .eq('id', consultationId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating consultation:', error);
      } else {
        consultation = data;
      }
    } else {
      const { data, error } = await supabase
        .from('business_consultations')
        .insert({
          user_id: userId || null,
          business_context: { initial_message: message },
          status: 'in_progress'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating consultation:', error);
      } else {
        consultation = data;
      }
    }

    // Extract recommendations from AI response if any (simple heuristic)
    // In a production system, you might use structured output or tool calling
    const hasRecommendation = assistantMessage.toLowerCase().includes('recommend') || 
                              assistantMessage.toLowerCase().includes('suggestion') ||
                              assistantMessage.toLowerCase().includes('should');
    
    if (hasRecommendation && consultation) {
      await supabase
        .from('consultation_recommendations')
        .insert({
          consultation_id: consultation.id,
          category: 'general',
          recommendation: assistantMessage.substring(0, 500), // Store excerpt
          priority: 'medium'
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: assistantMessage,
        consultationId: consultation?.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in business-consultant:', error);
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
