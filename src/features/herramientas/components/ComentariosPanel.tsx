import { useState } from 'react';
import { Card, Button, Textarea } from '@/components/ui';
import type { Comentario } from '../data/types';

interface Props {
  comentarios: Comentario[];
  onEnviar: (texto: string) => void;
}

const FECHA_CORTA = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

function formatFecha(iso: string): string {
  if (!iso) return '';
  return FECHA_CORTA.format(new Date(iso)).replace('.', '');
}

/**
 * Panel "Notas y comentarios" del detalle (toggle desde la toolbar). Se inserta entre la
 * toolbar y la tarjeta ESTADO. Autor fijo "Tú" y fecha corta es-ES (spec Fase C, D3).
 */
export function ComentariosPanel({ comentarios, onEnviar }: Props) {
  const [texto, setTexto] = useState('');

  const enviar = () => {
    const limpio = texto.trim();
    if (!limpio) return;
    onEnviar(limpio);
    setTexto('');
  };

  return (
    <Card className="p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">Notas y comentarios</h3>

      {comentarios.length === 0 ? (
        <p className="mb-3 text-sm text-slate-400">Sin comentarios todavía.</p>
      ) : (
        <ul className="mb-3 space-y-3">
          {comentarios.map((c) => (
            <li key={c.id} className="border-b border-slate-100 pb-3 last:border-0">
              <div className="mb-0.5 flex items-center gap-2 text-xs text-slate-400">
                <span className="font-medium text-slate-600">{c.autor}</span>
                <span>{formatFecha(c.fecha)}</span>
              </div>
              <p className="text-sm text-slate-700">{c.texto}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-start gap-2">
        <Textarea
          placeholder="Escribe un comentario…"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <Button variant="primary" size="sm" onClick={enviar}>Enviar</Button>
      </div>
    </Card>
  );
}
