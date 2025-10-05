'use client';
import React, { useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useFirestore, useUser, FirestorePermissionError, errorEmitter } from '@/firebase';

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
  FlaskConical,
  AlertTriangle,
  HeartPulse,
  Code,
  Languages,
  Loader,
  Info,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

// --- Helper Types ---
interface Gene {
  id: string;
  symbol: string;
  name: string;
  function: string;
  space_effects: {
    radiation_sensitivity: string;
    impact: string;
    recommendation: string;
  };
}

interface AnalysisResult {
  sequence_length: number;
  gc_content: string;
  base_counts: { [key: string]: number };
  analysis_date: Date;
  space_predictions: {
    radiation_risk: string;
    predicted_mutation_rate: string;
    microgravity_impact: string;
    protection_recommendations: string[];
  };
}

// --- Main Component ---
const DNAExplorerPage = () => {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  // --- State Management ---
  const [dnaSequence, setDnaSequence] = useState(
    'ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAAATCTTAGAGTGTCCAATATGTCTGGAGTTGATCAAGGAACCTGTCTCCACAAAGTGTGACCACATATTTTGCAAATTTTGCATGCTGAAACTTCTCAACCAGAAGAAAGGGCCTTCACAATGTCTTT'
  );
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [searchText, setSearchText] = useState('');

  const [geneSearchTerm, setGeneSearchTerm] = useState('');
  const [geneResults, setGeneResults] = useState<Gene[]>([]);
  const [isGeneSearching, setIsGeneSearching] = useState(false);

  const [translateInput, setTranslateInput] = useState('ATGGTGCACCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGCTGCTGGTGGTCTACCCTTGGACCCAGAGGTTCTTTGAGTCCTTTGGGGATCTGTCCACTCCTGATGCTGTTATGGGCAACCCTAAGGTGAAGGCTCATGGCAAGAAAGTGCTCGGTGCCTTTAGTGATGGCCTGGCTCACCTGGACAACCTCAAGGGCACCTTTGCCACACTGAGTGAGCTGCACTGTGACAAGCTGCACGTGGATCCTGAGAACTTCAGGGTGAGTCTATGGGACGCTTGATGGG');
  const [proteinResult, setProteinResult] = useState('');
  
  const [analysisSequence, setAnalysisSequence] = useState(dnaSequence);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- Client-Side "Cloud Function" Logic ---

  // Equivalent to `analyzeDNA` Cloud Function
  const handleAnalyzeSequence = async () => {
    if (!analysisSequence) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a DNA sequence to analyze.' });
      return;
    }
    if (!user) {
      toast({ variant: 'destructive', title: 'Authentication Required', description: 'You must be signed in to save an analysis.' });
      return;
    }

    const validChars = /^[ATCGatcg]+$/;
    if (!validChars.test(analysisSequence)) {
      toast({ variant: 'destructive', title: 'Invalid Sequence', description: 'DNA sequence can only contain A, T, C, and G.' });
      return;
    }

    setIsAnalyzing(true);
    
    // Perform analysis
    const upperSeq = analysisSequence.toUpperCase();
    const analysis: Omit<AnalysisResult, 'space_predictions'> = {
      sequence_length: upperSeq.length,
      gc_content: ((upperSeq.match(/[GC]/g) || []).length / upperSeq.length * 100).toFixed(1),
      base_counts: {
        A: (upperSeq.match(/A/g) || []).length,
        T: (upperSeq.match(/T/g) || []).length,
        C: (upperSeq.match(/C/g) || []).length,
        G: (upperSeq.match(/G/g) || []).length,
      },
      analysis_date: new Date(),
    };

    // Predict space impacts
    const space_predictions = predictSpaceImpact(analysis);
    const fullAnalysis: AnalysisResult = { ...analysis, space_predictions };
    setAnalysisResult(fullAnalysis);

    // Save to user's analyses in Firestore
    const analysesCollection = collection(firestore, 'users', user.uid, 'dna_analyses');
    const analysisData = {
      userId: user.uid,
      originalSequence: upperSeq,
      sequenceLength: fullAnalysis.sequence_length,
      gcContent: Number(fullAnalysis.gc_content),
      analysisDate: serverTimestamp(),
      results: JSON.stringify({ // Store complex object as a string
        ...fullAnalysis,
        analysis_date: fullAnalysis.analysis_date.toISOString(),
      }),
      spacePredictions: JSON.stringify(fullAnalysis.space_predictions)
    };

    addDoc(analysesCollection, analysisData)
      .then(() => {
        toast({ title: 'Analysis Complete', description: 'DNA analysis has been successfully saved to your profile.' });
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: analysesCollection.path,
          operation: 'create',
          requestResourceData: analysisData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsAnalyzing(false);
      });
  };
  
  // Equivalent to `searchGene` Cloud Function
  const handleGeneSearch = async () => {
    if (!geneSearchTerm) {
      setGeneResults([]);
      return;
    }
    if (!user) {
        toast({ variant: "destructive", title: "Authentication Required", description: "You must be signed in to search for genes." });
        return;
    }
    setIsGeneSearching(true);
    try {
      const genesRef = collection(firestore, 'genes');
      const q = query(genesRef, where('symbol', '==', geneSearchTerm.toUpperCase()));
      const querySnapshot = await getDocs(q);
      
      let results: Gene[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as Gene);
      });
      
      if (results.length === 0) {
        toast({ variant: 'destructive', title: 'Not Found', description: `Gene "${geneSearchTerm}" not in database. Please add it via the Firebase console.` });
      }

      setGeneResults(results);
    } catch (error: any) {
        const permissionError = new FirestorePermissionError({
          path: 'genes',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
    } finally {
      setIsGeneSearching(false);
    }
  };
  
  // Equivalent to `predictSpaceImpact` internal function
  const predictSpaceImpact = (analysis: Pick<AnalysisResult, 'gc_content' | 'sequence_length'>) => {
    const gcContent = parseFloat(analysis.gc_content);
    
    let radiationRisk = "Low";
    if (gcContent > 60) radiationRisk = "High";
    else if (gcContent > 45) radiationRisk = "Medium";
    
    let mutationRate = "Normal";
    if (analysis.sequence_length > 10000) mutationRate = "25% increase expected";
    else if (analysis.sequence_length > 5000) mutationRate = "15% increase expected";
    
    return {
      radiation_risk: radiationRisk,
      predicted_mutation_rate: mutationRate,
      microgravity_impact: "Gene expression alterations likely",
      protection_recommendations: [
        "Regular DNA damage assessment",
        radiationRisk === "High" ? "Enhanced radiation shielding" : "Standard protection",
        "Antioxidant supplementation"
      ]
    };
  };

  // --- Frontend Logic ---

  const handleSequenceSearch = () => {
    if (!searchText) {
      setHighlightedIndices([]);
      return;
    }
    const upperSeq = dnaSequence.toUpperCase();
    const upperSearch = searchText.toUpperCase();
    const indices: number[] = [];
    let startIndex = 0;
    while ((startIndex = upperSeq.indexOf(upperSearch, startIndex)) > -1) {
      for (let i = 0; i < searchText.length; i++) {
        indices.push(startIndex + i);
      }
      startIndex += 1;
    }
    setHighlightedIndices(indices);
    if (indices.length === 0) {
        toast({ title: 'Not Found', description: 'Sequence not found in the viewer.' });
    }
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
    const dna = translateInput.toUpperCase().replace(/[^ATCG]/g, '');
    for (let i = 0; i < dna.length - 2; i += 3) {
      const codon = dna.substring(i, i + 3);
      protein += codonTable[codon] || '?';
    }
    setProteinResult(protein || "No valid codons found.");
    toast({ title: 'Translation Complete', description: 'DNA translated to protein sequence.' });
  };
  
  const getBaseColor = (base: string) => {
    const colors: { [key: string]: string } = { 'A': 'text-red-400', 'T': 'text-green-400', 'C': 'text-blue-400', 'G': 'text-yellow-400' };
    return colors[base.toUpperCase()] || 'text-gray-400';
  }

  // --- Render ---
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-headline font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          DNA Cosmic Explorer
        </h1>
        <p className="text-muted-foreground">
          Advanced analysis of space-induced genetic changes
        </p>
      </div>

      {/* DNA Sequence Viewer */}
      <Card>
        <CardHeader>
          <CardTitle>DNA Sequence Viewer</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="bg-muted/50 rounded-lg p-4 font-mono text-lg leading-loose break-all h-48 mb-4">
            {dnaSequence.split('').map((base, index) => (
              <span
                key={index}
                className={`inline-block w-6 text-center rounded-sm transition-colors duration-200 ${getBaseColor(base)} ${
                  highlightedIndices.includes(index) ? 'bg-yellow-400/30' : ''
                }`}
              >
                {base}
              </span>
            ))}
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              placeholder="Search sequence (e.g. ATCG)"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSequenceSearch()}
            />
            <Button onClick={handleSequenceSearch}>
              <Search className="mr-2" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gene Finder */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Search className="text-primary" />
              <CardTitle>Gene Finder</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Enter gene symbol (e.g. BRCA1)"
                value={geneSearchTerm}
                onChange={(e) => setGeneSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGeneSearch()}
              />
              <Button onClick={handleGeneSearch} disabled={isGeneSearching || isUserLoading || !user}>
                {isGeneSearching ? <Loader className="animate-spin" /> : <Search />}
                <span className="sr-only">Search</span>
              </Button>
            </div>
            {!user && !isUserLoading && <p className="text-xs text-muted-foreground text-center">Please sign in to search the gene database.</p>}
            <ScrollArea className="h-64 space-y-2">
              {geneResults.length > 0 ? (
                geneResults.map((gene) => (
                  <div key={gene.id} className="p-3 bg-muted/50 rounded-md mb-2">
                    <p className="font-bold text-lg text-primary">{gene.symbol}</p>
                    <p className="text-sm font-semibold">{gene.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{gene.function}</p>
                    <div className="mt-2 p-2 bg-background rounded-md border border-border">
                        <p className="text-xs font-bold text-accent">Space Impact:</p>
                        <p className="text-xs text-muted-foreground">{gene.space_effects.impact}</p>
                        <p className="text-xs text-muted-foreground mt-1"><span className="font-semibold">Recommendation:</span> {gene.space_effects.recommendation}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground pt-10">
                  <p>Search for a gene to see its details and space-related effects.</p>
                  <p className="text-xs mt-2">(e.g., TP53, SOD2, TERT)</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Sequence Translation */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Languages className="text-green-500" />
              <CardTitle>DNA to Protein Translation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter DNA sequence to translate..."
              rows={4}
              value={translateInput}
              onChange={(e) => setTranslateInput(e.target.value)}
              className="font-mono"
            />
            <Button className="mt-2" onClick={handleTranslate}>
              Translate to Protein
            </Button>
            <div className="mt-4">
              <label className="text-sm font-medium">Resulting Protein Sequence</label>
              <Textarea
                readOnly
                rows={3}
                value={proteinResult}
                placeholder="Protein sequence will appear here"
                className="font-mono mt-1 text-accent"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DNA Analysis */}
       <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <FlaskConical className="text-purple-400"/>
                    <CardTitle>Analyze New DNA Sequence</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <Textarea 
                    placeholder="Paste a raw DNA sequence here for analysis and space impact prediction..." 
                    rows={5}
                    value={analysisSequence}
                    onChange={(e) => setAnalysisSequence(e.target.value)}
                    className="font-mono mb-2"
                />
                <Button onClick={handleAnalyzeSequence} disabled={isAnalyzing || isUserLoading || !user}>
                    {isAnalyzing ? <Loader className="animate-spin mr-2"/> : <FlaskConical className="mr-2"/>}
                    {isAnalyzing ? "Analyzing..." : (user ? "Analyze and Save" : "Login to Analyze")}
                </Button>
                
                {analysisResult && (
                    <div className="mt-4 space-y-4 p-4 border rounded-lg bg-muted/30">
                        <h3 className="font-bold text-lg">Analysis Complete</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Stat title="Seq. Length" value={analysisResult.sequence_length.toLocaleString()} />
                            <Stat title="GC Content" value={`${analysisResult.gc_content}%`} />
                            {Object.entries(analysisResult.base_counts).map(([base, count])=> (
                                <Stat key={base} title={`Base '${base}'`} value={count.toLocaleString()} />
                            ))}
                        </div>
                        <div className="p-3 bg-background rounded-md border">
                            <h4 className="font-semibold text-primary mb-2">Space Mission Predictions</h4>
                            <p className="text-sm"><strong className="text-muted-foreground">Radiation Risk: </strong>{analysisResult.space_predictions.radiation_risk}</p>
                            <p className="text-sm"><strong className="text-muted-foreground">Predicted Mutation Rate: </strong>{analysisResult.space_predictions.predicted_mutation_rate}</p>
                             <div className="mt-2">
                                <strong className="text-muted-foreground text-sm">Recommendations:</strong>
                                <ul className="list-disc list-inside text-sm mt-1">
                                    {analysisResult.space_predictions.protection_recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
};

const Stat = ({title, value}: {title:string, value: string|number}) => (
    <div className="bg-background p-2 rounded-md text-center border">
        <p className="text-xl font-bold text-accent">{value}</p>
        <p className="text-xs text-muted-foreground">{title}</p>
    </div>
);

export default DNAExplorerPage;
