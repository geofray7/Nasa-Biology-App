
'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dna,
  Search,
  Download,
  BarChart,
  Info,
  ChevronRight,
  AlertTriangle,
  HeartPulse,
  Code,
  FlaskConical,
   Languages,
  Loader
} from 'lucide-react';

const DNAExplorer = () => {
  const [dnaSequence, setDnaSequence] = useState('');
  const [baseCount, setBaseCount] = useState(0);
  const [geneCount, setGeneCount] = useState(0);
  const [mutationCount, setMutationCount] = useState(0);
  const [riskCount, setRiskCount] = useState(0);
  const [baseDistribution, setBaseDistribution] = useState([]);
  const [geneTypes, setGeneTypes] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [geneSearchTerm, setGeneSearchTerm] = useState('');
  const [geneResults, setGeneResults] = useState<any[]>([]);
  const [translateInput, setTranslateInput] = useState('');
  const [proteinResult, setProteinResult] = useState('');
  const [chartMode, setChartMode] = useState('dna');

  const dnaSequences = [
    "ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG",
    "GCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTA",
    "TTAGCTTAGCTTAGCTTAGCTTAGCTTAGCTTAGCTTAGCTTAGCTTAGCTTAGCTTAGCTTAGCTTAGCTTAGCTTAGC",
    "CGAATCGATCGAATCGATCGAATCGATCGAATCGATCGAATCGATCGAATCGATCGAATCGATCGAATCGATCGAATCGA"
  ];
  const genes = [
      { name: "BRCA1", description: "Breast cancer type 1 susceptibility protein" },
      { name: "TP53", description: "Cellular tumor antigen p53" },
      { name: "CFTR", description: "Cystic fibrosis transmembrane conductance regulator" },
      { name: "HBB", description: "Hemoglobin subunit beta" },
      { name: "APOE", description: "Apolipoprotein E" },
      { name: "FTO", description: "Fat mass and obesity-associated protein" },
      { name: "MTHFR", description: "Methylenetetrahydrofolate reductase" }
  ];
  
  const generateDNASequence = () => {
    const randomSequence = dnaSequences[Math.floor(Math.random() * dnaSequences.length)];
    setDnaSequence(randomSequence);
    updateStats(randomSequence);
    setSearchText('');
    setHighlightedIndices([]);
    analyzeSequence(randomSequence);
  };
  
  const updateStats = (sequence: string) => {
    setBaseCount(sequence.length);
    setGeneCount(Math.floor(Math.random() * 15) + 5);
    setMutationCount(Math.floor(Math.random() * 10) + 1);
    setRiskCount(Math.floor(Math.random() * 5));
  };
  
  const analyzeSequence = (sequence: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
        updateChartData(sequence, chartMode);
        setIsAnalyzing(false);
    }, 1500)
  };

  const updateChartData = (sequence:string, mode: string) => {
    const counts: { [key: string]: number } = { A: 0, T: 0, C: 0, G: 0, U: 0 };
    for (const base of sequence) {
        if(counts[base] !== undefined) counts[base]++;
    }

    if (mode === 'dna') {
        setBaseDistribution([
            { name: 'Adenine', value: counts.A, color: '#ef4444' },
            { name: 'Thymine', value: counts.T, color: '#22c55e' },
            { name: 'Cytosine', value: counts.C, color: '#3b82f6' },
            { name: 'Guanine', value: counts.G, color: '#f59e0b' },
        ]);
    } else { // RNA
        setBaseDistribution([
            { name: 'Adenine', value: counts.A, color: '#ef4444' },
            { name: 'Uracil', value: counts.T, color: '#8b5cf6' }, // Assuming T -> U
            { name: 'Cytosine', value: counts.C, color: '#3b82f6' },
            { name: 'Guanine', value: counts.G, color: '#f59e0b' },
        ]);
    }

    setGeneTypes([
        { name: 'Protein Coding', value: 60, color: '#3b82f6' },
        { name: 'RNA Genes', value: 20, color: '#a855f7' },
        { name: 'Pseudogenes', value: 10, color: '#ef4444' },
        { name: 'Regulatory', value: 10, color: '#f59e0b' },
    ]);
  }

  const handleSequenceSearch = () => {
    if (!searchText) {
        setHighlightedIndices([]);
        return;
    }
    const indices: number[] = [];
    let startIndex = 0;
    while((startIndex = dnaSequence.indexOf(searchText.toUpperCase(), startIndex)) > -1) {
        for(let i=0; i < searchText.length; i++) {
            indices.push(startIndex + i);
        }
        startIndex += 1;
    }
    setHighlightedIndices(indices);
  };
  
  const handleGeneSearch = () => {
    if (!geneSearchTerm) {
        setGeneResults([]);
        return;
    }
    const results = genes.filter(gene =>
        gene.name.toLowerCase().includes(geneSearchTerm.toLowerCase()) ||
        gene.description.toLowerCase().includes(geneSearchTerm.toLowerCase())
    );
    setGeneResults(results);
  };
  
  const handleTranslate = () => {
    const codonTable: { [key: string]: string } = {
        'ATG': 'M', 'TAA': '*', 'TAG': '*', 'TGA': '*', 'GCT': 'A', 'GCC': 'A', 'GCA': 'A', 'GCG': 'A',
        'CGT': 'R', 'CGC': 'R', 'CGA': 'R', 'CGG': 'R', 'AGA': 'R', 'AGG': 'R', 'AAT': 'N', 'AAC': 'N',
        'GAT': 'D', 'GAC': 'D', 'TGT': 'C', 'TGC': 'C', 'CAA': 'Q', 'CAG': 'Q', 'GAA': 'E', 'GAG': 'E',
        'GGT': 'G', 'GGC': 'G', 'GGA': 'G', 'GGG': 'G', 'CAT': 'H', 'CAC': 'H', 'ATT': 'I', 'ATC': 'I', 'ATA': 'I',
        'TTA': 'L', 'TTG': 'L', 'CTT': 'L', 'CTC': 'L', 'CTA': 'L', 'CTG': 'L', 'AAA': 'K', 'AAG': 'K',
        'TTT': 'F', 'TTC': 'F', 'CCT': 'P', 'CCC': 'P', 'CCA': 'P', 'CCG': 'P', 'TCT': 'S', 'TCC': 'S', 'TCA': 'S', 'TCG': 'S', 'AGT': 'S', 'AGC': 'S',
        'ACT': 'T', 'ACC': 'T', 'ACA': 'T', 'ACG': 'T', 'TGG': 'W', 'TAT': 'Y', 'TAC': 'Y', 'GTT': 'V', 'GTC': 'V', 'GTA': 'V', 'GTG': 'V'
    };
    
    let protein = '';
    const dna = translateInput.toUpperCase();
    for (let i = 0; i < dna.length - 2; i += 3) {
        const codon = dna.substring(i, i + 3);
        protein += codonTable[codon] || '?';
    }
    setProteinResult(protein || "No valid codons found");
  };

  useEffect(() => {
    generateDNASequence();
  }, []);
  
  useEffect(() => {
    if(dnaSequence) {
        updateChartData(dnaSequence, chartMode);
    }
  }, [chartMode]);

  const getBaseColor = (base: string) => {
    const colors: { [key: string]: string } = { 'A': 'text-red-400', 'T': 'text-green-400', 'C': 'text-blue-400', 'G': 'text-yellow-400' };
    return colors[base] || 'text-gray-400';
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-headline font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">DNA Cosmic Explorer</h1>
        <p className="text-muted-foreground">Advanced analysis of space-induced genetic changes</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>DNA Sequence Viewer</CardTitle>
            <div className="flex gap-2">
              <Button onClick={generateDNASequence}><Dna className="mr-2" /> Load New Sequence</Button>
              <Button variant="outline"><Download className="mr-2" /> Export</Button>
              <Button variant="outline" onClick={() => analyzeSequence(dnaSequence)} disabled={isAnalyzing}>
                {isAnalyzing ? <Loader className="animate-spin mr-2"/> : <BarChart className="mr-2" />}
                {isAnalyzing ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 font-mono text-lg leading-loose break-all max-h-48 overflow-y-auto mb-4">
            {dnaSequence.split('').map((base, index) => (
              <span key={index} className={`inline-block w-6 text-center rounded-md transition-all duration-200 ${getBaseColor(base)} ${highlightedIndices.includes(index) ? 'bg-yellow-400/30 scale-125' : ''}`}>
                {base}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="Search sequence (e.g. ATCG)" 
              value={searchText} 
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSequenceSearch()}
            />
            <Button onClick={handleSequenceSearch}><Search className="mr-2" /> Search</Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Code} title="Base Pairs" value={baseCount.toLocaleString()} color="primary" />
        <StatCard icon={Dna} title="Genes Identified" value={geneCount} color="purple" />
        <StatCard icon={AlertTriangle} title="Variants Detected" value={mutationCount} color="red" />
        <StatCard icon={HeartPulse} title="Health Risks" value={riskCount} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Base Pair Distribution</CardTitle>
                <div className="flex gap-2">
                    <Button variant={chartMode === 'dna' ? 'default' : 'outline'} onClick={() => setChartMode('dna')}>DNA</Button>
                    <Button variant={chartMode === 'rna' ? 'default' : 'outline'} onClick={() => setChartMode('rna')}>RNA</Button>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={baseDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Gene Types</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={geneTypes} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {geneTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                    <Legend />
                </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Search className="text-primary"/>
                    <CardTitle>Gene Finder</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2">
                    <Input 
                        placeholder="Enter gene name or ID (e.g. BRCA1)"
                        value={geneSearchTerm}
                        onChange={(e) => setGeneSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGeneSearch()}
                    />
                    <Button onClick={handleGeneSearch}>Find Gene</Button>
                </div>
                <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                    {geneResults.length > 0 ? geneResults.map(gene => (
                        <div key={gene.name} className="p-3 bg-muted/50 rounded-md">
                            <p className="font-semibold">{gene.name}</p>
                            <p className="text-sm text-muted-foreground">{gene.description}</p>
                        </div>
                    )) : geneSearchTerm && <p className="text-muted-foreground text-sm p-3">No genes found.</p>}
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Languages className="text-green-500"/>
                    <CardTitle>Sequence Translation</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <Textarea 
                    placeholder="Enter DNA sequence to translate (e.g. ATGCCGTA)" 
                    rows={3}
                    value={translateInput}
                    onChange={(e) => setTranslateInput(e.target.value)}
                />
                <Button className="mt-2" onClick={handleTranslate}>Translate to Protein</Button>
                <div className="mt-4">
                    <label className="text-sm font-medium">Protein Sequence</label>
                    <Textarea 
                        readOnly
                        rows={2}
                        value={proteinResult}
                        placeholder="Protein sequence appears here"
                    />
                </div>
            </CardContent>
        </Card>
      </div>

    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, color }: { icon: React.ElementType; title: string; value: string | number; color: string; }) => {
    const colors: { [key: string]: string } = {
        primary: 'text-primary bg-primary/10',
        purple: 'text-purple-400 bg-purple-400/10',
        red: 'text-red-400 bg-red-400/10',
        green: 'text-green-400 bg-green-400/10',
    }
    return (
        <Card className="hover:translate-y-[-5px] transition-transform duration-300">
            <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-lg ${colors[color]}`}>
                    <Icon className="size-8" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default DNAExplorer;

    