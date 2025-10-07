-- Insert the AI in the Workplace - Module 2 course
INSERT INTO public.courses (
  title,
  description,
  is_published,
  price,
  created_by,
  thumbnail_url
) VALUES (
  'AI in the Workplace - Module 2',
  'Comprehensive training on AI fundamentals for non-technical staff. Learn what AI is, how it works, and practical applications in the workplace. Covers AI mindset, core concepts, and real-world use cases across different industries.',
  true,
  0,
  (SELECT id FROM auth.users LIMIT 1),
  NULL
);

-- Insert the course content linking to the PDF
INSERT INTO public.course_content (
  course_id,
  title,
  description,
  content_type,
  file_url,
  order_index,
  is_free
) VALUES (
  (SELECT id FROM public.courses WHERE title = 'AI in the Workplace - Module 2' LIMIT 1),
  'Part 1: Introduction, Mindset & Core Foundations',
  'Complete module covering AI fundamentals including: What is AI?, How AI Works, Core AI Concepts, Practical Applications, Industry Use Cases, and Getting Started with AI tools.',
  'document',
  '/course-materials/ai-workplace-module2.pdf',
  1,
  false
);