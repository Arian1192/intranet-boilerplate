import { Card, Textarea, Button } from '@/components/ui';

export function ActionCommentsCard() {
  return (
    <Card className="space-y-4 p-6">
      <h2 className="font-semibold text-slate-800">Comentarios</h2>
      <p className="text-sm text-slate-500">Sin comentarios. Menciona a alguien con @Nombre.</p>
      <div className="flex items-end gap-3">
        <Textarea
          placeholder="Escribe un comentario... usa @Nombre para mencionar"
          className="flex-1"
        />
        <Button>Enviar</Button>
      </div>
    </Card>
  );
}
