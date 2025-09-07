-- Create knowledge base structure
CREATE TABLE public.knowledge_base (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  module_number INTEGER,
  section TEXT,
  keywords TEXT[],
  is_searchable BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create FAQ table
CREATE TABLE public.knowledge_faq (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_faq ENABLE ROW LEVEL SECURITY;

-- RLS Policies for knowledge base (public read access)
CREATE POLICY "Knowledge base is publicly readable"
ON public.knowledge_base FOR SELECT
USING (true);

CREATE POLICY "Admins can manage knowledge base"
ON public.knowledge_base FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for FAQ (public read access)
CREATE POLICY "FAQ is publicly readable"
ON public.knowledge_faq FOR SELECT
USING (true);

CREATE POLICY "Admins can manage FAQ"
ON public.knowledge_faq FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add search function using full-text search
CREATE OR REPLACE FUNCTION public.search_knowledge_base(search_query TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  category TEXT,
  module_number INTEGER,
  section TEXT,
  relevance REAL
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    kb.id,
    kb.title,
    kb.content,
    kb.category,
    kb.module_number,
    kb.section,
    ts_rank(
      to_tsvector('english', kb.title || ' ' || kb.content || ' ' || array_to_string(kb.keywords, ' ')),
      plainto_tsquery('english', search_query)
    ) as relevance
  FROM public.knowledge_base kb
  WHERE 
    kb.is_searchable = true
    AND (
      to_tsvector('english', kb.title || ' ' || kb.content || ' ' || array_to_string(kb.keywords, ' ')) 
      @@ plainto_tsquery('english', search_query)
    )
  ORDER BY relevance DESC, kb.module_number ASC;
$$;

-- Add update trigger
CREATE TRIGGER update_knowledge_base_updated_at
BEFORE UPDATE ON public.knowledge_base
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert course content for Module 1
INSERT INTO public.knowledge_base (title, content, category, module_number, section, keywords) VALUES
('Introduction to AI - Definition', 'Artificial Intelligence (AI) is technology that enables machines to perform tasks that typically require human intelligence, such as learning, reasoning, and problem-solving.', 'Course Content', 1, 'AI Fundamentals', ARRAY['AI', 'artificial intelligence', 'definition', 'introduction']),

('Types of AI - Narrow AI', 'Narrow AI (Weak AI) is designed to perform specific tasks. Examples include Siri, chatbots, recommendation systems, and image recognition. This is the most common type of AI today.', 'Course Content', 1, 'AI Types', ARRAY['narrow AI', 'weak AI', 'specific tasks', 'Siri', 'chatbots']),

('Types of AI - General AI', 'General AI (Strong AI) refers to machines that possess human-level intelligence across all domains. This technology is still emerging and represents the future goal of AI development.', 'Course Content', 1, 'AI Types', ARRAY['general AI', 'strong AI', 'human-level', 'emerging technology']),

('Everyday AI Examples', 'AI is already part of daily life: Google Maps for navigation, Netflix for recommendations, email spam filters, voice assistants like Alexa, and predictive text on smartphones.', 'Course Content', 1, 'Real-world Applications', ARRAY['Google Maps', 'Netflix', 'spam filters', 'voice assistants', 'Alexa', 'everyday AI']),

('Why AI Matters for Staff', 'AI helps non-technical staff save time, reduce errors, and adapt to AI-driven workplaces. It enhances productivity without requiring technical expertise.', 'Course Content', 1, 'Business Value', ARRAY['productivity', 'time saving', 'error reduction', 'workplace adaptation']);

-- Insert Module 2 content
INSERT INTO public.knowledge_base (title, content, category, module_number, section, keywords) VALUES
('AI Productivity Tools Overview', 'AI productivity tools include smart calendars, task managers, and virtual assistants that help organize work and automate routine tasks.', 'Course Content', 2, 'Productivity Tools', ARRAY['productivity', 'calendars', 'task managers', 'virtual assistants', 'automation']),

('Writing and Content AI Tools', 'Popular AI writing tools include ChatGPT for general writing, Jasper for marketing copy, Grammarly for grammar checking, and QuillBot for paraphrasing and editing.', 'Course Content', 2, 'Writing Tools', ARRAY['ChatGPT', 'Jasper', 'Grammarly', 'QuillBot', 'writing', 'content creation']),

('Image, Video and Audio AI Tools', 'Creative AI tools include DALL·E and MidJourney for image generation, Lumen5 for video creation, and ElevenLabs for voice synthesis and audio production.', 'Course Content', 2, 'Creative Tools', ARRAY['DALL·E', 'MidJourney', 'Lumen5', 'ElevenLabs', 'image generation', 'video', 'audio']),

('Automation and Integration Tools', 'Tools like Zapier, Notion AI, and Make help connect different apps and automate workflows, reducing manual work and improving efficiency.', 'Course Content', 2, 'Automation', ARRAY['Zapier', 'Notion AI', 'Make', 'automation', 'workflow', 'integration']),

('Business Impact of AI Tools', 'AI tools deliver efficiency gains, cost savings, better resource management, and competitive advantages through improved speed and quality of work.', 'Course Content', 2, 'Business Benefits', ARRAY['efficiency', 'cost savings', 'resource management', 'competitive advantage']);

-- Insert Module 3 content  
INSERT INTO public.knowledge_base (title, content, category, module_number, section, keywords) VALUES
('AI for Personal Productivity', 'AI assists with scheduling appointments, setting reminders, summarizing emails, managing to-do lists, and organizing personal workflows.', 'Course Content', 3, 'Personal Use', ARRAY['scheduling', 'reminders', 'email summaries', 'to-do lists', 'personal productivity']),

('AI for Writing and Communication', 'AI helps draft emails and reports, create presentations, summarize research topics, and generate creative ideas for content and communication.', 'Course Content', 3, 'Communication', ARRAY['email drafting', 'reports', 'presentations', 'research summaries', 'creative ideas']),

('AI in Customer Service', 'AI powers FAQ handling, provides 24/7 customer support, enables faster response times, and improves overall customer satisfaction.', 'Course Content', 3, 'Customer Service', ARRAY['FAQ', 'customer support', '24/7', 'response times', 'customer satisfaction']),

('AI for Marketing and Social Media', 'AI creates social media posts, analyzes trends, suggests relevant hashtags, generates ad copy, and produces marketing visuals.', 'Course Content', 3, 'Marketing', ARRAY['social media', 'trends', 'hashtags', 'ad copy', 'marketing visuals']),

('Enhanced Customer Experience', 'AI enables omnichannel integration, provides staff training insights, creates feedback loops, and personalizes customer interactions.', 'Course Content', 3, 'Customer Experience', ARRAY['omnichannel', 'training', 'feedback loops', 'personalization']);

-- Insert Module 4 content
INSERT INTO public.knowledge_base (title, content, category, module_number, section, keywords) VALUES
('AI in Sales and Lead Generation', 'AI identifies potential leads, scores prospects based on behavior, personalizes outreach messages, and analyzes customer behavior patterns.', 'Course Content', 4, 'Sales', ARRAY['lead generation', 'prospect scoring', 'personalized outreach', 'behavior analysis']),

('AI for Marketing and Advertising', 'AI generates compelling ad copy, optimizes campaign performance, targets specific audiences, and creates marketing visuals automatically.', 'Course Content', 4, 'Marketing', ARRAY['ad copy', 'campaign optimization', 'audience targeting', 'marketing automation']),

('AI-Enhanced CRM Systems', 'AI tracks customer interactions, suggests follow-up actions, provides insights into customer behavior, and predicts customer needs.', 'Course Content', 4, 'CRM', ARRAY['CRM', 'interaction tracking', 'follow-up suggestions', 'customer insights', 'predictive analytics']),

('Workflow Optimization with AI', 'AI automates repetitive tasks, integrates different applications, streamlines business operations, and reduces human error in processes.', 'Course Content', 4, 'Workflow', ARRAY['task automation', 'app integration', 'streamlined operations', 'error reduction']);

-- Insert Module 5 content
INSERT INTO public.knowledge_base (title, content, category, module_number, section, keywords) VALUES
('Future AI Trends', 'Emerging trends include increased automation, generative AI expansion, AI integration in healthcare and finance, and enhanced customer service capabilities.', 'Course Content', 5, 'Future Trends', ARRAY['automation', 'generative AI', 'healthcare', 'finance', 'future trends']),

('AI Ethics and Considerations', 'Key ethical considerations include data privacy protection, addressing algorithmic bias, ensuring transparency in AI decisions, and maintaining accountability.', 'Course Content', 5, 'Ethics', ARRAY['data privacy', 'algorithmic bias', 'transparency', 'accountability', 'ethics']),

('Human-AI Collaboration', 'Best practices include keeping humans in the decision-making loop, using AI as a collaborative partner rather than replacement, and maintaining human oversight.', 'Course Content', 5, 'Collaboration', ARRAY['human oversight', 'collaboration', 'partnership', 'decision-making loop']),

('Preparing for the AI Future', 'Success requires continuous learning, adaptability to new technologies, regular upskilling, and staying informed about AI developments.', 'Course Content', 5, 'Future Preparation', ARRAY['continuous learning', 'adaptability', 'upskilling', 'AI developments']);

-- Insert Agent Reference content
INSERT INTO public.knowledge_base (title, content, category, module_number, section, keywords) VALUES
('Agent Best Practices', 'AI agents should provide accurate information, request human oversight for critical decisions, maintain POPIA compliance, and escalate complex issues appropriately.', 'Agent Reference', NULL, 'Best Practices', ARRAY['best practices', 'human oversight', 'POPIA compliance', 'escalation']),

('AI Tools Quick Reference', 'ChatGPT: General writing and conversation. Jasper: Marketing copy. Grammarly: Grammar checking. DALL·E: Image generation. Zapier: Workflow automation.', 'Agent Reference', NULL, 'Tool Reference', ARRAY['ChatGPT', 'Jasper', 'Grammarly', 'DALL·E', 'Zapier', 'quick reference']),

('Human Oversight Guidelines', 'Require human approval for: financial decisions, contract commitments, personal data handling, high-value leads, and sensitive content publication.', 'Agent Reference', NULL, 'Oversight', ARRAY['human approval', 'financial decisions', 'contracts', 'personal data', 'sensitive content']);

-- Insert FAQ content
INSERT INTO public.knowledge_faq (question, answer, category, keywords) VALUES
('What is the difference between Narrow AI and General AI?', 'Narrow AI performs specific tasks (like Siri or spam filters), while General AI would have human-level intelligence across all domains. Currently, only Narrow AI exists commercially.', 'AI Fundamentals', ARRAY['narrow AI', 'general AI', 'difference', 'types']),

('Do I need technical skills to use AI tools?', 'No! Most AI tools are designed for non-technical users. They typically work through simple interfaces, chat commands, or drag-and-drop functionality.', 'Getting Started', ARRAY['technical skills', 'non-technical', 'user-friendly', 'interfaces']),

('How can AI help with my daily work tasks?', 'AI can help with email drafting, scheduling, research, content creation, data analysis, customer support, and automating repetitive tasks.', 'Productivity', ARRAY['daily tasks', 'email', 'scheduling', 'research', 'automation']),

('Is my data safe when using AI tools?', 'Reputable AI tools follow strict data protection protocols. Always check privacy policies and use tools that comply with regulations like POPIA in South Africa.', 'Privacy', ARRAY['data safety', 'privacy', 'POPIA', 'data protection']),

('What should I do if an AI agent makes a mistake?', 'Always verify important AI outputs, especially for financial, legal, or sensitive matters. Report errors to human supervisors and use AI as a helpful assistant, not a final decision maker.', 'Best Practices', ARRAY['AI mistakes', 'verification', 'human oversight', 'errors']),

('How often should I update my AI knowledge?', 'AI technology evolves rapidly. Aim to learn about new tools and capabilities quarterly, and stay informed about industry developments through newsletters and training updates.', 'Learning', ARRAY['knowledge updates', 'learning', 'training', 'industry developments']);