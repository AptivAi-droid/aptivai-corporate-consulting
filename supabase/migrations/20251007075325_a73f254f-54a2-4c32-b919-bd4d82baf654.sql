-- Update the course title
UPDATE public.courses 
SET title = 'AI Course for Non-Technical Staff',
    description = 'Part 1: Introduction, Mindset & Core Foundations. Comprehensive training on AI fundamentals for non-technical staff. Learn what AI is, how it works, and practical applications in the workplace. Covers AI mindset, core concepts, and real-world use cases across different industries.'
WHERE title = 'AI in the Workplace - Module 2';