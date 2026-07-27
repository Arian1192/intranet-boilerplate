export interface EmailTemplate {
  id: string;
  slug: string;
  title: string;
  description: string;
  subject: string;
  emailTitle: string;
  message: string;
  buttonLabel: string;
  buttonLink: string;
  variables: string[];
}

export const FOOTER_NOTE =
  'Salen por Resend desde no-reply@blackmoose.es con copia a quien los lanza. En invitaciones, {{link}} es el enlace para crear la contraseña: va en el botón, no en el texto.';

const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl-invitacion-portal',
    slug: 'invitacion_portal',
    title: 'Bienvenida — portal de cliente',
    description: 'Invitación a un cliente al portal de reposiciones (CRUDA).',
    subject: 'Acceso a tu portal de cliente · CRUDA by Black Moose Group',
    emailTitle: 'Acceso a tu portal de cliente',
    message:
      'Hola {{nombre}},\nTe damos acceso a tu portal de CRUDA para que gestiones tus reposiciones de forma autónoma: pides, ves el estado y consultas tu histórico sin esperar a nadie.\nCrea tu contraseña para entrar. El enlace caduca en 24 horas.',
    buttonLabel: 'Crear mi contraseña',
    buttonLink: '{{link}}',
    variables: ['{{nombre}}', '{{link}}'],
  },
  {
    id: 'tpl-invitacion-usuario',
    slug: 'invitacion_usuario',
    title: 'Bienvenida — usuario de la intranet',
    description: 'Invitación a un usuario nuevo de la intranet.',
    subject: 'Tu acceso a la intranet · Black Moose',
    emailTitle: 'Tu acceso a la intranet',
    message:
      'Hola {{nombre}},\nTe hemos dado acceso a la intranet de Black Moose. Desde ahí gestionas tu trabajo, tus vacaciones y todo lo demás.\nPara entrar, crea tu contraseña. El enlace caduca en 24 horas: si se te pasa, pídenos otro y listo.',
    buttonLabel: 'Crear mi contraseña',
    buttonLink: '{{link}}',
    variables: ['{{nombre}}', '{{link}}'],
  },
  {
    id: 'tpl-liquidacion-show',
    slug: 'liquidacion_show',
    title: 'Liquidación de show (artista)',
    description: 'Informe de liquidación de show que se envía al artista (con el PDF adjunto).',
    subject: 'Liquidación {{artista}}, {{show}} - {{fecha}}',
    emailTitle: 'Liquidación de {{show}}',
    message:
      'Hola {{artista}},\nAdjuntamos la liquidación del show {{show}} ({{codigo}}) del {{fecha}}.\n\nFee bruto: {{fee_bruto}}\nBooking fee: {{booking_fee}}\nManagement fee: {{management_fee}}\nGastos: {{gastos_total}}\n\nNeto al artista: {{neto_artista}}\n\nTienes el detalle completo en el PDF adjunto. Cualquier duda, respóndenos a este correo.',
    buttonLabel: '',
    buttonLink: '',
    variables: [
      '{{artista}}',
      '{{show}}',
      '{{codigo}}',
      '{{fecha}}',
      '{{neto_artista}}',
      '{{fee_bruto}}',
      '{{booking_fee}}',
      '{{management_fee}}',
      '{{gastos_total}}',
      '{{gastos_detalle}}',
    ],
  },
  {
    id: 'tpl-reset-password',
    slug: 'reset_password',
    title: 'Restablecer contraseña',
    description: 'Correo para restablecer la contraseña (lo lanza un administrador).',
    subject: 'Restablece tu contraseña · Black Moose',
    emailTitle: 'Restablecer tu contraseña',
    message:
      'Hola {{nombre}},\nHemos recibido una petición para cambiar la contraseña de tu cuenta de Black Moose.\nSi has sido tú, entra desde el botón. Si no, ignora este correo: tu contraseña no cambia hasta que alguien la ponga desde ese enlace.',
    buttonLabel: 'Cambiar mi contraseña',
    buttonLink: '{{link}}',
    variables: ['{{nombre}}', '{{link}}'],
  },
  {
    id: 'tpl-vacaciones-aprobada',
    slug: 'vacaciones_aprobada',
    title: 'Vacaciones — aprobada',
    description: 'Email al empleado cuando se aprueba su solicitud de vacaciones/ausencia.',
    subject: 'Tu solicitud de {{tipo}} ha sido aprobada · Black Moose',
    emailTitle: 'Solicitud aprobada',
    message: 'Hola {{nombre}},\nTu solicitud de {{tipo}} ha sido aprobada.\nDesde el {{desde}} hasta el {{hasta}} ({{dias}} días hábiles).\n{{notas}}',
    buttonLabel: '',
    buttonLink: '',
    variables: ['{{nombre}}', '{{tipo}}', '{{desde}}', '{{hasta}}', '{{dias}}', '{{notas}}', '{{estado}}'],
  },
  {
    id: 'tpl-vacaciones-rechazada',
    slug: 'vacaciones_rechazada',
    title: 'Vacaciones — rechazada',
    description: 'Email al empleado cuando se rechaza su solicitud de vacaciones/ausencia.',
    subject: 'Tu solicitud de {{tipo}} ha sido rechazada · Black Moose',
    emailTitle: 'Solicitud rechazada',
    message:
      'Hola {{nombre}},\nTu solicitud de {{tipo}} (del {{desde}} al {{hasta}}) no ha podido aprobarse.\n{{notas}}\nSi necesitas darle una vuelta, habla con tu responsable.',
    buttonLabel: '',
    buttonLink: '',
    variables: ['{{nombre}}', '{{tipo}}', '{{desde}}', '{{hasta}}', '{{dias}}', '{{notas}}', '{{estado}}'],
  },
];

export function templates(): EmailTemplate[] {
  return EMAIL_TEMPLATES.map((t) => ({ ...t, variables: [...t.variables] }));
}
