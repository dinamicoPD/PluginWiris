'use client';

import React, { useState, useEffect } from 'react';
import QuestionBankEditor from '@/components/QuestionBankEditor';
import QuizFromBank from '@/components/QuizFromBank';
import BankSelector from '@/components/BankSelector';

import type { Question, Bank } from '@/types/question';

// ----- Utils -----
function uuid() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

const LS_KEY = 'math_banks_v2';

// ----- Componente principal -----
export default function Home() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string>('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estados para QuizFromBank:
  const [quizAnswers, setQuizAnswers] = useState<{ [qid: number]: string | number[] }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Carga bancos del localStorage al montar
  useEffect(() => {
    const raw = typeof window !== 'undefined' && localStorage.getItem(LS_KEY);
    let data: { banks: Bank[]; selectedBankId: string } = { banks: [], selectedBankId: '' };
    if (raw) {
      try { data = JSON.parse(raw); } catch { }
    }
    if (!data.banks || data.banks.length === 0) {
      // Si no hay bancos, crea uno nuevo
      const newBank: Bank = { id: uuid(), name: "Banco 1", questions: [] };
      data = { banks: [newBank], selectedBankId: newBank.id };
    }
    setBanks(data.banks);
    setSelectedBankId(data.selectedBankId || data.banks[0].id);
    setLoading(false);
  }, []);

  // Guarda cambios en localStorage cada vez que bancos o selectedBank cambian
  useEffect(() => {
    if (banks.length > 0 && selectedBankId) {
      localStorage.setItem(LS_KEY, JSON.stringify({ banks, selectedBankId }));
    }
  }, [banks, selectedBankId]);

  // --- Loader para evitar render si aún no hay bancos ---
  if (loading || banks.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <span className="text-xl text-gray-600 animate-pulse">Cargando bancos...</span>
      </div>
    );
  }

  // Banco seguro SIEMPRE
  const selectedBank = banks.find(b => b.id === selectedBankId) || banks[0];

  // Pasa setQuestions del banco seleccionado
  const setQuestionsForSelected = (qs: Question[]) => {
    setBanks(bs =>
      bs.map(b => b.id === selectedBank.id ? { ...b, questions: qs } : b)
    );
  };

  // --- Funciones de bancos ---
  const handleSelectBank = (id: string) => setSelectedBankId(id);

  const handleNewBank = () => {
    const name = prompt('Nombre para el nuevo banco:', `Banco ${banks.length + 1}`);
    if (!name) return;
    const newBank: Bank = { id: uuid(), name, questions: [] };
    setBanks(bs => [...bs, newBank]);
    setSelectedBankId(newBank.id);
  };

  const handleDeleteBank = (id: string) => {
    if (!window.confirm('¿Seguro que quieres borrar este banco completo?')) return;
    const newBanks = banks.filter(b => b.id !== id);
    setBanks(newBanks);
    setSelectedBankId(newBanks[0]?.id || '');
  };

  const handleEditBankName = (id: string, newName: string) => {
    setBanks(bs => bs.map(b => b.id === id ? { ...b, name: newName } : b));
  };

  const handleMoveBank = (id: string, dir: 'up' | 'down') => {
    setBanks(bs => {
      const idx = bs.findIndex(b => b.id === id);
      if (idx === -1) return bs;
      const newBs = [...bs];
      if (dir === 'up' && idx > 0) {
        [newBs[idx - 1], newBs[idx]] = [newBs[idx], newBs[idx - 1]];
      } else if (dir === 'down' && idx < bs.length - 1) {
        [newBs[idx + 1], newBs[idx]] = [newBs[idx], newBs[idx + 1]];
      }
      return newBs;
    });
  };

  // ---- FUNCIONES PARA EL QUIZ ----
  const handleQuizSubmit = (answers: { [qid: number]: string | number[] }) => {
    setQuizSubmitted(true);
    // Aquí podrías guardar/calificar/envíar las respuestas...
    // Por ejemplo:
    // calificarQuiz(answers, selectedBank.questions)
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Plataforma Matemática (Multi-Banco)</h1>
      <BankSelector
        banks={banks.map(b => ({ id: b.id, name: b.name }))}
        selected={selectedBankId}
        onChange={handleSelectBank}
        onNew={handleNewBank}
        onDelete={handleDeleteBank}
        onEditName={handleEditBankName}
        onMove={handleMoveBank}
      />
      <QuestionBankEditor
        questions={selectedBank.questions}
        setQuestions={setQuestionsForSelected}
      />
      <div className="my-8"></div>
      {!showQuiz && (
        <button
          onClick={() => {
            setShowQuiz(true);
            setQuizAnswers({});       // Limpiar respuestas al iniciar nuevo quiz
            setQuizSubmitted(false);  // Resetear estado enviado
          }}
          className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition mb-8"
        >
          Crear Quiz
        </button>
      )}
      {showQuiz && (
        <>
          <QuizFromBank
            questions={selectedBank.questions}
            answers={quizAnswers}
            setAnswers={setQuizAnswers}
            submitted={quizSubmitted}
            onSubmit={handleQuizSubmit}
          />
          <button
            onClick={() => setShowQuiz(false)}
            className="mt-8 px-6 py-2 bg-gray-600 text-white rounded font-bold hover:bg-gray-700 transition"
          >
            Volver al editor
          </button>
        </>
      )}
    </main>
  );
}
