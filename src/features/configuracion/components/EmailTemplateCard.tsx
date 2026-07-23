import { useState } from 'react';
import { Card, Input, Button } from '@/components/ui';
import { RichTextEditor } from '@/components/ui';
import type { EmailTemplate } from '../data/plantillasCorreo';

export interface EmailTemplateCardProps {
  template: EmailTemplate;
}

export function EmailTemplateCard({ template }: EmailTemplateCardProps) {
  const [subject, setSubject] = useState(template.subject);
  const [emailTitle, setEmailTitle] = useState(template.emailTitle);
  const [buttonLabel, setButtonLabel] = useState(template.buttonLabel);
  const [buttonLink, setButtonLink] = useState(template.buttonLink);
  const [messageDirty, setMessageDirty] = useState(false);

  const dirty =
    subject !== template.subject ||
    emailTitle !== template.emailTitle ||
    buttonLabel !== template.buttonLabel ||
    buttonLink !== template.buttonLink ||
    messageDirty;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-800">{template.title}</h3>
          <p className="text-sm text-slate-400">{template.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" variant="ghost" size="sm">Editar</Button>
          <Button type="button" variant="ghost" size="sm">Vista previa</Button>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{template.slug}</span>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <label className="text-xs text-slate-500">Asunto — lo que se lee en la bandeja</label>
        <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div className="mt-3 space-y-1">
        <label className="text-xs text-slate-500">Título — el titular al abrir el correo</label>
        <Input value={emailTitle} onChange={(e) => setEmailTitle(e.target.value)} />
      </div>
      <div className="mt-3 space-y-1">
        <label className="text-xs text-slate-500">Mensaje</label>
        <RichTextEditor
          content={`<p>${template.message.split('\n').join('</p><p>')}</p>`}
          onChange={() => setMessageDirty(true)}
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Botón — vacío = sin botón</label>
          <Input value={buttonLabel} onChange={(e) => setButtonLabel(e.target.value)} placeholder="Crear mi contraseña" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Enlace del botón</label>
          <Input value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} placeholder="{{link}}" />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1 text-xs text-slate-500">
        <span>Variables:</span>
        {template.variables.map((v) => (
          <span key={v} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-600">{v}</span>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          disabled={!dirty}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: '#44444C' }}
        >
          Guardar
        </button>
        <span className="text-xs text-slate-400">{dirty ? 'Cambios sin guardar' : 'Sin cambios'}</span>
      </div>
    </Card>
  );
}
