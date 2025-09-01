-- Create initial admin user for nealtitus4823@gmail.com
-- This will run after the user signs up to grant admin privileges

-- Insert admin role for the specific email when they sign up
-- We'll use a function that checks email and grants admin role

CREATE OR REPLACE FUNCTION public.grant_admin_role_to_initial_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is the initial admin user
  IF NEW.email = 'nealtitus4823@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to grant admin role to initial user
CREATE TRIGGER grant_initial_admin_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.grant_admin_role_to_initial_user();