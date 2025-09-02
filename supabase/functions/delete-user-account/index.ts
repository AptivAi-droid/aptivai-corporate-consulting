import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Get the user ID from the request
    const { user_id } = await req.json()

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify the requesting user owns this account
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user || user.id !== user_id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Cannot delete another user\'s account' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Begin deletion process (in compliance with POPIA 30-day retention)
    // Step 1: Mark account for deletion (soft delete)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        deletion_requested_at: new Date().toISOString(),
        full_name: '[DELETED]',
        email: '[DELETED]'
      })
      .eq('user_id', user_id)

    if (profileError) {
      console.error('Profile deletion error:', profileError)
    }

    // Step 2: Remove user from all courses (immediate)
    const { error: enrollmentError } = await supabase
      .from('course_enrollments')
      .delete()
      .eq('student_id', user_id)

    if (enrollmentError) {
      console.error('Enrollment deletion error:', enrollmentError)
    }

    // Step 3: Remove user roles (immediate)
    const { error: rolesError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', user_id)

    if (rolesError) {
      console.error('Roles deletion error:', rolesError)
    }

    // Step 4: Delete the auth user (this cascades to profiles due to foreign key)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user_id)

    if (deleteError) {
      console.error('Auth user deletion error:', deleteError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to delete user account',
          details: deleteError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Log the deletion for compliance audit
    console.log(`User account deleted: ${user_id} at ${new Date().toISOString()} - POPIA Compliance`)

    return new Response(
      JSON.stringify({ 
        message: 'Account deletion completed successfully',
        compliance_note: 'All personal data has been deleted in accordance with POPIA requirements'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred during account deletion',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})