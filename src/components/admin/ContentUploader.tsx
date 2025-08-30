import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, File, Video, Music, Image, FileText, Presentation, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
}

interface ContentCategory {
  id: string;
  name: string;
  color: string;
}

const ContentUploader = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    content_type: '',
    category_id: '',
    is_free: false,
    order_index: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .order('title');

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const getContentTypeFromFile = (file: File): string => {
    const type = file.type;
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.startsWith('image/')) return 'image';
    if (type === 'application/pdf' || type.includes('document') || type.includes('presentation')) return 'document';
    return 'document';
  };

  const getStorageBucket = (contentType: string): string => {
    switch (contentType) {
      case 'video': return 'course-videos';
      case 'audio': return 'course-audio';
      case 'image': return 'course-images';
      default: return 'course-documents';
    }
  };

  const getFileIcon = (contentType: string) => {
    switch (contentType) {
      case 'video': return <Video className="h-5 w-5" />;
      case 'audio': return <Music className="h-5 w-5" />;
      case 'image': return <Image className="h-5 w-5" />;
      case 'gamma': return <Presentation className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    
    // Auto-detect content type from first file
    if (files.length > 0) {
      const contentType = getContentTypeFromFile(files[0]);
      setFormData(prev => ({ ...prev, content_type: contentType }));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File, contentType: string): Promise<string> => {
    const bucket = getStorageBucket(contentType);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${formData.course_id}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course_id || selectedFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a course and at least one file.",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const totalFiles = selectedFiles.length;
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const contentType = formData.content_type || getContentTypeFromFile(file);
        
        // Upload file to storage
        const fileUrl = await uploadFile(file, contentType);
        
        // Create content record
        const { error } = await supabase
          .from('course_content')
          .insert({
            course_id: formData.course_id,
            title: formData.title || file.name,
            description: formData.description,
            content_type: contentType,
            file_url: fileUrl,
            file_size: file.size,
            category_id: formData.category_id || null,
            order_index: formData.order_index + i,
            is_free: formData.is_free,
          });

        if (error) throw error;
        
        setUploadProgress(((i + 1) / totalFiles) * 100);
      }

      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${totalFiles} file(s).`,
      });

      // Reset form
      setSelectedFiles([]);
      setFormData({
        course_id: '',
        title: '',
        description: '',
        content_type: '',
        category_id: '',
        is_free: false,
        order_index: 0,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message,
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Content Upload</h2>
        <p className="text-muted-foreground">Upload videos, audio, documents, and other course materials</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Course Content</CardTitle>
          <CardDescription>
            Select files and provide details for your course content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select
                  value={formData.course_id}
                  onValueChange={(value) => setFormData({ ...formData, course_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Files *</Label>
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-accent transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Course Content</h3>
                <p className="text-muted-foreground mb-4">
                  Click to select files or drag and drop
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports: Videos (MP4, MOV), Audio (MP3, WAV), Documents (PDF, DOCX), Images (JPG, PNG)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="video/*,audio/*,image/*,.pdf,.docx,.pptx"
              />
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files</Label>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      {getFileIcon(getContentTypeFromFile(file))}
                      <div className="flex-1">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Badge variant="outline">
                        {getContentTypeFromFile(file)}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Content Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Leave empty to use filename"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Order Index</Label>
                <Input
                  id="order"
                  type="number"
                  min="0"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description for the content"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="free"
                checked={formData.is_free}
                onCheckedChange={(checked) => setFormData({ ...formData, is_free: checked })}
              />
              <Label htmlFor="free">Make this content free to access</Label>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Upload Progress</Label>
                  <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            <Button
              type="submit"
              disabled={uploading || selectedFiles.length === 0 || !formData.course_id}
              className="w-full"
            >
              {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} File(s)`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentUploader;