import { ChatInterface } from './chat-interface';

export const metadata = {
  title: 'AI Research Co-Pilot',
};

export default function AiResearchCopilotPage() {
  return (
    <div className="h-full flex flex-col -m-4 sm:-m-6 lg:-m-8">
      <div className="text-center py-4 border-b">
        <h1 className="text-2xl font-headline font-bold">
          AI Research Co-Pilot
        </h1>
        <p className="text-muted-foreground text-sm">
          Ask me anything about NASA's bioscience research papers.
        </p>
      </div>
      <ChatInterface />
    </div>
  );
}
