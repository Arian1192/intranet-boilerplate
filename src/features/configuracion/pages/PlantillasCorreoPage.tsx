import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { EmailTemplateCard } from '../components/EmailTemplateCard';
import { templates, FOOTER_NOTE } from '../data/plantillasCorreo';

export function PlantillasCorreoPage() {
  const list = templates();
  return (
    <div className="space-y-6">
      <ConfigPageHeader
        title="Plantillas de correo"
        subtitle="Escribe el correo como un correo. La marca —logo, tipografía, botón y pie— la pone el sistema: aquí solo va el mensaje. Las variables van entre llaves, p. ej. {{nombre}}."
      />
      <div className="space-y-4">
        {list.map((template) => (
          <EmailTemplateCard key={template.id} template={template} />
        ))}
      </div>
      <p className="text-xs text-slate-500">{FOOTER_NOTE}</p>
    </div>
  );
}
