export type NotificationCategoryId = 'vacaciones' | 'pedidos_reposicion' | 'contratos_firmados' | 'alertas_rrhh';

export interface NotificationCategory {
  id: NotificationCategoryId;
  title: string;
  description: string;
  hasEmailToggle: boolean;
}

export interface NotificationRecipient {
  categoryId: NotificationCategoryId;
  userName: string;
  checked: boolean;
  alsoEmail: boolean;
}

export interface PersonalNotificationType {
  id: string;
  label: string;
  description: string;
}

const USERS = [
  'Alba Gelabert', 'Aldo Messina', 'Alex González', 'Carlos Pego', 'Fran Hinojosa Veredas',
  'Israel Cuenca', 'Jack Howell', 'Jassi Gonzalez Montes', 'Joe Coe', 'Juan (Staff Level Test)',
  'Oscar Buch', 'Sadkiel', 'test', 'Tony Carrerira', 'Yenifer Bernardo',
];

const CATEGORIES: NotificationCategory[] = [
  { id: 'vacaciones', title: 'Solicitudes de vacaciones', description: 'Cuando alguien pide vacaciones o una ausencia. La reciben quienes aprueban.', hasEmailToggle: false },
  { id: 'pedidos_reposicion', title: 'Pedidos de reposición (portal)', description: 'Cuando un cliente crea un pedido desde su portal. La reciben quienes lo atienden. Puedes activar además el aviso por email.', hasEmailToggle: true },
  { id: 'contratos_firmados', title: 'Contratos firmados', description: 'Cuando un promotor firma online el contrato de un show (Signaturit). La reciben quienes designes. Puedes activar además el aviso por email.', hasEmailToggle: true },
  { id: 'alertas_rrhh', title: 'Alertas de RRHH', description: 'Fin de contrato, fin de periodo de prueba y revisión salarial, con antelación. La reciben quienes designes. Puedes activar además el aviso por email.', hasEmailToggle: true },
];

const CHECKED_ALWAYS = ['Carlos Pego', 'test'];

const RECIPIENTS: NotificationRecipient[] = CATEGORIES.flatMap((c) =>
  USERS.map((userName) => {
    const checked = CHECKED_ALWAYS.includes(userName) || (c.id === 'pedidos_reposicion' && userName === 'Israel Cuenca');
    const alsoEmail = c.hasEmailToggle && checked;
    return { categoryId: c.id, userName, checked, alsoEmail };
  })
);

const PERSONAL_TYPES: PersonalNotificationType[] = [
  { id: 'vacaciones_resueltas', label: 'Tus vacaciones resueltas', description: 'Cuando aprueban o rechazan tu solicitud. Llega siempre al solicitante.' },
  { id: 'acciones_asignadas', label: 'Acciones asignadas', description: 'Cuando te asignan o te añaden a una acción de Etra. Llega siempre al implicado.' },
  { id: 'novedades_grupo', label: 'Novedades del grupo', description: 'Cuando se publica una novedad. Llega a todo el equipo.' },
  { id: 'alertas_produccion', label: 'Alertas de producción', description: 'Cuando un evento incumple un hito (line-up, contrato, depósito...) dentro de su ventana. Llega al responsable y al equipo de producción.' },
  { id: 'alertas_shows', label: 'Alertas de shows', description: 'Cuando un show tiene un agujero por el que se puede caer el dinero (confirmado sin contrato, logística sin cerrar a D-7, oferta que nadie persigue, show sin liquidar). Llega al booker del show y a los admins.' },
  { id: 'arte_pendiente', label: 'Arte pendiente de aprobar', description: 'Cuando hay un flyer o pieza esperando tu aprobación. Llega al aprobador designado del artista.' },
  { id: 'arte_resuelto', label: 'Tu arte, resuelto', description: 'Cuando aprueban, rechazan o piden cambios en un arte que subiste. Llega a quien lo subió.' },
  { id: 'trabajo_asignado', label: 'Trabajo asignado', description: 'Cuando te asignan como responsable de una pieza, publicación, campaña o tarea de producción. Llega siempre al implicado.' },
  { id: 'aprobaciones_asignadas', label: 'Aprobaciones asignadas', description: 'Cuando te ponen como responsable de aprobar una pieza. Llega siempre al implicado.' },
  { id: 'aprobaciones_cliente', label: 'Aprobaciones del cliente', description: 'Cuando un cliente aprueba o pide cambios en una pieza o publicación desde su enlace. Llega al responsable.' },
  { id: 'cumpleanos_equipo', label: 'Cumpleaños del equipo', description: 'El día del cumpleaños de un compañero. Llega a todo el equipo.' },
];

export function categories(): NotificationCategory[] {
  return CATEGORIES.map((c) => ({ ...c }));
}

export function recipientsFor(categoryId: NotificationCategoryId): NotificationRecipient[] {
  return RECIPIENTS.filter((r) => r.categoryId === categoryId).map((r) => ({ ...r }));
}

export function personalTypes(): PersonalNotificationType[] {
  return PERSONAL_TYPES.map((t) => ({ ...t }));
}
