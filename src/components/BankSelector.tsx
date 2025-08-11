'use client';

import React from "react";

interface Props {
  banks: { id: string; name: string }[];
  selected: string;
  onChange: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onEditName?: (id: string, newName: string) => void;
  onMove?: (id: string, dir: "up" | "down") => void;
}
const BankSelector: React.FC<Props> = ({
  banks, selected, onChange, onNew, onDelete, onEditName, onMove
}) => (
  <div className="flex flex-wrap items-center gap-2 mb-4">
    {banks.map((b, i) => (
      <div key={b.id} className={`px-3 py-1 rounded ${selected === b.id ? "bg-blue-100 font-bold" : "bg-gray-100"}`}>
        <span
          className="cursor-pointer"
          onClick={() => onChange(b.id)}
        >{b.name}</span>
        {onEditName && (
          <button onClick={() => {
            const name = prompt("Nuevo nombre:", b.name);
            if (name) onEditName(b.id, name);
          }}>✏️</button>
        )}
        <button className="ml-2" onClick={() => onDelete(b.id)}>🗑️</button>
        {onMove && (
          <>
            <button onClick={() => onMove(b.id, "up")}>⬆️</button>
            <button onClick={() => onMove(b.id, "down")}>⬇️</button>
          </>
        )}
      </div>
    ))}
    <button onClick={onNew} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">+ Nuevo banco</button>
  </div>
);
export default BankSelector;
