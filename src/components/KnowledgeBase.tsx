import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, BookOpen, HelpCircle, Brain, Users, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeBaseItem {
  id: string;
  title: string;
  content: string;
  category: string;
  module_number: number | null;
  section: string | null;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

const KnowledgeBase = () => {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeBaseItem[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<KnowledgeBaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchKnowledgeBase();
    fetchFAQs();
  }, []);

  const fetchKnowledgeBase = async () => {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('is_searchable', true)
        .order('module_number', { ascending: true, nullsFirst: false })
        .order('title', { ascending: true });

      if (error) throw error;
      setKnowledgeItems(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('knowledge_faq')
        .select('*')
        .order('question', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('search_knowledge_base', {
        search_query: searchQuery
      });

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Search Error",
        description: error.message,
      });
    }
  };

  const groupedItems = knowledgeItems.reduce((acc, item) => {
    const key = item.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, KnowledgeBaseItem[]>);

  const moduleItems = knowledgeItems.filter(item => item.module_number !== null);
  const groupedModules = moduleItems.reduce((acc, item) => {
    const key = `Module ${item.module_number}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, KnowledgeBaseItem[]>);

  const agentReference = knowledgeItems.filter(item => item.category === 'Agent Reference');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Course Content':
        return <BookOpen className="h-5 w-5" />;
      case 'Agent Reference':
        return <Brain className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading knowledge base...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">AptivAI Knowledge Base</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Comprehensive AI course content and reference materials for agents and staff
        </p>
      </div>

      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Knowledge Base
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search for AI concepts, tools, or best practices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold">Search Results:</h3>
              {searchResults.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-start gap-2">
                    {item.module_number && (
                      <Badge variant="secondary">Module {item.module_number}</Badge>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.content}</p>
                      {item.section && (
                        <Badge variant="outline" className="mt-2">{item.section}</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modules">Course Modules</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="agents">Agent Reference</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="modules">
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">AI for Non-Technical Staff Course</h2>
              <p className="text-muted-foreground">Complete course content organized by modules</p>
            </div>
            
            {Object.entries(groupedModules).map(([module, items]) => (
              <Card key={module}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {module}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {items.map((item, index) => (
                      <AccordionItem key={item.id} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center gap-2">
                            <span>{item.title}</span>
                            {item.section && (
                              <Badge variant="outline">{item.section}</Badge>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground leading-relaxed">
                            {item.content}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {category}
                  </CardTitle>
                  <CardDescription>
                    {items.length} item{items.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {items.map((item, index) => (
                      <AccordionItem key={item.id} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center gap-2">
                            <span>{item.title}</span>
                            {item.module_number && (
                              <Badge variant="secondary">Module {item.module_number}</Badge>
                            )}
                            {item.section && (
                              <Badge variant="outline">{item.section}</Badge>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground leading-relaxed">
                            {item.content}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="agents">
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2 flex items-center justify-center gap-2">
                <Brain className="h-6 w-6" />
                Agent Reference
              </h2>
              <p className="text-muted-foreground">Guidelines and best practices for AI agents</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Agent Guidelines & Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {agentReference.map((item, index) => (
                    <AccordionItem key={item.id} value={`agent-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.content}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="faq">
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2 flex items-center justify-center gap-2">
                <HelpCircle className="h-6 w-6" />
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">Quick answers to common questions about AI</p>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <Accordion type="single" collapsible>
                  {faqs.map((faq, index) => (
                    <AccordionItem key={faq.id} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <span>{faq.question}</span>
                          {faq.category && (
                            <Badge variant="outline">{faq.category}</Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeBase;