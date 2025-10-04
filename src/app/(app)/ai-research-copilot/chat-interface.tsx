'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Home,
  Bot,
  FileText,
  Database,
  BarChart,
  Settings,
  Rocket,
  Search,
  Bell,
  User,
  Trash,
  Plus,
  Circle,
  Lightbulb,
  File,
  FlaskConical,
  Dna,
  Share2,
  List,
  Paperclip,
  BrainCircuit,
  X,
  BookOpen,
  Download,
  Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// --- Backend Simulation Class (adapted for React state) ---
class NASABioSpaceBackend {
  data: any;

  constructor(initialData: any) {
    this.data = initialData;
  }

  saveData(newData: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nasaBioSpaceData', JSON.stringify(newData));
    }
  }

  // Paper methods
  getPapers() {
    return this.data.papers;
  }

  getPaper(id: number) {
    return this.data.papers.find((paper: any) => paper.id === id);
  }

  searchPapers(query: string) {
    const papers = this.getPapers();
    const lowerQuery = query.toLowerCase();
    return papers.filter(
      (paper: any) =>
        paper.title.toLowerCase().includes(lowerQuery) ||
        paper.abstract.toLowerCase().includes(lowerQuery) ||
        paper.authors.toLowerCase().includes(lowerQuery) ||
        paper.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Dataset methods
  getDatasets() {
    return this.data.datasets;
  }

  getDataset(id: number) {
    return this.data.datasets.find((dataset: any) => dataset.id === id);
  }

  // Analysis methods
  getAnalyses() {
    return this.data.analyses;
  }

  // Conversation methods
  getCurrentConversation() {
    return this.data.conversations.find(
      (conv: any) => conv.id === this.data.currentConversationId
    );
  }

  addMessageToConversation(role: string, content: string) {
    const conversation = this.getCurrentConversation();

    if (conversation) {
      const newMessage = {
        role: role,
        content: content,
        timestamp: new Date().toISOString(),
      };
      conversation.messages.push(newMessage);
      conversation.updatedAt = new Date().toISOString();
      return newMessage;
    }
    return null;
  }

  // Activity methods
  getActivities() {
    return this.data.activities;
  }

  addActivity(type: string, action: string, target: string) {
    const newActivity = {
      id:
        this.data.activities.length > 0
          ? Math.max(...this.data.activities.map((a: any) => a.id)) + 1
          : 1,
      type: type,
      action: action,
      target: target,
      timestamp: new Date().toISOString(),
    };

    this.data.activities.unshift(newActivity);
    if (this.data.activities.length > 10) {
      this.data.activities = this.data.activities.slice(0, 10);
    }
    return newActivity;
  }

  // AI Response Generation
  generateAIResponse(userMessage: string) {
    const lowerMessage = userMessage.toLowerCase();

    // Paper-related queries
    if (
      lowerMessage.includes('paper') ||
      lowerMessage.includes('research') ||
      lowerMessage.includes('study')
    ) {
      const papers = this.getPapers();
      if (lowerMessage.includes('arabidopsis') || lowerMessage.includes('plant')) {
        const plantPapers = papers.filter((p: any) =>
          p.tags.some((tag: string) =>
            ['plant', 'arabidopsis', 'root'].includes(tag)
          )
        );
        return this.formatPaperResponse(plantPapers, 'plant biology research');
      } else if (
        lowerMessage.includes('cyanobacteria') ||
        lowerMessage.includes('bacteria')
      ) {
        const bacteriaPapers = papers.filter((p: any) =>
          p.tags.some((tag: string) =>
            ['cyanobacteria', 'microbial'].includes(tag)
          )
        );
        return this.formatPaperResponse(bacteriaPapers, 'microbial research');
      } else if (
        lowerMessage.includes('radiation') ||
        lowerMessage.includes('dna')
      ) {
        const radiationPapers = papers.filter((p: any) =>
          p.tags.some((tag: string) => ['radiation', 'dna'].includes(tag))
        );
        return this.formatPaperResponse(
          radiationPapers,
          'radiation biology research'
        );
      } else {
        return this.formatPaperResponse(
          papers.slice(0, 3),
          'space biology research'
        );
      }
    }

    // Dataset-related queries
    if (lowerMessage.includes('dataset') || lowerMessage.includes('data')) {
      const datasets = this.getDatasets();
      if (lowerMessage.includes('image') || lowerMessage.includes('microscopy')) {
        const imagingDatasets = datasets.filter((d: any) => d.type === 'imaging');
        return this.formatDatasetResponse(imagingDatasets, 'imaging datasets');
      } else if (
        lowerMessage.includes('gene') ||
        lowerMessage.includes('expression')
      ) {
        const genomicsDatasets = datasets.filter(
          (d: any) => d.type === 'transcriptomics' || d.type === 'genomics'
        );
        return this.formatDatasetResponse(genomicsDatasets, 'genomics datasets');
      } else {
        return this.formatDatasetResponse(
          datasets.slice(0, 3),
          'NASA biology datasets'
        );
      }
    }

    // Analysis-related queries
    if (lowerMessage.includes('analyze') || lowerMessage.includes('analysis')) {
      return `I can help you analyze NASA biology datasets. I support several types of analyses:

- **Statistical Analysis** - PCA, clustering, differential expression
- **Bioinformatics** - Pathway enrichment, gene ontology, sequence analysis
- **Image Analysis** - Morphological measurements, pattern recognition

Which dataset would you like to analyze, or what specific analysis are you interested in?`;
    }

    // General space biology information
    if (
      lowerMessage.includes('microgravity') ||
      lowerMessage.includes('space') ||
      lowerMessage.includes('iss')
    ) {
      return `Microgravity research is a key focus of NASA's biological studies. Here are some key areas:

- **Plant Biology**: How plants grow and develop without gravity cues
- **Microbial Behavior**: Changes in microbial growth and virulence
- **Human Physiology**: Effects on bone density, muscle mass, and immune function
- **Radiation Biology**: DNA damage and repair in space environments

Would you like me to find specific research papers or datasets on any of these topics?`;
    }

    // Default response
    return `I'm your NASA Biology & Space Research Assistant! I can help you:

- Find and explore research papers on space biology
- Access and analyze NASA biological datasets
- Generate insights from space biology research
- Perform statistical and bioinformatics analyses

What specific area of space biology are you interested in?`;
  }

  formatPaperResponse(papers: any[], context: string) {
    if (papers.length === 0) {
      return `I couldn't find any ${context} papers matching your query. Try searching for different keywords.`;
    }

    let response = `Here are some relevant ${context} papers:\n\n`;

    papers.forEach((paper) => {
      response += `**${paper.title}**\n`;
      response += `*${paper.authors}* (${paper.year})\n`;
      response += `${paper.abstract.substring(0, 150)}...\n`;
      response += `Tags: ${paper.tags.slice(0, 3).join(', ')}\n\n`;
    });

    response +=
      'Would you like more details about any of these papers, or should I search for something else?';
    return response;
  }

  formatDatasetResponse(datasets: any[], context: string) {
    if (datasets.length === 0) {
      return `I couldn't find any ${context} matching your query.`;
    }

    let response = `Here are some ${context} available:\n\n`;

    datasets.forEach((dataset) => {
      response += `**${dataset.name}**\n`;
      response += `Type: ${dataset.type} | Size: ${dataset.size} | Records: ${dataset.records}\n`;
      response += `${dataset.description}\n`;
      response += `Access: ${dataset.access}\n\n`;
    });

    response +=
      'Would you like to explore any of these datasets further or perform an analysis?';
    return response;
  }
}

// --- Helper Functions ---
const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getTimeAgo = (date: string | Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / (3600000 * 24));

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

// --- Main Component ---
export default function AiResearchCopilotPage() {
  const [data, setData] = useState<any | null>(null);
  const [backend, setBackend] = useState<NASABioSpaceBackend | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [copilotInput, setCopilotInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [modalContent, setModalContent] = useState<
    { type: 'paper'; id: number } | { type: 'dataset'; id: number } | null
  >(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialData = localStorage.getItem('nasaBioSpaceData');
    let loadedData;
    if (initialData) {
      loadedData = JSON.parse(initialData);
    } else {
      const be = new NASABioSpaceBackend({} as any); // temp backend to get initial data
      const demoData = {
         user: {
            id: 1,
            name: "Dr. Alex Researcher",
            role: "Space Biologist",
            institution: "NASA Ames Research Center",
            specialization: "Microgravity Biology"
        },
        papers: [
            { 
                id: 1, 
                title: "Effects of Microgravity on Arabidopsis thaliana Root Development", 
                authors: "Smith, J., Johnson, M., Williams, R., et al.",
                abstract: "This study investigates the morphological and genetic responses of Arabidopsis thaliana roots to microgravity conditions aboard the International Space Station. Our findings reveal significant alterations in root architecture and gene expression patterns related to gravitropism.",
                journal: "Space Biology Research",
                year: 2023,
                citations: 42,
                tags: ["microgravity", "arabidopsis", "root development", "gene expression"],
                datasetIds: [1, 3],
                url: "https://example.com/paper1",
                addedDate: new Date('2023-08-15').toISOString()
            },
            { 
                id: 2, 
                title: "Metabolic Adaptation of Cyanobacteria in Simulated Martian Environment", 
                authors: "Chen, L., Rodriguez, K., Thompson, P., et al.",
                abstract: "We examined the metabolic changes in cyanobacteria exposed to Martian atmospheric conditions. Results indicate enhanced production of protective pigments and altered carbon fixation pathways, suggesting potential for life support systems.",
                journal: "Astrobiology Journal",
                year: 2023,
                citations: 28,
                tags: ["cyanobacteria", "martian environment", "metabolism", "life support"],
                datasetIds: [2],
                url: "https://example.com/paper2",
                addedDate: new Date('2023-09-02').toISOString()
            },
            { 
                id: 3, 
                title: "Radiation Effects on Mammalian Cell Cultures in Deep Space Conditions", 
                authors: "Davis, S., Miller, A., Wilson, T., et al.",
                abstract: "This research characterizes DNA damage and repair mechanisms in mammalian cells exposed to cosmic radiation levels equivalent to deep space missions. Findings have implications for astronaut health and radiation protection strategies.",
                journal: "Radiation Research",
                year: 2022,
                citations: 67,
                tags: ["radiation", "mammalian cells", "DNA damage", "space missions"],
                datasetIds: [4],
                url: "https://example.com/paper3",
                addedDate: new Date('2023-07-20').toISOString()
            },
            { 
                id: 4, 
                title: "Microbial Community Dynamics in Closed Life Support Systems", 
                authors: "Garcia, M., Lee, H., Brown, D., et al.",
                abstract: "Long-term analysis of microbial populations in simulated closed life support systems reveals complex ecological interactions and stability patterns crucial for extended space missions.",
                journal: "Applied and Environmental Microbiology",
                year: 2023,
                citations: 31,
                tags: ["microbiome", "life support", "closed systems", "ecology"],
                datasetIds: [5],
                url: "https://example.com/paper4",
                addedDate: new Date('2023-10-05').toISOString()
            }
        ],
        datasets: [
            {
                id: 1,
                name: "Arabidopsis Root Imaging - ISS Expedition 65",
                description: "High-resolution microscopy images of Arabidopsis thaliana roots grown in microgravity conditions",
                type: "imaging",
                size: "15.2 GB",
                records: "2,450 images",
                source: "International Space Station",
                year: 2022,
                tags: ["plant biology", "microgravity", "ISS", "imaging"],
                papers: [1],
                access: "public",
                url: "https://example.com/dataset1"
            },
            {
                id: 2,
                name: "Cyanobacteria Metabolic Profiling - Mars Simulation",
                description: "Comprehensive metabolomics data from cyanobacteria exposed to simulated Martian conditions",
                type: "metabolomics",
                size: "8.7 GB",
                records: "15,342 compounds",
                source: "NASA Ames Research Center",
                year: 2023,
                tags: ["cyanobacteria", "metabolomics", "mars simulation", "life support"],
                papers: [2],
                access: "public",
                url: "https://example.com/dataset2"
            },
            {
                id: 3,
                name: "Arabidopsis Transcriptome - Microgravity Response",
                description: "RNA sequencing data showing gene expression changes in Arabidopsis under microgravity",
                type: "transcriptomics",
                size: "12.5 GB",
                records: "28,000 genes",
                source: "International Space Station",
                year: 2023,
                tags: ["transcriptomics", "arabidopsis", "gene expression", "microgravity"],
                papers: [1],
                access: "public",
                url: "https://example.com/dataset3"
            },
            {
                id: 4,
                name: "Mammalian Cell Radiation Response - Cosmic Ray Exposure",
                description: "Comprehensive dataset on DNA damage and repair in mammalian cells exposed to space radiation",
                type: "genomics",
                size: "22.1 GB",
                records: "5,200 samples",
                source: "NASA Space Radiation Laboratory",
                year: 2022,
                tags: ["radiation", "mammalian cells", "DNA damage", "genomics"],
                papers: [3],
                access: "restricted",
                url: "https://example.com/dataset4"
            },
            {
                id: 5,
                name: "Microbiome Analysis - Closed System Ecology",
                description: "16S rRNA sequencing data from microbial communities in simulated closed life support systems",
                type: "microbiome",
                size: "7.8 GB",
                records: "1,200 samples",
                source: "NASA Johnson Space Center",
                year: 2023,
                tags: ["microbiome", "closed systems", "ecology", "16S rRNA"],
                papers: [4],
                access: "public",
                url: "https://example.com/dataset5"
            }
        ],
        analyses: [
            {
                id: 1,
                name: "Root Architecture PCA",
                description: "Principal Component Analysis of Arabidopsis root morphology in microgravity",
                type: "statistical",
                datasetIds: [1],
                paperIds: [1],
                status: "completed",
                createdAt: new Date('2023-08-20').toISOString(),
                results: "Significant separation of microgravity samples along PC1"
            },
            {
                id: 2,
                name: "Metabolic Pathway Enrichment",
                description: "Enrichment analysis of altered metabolic pathways in Martian conditions",
                type: "bioinformatics",
                datasetIds: [2],
                paperIds: [2],
                status: "completed",
                createdAt: new Date('2023-09-10').toISOString(),
                results: "5 significantly enriched pathways related to stress response"
            }
        ],
        conversations: [
            {
                id: 1,
                messages: [
                    {
                        role: "assistant",
                        content: "Hello! I'm your NASA Biology & Space Research Assistant. I can help you explore research papers, analyze datasets, and generate insights about space biology. What would you like to know?",
                        timestamp: new Date(Date.now() - 3600000).toISOString()
                    }
                ],
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                updatedAt: new Date(Date.now() - 3600000).toISOString()
            }
        ],
        activities: [
            {
                id: 1,
                type: "paper",
                action: "added to library",
                target: "Effects of Microgravity on Arabidopsis thaliana Root Development",
                timestamp: new Date(Date.now() - 2 * 24 * 3600000).toISOString()
            },
            {
                id: 2,
                type: "analysis",
                action: "completed",
                target: "Root Architecture PCA",
                timestamp: new Date(Date.now() - 1 * 24 * 3600000).toISOString()
            },
            {
                id: 3,
                type: "dataset",
                action: "accessed",
                target: "Arabidopsis Root Imaging - ISS Expedition 65",
                timestamp: new Date(Date.now() - 12 * 3600000).toISOString()
            },
            {
                id: 4,
                type: "paper",
                action: "cited in analysis",
                target: "Metabolic Adaptation of Cyanobacteria in Simulated Martian Environment",
                timestamp: new Date(Date.now() - 6 * 3600000).toISOString()
            }
        ],
        currentConversationId: 1
      };
      localStorage.setItem('nasaBioSpaceData', JSON.stringify(demoData));
      loadedData = demoData;
    }

    setData(loadedData);
    setBackend(new NASABioSpaceBackend(loadedData));
  }, []);

  const updateData = (newData: any) => {
    setData(newData);
    localStorage.setItem('nasaBioSpaceData', JSON.stringify(newData));
    if (backend) {
      backend.data = newData;
    }
  };

  const handleSendMessage = () => {
    if (!copilotInput.trim() || !backend) return;

    const newData = { ...data };

    // Add user message
    const conversation = newData.conversations.find(
      (c: any) => c.id === newData.currentConversationId
    );
    if (!conversation) return;

    conversation.messages.push({
      role: 'user',
      content: copilotInput,
      timestamp: new Date().toISOString(),
    });
    conversation.updatedAt = new Date().toISOString();

    setCopilotInput('');
    setIsTyping(true);
    updateData(newData);

    setTimeout(() => {
      const aiResponse = backend.generateAIResponse(copilotInput);
      conversation.messages.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      });
      conversation.updatedAt = new Date().toISOString();
      setIsTyping(false);
      updateData({ ...newData }); // Trigger re-render
    }, 1500);
  };
  
  const handleClearChat = () => {
    if (!backend) return;
    const newData = { ...data };
    const conversation = newData.conversations.find(
      (c: any) => c.id === newData.currentConversationId
    );
    if(conversation) {
      conversation.messages = [conversation.messages[0]]; // keep welcome message
      updateData(newData);
    }
  }
  
  useEffect(() => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data?.conversations, isTyping]);


  if (!backend || !data) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const currentConversation = data.conversations.find(
      (c: any) => c.id === data.currentConversationId
    );
    
  const getToolIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if(lowerName.includes('gene')) return Dna;
    if(lowerName.includes('pathway')) return Share2;
    if(lowerName.includes('image')) return File;
    if(lowerName.includes('statistical')) return BarChart;
    if(lowerName.includes('sequence')) return FileText;
    if(lowerName.includes('network')) return BrainCircuit;
    return FlaskConical;
  }
  
  const getDatasetIcon = (type: string) => {
    switch (type) {
      case 'imaging': return File;
      case 'transcriptomics': return Dna;
      case 'metabolomics': return FlaskConical;
      case 'genomics': return Dna;
      case 'microbiome': return Share2;
      default: return Database;
    }
  }
  
  const getActivityIcon = (type: string) => {
      switch (type) {
          case 'paper': return BookOpen;
          case 'dataset': return Database;
          case 'analysis': return BarChart;
          default: return Lightbulb;
      }
  }
  
  const Modal = () => {
    if (!modalContent) return null;
    
    let title = '';
    let content = null;
    
    if (modalContent.type === 'paper') {
      const paper = backend.getPaper(modalContent.id);
      if (!paper) return null;
      
      const relatedDatasets = paper.datasetIds.map((id: number) => backend.getDataset(id)).filter(Boolean);
      
      title = paper.title;
      content = (
        <div>
          <div className="mb-4">
            <label className="font-semibold text-sm text-text-secondary">Authors</label>
            <p>{paper.authors}</p>
          </div>
          <div className="mb-4">
            <label className="font-semibold text-sm text-text-secondary">Journal & Year</label>
            <p>{paper.journal}, {paper.year} | Citations: {paper.citations}</p>
          </div>
          <div className="mb-4">
            <label className="font-semibold text-sm text-text-secondary">Abstract</label>
            <p className="text-text-secondary">{paper.abstract}</p>
          </div>
          {relatedDatasets.length > 0 && (
            <div className="mb-4">
              <label className="font-semibold text-sm text-text-secondary">Related Datasets</label>
              {relatedDatasets.map((ds: any) => (
                <div key={ds.id} className="p-3 bg-background rounded-md mt-2 border border-border">
                  <p className="font-semibold">{ds.name}</p>
                  <p className="text-xs text-text-secondary">{ds.description}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2 mt-6">
              <Button><Download className="mr-2"/> Download</Button>
              <Button variant="outline"><Quote className="mr-2"/> Cite</Button>
              <Button variant="outline"><BarChart className="mr-2"/> Analyze Data</Button>
          </div>
        </div>
      );
    } else { // dataset
      const dataset = backend.getDataset(modalContent.id);
      if (!dataset) return null;

      const relatedPapers = dataset.papers.map((id: number) => backend.getPaper(id)).filter(Boolean);

      title = dataset.name;
      content = (
        <div>
          <div className="mb-4">
            <label className="font-semibold text-sm text-text-secondary">Description</label>
            <p>{dataset.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div><strong className="text-text-secondary">Type:</strong> {dataset.type}</div>
            <div><strong className="text-text-secondary">Size:</strong> {dataset.size}</div>
            <div><strong className="text-text-secondary">Records:</strong> {dataset.records}</div>
            <div><strong className="text-text-secondary">Source:</strong> {dataset.source}</div>
            <div><strong className="text-text-secondary">Year:</strong> {dataset.year}</div>
            <div><strong className="text-text-secondary">Access:</strong> {dataset.access}</div>
          </div>
           {relatedPapers.length > 0 && (
            <div className="mb-4">
              <label className="font-semibold text-sm text-text-secondary">Related Papers</label>
              {relatedPapers.map((p: any) => (
                <div key={p.id} className="p-3 bg-background rounded-md mt-2 border border-border">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-xs text-text-secondary">{p.authors} ({p.year})</p>
                </div>
              ))}
            </div>
          )}
           <div className="flex gap-2 mt-6">
              <Button><Download className="mr-2"/> Download</Button>
              <Button variant="outline"><BarChart className="mr-2"/> Analyze</Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <div className="bg-card-bg rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col border border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">{title}</h3>
            <Button variant="ghost" size="icon" onClick={() => setModalContent(null)}><X/></Button>
          </div>
          <div className="overflow-y-auto pr-2">
            {content}
          </div>
        </div>
      </div>
    );
  }

  const renderTabs = () => {
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'copilot', label: 'AI Copilot', icon: Bot },
        { id: 'papers', label: 'Research Papers', icon: FileText },
        { id: 'datasets', label: 'Datasets', icon: Database },
        { id: 'analyses', label: 'Analyses', icon: BarChart },
        { id: 'tools', label: 'Tools', icon: FlaskConical },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <ul className="space-y-1">
            {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                    <li 
                        key={tab.id}
                        className={`px-5 py-3 rounded-md transition-colors cursor-pointer flex items-center gap-3 ${activeTab === tab.id ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10'}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <Icon className="w-5 h-5"/>
                        <span>{tab.label}</span>
                    </li>
                )
            })}
        </ul>
    );
  }

  return (
    <div className="w-full h-full flex">
      {/* Sidebar */}
      <div className="w-[300px] bg-card-bg p-4 flex-shrink-0 flex-col border-r border-border hidden lg:flex">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="p-2 bg-primary rounded-lg">
            <Rocket className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">
            NASA <span className="text-red-500">BioSpace</span>
          </h2>
        </div>
        <nav className="mt-4 flex-1">
            {renderTabs()}
        </nav>
        <div className="mt-4 p-4 border-t border-border">
             <h3 className="text-sm font-semibold mb-3 text-text-secondary flex items-center gap-2"><BarChart/> Research Stats</h3>
             <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-text-secondary">Papers Analyzed</span> <span className="font-semibold">{data.papers.length}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Datasets</span> <span className="font-semibold">{data.datasets.length}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Analyses Run</span> <span className="font-semibold">{data.analyses.length}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Insights Found</span> <span className="font-semibold">312</span></div>
             </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent-1 bg-clip-text text-transparent">
            NASA Biology & Space Research Copilot
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input type="text" placeholder="Search papers, datasets..." className="bg-card-bg border border-border rounded-full pl-10 pr-4 py-2 w-72"/>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background"></span>
            </Button>
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Research Papers</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.papers.length}</div>
                </CardContent>
              </Card>
               <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">NASA Datasets</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.datasets.length}</div>
                </CardContent>
              </Card>
               <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Analyses Completed</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.analyses.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Insights Generated</CardTitle>
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">312</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* AI Copilot Section */}
              <div className="lg:col-span-2">
                  <Card className="h-[600px] flex flex-col">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-primary/20 rounded-full"><Bot className="w-5 h-5 text-primary"/></div>
                           <CardTitle>AI Research Copilot</CardTitle>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleClearChat}><Trash className="mr-2"/> Clear</Button>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col overflow-hidden">
                          <div className="flex-1 overflow-y-auto pr-4 space-y-4">
                              {currentConversation.messages.map((message: any, index: number) => {
                                  const isUser = message.role === 'user';
                                  return (
                                    <div key={index} className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
                                        {!isUser && <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><Bot/></div>}
                                        <div className={`p-3 rounded-lg max-w-[85%] ${isUser ? 'bg-primary/90' : 'bg-muted'}`}>
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                            <p className={`text-xs mt-1 ${isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{formatTime(message.timestamp)}</p>
                                        </div>
                                        {isUser && <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0"><User/></div>}
                                    </div>
                                  )
                              })}
                              {isTyping && (
                                <div className="flex items-start gap-3">
                                   <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><Bot/></div>
                                   <div className="p-3 rounded-lg bg-muted flex items-center gap-2">
                                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                                   </div>
                                </div>
                              )}
                              <div ref={messagesEndRef} />
                          </div>
                          <div className="mt-4 flex gap-2">
                            <input
                              type="text"
                              value={copilotInput}
                              onChange={(e) => setCopilotInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              placeholder="Ask about space biology..."
                              className="flex-1 bg-muted border border-border rounded-full px-4 py-2"
                            />
                            <Button onClick={handleSendMessage} size="icon" className="rounded-full">
                              <Paperclip />
                            </Button>
                          </div>
                      </CardContent>
                  </Card>
              </div>
              
              {/* Recent Activity */}
               <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto">
                     <ul className="space-y-4">
                        {data.activities.map((activity: any) => {
                           const Icon = getActivityIcon(activity.type);
                           return (
                            <li key={activity.id} className="flex gap-3">
                               <div className="p-2 bg-muted rounded-full h-fit"><Icon className="w-4 h-4 text-muted-foreground"/></div>
                               <div>
                                  <p className="text-sm">
                                    {activity.action} <span className="font-semibold text-primary/80">{activity.target}</span>
                                  </p>
                                  <p className="text-xs text-muted-foreground">{getTimeAgo(activity.timestamp)}</p>
                               </div>
                            </li>
                           )
                        })}
                     </ul>
                  </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {activeTab === 'papers' && (
          <Card>
            <CardHeader>
              <CardTitle>Research Papers</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.papers.map((paper: any) => (
                <Card key={paper.id} className="cursor-pointer hover:border-primary" onClick={() => setModalContent({type: 'paper', id: paper.id})}>
                  <CardHeader>
                    <CardTitle className="text-base">{paper.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">{paper.authors}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{paper.abstract}</p>
                    <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                      <span>{paper.year}</span>
                      <div className="flex gap-2">
                        {paper.tags.slice(0,3).map((tag:string) => <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">{tag}</span>)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
      <Modal/>
    </div>
  );
}