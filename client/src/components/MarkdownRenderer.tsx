import React from 'react';
import { Sparkles, HeartPulse, Stethoscope, CheckCircle2 } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isStreaming }) => {
  // If streaming and waiting for the very first token, render a clean bouncing 3-dot loader
  if (isStreaming && (!content || content.trim() === '' || content.trim() === '...')) {
    return (
      <div className="flex items-center gap-1.5 py-2 px-1">
        <span className="h-2 w-2 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.3s]"></span>
        <span className="h-2 w-2 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.15s]"></span>
        <span className="h-2 w-2 rounded-full bg-neutral-400 animate-bounce"></span>
      </div>
    );
  }

  if (!content) return null;

  // Normalize lines and filter out unwanted raw symbols
  const lines = content.split('\n');

  /**
   * Cleans all raw markdown markers like ***, **, *, ## from a string
   */
  const stripMarkdownSymbols = (text: string) => {
    return text.replace(/[*#_~`]/g, '').trim();
  };

  /**
   * Checks if a line represents a major section title
   */
  const isSectionHeader = (trimmed: string) => {
    const rawClean = stripMarkdownSymbols(trimmed).toLowerCase();

    // Check for common section keywords
    const isOverview =
      rawClean.includes('overview') ||
      rawClean.includes('summary') ||
      rawClean.includes('सारांश') ||
      rawClean.includes('आश्वस्ति');
    const isFindings =
      rawClean.includes('key finding') ||
      rawClean.includes('findings explained') ||
      rawClean.includes('महत्वपूर्ण निष्कर्ष') ||
      rawClean.includes('निष्कर्ष');
    const isNextSteps =
      rawClean.includes('next step') ||
      rawClean.includes('doctor visit') ||
      rawClean.includes('physician') ||
      rawClean.includes('डॉक्टर') ||
      rawClean.includes('परामर्श');

    // Matches lines like "### 1. Overview", "* **Summary**", "1. **Summary**", "**Key Findings**"
    const isNumberedOrHashed = /^(?:#+|\d+\.|\*|\-|\u2022)?\s*\*?\*?\s*(?:overview|summary|key findings|next steps|doctor visit|1\.|2\.|3\.|सारांश|निष्कर्ष)/i.test(
      trimmed
    );

    if (isOverview || isFindings || isNextSteps || isNumberedOrHashed) {
      return { isHeader: true, isOverview, isFindings, isNextSteps };
    }
    return { isHeader: false, isOverview: false, isFindings: false, isNextSteps: false };
  };

  const renderFormattedLine = (line: string, lineIndex: number) => {
    const trimmed = line.trim();
    if (!trimmed) {
      // Empty line creates breathing room
      return <div key={lineIndex} className="h-2" />;
    }

    // 1. Check if line is a Section Header
    const headerCheck = isSectionHeader(trimmed);
    if (headerCheck.isHeader) {
      const cleanTitle = stripMarkdownSymbols(trimmed);

      return (
        <div key={lineIndex} className="mt-6 mb-3 first:mt-1">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-semibold text-xs sm:text-sm tracking-wide">
            {headerCheck.isOverview && <HeartPulse className="h-4 w-4 text-neutral-300 flex-shrink-0" />}
            {headerCheck.isFindings && <Sparkles className="h-4 w-4 text-neutral-300 flex-shrink-0" />}
            {headerCheck.isNextSteps && <Stethoscope className="h-4 w-4 text-neutral-300 flex-shrink-0" />}
            {!headerCheck.isOverview && !headerCheck.isFindings && !headerCheck.isNextSteps && (
              <CheckCircle2 className="h-4 w-4 text-neutral-300 flex-shrink-0" />
            )}
            <span className="text-white font-medium">{cleanTitle}</span>
          </div>
        </div>
      );
    }

    // 2. Check if line is a Bullet Item
    const isBullet = /^(?:[\-\*•]|\d+\.)\s+/.test(trimmed);
    if (isBullet) {
      const rawText = trimmed.replace(/^(?:[\-\*•]|\d+\.)\s+/, '');

      return (
        <div key={lineIndex} className="flex items-start gap-2.5 my-2 pl-0.5 text-neutral-200 text-xs sm:text-sm leading-7">
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 mt-2.5 flex-shrink-0" />
          <div className="flex-1">
            {formatSpans(rawText)}
          </div>
        </div>
      );
    }

    // 3. Regular Paragraph
    return (
      <p key={lineIndex} className="my-2 text-xs sm:text-sm text-neutral-300 leading-7 font-normal">
        {formatSpans(trimmed)}
      </p>
    );
  };

  /**
   * Formats **bold text**, biomarkers, and numeric values with clean highlights
   * Strips all remaining rogue asterisks!
   */
  const formatSpans = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

    return parts.map((part, i) => {
      const isBold =
        (part.startsWith('**') && part.endsWith('**') && part.length > 4) ||
        (part.startsWith('*') && part.endsWith('*') && part.length > 2);

      if (isBold) {
        const inner = stripMarkdownSymbols(part);
        if (!inner) return null;

        const upper = inner.toUpperCase();
        const isLow = upper.includes('LOW') || upper.includes('कम');
        const isHigh = upper.includes('HIGH') || upper.includes('अधिक');
        const isNormal = upper.includes('NORMAL') || upper.includes('सामान्य');

        return (
          <span
            key={i}
            className={`font-semibold px-2 py-0.5 rounded-md mx-1 text-xs sm:text-sm inline-block ${
              isLow
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : isHigh
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : isNormal
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-neutral-800 text-white border border-neutral-700 font-medium'
            }`}
          >
            {inner}
          </span>
        );
      }

      // Regular text: clean any stray asterisks
      const cleanRegular = part.replace(/\*/g, '');
      return <span key={i}>{cleanRegular}</span>;
    });
  };

  return (
    <div className="space-y-0.5 text-neutral-200">
      {lines.map((line, idx) => renderFormattedLine(line, idx))}
      {isStreaming && (
        <span className="inline-block w-1.5 h-3.5 ml-1 bg-neutral-300 animate-pulse rounded-xs align-middle" />
      )}
    </div>
  );
};
