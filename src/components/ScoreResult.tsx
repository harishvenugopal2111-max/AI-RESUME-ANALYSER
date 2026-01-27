import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreResultProps {
  score: number;
  isSelected: boolean;
}

export function ScoreResult({ score, isSelected }: ScoreResultProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-8"
    >
      <div className={cn(
        "relative overflow-hidden rounded-2xl p-6 border",
        isSelected 
          ? "bg-success/5 border-success/20" 
          : "bg-destructive/5 border-destructive/20"
      )}>
        {/* Background decoration */}
        <div className={cn(
          "absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20",
          isSelected ? "bg-success" : "bg-destructive"
        )} />
        
        <div className="relative flex items-center gap-6">
          {/* Circular Progress */}
          <div className="relative flex-shrink-0">
            <svg className="w-28 h-28 -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/30"
              />
              <motion.circle
                cx="56"
                cy="56"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className={isSelected ? "text-success" : "text-destructive"}
                initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span 
                className="text-2xl font-bold text-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {score.toFixed(0)}%
              </motion.span>
            </div>
          </div>

          {/* Result Text */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              {isSelected ? (
                <CheckCircle2 className="w-6 h-6 text-success" />
              ) : (
                <XCircle className="w-6 h-6 text-destructive" />
              )}
              <h3 className={cn(
                "text-xl font-bold",
                isSelected ? "text-success" : "text-destructive"
              )}>
                {isSelected ? "Selected" : "Not Selected"}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {isSelected 
                ? "This resume meets the job requirements with a strong match score."
                : "This resume doesn't meet the minimum match threshold of 50%."}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Match score based on keyword analysis</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
