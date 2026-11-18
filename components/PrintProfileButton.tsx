'use client';

import { Printer } from 'lucide-react';

export function PrintProfileButton() {
  return (
    <button
      type="button"
      className="recruiter-button recruiter-button-secondary recruiter-print-button"
      onClick={() => window.print()}
      aria-label="Imprimir este perfil ou salvar como PDF usando o navegador"
    >
      IMPRIMIR / SALVAR PDF <Printer size={17} aria-hidden="true" />
    </button>
  );
}
