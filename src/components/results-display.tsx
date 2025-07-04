"use client";

import type { DetectDuplicateNamesOutput } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, CheckCircle2 } from 'lucide-react';

interface ResultsDisplayProps {
  results: DetectDuplicateNamesOutput | null;
  isLoading: boolean;
}

export function ResultsDisplay({ results, isLoading }: ResultsDisplayProps) {
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-2">
            <div className="flex justify-between items-center p-4 border-b">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16" />
            </div>
            <div className="flex justify-between items-center p-4 border-b">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-12" />
            </div>
            <div className="flex justify-between items-center p-4">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-14" />
            </div>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return null;
  }

  const duplicates = results;

  return (
    <Card className="shadow-sm transition-all duration-500 ease-in-out animate-in fade-in-0 slide-in-from-bottom-5">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary"/>
            Resultados da Análise
        </CardTitle>
        <CardDescription>
            {duplicates.length > 0 
                ? `Encontrados ${duplicates.length} nome(s) duplicado(s).` 
                : "Nenhum nome duplicado foi encontrado no arquivo."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {duplicates.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-right">Ocorrências</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {duplicates.map((item, index) => (
                  <TableRow key={index} className="animate-in fade-in-0" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right font-mono text-primary font-bold text-lg">{item.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/50 rounded-lg">
            <CheckCircle2 className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Tudo Certo!</h3>
            <p className="mt-1 text-muted-foreground">Seu arquivo não contém nomes duplicados.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
