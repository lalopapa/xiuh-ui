'use client';
import { useEffect, useRef, useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

type Props = {
  /** Se llama `delay` ms después de que el usuario deja de escribir (no al montar) */
  onSearch: (value: string) => void;
  placeholder?: string;
  delay?: number;
  defaultValue?: string;
  clearLabel?: string;
  className?: string;
};

/** Buscador con debounce y botón para limpiar */
export default function SearchInput({ onSearch, placeholder = 'Buscar', delay = 300, defaultValue = '', clearLabel = 'Limpiar', className = '' }: Props) {
  const [term, setTerm] = useState(defaultValue);
  // En un ref para no reiniciar el debounce cada vez que el padre crea un onSearch nuevo
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;
  const touched = useRef(false);

  useEffect(() => {
    if (!touched.current) return;
    const timer = setTimeout(() => onSearchRef.current(term), delay);
    return () => clearTimeout(timer);
  }, [term, delay]);

  const update = (value: string) => {
    touched.current = true;
    setTerm(value);
  };

  return (
    <label className={`input w-full ${className}`}>
      <MagnifyingGlassIcon className="size-5 opacity-50" />
      <input type="search" className="grow text-base" placeholder={placeholder} value={term} onChange={(e) => update(e.target.value)} />
      {term && (
        <button type="button" className="btn btn-ghost btn-xs btn-circle" onClick={() => update('')} aria-label={clearLabel}>
          <XMarkIcon className="size-4" />
        </button>
      )}
    </label>
  );
}
