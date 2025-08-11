'use client';

import React from "react";
import type { Question } from "@/types/question";
import LatexText from "./LatexText";
import MathLiveEditor from "./MathLiveEditor";

interface Props {
  questions: Question[];
  onSubmit: (answers: { [qid: number]: string | number[] }) => void;
  submitted: boolean;
  answers: { [qid: number]: string | number[] };
  setAnswers: React.Dispatch<React.SetStateAction<{ [qid: number]: string | number[] }>>;
}

const QuizFromBank: React.FC<Props> = ({ questions, onSubmit, submitted, answers, setAnswers }) => {
  const handleAnswer = (qid: number, value: string | number[]) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-bold mb-4">Quiz</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!submitted) onSubmit(answers);
        }}
      >
        {questions.map((q, idx) => (
          <div key={q.id} className="mb-6">
            <div className="font-semibold mb-1">
              {idx + 1}. <LatexText latex={q.question} />
              <span className="ml-2 text-xs text-gray-500">({q.points} ptos)</span>
            </div>
            {q.type === "cloze" && (
              <MathLiveEditor
                value={typeof answers[q.id] === "string" ? (answers[q.id] as string) : ""}
                onChange={v => handleAnswer(q.id, v)}
                placeholder="Tu respuesta aquí"
              />
            )}
            {q.type === "multichoice" && (
              <ul>
                {(q.options || []).map((opt, i) => (
                  <li key={i}>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        disabled={submitted}
                        checked={Array.isArray(answers[q.id]) && (answers[q.id] as number[]).includes(i)}
                        onChange={e => {
                          let arr: number[] = Array.isArray(answers[q.id]) ? [...(answers[q.id] as number[])] : [];
                          if (e.target.checked) arr.push(i);
                          else arr = arr.filter(ix => ix !== i);
                          handleAnswer(q.id, arr);
                        }}
                      />
                      <LatexText latex={opt.latex} />
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {!submitted && (
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition"
          >
            Enviar respuestas
          </button>
        )}
      </form>
    </div>
  );
};

export default QuizFromBank;
