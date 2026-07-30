import type { CreativePiece } from './seed';

/**
 * Las creatividades de `/euphoric/piezas`, migradas del modelo `Piece` de euphoric al
 * `CreativePiece` compartido. Espejo del live del 29-jul (`docs/references/euphoric/
 * live-2026-07-29-creatividades.json`).
 *
 * Qué cambió al migrar, campo a campo:
 * - `owner` → `assignee`; `deadlineLabel` → `deadline` (mismo formato, copia directa).
 * - `isoDeadline` **desaparece**: es derivable con `deadlineToIso(deadline)`, verificado en las 10
 *   piezas con round-trip exacto, incluida la que no tiene deadline (`'—'` → `null`).
 * - `status` pasa de slug (`'en-produccion'`) al texto de display (`'En producción'`), que es lo
 *   que el modelo compartido guarda y pinta.
 * - `checklistDone`/`checklistTotal` planos → `checklist` opcional; `total === 0` ⇒ `undefined`,
 *   que es como euphoric decidía si pintaba el `☑`.
 * - `clientApproval: '—'` (centinela) → `undefined`; el `—` lo pone la tabla con `?? '—'`.
 * - `priority` de slug a display. No se pinta en ninguna vista — el live no lo muestra — pero se
 *   conserva por paridad de datos.
 * - `isOverdue` desaparece: el modelo compartido deriva el tono del deadline con `tonoDeadline()`
 *   contra `HOY_ISO`, con la misma regla que euphoric aplicaba al vuelo más los cuatro tonos del
 *   live. Salen 4 «vencido», que es la cifra que el live pinta en el indicador «Atrasadas».
 */
export const piezasEuphoric: CreativePiece[] = [
  {
    id: 'pz-flyer-sonny',
    assignee: 'Sin asignar',
    title: 'Flyer SIGHT: Sonny Fodera, Xandro, Marcel BS, Jose Fajardo',
    client: 'SIGHT',
    type: 'Estático',
    version: 'v1',
    priority: 'Media',
    deadline: '17 jul 2026',
    status: 'Briefing',
  },
  {
    id: 'pz-settimes-sonny',
    assignee: 'Sin asignar',
    title: 'Set Times SIGHT: Sonny Fodera, Xandro, Marcel BS, Jose Fajardo',
    client: 'SIGHT',
    type: 'Estático',
    version: 'v1',
    priority: 'Media',
    deadline: '11 ago 2026',
    status: 'Briefing',
  },
  {
    id: 'pz-settimes-james',
    assignee: 'Alba',
    title: 'Set Times SIGHT: James Hype, Alex Now, La Cintia, Pau Guilera',
    client: 'SIGHT',
    type: 'Estático',
    version: 'v1',
    priority: 'Media',
    deadline: '04 ago 2026',
    status: 'Briefing',
  },
  {
    id: 'pz-flyer-james',
    assignee: 'Alba',
    title: 'Flyer SIGHT: James Hype, Alex Now, La Cintia, Pau Guilera',
    client: 'SIGHT',
    type: 'Estático',
    version: 'v1',
    priority: 'Media',
    deadline: '10 jul 2026',
    status: 'Briefing',
    clientApproval: 'Pendiente cliente',
  },
  {
    // La única sin deadline: en euphoric era `isoDeadline: ''` con etiqueta `'—'`.
    id: 'pz-claptone-opium',
    assignee: 'Sin asignar',
    title: 'Claptone',
    client: 'Opium Bcn',
    type: 'Estático',
    version: 'v1',
    priority: 'Media',
    deadline: '—',
    status: 'Briefing',
  },
  {
    id: 'pz-pack-sold-out',
    assignee: 'Carlos',
    title: 'Pack Sold Out · Pack Sold Out',
    client: 'SIGHT',
    type: 'Estático',
    version: 'v1',
    priority: 'Media',
    deadline: '10 jul 2026',
    status: 'En producción',
    checklist: { done: 0, total: 3 },
  },
  {
    id: 'pz-settimes-claptone',
    assignee: 'Alba',
    title: 'Set Times SIGHT: Claptone, Vite b2b Miganova, Tomi & Kesh , Alexanders Som, Luka Kuhnow',
    client: 'SIGHT',
    type: 'Estático',
    version: 'v1',
    priority: 'Media',
    deadline: '28 jul 2026',
    status: 'Cambios',
    clientApproval: 'Pendiente cliente',
  },
  {
    /**
     * La única de las 10 con marcador. Euphoric lo derivaba de `type === 'Vídeo'`, lo que se lo
     * pondría también a `Flyer Claptone 02/08`; la captura del 30-jul demuestra que eso es falso
     * (misma bajada `SIGHT · Vídeo · v1`, y esa no lo lleva). Se le quita la derivación y pasa a
     * ser dato por pieza.
     */
    id: 'pz-video-pomo',
    assignee: 'Alba',
    title: 'Video Pomo 26/07',
    client: 'SIGHT',
    type: 'Vídeo',
    version: 'v1',
    priority: 'Media',
    deadline: '08 ago 2026',
    status: 'Aprobado',
    checklist: { done: 0, total: 1 },
    icon: '🎬',
    iconTitle: 'Vídeo',
  },
  {
    // Vencida pero aprobada: el live no la marca como atrasada.
    id: 'pz-flyer-claptone',
    assignee: 'Sin asignar',
    title: 'Flyer SIGHT: Claptone, Vite b2b Miganova, Tomi & Kesh , Alexanders Som, Luka Kuhnow',
    client: 'SIGHT',
    type: 'Estático',
    version: 'v1',
    priority: 'Media',
    deadline: '03 jul 2026',
    status: 'Aprobado',
  },
  {
    id: 'pz-flyer-claptone-0208',
    assignee: 'Carlos',
    title: 'Flyer Claptone 02/08',
    client: 'SIGHT',
    type: 'Vídeo',
    version: 'v1',
    priority: 'Media',
    deadline: '22 jul 2026',
    status: 'Aprobado',
    checklist: { done: 2, total: 3 },
  },
];
