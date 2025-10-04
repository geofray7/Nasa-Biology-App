
'use client';
import { useState, useEffect, useRef } from 'react';
import { Bot, Send, User2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// NASA Biology Knowledge Base - Comprehensive dataset from user prompt
const nasaKnowledgeBase = {
    microgravity_plants: {
        question: "What happens to plants in microgravity?",
        answer: `NASA's research shows that plants in microgravity experience significant changes:

**Root Development**: Arabidopsis thaliana roots show altered growth patterns and gravitropic responses. Without gravity cues, roots grow in more random directions.

**Gene Expression**: Studies from the International Space Station reveal changes in gene expression related to:
- Cell wall formation
- Stress response pathways
- Hormone signaling (auxin distribution)

**Practical Implications**: This research helps develop:
- Better plant growth systems for long-duration missions
- Food production for future Mars missions
- Understanding fundamental plant biology

*Source: NASA Plant Habitat experiments on ISS*`
    },
    
    space_radiation: {
        question: "How does space radiation affect DNA?",
        answer: `Space radiation poses significant challenges to biological organisms:

**Radiation Types in Space**:
- Galactic Cosmic Rays (GCRs)
- Solar Particle Events (SPEs)
- Trapped radiation in Van Allen belts

**DNA Damage Effects**:
- Double-strand breaks are more common
- Complex DNA lesions that are harder to repair
- Increased mutation rates

**NASA's Findings**:
- Mammalian cells show reduced repair efficiency in microgravity
- Some organisms have enhanced DNA repair mechanisms
- Radiation shielding effectiveness varies by material

**Current Research**:
- Developing better radiation protection
- Understanding combined effects of radiation and microgravity
- Identifying radiation-resistant organisms for space applications

*Source: NASA Space Radiation Laboratory studies*`
    },
    
    microbes_space: {
        question: "What is NASA studying about microbes in space?",
        answer: `NASA's microbial research focuses on several key areas:

**Microbial Behavior Changes**:
- Some bacteria become more virulent in space
- Altered antibiotic resistance patterns
- Changes in biofilm formation

**ISS Environmental Microbiology**:
- Regular monitoring of spacecraft surfaces
- Understanding microbial communities in closed systems
- Developing cleaning and sterilization protocols

**Beneficial Applications**:
- Waste processing using microbial systems
- Air revitalization
- Food production (fermentation, probiotics)

**Planetary Protection**:
- Preventing forward contamination (Earth to other planets)
- Preventing backward contamination (other planets to Earth)
- Sterilization techniques for spacecraft

*Source: NASA Microbiology Laboratory research*`
    },
    
    life_support: {
        question: "Tell me about life support systems",
        answer: `NASA's Advanced Life Support Systems research includes:

**Environmental Control**:
- Air revitalization (CO2 removal, O2 production)
- Temperature and humidity control
- Trace contaminant removal

**Water Recovery**:
- Recycling wastewater (including urine)
- Water purification technologies
- Monitoring water quality

**Food Production**:
- Plant growth systems (Veggie, Advanced Plant Habitat)
- Nutrient delivery systems
- Harvesting and food safety

**Current Systems on ISS**:
- Environmental Control and Life Support System (ECLSS)
- Water Recovery System
- Oxygen Generation System

**Future Developments**:
- Closed-loop systems for Mars missions
- Integration of biological and physical systems
- Reliability and maintenance optimization

*Source: NASA Life Support Systems research*`
    },
    
    arabidopsis_research: {
        question: "What NASA research exists on Arabidopsis?",
        answer: `Arabidopsis thaliana is a model organism for NASA's plant biology research:

**Key Experiments**:
- **Plant Growth Investigations**: Studying root and shoot development in microgravity
- **Gene Expression Analysis**: Identifying gravity-responsive genes
- **Cell Wall Research**: Understanding plant structural changes

**Major Findings**:
- Altered auxin distribution affects growth patterns
- Changes in cell wall composition and mechanics
- Stress response pathways are activated differently

**ISS Facilities Used**:
- Advanced Plant Habitat (APH)
- Vegetable Production System (Veggie)
- Biological Research in Canisters (BRIC)

**Importance**:
- Helps develop better crop plants for space
- Provides insights for terrestrial agriculture
- Understanding fundamental plant biology

*Source: NASA Space Biology Program*`
    },
    
    astronaut_health: {
        question: "How does space affect astronaut health?",
        answer: `NASA's Human Research Program studies these key effects:

**Bone Density Loss**:
- 1-2% bone mineral density loss per month in space
- Similar to osteoporosis but reversible upon return
- Exercise countermeasures help reduce loss

**Muscle Atrophy**:
- Rapid loss of muscle mass and strength
- Affects postural muscles most significantly
- Resistance exercise is primary countermeasure

**Vision Changes**:
- Spaceflight Associated Neuro-ocular Syndrome (SANS)
- Fluid shifts cause structural changes in eyes
- Affects approximately 2/3 of astronauts

**Immune System**:
- Altered immune cell function
- Increased latent virus reactivation
- Changes in inflammatory responses

**Radiation Risks**:
- Increased cancer risk
- Potential central nervous system effects
- Cardiovascular disease risks

*Source: NASA Human Research Program data*`
    },
    
    iss_experiments: {
        question: "What biology experiments are on the ISS?",
        answer: `The International Space Station hosts numerous biology experiments:

**Current Active Experiments**:

**Plant Habitat-03**: 
- Studies whether adaptations in one generation of plants grown in space can transfer to the next

**Rodent Research**:
- Examines effects of spaceflight on mammalian physiology
- Studies muscle and bone loss countermeasures

**Microbial Tracking**:
- Monitors microorganisms aboard the ISS
- Studies how microbes adapt to space environment

**BioNutrients**:
- Demonstrates technology to produce key nutrients from yeast

**Past Notable Experiments**:
- **Veggie**: Fresh food production in space
- **Twins Study**: Comprehensive study of identical twin astronauts
- **Microbial Observatory**: Long-term microbial monitoring

*Source: NASA ISS Science Reports*`
    },
    
    mars_biology: {
        question: "What biology research prepares us for Mars?",
        answer: `NASA's Mars-focused biology research includes:

**Radiation Protection**:
- Studying Martian radiation environment
- Developing effective shielding strategies
- Understanding biological effects of Mars-level radiation

**Life Support Systems**:
- Testing closed-loop systems for longer missions
- Developing reliable food production methods
- Water recycling and air revitalization technologies

**Human Factors**:
- Psychological effects of long-duration isolation
- Team dynamics in confined environments
- Medical capabilities for Mars missions

**Planetary Protection**:
- Sterilizing spacecraft to prevent contamination
- Protocols for handling potential Martian samples
- Protecting Earth from backward contamination

**In-Situ Resource Utilization**:
- Using Martian resources for life support
- Potential for growing plants in Martian soil simulants
- Water extraction from Martian environment

*Source: NASA Mars Exploration Program*`
    }
};

const getCurrentTime = () => {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + 
           now.getMinutes().toString().padStart(2, '0');
};

const initialMessage = {
    role: 'assistant',
    text: `Hello! I'm your NASA Biology & Space Research Assistant. I'm trained on NASA's official biology datasets and research papers. I can help you with questions about:

• Microgravity effects on plants and organisms
• Space radiation biology
• Closed life support systems
• Astrobiology and planetary protection
• ISS biological experiments
• NASA dataset information

What would you like to know about NASA's biology research?`,
    time: getCurrentTime()
};

const suggestions = [
    { question: "What happens to plants in microgravity?", label: "🌱 Plants in microgravity" },
    { question: "How does space radiation affect DNA?", label: "🧬 Space radiation effects" },
    { question: "What is NASA studying about microbes in space?", label: "🦠 Microbes in space" },
    { question: "Tell me about life support systems", label: "🔬 Life support systems" }
];


export default function AiResearchCopilotPage() {
    const [messages, setMessages] = useState([initialMessage]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isTyping]);

    const handleSendMessage = () => {
        const trimmedInput = inputValue.trim();
        if (!trimmedInput) return;

        setMessages(prev => [...prev, { role: 'user', text: trimmedInput, time: getCurrentTime() }]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            const response = generateAIResponse(trimmedInput);
            setIsTyping(false);
            setMessages(prev => [...prev, { role: 'assistant', text: response, time: getCurrentTime() }]);
        }, 1500 + Math.random() * 1000);
    };

    const handleSuggestionClick = (question: string) => {
        setInputValue(question);
        // We need to trigger send after state update
        setTimeout(() => document.getElementById('sendButton')?.click(), 0);
    }
    
    const generateAIResponse = (userMessage: string) => {
        const lowerMessage = userMessage.toLowerCase();
        
        for (const [, data] of Object.entries(nasaKnowledgeBase)) {
            if (lowerMessage.includes(data.question.toLowerCase()) || 
                data.question.toLowerCase().includes(lowerMessage)) {
                return data.answer;
            }
        }
        
        // Keyword matches
        const keywords = [
            { keys: ['plant', 'arabidopsis', 'root'], responseKey: 'arabidopsis_research' },
            { keys: ['radiation', 'dna', 'genetic'], responseKey: 'space_radiation' },
            { keys: ['microbe', 'bacteria', 'virus'], responseKey: 'microbes_space' },
            { keys: ['life support', 'ecosystem', 'closed'], responseKey: 'life_support' },
            { keys: ['astronaut', 'health', 'human'], responseKey: 'astronaut_health' },
            { keys: ['iss', 'space station', 'experiment'], responseKey: 'iss_experiments' },
            { keys: ['mars', 'red planet', 'martian'], responseKey: 'mars_biology' },
            { keys: ['microgravity', 'zero gravity', 'weightless'], responseKey: 'microgravity_plants' },
        ];

        for(const {keys, responseKey} of keywords) {
            if(keys.some(key => lowerMessage.includes(key))) {
                return (nasaKnowledgeBase as any)[responseKey].answer;
            }
        }
        
        // Default response
        return `I'm specifically trained on NASA biology and space research datasets. I can help you with questions about:

• Plant growth in microgravity (Arabidopsis, crop plants)
• Space radiation effects on biological systems
• Microbial behavior in space environments  
• Life support systems and closed ecosystems
• Astronaut health and physiology
• ISS biological experiments
• Mars mission preparation biology
• Planetary protection protocols

Could you please rephrase your question or ask about one of these NASA biology topics?`;
    }

    return (
        <div className="flex justify-center items-center h-full bg-gradient-to-br from-[#0a1128] to-[#1a243d] p-4">
            <div className="w-full max-w-4xl h-[90vh] bg-[#1a243d]/95 rounded-2xl shadow-2xl border border-[#2d3a5c] flex flex-col overflow-hidden">
                <div className="bg-[#0b3d91]/90 p-5 text-center border-b border-[#2d3a5c]">
                    <h1 className="text-2xl font-bold mb-1">🚀 NASA BioSpace Assistant</h1>
                    <p className="text-sm text-[#b8c2d6]">Ask me anything about NASA biology and space research</p>
                </div>

                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={cn('flex gap-3 max-w-[85%] animate-[fadeIn_0.3s_ease-in]', msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start')}>
                            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-lg', msg.role === 'user' ? 'bg-[#fc3d21]' : 'bg-[#0b3d91]')}>
                                {msg.role === 'user' ? '👨‍🚀' : '🤖'}
                            </div>
                            <div className={cn('bg-white/10 p-4 rounded-2xl', msg.role === 'user' ? 'bg-[#0b3d91] rounded-tr-md' : 'rounded-tl-md')}>
                                <p className="text-base whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                <p className="text-xs text-[#b8c2d6] mt-2 text-right">{msg.time}</p>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                         <div className="flex items-center gap-3 self-start">
                             <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-lg bg-[#0b3d91]">🤖</div>
                            <div className="flex items-center gap-2 p-4 bg-white/10 rounded-2xl rounded-tl-md">
                                <div className="w-2 h-2 rounded-full bg-[#b8c2d6] animate-[typing_1.4s_infinite_ease-in-out] [animation-delay:-0.32s]"></div>
                                <div className="w-2 h-2 rounded-full bg-[#b8c2d6] animate-[typing_1.4s_infinite_ease-in-out] [animation-delay:-0.16s]"></div>
                                <div className="w-2 h-2 rounded-full bg-[#b8c2d6] animate-[typing_1.4s_infinite_ease-in-out]"></div>
                            </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-5 border-t border-[#2d3a5c] bg-[#1a243d]/80">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion.question)}
                                className="bg-[#0b3d91]/30 border border-[#2d3a5c] text-[#b8c2d6] px-4 py-2 rounded-full text-sm cursor-pointer transition-all hover:bg-[#0b3d91]/50 hover:text-white hover:-translate-y-0.5"
                            >
                                {suggestion.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-3 items-center">
                        <input
                            type="text"
                            id="userInput"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask about NASA biology research..."
                            autoComplete="off"
                            className="flex-1 px-5 py-3 bg-white/10 border border-[#2d3a5c] rounded-full text-white placeholder:text-[#b8c2d6] focus:outline-none focus:border-[#0b3d91] focus:bg-white/15 transition-all"
                        />
                        <button
                            id="sendButton"
                            onClick={handleSendMessage}
                            className="w-12 h-12 rounded-full bg-[#0b3d91] text-white flex items-center justify-center transition-all hover:bg-[#1e5bc9] hover:scale-105 active:scale-95"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes typing {
                    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                    40% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
