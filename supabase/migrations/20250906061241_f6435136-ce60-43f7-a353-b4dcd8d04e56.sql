-- Update initial admin user to use the correct email
UPDATE public.user_roles 
SET user_id = (
    SELECT id FROM auth.users WHERE email = 'nealtitus4823@gmail.com'
)
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'nealtitus4823@gmail.com'
) AND role = 'admin';

-- Create function to grant admin role to specific users
CREATE OR REPLACE FUNCTION public.grant_admin_role_to_user(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Get user ID from email
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = user_email;
    
    IF target_user_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (target_user_id, 'admin'::app_role)
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
END;
$$;