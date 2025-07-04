'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/file-uploader';
import { ResultsDisplay } from '@/components/results-display';
import type { DetectDuplicateNamesOutput } from '@/app/actions';
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
    <div className="min-h-screen bg-muted/30">
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
            Duplicate Detective
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Upload a file. Find duplicates. Simple, fast, and secure.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mt-10 space-y-6">
          <FileUploader onAnalyze={handleAnalyze} isLoading={isLoading} />
          
          <ResultsDisplay results={results} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
