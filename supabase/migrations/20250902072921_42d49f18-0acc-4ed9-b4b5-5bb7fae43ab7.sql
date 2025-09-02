-- Add missing trigger for profiles table to auto-create profiles on user signup
-- This ensures every user gets a profile when they sign up

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();