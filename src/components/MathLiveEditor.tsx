'use client';

import React, { useEffect, useRef } from 'react';
// @ts-ignore
import type { MathfieldElement } from 'mathlive';

interface MathLiveEditorProps {
  value: string;
  onChange: (latex: string) => void;
  placeholder?: string;
}

const MathLiveEditor: React.FC<MathLiveEditorProps> = ({
  value,
  onChange,
  placeholder = 'Escribe una expresión matemática…',
}) => {
  const mathfieldRef = useRef<HTMLDivElement>(null);
  const mathFieldElement = useRef<MathfieldElement | null>(null);
  const valueRef = useRef(value);

  useEffect(() => {
    let mounted = true;
    const loadMathLive = async () => {
      if (typeof window !== 'undefined') {
        const { MathfieldElement } = await import('mathlive');
        if (
          mounted &&
          mathfieldRef.current &&
          !mathfieldRef.current.querySelector('math-field')
        ) {
          const mf = document.createElement('math-field') as MathfieldElement;
          mf.setAttribute('style', 'min-width:320px; font-size:1.3rem;');
          mf.setAttribute('virtual-keyboard-mode', 'onfocus');
          mf.setAttribute('virtual-keyboards', 'numeric symbols greek');
          mf.setAttribute('locale', 'es');
          mf.setAttribute('sounds', 'off');
          if (placeholder) mf.setAttribute('placeholder', placeholder);

          mf.value = valueRef.current || '';
          mf.addEventListener('input', () => {
            if (mf.value !== valueRef.current) {
              valueRef.current = mf.value;
              onChange(mf.value);
            }
          });

          mathfieldRef.current.appendChild(mf);
          mathFieldElement.current = mf;
        }
      }
    };
    loadMathLive();

    return () => {
      mounted = false;
      if (mathfieldRef.current && mathFieldElement.current) {
        mathfieldRef.current.removeChild(mathFieldElement.current);
        mathFieldElement.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mf = mathfieldRef.current?.querySelector('math-field') as MathfieldElement | null;
    if (mf && value !== valueRef.current) {
      mf.value = value;
      valueRef.current = value;
    }
  }, [value]);

  return (
    <div>
      <label className="block mb-1 font-bold">Editor Matemático</label>
      <div ref={mathfieldRef}></div>
      <div className="mt-2 text-xs text-gray-500">
        La respuesta se guarda en <strong>LaTeX</strong>.
      </div>
    </div>
  );
};

export default MathLiveEditor;
