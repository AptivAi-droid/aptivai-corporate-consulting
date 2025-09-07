import KnowledgeBase from '@/components/KnowledgeBase';
import Navigation from '@/components/navigation';

const KnowledgeBasePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
        <KnowledgeBase />
      </div>
    </div>
  );
};

export default KnowledgeBasePage;