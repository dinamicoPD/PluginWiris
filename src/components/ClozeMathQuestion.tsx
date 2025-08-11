'use client';

import React, { useState } from 'react';
import MathLiveEditor from './MathLiveEditor';
import { simplify } from 'mathjs';

// Conversor LaTeX -> mathjs
const latexToMathJS = (latex: string): string => {
  let expr = latex;
  expr = expr.replace(/\\frac\s*{([^}]*)}\s*{([^}]*)}/g, '($1)/($2)');
  expr = expr.replace(/\\sqrt\s*{([^}]*)}/g, 'sqrt($1)');
  expr = expr.replace(/([a-zA-Z0-9\)\]]+)\s*\^\s*{([^}]*)}/g, '($1)^($2)');
  expr = expr.replace(/([a-zA-Z0-9\)\]]+)\s*\^\s*([a-zA-Z0-9]+)/g, '($1)^($2)');
  expr = expr.replace(/(\d)([a-zA-Z])/g, '$1*$2');
  expr = expr.replace(/\)\s*\(/g, ')*(');
  expr = expr.replace(/\\left|\\right/g, '');
  expr = expr.replace(/ /g, '');
  expr = expr.replace(/\\,/g, '');
  return expr;
};

const normalize = (expr: string): string => {
  try {
    return simplify(expr).toString();
  } catch {
    return expr;
  }
};

const areEquivalent = (input: string, answer: string): boolean => {
  try {
    return normalize(input) === normalize(answer);
  } catch {
    return false;
  }
};

interface ClozeMathQuestionProps {
  question: string;
  expected: string;
  points?: number;
  onScore?: (score: number) => void;
  disabled?: boolean;
}

const ClozeMathQuestion: React.FC<ClozeMathQuestionProps> = ({
  question,
  expected,
  points = 1,
  onScore,
  disabled = false,
}) => {
  const [userLatex, setUserLatex] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const handleCheck = () => {
    const userInput = latexToMathJS(userLatex);
    const expectedInput = latexToMathJS(expected);

    if (areEquivalent(userInput, expectedInput)) {
      setFeedback('✅ ¡Correcto!');
      setScore(points);
      onScore?.(points);
    } else {
      setFeedback('❌ Incorrecto. Intenta de nuevo.');
      setScore(0);
      onScore?.(0);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 mt-6">
      <div className="mb-4">
        <span className="font-semibold text-gray-700">
          {question.replace('{1}', '________')}
        </span>
      </div>
      <MathLiveEditor
        value={userLatex}
        onChange={setUserLatex}
        placeholder="Escribe aquí tu respuesta…"
      />
      <button
        className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-bold"
        onClick={handleCheck}
        disabled={disabled}
      >
        Verificar
      </button>
      {feedback && (
        <div className="mt-4 text-lg">
          {feedback}
          <br />
          <span className="text-sm text-gray-500">
            Calificación: {score}/{points}
          </span>
        </div>
      )}
    </div>
  );
};

export default ClozeMathQuestion;
