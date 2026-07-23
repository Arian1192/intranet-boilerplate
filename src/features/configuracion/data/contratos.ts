export interface ContractTemplate {
  id: string;
  name: string;
  langCode: 'ES' | 'EN';
  description: string;
}

const CONTRACT_TEMPLATES: ContractTemplate[] = [
  { id: 'contrato-es', name: 'Contrato estándar (ES)', langCode: 'ES', description: 'Plantilla base de actuación en español.' },
  { id: 'contrato-en', name: 'Booking Agreement (EN)', langCode: 'EN', description: 'Contrato de actuación completo en inglés (basado en el contrato ConceptOne).' },
];

export function contractTemplates(): ContractTemplate[] {
  return CONTRACT_TEMPLATES.map((t) => ({ ...t }));
}
