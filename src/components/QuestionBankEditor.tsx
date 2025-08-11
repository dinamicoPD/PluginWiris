'use client';

import React, { useState, useRef } from 'react';
import MathLiveEditor from './MathLiveEditor';
import LatexText from './LatexText';
import type { Question, ClozeQuestion, MultichoiceOption, MultichoiceQuestion } from '@/types/question';

// --- MathTextArea: textarea + inserción de fórmulas
function insertAtCursor(
  textarea: HTMLTextAreaElement,
  insertText: string
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const newValue =
    textarea.value.substring(0, start) +
    insertText +
    textarea.value.substring(end);
  textarea.value = newValue;
  textarea.selectionStart = textarea.selectionEnd = start + insertText.length;
  return newValue;
}

const MathTextArea: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showMath, setShowMath] = useState(false);
  const [formula, setFormula] = useState("");

  return (
    <div>
      <label className="block font-bold mb-1">Enunciado de la pregunta</label>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border rounded p-2 min-h-[56px] max-h-40 focus:outline-none focus:ring focus:ring-blue-200 resize-none text-base"
        placeholder={placeholder || "Escribe aquí el enunciado..."}
      />
      <div className="flex items-center gap-2 mt-1">
        <button
          type="button"
          className="px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs"
          onClick={() => setShowMath(true)}
        >
          ➕ Insertar fórmula
        </button>
        <span className="text-xs text-gray-500">Puedes insertar texto y fórmulas.</span>
      </div>
      {/* Modal para insertar fórmula */}
      {showMath && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg p-4 min-w-[340px] max-w-[96vw]">
            <h4 className="font-bold mb-2">Escribe una fórmula matemática</h4>
            <MathLiveEditor value={formula} onChange={setFormula} />
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => {
                  const area = textareaRef.current;
                  if (area) {
                    // Delimitadores \(...\) para inline latex
                    const latex = `\\(${formula}\\)`;
                    const newValue = insertAtCursor(area, latex);
                    onChange(newValue);
                  }
                  setShowMath(false);
                  setFormula("");
                }}
                disabled={!formula}
              >
                Insertar
              </button>
              <button
                type="button"
                className="px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                onClick={() => setShowMath(false)}
              >
                Cancelar
              </button>
            </div>
            <div className="mt-2 text-sm">
              <span className="font-bold mr-2">Vista previa:</span>
              <LatexText latex={formula} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Renderiza texto + LaTeX embebido ---
function RenderQuestionWithLatex({ text }: { text: string }) {
  const blocks = text.split(/(\\\(.+?\\\))/g);
  return (
    <span>
      {blocks.map((b, i) =>
        b.startsWith("\\(") && b.endsWith("\\)") ? (
          <LatexText key={i} latex={b.slice(2, -2)} />
        ) : (
          <span key={i}>{b}</span>
        )
      )}
    </span>
  );
}

interface Props {
  questions: Question[];
  setQuestions: (qs: Question[]) => void;
}

type EditState =
  | ({ type: 'cloze' } & Partial<ClozeQuestion>)
  | ({ type: 'multichoice' } & Partial<MultichoiceQuestion>)
  | null;

const emptyOption = (): MultichoiceOption => ({ latex: '', correct: false });

const QuestionBankEditor: React.FC<Props> = ({ questions, setQuestions }) => {
  const [edit, setEdit] = useState<EditState>(null);

  // Helpers
  const resetEdit = () => setEdit(null);

  const handleNew = () => setEdit({
    type: 'cloze',
    question: '',
    expected: '',
    points: 1,
    correctionMode: 'algebraic'
  });

  const handleEdit = (q: Question) => {
    if (q.type === 'cloze') {
      setEdit({ ...q });
    } else {
      setEdit({ ...q, options: q.options.map(o => ({ ...o })) });
    }
  };

  const handleSave = () => {
    if (!edit) return;
    if (!edit.question || (edit.type === 'cloze' && !edit.expected) || !edit.points) return;
    if (edit.type === 'multichoice' && (!edit.options || edit.options.length < 2 || !edit.options.some(o => o.correct))) return;

    if ('id' in edit && typeof edit.id === 'number') {
      setQuestions(qs => qs.map(q => q.id === edit.id ? (edit as Question) : q));
    } else {
      const newId = Math.max(0, ...questions.map(q => q.id)) + 1;
      setQuestions(qs => [...qs, { ...edit, id: newId } as Question]);
    }
    resetEdit();
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Borrar esta pregunta?')) return;
    setQuestions(qs => qs.filter(q => q.id !== id));
  };

  return (
    <section className="w-full max-w-3xl mx-auto bg-white p-6 rounded-xl shadow mb-6">
      <h2 className="text-xl font-bold mb-3">Banco de preguntas</h2>
      <ol className="mb-5 space-y-5">
        {questions.length === 0 && (
          <div className="text-gray-500 italic">No hay preguntas. Usa el botón para crear una nueva.</div>
        )}
        {questions.map((q, idx) => (
          <li key={q.id} className="border-b pb-2 mb-2 flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{idx + 1}.</span>
              <RenderQuestionWithLatex text={q.question} />
              <span className="text-xs text-gray-400 ml-2">{q.type === 'cloze' ? 'Cálculo' : 'Multiopción'}</span>
              <span className="ml-2 text-xs text-gray-500">({q.points} ptos)</span>
              <button className="ml-auto text-blue-600 font-bold" onClick={() => handleEdit(q)}>Editar</button>
              <button className="ml-2 text-red-500 font-bold" onClick={() => handleDelete(q.id)}>Borrar</button>
            </div>
            {q.type === 'cloze' && (
              <div className="pl-7 text-sm mt-1">
                <span className="mr-2">Respuesta esperada: </span>
                <LatexText latex={q.expected} />
                <span className="ml-2 text-xs text-gray-400">
                  {q.correctionMode === 'algebraic' ? 'Validación algebraica' : 'Validación exacta'}
                </span>
              </div>
            )}
            {q.type === 'multichoice' && (
              <ul className="pl-7 text-sm mt-1 space-y-1">
                {q.options.map((op, i) => (
                  <li key={i} className={op.correct ? 'text-green-700' : ''}>
                    <span className="inline-block w-4">{op.correct ? '✔️' : ''}</span>
                    <LatexText latex={op.latex} />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>

      {/* --- Formulario de nueva pregunta / edición --- */}
      <div className="mb-2">
        {!edit && (
          <button
            onClick={handleNew}
            className="px-6 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition"
          >+ Nueva pregunta</button>
        )}

        {edit && (
          <form
            className="bg-gray-50 border p-4 rounded-xl flex flex-col gap-4"
            onSubmit={e => { e.preventDefault(); handleSave(); }}
          >
            <div className="flex gap-4">
              <label className="font-semibold">
                <input
                  type="radio"
                  name="type"
                  checked={edit.type === 'cloze'}
                  onChange={() =>
                    setEdit({
                      type: 'cloze',
                      question: edit.question ?? '',
                      expected: '',
                      points: edit.points ?? 1,
                      correctionMode: 'algebraic',
                    })
                  }
                  className="mr-1"
                /> Cálculo (respuesta directa)
              </label>
              <label className="font-semibold">
                <input
                  type="radio"
                  name="type"
                  checked={edit.type === 'multichoice'}
                  onChange={() =>
                    setEdit({
                      type: 'multichoice',
                      question: edit.question ?? '',
                      options: [emptyOption(), emptyOption()],
                      points: edit.points ?? 1,
                    })
                  }
                  className="mr-1"
                /> Multiopción
              </label>
            </div>

            {/* Enunciado como textarea enriquecido */}
            <MathTextArea
              value={edit.question ?? ""}
              onChange={val => setEdit(q => q ? { ...q, question: val } : q)}
              placeholder="Escribe el enunciado aquí, puedes insertar texto y fórmulas"
            />

            {/* Modo CLOZE */}
            {edit.type === 'cloze' && (
              <>
                <div>
                  <label className="block font-bold mb-1">Respuesta esperada</label>
                  <MathLiveEditor
                    value={edit.expected ?? ''}
                    onChange={val => setEdit(q => q ? { ...q, expected: val } : q)}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Modo de corrección</label>
                  <select
                    value={edit.correctionMode || 'algebraic'}
                    onChange={e =>
                      setEdit(q =>
                        q && q.type === 'cloze'
                          ? { ...q, correctionMode: e.target.value as 'algebraic' | 'exact' }
                          : q
                      )
                    }
                    className="border rounded p-2 ml-2"
                  >
                    <option value="algebraic">Algebraica (equivalencia matemática)</option>
                    <option value="exact">Exacta (mismo orden y forma)</option>
                  </select>
                </div>
              </>
            )}

            {/* Modo MULTICHOICE */}
            {edit.type === 'multichoice' && (
              <>
                <div>
                  <label className="block font-bold mb-1">Opciones</label>
                  <ul className="space-y-2">
                    {(edit.options ?? []).map((op, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!op.correct}
                          onChange={e => setEdit(q => {
                            if (!q || q.type !== 'multichoice' || !q.options) return q;
                            const options = q.options.map((o, i) => i === idx ? { ...o, correct: e.target.checked } : o);
                            return { ...q, options };
                          })}
                          className="scale-125"
                          title="Respuesta correcta"
                        />
                        <MathLiveEditor
                          value={op.latex}
                          onChange={val =>
                            setEdit(q => {
                              if (!q || q.type !== 'multichoice' || !q.options) return q;
                              const options = q.options.map((o, i) => i === idx ? { ...o, latex: val } : o);
                              return { ...q, options };
                            })
                          }
                          placeholder={`Opción ${idx + 1}`}
                        />
                        <button
                          type="button"
                          className="ml-2 text-red-500 text-xl font-bold"
                          disabled={(edit.options?.length ?? 0) <= 2}
                          onClick={() =>
                            setEdit(q => {
                              if (!q || q.type !== 'multichoice' || !q.options) return q;
                              const options = q.options.filter((_, i) => i !== idx);
                              return { ...q, options };
                            })
                          }
                        >✕</button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() =>
                      setEdit(q => {
                        if (!q || q.type !== 'multichoice' || !q.options) return q;
                        return { ...q, options: [...q.options, emptyOption()] };
                      })
                    }
                  >+ Opción</button>
                </div>
              </>
            )}

            {/* Puntos */}
            <div>
              <label className="block font-bold mb-1">Puntaje</label>
              <input
                type="number"
                min={1}
                value={edit.points ?? 1}
                onChange={e =>
                  setEdit(q => q ? { ...q, points: parseInt(e.target.value) } : q)
                }
                className="border rounded p-2 w-24"
              />
            </div>

            <div className="flex gap-4 mt-3">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition"
              >Guardar</button>
              <button
                type="button"
                className="px-6 py-2 bg-gray-400 text-white rounded font-bold hover:bg-gray-500 transition"
                onClick={resetEdit}
              >Cancelar</button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default QuestionBankEditor;
