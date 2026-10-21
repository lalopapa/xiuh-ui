'use client';
import { useEffect, useState } from 'react';
import { CheckIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { copyText } from '@/lib/clipboard';

type Props = {
  text: string;
  label?: string;
  copiedLabel?: string;
  onSuccess?: () => void;
  onError?: () => void;
  className?: string;
};

/** Botón que copia `text` y muestra una palomita por 2 segundos */
export default function ButtonCopy({
  text,
  label = 'Copiar',
  copiedLabel = 'Copiado',
  onSuccess,
  onError,
  className = 'btn btn-outline btn-primary',
}: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleClick = async () => {
    if (await copyText(text)) {
      setCopied(true);
      onSuccess?.();
    } else {
      onError?.();
    }
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {copied ? <CheckIcon className="size-5" /> : <ClipboardDocumentListIcon className="size-5" />}
      {copied ? copiedLabel : label}
    </button>
  );
}
