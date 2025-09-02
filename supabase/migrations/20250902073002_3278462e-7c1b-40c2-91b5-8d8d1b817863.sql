-- Fix critical security issue: Ensure paid course content requires enrollment
-- Replace overly permissive policy with enrollment-based access control

-- Drop the current overly permissive policy
DROP POLICY IF EXISTS "Everyone can view content for published courses" ON public.course_content;

-- Create new policies that properly protect paid content
CREATE POLICY "Free content is viewable by everyone"
ON public.course_content
FOR SELECT
TO authenticated
USING (
  is_free = true 
  AND EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = course_content.course_id 
    AND courses.is_published = true
  )
);

CREATE POLICY "Paid content requires enrollment"
ON public.course_content
FOR SELECT
TO authenticated
USING (
  is_free = false 
  AND EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = course_content.course_id 
    AND courses.is_published = true
  )
  AND (
    -- User must be enrolled in the course
    EXISTS (
      SELECT 1 FROM public.course_enrollments 
      WHERE course_enrollments.course_id = course_content.course_id 
      AND course_enrollments.student_id = auth.uid()
    )
    -- OR user is admin/instructor
    OR has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'instructor'::app_role)
  )
);

CREATE POLICY "Admins and instructors can view all content"
ON public.course_content
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'instructor'::app_role)
);