import React from 'react';

interface CodeViewerProps {
  code: string;
  language: string;
  fontSize?: number;
  lineHeight?: number;
}


const COLORS = {
  keyword: 'text-[#569CD6]',      // Blue (const, var, function)
  control: 'text-[#C586C0]',      // Pink (return, if, else)
  string: 'text-[#CE9178]',       // Orange
  function: 'text-[#DCDCAA]',     // Yellow
  number: 'text-[#B5CEA8]',       // Light Green
  comment: 'text-[#6A9955]',      // Green
  operator: 'text-[#D4D4D4]',     // White/Grey
  default: 'text-[#9CDCFE]',      // Light Blue (variables)
  type: 'text-[#4EC9B0]',         // Teal (Types, Classes)
};

//Regex
const KEYWORDS_REGEX = /^(const|let|var|function|def|class|int|void|async|await|public|private|static|package|import|using|namespace|struct|impl|fn|mut|type|interface)$/;
const CONTROL_REGEX = /^(return|if|else|for|while|try|catch|from|match|switch|case|break|continue)$/;
const TYPE_REGEX = /^[A-Z][a-zA-Z0-9]*$/; 

export default function CodeViewer({ 
  code, 
  language, 
  fontSize = 14, // Default value
  lineHeight = 1.5 // Default value
}: CodeViewerProps) {
  
  const highlightCode = (input: string) => {
    if (!input) return [];

    return input.split('\n').map((line, i) => {
      // 1. Handle Comments (Green)
      if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
        return <div key={i} className={COLORS.comment}>{line}</div>;
      }

      // 2. Tokenize the line
      const tokens = line.split(/(\s+|[(){}[\],.;"'])/g);

      return (
        <div key={i} className="whitespace-pre">
          {tokens.map((token, j) => {
            if (token.startsWith("'") || token.startsWith('"') || token.startsWith('`')) {
              return <span key={j} className={COLORS.string}>{token}</span>;
            }
            if (KEYWORDS_REGEX.test(token)) {
              return <span key={j} className={COLORS.keyword}>{token}</span>;
            }
            if (CONTROL_REGEX.test(token)) {
              return <span key={j} className={COLORS.control}>{token}</span>;
            }
            if (/^\d+$/.test(token)) {
              return <span key={j} className={COLORS.number}>{token}</span>;
            }
            if (TYPE_REGEX.test(token) && token.length > 1) {
              return <span key={j} className={COLORS.type}>{token}</span>;
            }
            if (/^[a-zA-Z_]\w*(?=\()/.test(token)) {
               return <span key={j} className={COLORS.function}>{token}</span>;
            }
            
            return <span key={j} className={COLORS.default}>{token}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div 
      className="font-mono transition-all duration-200"
      style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
    >
      {highlightCode(code)}
    </div>
  );
}