"use client";

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { UploadCloud, FileText, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onAnalyze: (fileContent: string) => void;
  isLoading: boolean;
}

export function FileUploader({ onAnalyze, isLoading }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File is too large. Please upload a file smaller than 5MB.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleAnalyzeClick = () => {
    if (!file) return;

    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'ods' || fileExtension === 'xls' || fileExtension === 'xlsx') {
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          const namesContent = jsonData
            .map((row: any) => row[0])
            .filter(name => name !== null && name !== undefined && String(name).trim() !== '')
            .join('\n');
            
          onAnalyze(namesContent);
        } catch (error) {
          console.error("Error parsing file:", error);
          alert("Could not parse the file. Please ensure it's a valid spreadsheet and that names are in the first column.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else { // For .txt and .csv
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onAnalyze(content);
      };
      reader.readAsText(file);
    }
  };

  const removeFile = () => {
    setFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-4">
        {!file && (
            <div
                className={cn(
                "flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50 hover:bg-muted"
                )}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                <p className="mt-4 font-semibold text-foreground">
                Click to upload or drag & drop
                </p>
                <p className="text-sm text-muted-foreground mt-1">TXT, CSV, ODS, XLS, or XLSX (5MB max)</p>
                <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".txt,.csv,.ods,.xls,.xlsx"
                onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                />
            </div>
        )}

        {file && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-6 w-6 text-primary flex-shrink-0" />
                <span className="font-medium text-sm truncate">{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={removeFile} disabled={isLoading} className="flex-shrink-0">
                <X className="h-4 w-4" />
                </Button>
            </div>
            <Button onClick={handleAnalyzeClick} disabled={isLoading} className="w-full">
                {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                    </>
                ) : (
                    'Analyze Duplicates'
                )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
