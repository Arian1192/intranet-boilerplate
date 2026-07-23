import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { EmailTemplateCard } from '../components/EmailTemplateCard';
import { templates, FOOTER_NOTE } from '../data/plantillasCorreo';

export function PlantillasCorreoPage() {
  const list = templates();
  return (
    <div className="space-y-6">
      <ConfigPageHeader
        title="Plantillas de correo"
        subtitle="Personaliza los correos que salen desde Black Moose."
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
