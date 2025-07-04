'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/file-uploader';
import { ResultsDisplay } from '@/components/results-display';
import { useToast } from "@/hooks/use-toast";

// A lógica de análise foi movida para o client-side para garantir 100% de segurança e privacidade.
// Nenhum dado é enviado para um servidor.

type DetectDuplicateNamesOutput = Array<{
  name: string;
  count: number;
}>;

function normalizeName(name: string): string {
  // Normalização simples: remove espaços em branco e converte para minúsculas.
  return name.trim().toLowerCase();
}

function analyzeFileForDuplicates(fileContent: string): DetectDuplicateNamesOutput {
  if (!fileContent) {
    throw new Error('O conteúdo do arquivo está vazio.');
  }

  const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== '');
  const counts: Map<string, { count: number; original: string }> = new Map();

  for (const line of lines) {
    const normalized = normalizeName(line);
    if (normalized) {
      if (counts.has(normalized)) {
        counts.get(normalized)!.count++;
      } else {
        counts.set(normalized, { count: 1, original: line.trim() });
      }
    }
  }

  const results: DetectDuplicateNamesOutput = Array.from(counts.entries())
    .filter(([_, value]) => value.count > 1) // Apenas duplicatas
    .map(([_, value]) => ({
    name: value.original,
    count: value.count,
  }));

  return results;
}


export default function Home() {
  const [results, setResults] = useState<DetectDuplicateNamesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = (fileContent: string) => {
    setIsLoading(true);
    setResults(null);

    // Adiciona um pequeno delay para a UI de loading ser percebida em arquivos pequenos
    setTimeout(() => {
        try {
            const data = analyzeFileForDuplicates(fileContent);
            setResults(data);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Falha na Análise",
                description: error.message || 'Ocorreu um erro inesperado ao analisar o arquivo.',
            });
        } finally {
            setIsLoading(false);
        }
    }, 250); // 250ms de delay
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
            Detetive de Duplicatas
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Envie um arquivo. Encontre duplicatas. Simples, rápido e seguro.
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
