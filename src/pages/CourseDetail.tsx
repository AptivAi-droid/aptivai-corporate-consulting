import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, BookOpen, FileText, ChevronLeft, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import PageHeader from '@/components/page-header';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  price: number;
  is_published: boolean;
  course_content: CourseContent[];
}

interface CourseContent {
  id: string;
  title: string;
  description: string | null;
  content_type: string;
  file_url: string | null;
  order_index: number;
  is_free: boolean;
}

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
      checkEnrollment();
    }
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          course_content (
            id,
            title,
            description,
            content_type,
            file_url,
            order_index,
            is_free
          )
        `)
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      
      // Sort content by order_index
      if (data.course_content) {
        data.course_content.sort((a: CourseContent, b: CourseContent) => a.order_index - b.order_index);
      }
      
      setCourse(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('course_id', id)
        .eq('student_id', user.id)
        .single();

      if (data) setIsEnrolled(true);
    } catch (error) {
      // User not enrolled
      setIsEnrolled(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to enroll in this course.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          course_id: id,
          student_id: user.id,
        });

      if (error) throw error;

      setIsEnrolled(true);
      toast({
        title: "Success!",
        description: "You've been enrolled in this course.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const canAccessContent = (content: CourseContent) => {
    return content.is_free || isEnrolled;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader />
        <div className="container mx-auto px-4 py-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader />
        <div className="container mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
            <Button asChild>
              <Link to="/courses">Back to Courses</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/courses">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
        </Button>

        {/* Course Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" />
                <span>{course.course_content?.length || 0} Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                <span>Professional Level</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                <span>Self-paced</span>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Course Access</CardTitle>
              {course.price === 0 ? (
                <Badge variant="secondary" className="w-fit">Free Course</Badge>
              ) : (
                <Badge variant="default" className="w-fit">R {course.price}</Badge>
              )}
            </CardHeader>
            <CardContent>
              {isEnrolled ? (
                <div className="space-y-4">
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <p className="text-sm text-center font-medium">✓ You're enrolled!</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You have full access to all course materials.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button onClick={handleEnroll} className="w-full">
                    {course.price === 0 ? 'Enroll for Free' : 'Enroll Now'}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    {course.price === 0 
                      ? 'Get instant access to all course materials'
                      : 'One-time payment for lifetime access'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Course Content */}
        <Tabs defaultValue="content" className="w-full">
          <TabsList>
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-6">
            <div className="space-y-4">
              {course.course_content && course.course_content.length > 0 ? (
                course.course_content.map((content, index) => (
                  <Card key={content.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Lesson {index + 1}</Badge>
                            {content.is_free && <Badge variant="secondary">Free Preview</Badge>}
                          </div>
                          <CardTitle className="text-xl">{content.title}</CardTitle>
                          {content.description && (
                            <CardDescription className="mt-2">
                              {content.description}
                            </CardDescription>
                          )}
                        </div>
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      {canAccessContent(content) ? (
                        content.file_url ? (
                          <Button asChild>
                            <a href={content.file_url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-2" />
                              View/Download Material
                            </a>
                          </Button>
                        ) : (
                          <p className="text-sm text-muted-foreground">Content coming soon</p>
                        )
                      ) : (
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">
                            🔒 Enroll to access this content
                          </p>
                          <Button onClick={handleEnroll} size="sm">
                            Enroll Now
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      Course content will be available soon.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>{course.description}</p>
                <h3 className="text-lg font-semibold mt-6 mb-3">Course Highlights</h3>
                <ul className="space-y-2">
                  <li>Comprehensive understanding of AI fundamentals</li>
                  <li>Practical applications in workplace settings</li>
                  <li>Industry-specific use cases and examples</li>
                  <li>Hands-on guidance for getting started with AI tools</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetail;
