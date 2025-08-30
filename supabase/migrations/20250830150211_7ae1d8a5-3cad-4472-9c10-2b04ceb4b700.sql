-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'instructor', 'student');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  price DECIMAL(10,2) DEFAULT 0,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content categories table
CREATE TABLE public.content_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#6B7280',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course content table
CREATE TABLE public.course_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'audio', 'document', 'gamma', 'image', 'text')),
  file_url TEXT,
  file_size BIGINT,
  duration INTEGER, -- in seconds for video/audio
  category_id UUID REFERENCES public.content_categories(id),
  order_index INTEGER NOT NULL DEFAULT 0,
  is_free BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student enrollments table
CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  UNIQUE (course_id, student_id)
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('course-videos', 'course-videos', false),
  ('course-audio', 'course-audio', false),
  ('course-documents', 'course-documents', false),
  ('course-images', 'course-images', true),
  ('course-thumbnails', 'course-thumbnails', true);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for courses
CREATE POLICY "Everyone can view published courses" ON public.courses FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'admin') OR created_by = auth.uid());
CREATE POLICY "Admins and instructors can manage courses" ON public.courses FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'instructor'));

-- RLS Policies for content_categories
CREATE POLICY "Everyone can view categories" ON public.content_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.content_categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for course_content
CREATE POLICY "Everyone can view content for published courses" ON public.course_content 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE id = course_content.course_id 
      AND (is_published = true OR public.has_role(auth.uid(), 'admin'))
    )
  );
CREATE POLICY "Admins and instructors can manage content" ON public.course_content FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'instructor'));

-- RLS Policies for course_enrollments
CREATE POLICY "Students can view their own enrollments" ON public.course_enrollments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can enroll themselves" ON public.course_enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Admins can manage all enrollments" ON public.course_enrollments FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Storage policies for course content
CREATE POLICY "Admins can upload course videos" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'course-videos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload course audio" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'course-audio' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload course documents" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'course-documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload course images" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'course-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload course thumbnails" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'course-thumbnails' AND public.has_role(auth.uid(), 'admin'));

-- Allow authenticated users to view course content files
CREATE POLICY "Authenticated users can view course content" ON storage.objects FOR SELECT 
  USING (auth.role() = 'authenticated' AND bucket_id IN ('course-videos', 'course-audio', 'course-documents'));

-- Public access for images and thumbnails
CREATE POLICY "Public can view course images" ON storage.objects FOR SELECT 
  USING (bucket_id IN ('course-images', 'course-thumbnails'));

-- Admins can manage all storage objects
CREATE POLICY "Admins can manage all course files" ON storage.objects FOR ALL 
  USING (public.has_role(auth.uid(), 'admin') AND bucket_id IN ('course-videos', 'course-audio', 'course-documents', 'course-images', 'course-thumbnails'));

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_course_content_updated_at BEFORE UPDATE ON public.course_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content categories
INSERT INTO public.content_categories (name, description, color) VALUES
  ('Video Lessons', 'Instructional video content', '#3B82F6'),
  ('Audio Podcasts', 'Audio-based learning materials', '#10B981'),
  ('Documents', 'PDFs, presentations, and written materials', '#F59E0B'),
  ('Gamma Presentations', 'Interactive presentations from Gamma.app', '#8B5CF6'),
  ('Assignments', 'Practice exercises and assignments', '#EF4444'),
  ('Resources', 'Additional learning resources', '#6B7280');