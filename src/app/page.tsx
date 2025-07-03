'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/file-uploader';
import { ResultsDisplay } from '@/components/results-display';
import type { DetectDuplicateNamesOutput } from '@/ai/flows/detect-duplicate-names';
import { analyzeFileForDuplicates } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [results, setResults] = useState<DetectDuplicateNamesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async (fileContent: string) => {
    setIsLoading(true);
    setResults(null);

    const { data, error } = await analyzeFileForDuplicates(fileContent);
    
    setIsLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error,
      });
      return;
    }
    
    setResults(data);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-3xl mx-auto space-y-8">
          <header className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Duplicate Detective
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a file to instantly find duplicate names with AI-powered precision.
            </p>
          </header>

          <FileUploader onAnalyze={handleAnalyze} isLoading={isLoading} />
          
          <ResultsDisplay results={results} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
