import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ResumeUploader } from '@/components/ResumeUploader';
import { ScoreResult } from '@/components/ScoreResult';
import { extractTextFromPDF, calculateMatchScore } from '@/lib/pdfParser';
import { toast } from 'sonner';

const Index = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ score: number; isSelected: boolean } | null>(null);

  const handleScreenResume = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    if (!selectedFile) {
      toast.error('Please upload a resume');
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const resumeText = await extractTextFromPDF(selectedFile);
      const score = calculateMatchScore(jobDescription, resumeText);
      const isSelected = score >= 50;

      setResult({ score, isSelected });
      
      if (isSelected) {
        toast.success('Resume analysis complete!');
      } else {
        toast.info('Resume analysis complete');
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast.error('Failed to process the resume. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary">
              <FileSearch className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Resume Screener</h1>
              <p className="text-xs text-muted-foreground">AI-powered resume analysis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Smart Matching Algorithm
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Screen Resumes Instantly
            </h2>
            <p className="text-muted-foreground">
              Upload a resume and job description to get an instant match score
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 space-y-6">
            {/* Job Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Job Description
              </label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="min-h-[140px] resize-none bg-secondary/50 border-border focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Resume Upload */}
            <ResumeUploader
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
              onClear={handleClearFile}
            />

            {/* Submit Button */}
            <Button
              onClick={handleScreenResume}
              disabled={isProcessing || !jobDescription.trim() || !selectedFile}
              className="w-full h-12 text-base font-semibold gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <FileSearch className="w-5 h-5 mr-2" />
                  Screen Resume
                </>
              )}
            </Button>

            {/* Result */}
            {result && (
              <ScoreResult score={result.score} isSelected={result.isSelected} />
            )}
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Match scores are calculated based on keyword overlap between the job description and resume.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
