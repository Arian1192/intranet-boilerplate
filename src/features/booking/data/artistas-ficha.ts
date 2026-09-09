/**
 * Datos de `/artistas`.
 *
 * Calcados de `f1-artistas` y `f1-artistas--roster` (live capturado el
 * 2026-09-09 a las 10:09 CEST). La lista y las nueve redes de cada tarjeta del
 * Roster salen del volcado del `<main>`, extraídas del DOM y no a mano.
 */

/** Las nueve redes de la tarjeta del Roster, en el orden en que las pinta. */
export const REDES_ROSTER = [
  'Instagram',
  'Facebook',
  'TikTok',
  'Spotify',
  'Resident Advisor',
  'Beatport',
  'SoundCloud',
  'YouTube',
  'Apple Music',
] as const;

export type RedRoster = (typeof REDES_ROSTER)[number];

export interface ArtistaFicha {
  id: string;
  nombre: string;
  /** Insignia `B` violeta de la cabecera y de cada fila. */
  booking: boolean;
  /** Insignia `M` ámbar. */
  management: boolean;
  /**
   * La foto que el live sirve desde la CDN de Spotify. **Se guarda pero no se
   * pinta** — ver `MOSTRAR_FOTOS`. `null` en los tres artistas que en el propio
   * live ya caen al fallback de iniciales.
   */
  fotoUrl: string | null;
  /** Sólo las redes que el live enlaza de verdad; el resto salen en gris. */
  redes: Partial<Record<RedRoster, string>>;
}

/**
 * Los avatares se pintan **siempre** con las iniciales, nunca con la foto.
 *
 * No es una limitación: es que enlazar `i.scdn.co` ataría la pantalla a la CDN
 * de un tercero y a que haya red. Los tests corren sin ella, y una foto rota
 * calca peor que unas iniciales — que además son el propio fallback del live,
 * el que ya usa con Olivia Bass, Parsa Jafari y Saldivar.
 *
 * `fotoUrl` queda guardado: si algún día se quieren las fotos, se cambia esta
 * constante y nada más.
 */
export const MOSTRAR_FOTOS = false;

/** Los dos contadores de la cabecera: `B 41` y `M 17`. */
export const KPI_BOOKING = 41;
export const KPI_MANAGEMENT = 17;

/** Ninguno de los 41 tiene contrato en la foto. */
export const BADGE_SIN_CONTRATO = 'Sin contrato';

/**
 * El pie «Archivados · 1» del live va plegado y **no se llegó a abrir**: no se
 * sabe quién es ese artista, así que el plegable se calca inerte.
 */
export const ARCHIVADOS = 1;

export const VACIO_ARTISTAS = 'Selecciona un artista o crea uno nuevo.';

export const PLACEHOLDER_BUSCADOR = 'Buscar artista…';

/** 'Olivia Bass' → 'OL', igual que el fallback de avatar del live. */
export function iniciales(nombre: string): string {
  return nombre.slice(0, 2).toUpperCase();
}

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function filtrarArtistas(lista: ArtistaFicha[], texto: string): ArtistaFicha[] {
  if (!texto.trim()) return lista;
  const aguja = normalizar(texto);
  return lista.filter((artista) => normalizar(artista.nombre).includes(aguja));
}

/** Los 41 del live, en el orden alfabético en que los sirve. */
export const artistasFicha: ArtistaFicha[] = [
  {
    id: 'aaron-martin',
    nombre: 'Aaron Martin',
    booking: true,
    management: true,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5ebd9d6096871716ed9a812f978',
    redes: {
      Instagram: 'https://www.instagram.com/aaronmartin.ofc/',
      TikTok: 'https://www.tiktok.com/@aaronmartin.ofc',
      Spotify: 'https://open.spotify.com/intl-es/artist/3oRC5mspncCLEvanUoslrd',
      'Resident Advisor': 'https://es.ra.co/dj/aaronmartin',
      Beatport: 'https://www.beatport.com/artist/aaron-martin/870410',
      SoundCloud: 'https://soundcloud.com/aaronmartin_ofc',
      YouTube: 'https://www.youtube.com/@aaronmartin_ofc',
    },
  },
  {
    id: 'abdon',
    nombre: 'Abdon',
    booking: true,
    management: true,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb555ed038202a1664f82b6abc',
    redes: {
      Instagram: 'https://www.instagram.com/abdonmusic_/',
      TikTok: 'https://www.tiktok.com/@abdonmusic_',
      Spotify: 'https://open.spotify.com/intl-es/artist/1U3KHe6KtUztP3gIUBQ7h0',
      'Resident Advisor': 'https://es.ra.co/dj/abdon',
      Beatport: 'https://www.beatport.com/es/artist/abdon/861690',
      SoundCloud: 'https://soundcloud.com/abdonmusiclife',
      YouTube: 'https://www.youtube.com/@abdonmusic_',
    },
  },
  {
    id: 'aca',
    nombre: 'ACA',
    booking: true,
    management: false,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb3b36061d564eb7e61e951460',
    redes: {
      Instagram: 'https://www.instagram.com/aca.dj.official/',
      Spotify: 'https://open.spotify.com/intl-es/artist/2sBmYkeeOmp0pIU3M4fMfH',
      'Resident Advisor': 'https://es.ra.co/dj/acayu',
      Beatport: 'https://www.beatport.com/es/artist/aca-yu/1045048',
      SoundCloud: 'https://soundcloud.com/acadj',
      YouTube: 'https://www.youtube.com/@aca.dj.official',
    },
  },
  {
    id: 'andrea-castells',
    nombre: 'Andrea Castells',
    booking: true,
    management: false,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb619573f7abfd06cea0e47f0b',
    redes: {
      Instagram: 'https://www.instagram.com/andreacastells/',
      Spotify: 'https://open.spotify.com/intl-es/artist/5POnN5esh44APUrYWOLIK9',
      'Resident Advisor': 'https://es.ra.co/dj/andreacastells',
      Beatport: 'https://www.beatport.com/artist/andrea-castells/1330366',
      SoundCloud: 'https://soundcloud.com/andreacastellsmusic',
    },
  },
  {
    id: 'art-no-logia',
    nombre: 'ART NO LOGIA',
    booking: true,
    management: true,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb715b745afe467263378854b3',
    redes: {
      Instagram: 'https://www.instagram.com/artnologia_/',
      Spotify: 'https://open.spotify.com/intl-es/artist/578uwpciymiRVea76Q8CMK',
      'Resident Advisor': 'https://es.ra.co/dj/artnologia',
      Beatport: 'https://www.beatport.com/artist/art-no-logia/1061996',
      SoundCloud: 'https://soundcloud.com/artnologia',
    },
  },
  {
    id: 'bassel-darwish',
    nombre: 'Bassel Darwish',
    booking: true,
    management: false,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb21c5141b6e3d8473a0c6ca04',
    redes: {
      Spotify: 'https://open.spotify.com/artist/0YSvkYYbu18RTZpK3cUP6i',
    },
  },
  {
    id: 'bizza',
    nombre: 'Bizza',
    booking: true,
    management: true,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb822fd1cc28c2e5349411e41b',
    redes: {
      Instagram: 'https://www.instagram.com/bizza_up/',
      Spotify: 'https://open.spotify.com/artist/1x3h782rndvyBIsITAocXG',
      'Resident Advisor': 'https://es.ra.co/dj/bizza/biography',
      Beatport: 'https://www.beatport.com/artist/bizza/675893',
      SoundCloud:
        'https://soundcloud.com/bizzadj?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
    },
  },
  {
    id: 'brenda-serna',
    nombre: 'Brenda Serna',
    booking: true,
    management: false,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eba2bf6bbd9709bc9fad84f1fb',
    redes: {
      Spotify: 'https://open.spotify.com/artist/70v4feGLc8A2Rq2CLQUPcm',
    },
  },
  {
    id: 'claudia-tejeda',
    nombre: 'Claudia Tejeda',
    booking: true,
    management: true,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5ebb0fc729f29d89eb685d4e5bc',
    redes: {
      Instagram: 'https://www.instagram.com/claudiatejeda.music/',
      Spotify: 'https://open.spotify.com/artist/3sCfOqeJokKsGSwy0sCi43',
      'Resident Advisor': 'https://es.ra.co/dj/claudiatejeda',
      Beatport: 'https://www.beatport.com/es/artist/claudia-tejeda/266742',
      SoundCloud: 'https://soundcloud.com/claudia-tejeda',
      YouTube: 'https://www.youtube.com/channel/UCTuV_tAEWsUgTeKRbywlwew',
    },
  },
  {
    id: 'dh-moon',
    nombre: 'DH Moon',
    booking: true,
    management: true,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5ebb6f35d6b5b1d0badf57e3fd2',
    redes: {
      Instagram: 'https://www.instagram.com/dhmoon_gt/',
      Spotify: 'https://open.spotify.com/artist/3XeZeVmAtD6nZFhZyOF46u',
      'Resident Advisor': 'https://es.ra.co/dj/dhmoon',
      Beatport: 'https://www.beatport.com/es/artist/dh-moon/962621',
      SoundCloud: 'https://soundcloud.com/dhmoonofc',
      YouTube: 'https://www.youtube.com/@DHMoonGT',
    },
  },
  {
    id: 'dhuna',
    nombre: 'Dhuna',
    booking: true,
    management: false,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb788ab2fec879de51601987b7',
    redes: {
      Instagram: 'https://www.instagram.com/dhuna_/',
      Spotify: 'https://open.spotify.com/artist/1x3iGE0BolWCJKzSHaObla',
      'Resident Advisor': 'https://es.ra.co/dj/dhuna',
      Beatport: 'https://www.beatport.com/artist/dhuna/178979',
      SoundCloud: 'https://soundcloud.com/dhunaalvarez',
      YouTube: 'https://www.youtube.com/@DhunaMusic',
    },
  },
  {
    id: 'florentia',
    nombre: 'Florentia',
    booking: true,
    management: false,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5ebfe7bef1fa421fa42b237a2bb',
    redes: {
      Instagram: 'https://www.instagram.com/florentiaofficial/',
      Spotify: 'https://open.spotify.com/artist/34FR7Jh5TlMsmEVUlHVzmD',
      'Resident Advisor': 'https://es.ra.co/dj/florentia',
      Beatport: 'https://www.beatport.com/artist/florentia/800657',
      SoundCloud: 'https://soundcloud.com/florentiaofficial',
      YouTube: 'https://www.youtube.com/@florentiaofficial',
    },
  },
  {
    id: 'fran-hernandez',
    nombre: 'Fran Hernandez',
    booking: true,
    management: false,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5ebbe42916978d2644843db7a80',
    redes: {
      Instagram: 'https://www.instagram.com/franhernandezdj/?hl=es',
      Spotify: 'https://open.spotify.com/artist/7tswPf6HSa3DQ91FxmJw5H',
      'Resident Advisor': 'https://es.ra.co/dj/franhernandez',
      Beatport: 'https://www.beatport.com/artist/fran-hernandez/605792',
      SoundCloud: 'https://soundcloud.com/franhernandezdj',
      YouTube: 'https://www.youtube.com/@fran_hernandez_',
    },
  },
  {
    id: 'freddy-bello',
    nombre: 'Freddy Bello',
    booking: true,
    management: true,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb5b269ffea83c3f5bb961c962',
    redes: {
      Instagram: 'https://www.instagram.com/freddybellofb/',
      Spotify: 'https://open.spotify.com/artist/5mFUvXMZFndL6Wl2TwbkiD',
      'Resident Advisor': 'https://es.ra.co/dj/freddybello-ve',
      Beatport: 'https://www.beatport.com/artist/freddy-bello/438983',
      SoundCloud: 'https://soundcloud.com/djfreddybello1',
      YouTube: 'https://www.youtube.com/@DJFREDDYBELLO',
    },
  },
  {
    id: 'gaston-zani',
    nombre: 'Gaston Zani',
    booking: true,
    management: true,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5ebe5458e46566fa59eec32ea4f',
    redes: {
      Instagram: 'https://www.instagram.com/gastonzani/',
      Facebook: 'https://www.facebook.com/gastonzanidj',
      TikTok: 'https://www.tiktok.com/@gastonzani',
      Spotify: 'https://open.spotify.com/artist/2uU0gIFQJd8zSyAaxhhoL1',
      'Resident Advisor': 'https://es.ra.co/dj/gastonzani',
      Beatport: 'https://www.beatport.com/artist/gaston-zani/454135',
      SoundCloud: 'https://soundcloud.com/gastonzanidj',
      YouTube: 'https://www.youtube.com/channel/UCSSqzdys3gCYj1jHlkslX8g',
    },
  },
  {
    id: 'janse',
    nombre: 'Janse',
    booking: true,
    management: true,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5ebfe0c1db693591f26eab21ecd',
    redes: {
      Instagram: 'https://www.instagram.com/jansemusic/',
      Spotify: 'https://open.spotify.com/artist/3gd6H7n49sL1dTMJmRk3uJ',
      'Resident Advisor': 'https://es.ra.co/dj/janse',
      Beatport: 'https://www.beatport.com/es/artist/janse/1326417',
      SoundCloud: 'https://soundcloud.com/jansemusic',
    },
  },
  {
    id: 'jose-fajardo',
    nombre: 'Jose Fajardo',
    booking: true,
    management: false,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb6252e7a7bb115120de413b00',
    redes: {
      Instagram: 'https://www.instagram.com/josefajardomusic/?hl=es',
      Spotify: 'https://open.spotify.com/artist/54yZhCzQYoj5xyc7cdLv32',
      'Resident Advisor': 'https://es.ra.co/dj/josefajardo',
      Beatport: 'https://www.beatport.com/artist/jose-fajardo/883902',
      SoundCloud: 'https://soundcloud.com/josefajardo',
      YouTube: 'https://www.youtube.com/channel/UC2tYNQHTh0hyVzS99Pe9mAA',
    },
  },
  {
    id: 'koleto',
    nombre: 'Koleto',
    booking: true,
    management: false,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb179896c27e3eb4aa17180250',
    redes: {
      Instagram: 'https://www.instagram.com/koletodj/',
      Spotify: 'https://open.spotify.com/artist/7lfqVBdXt8NHqkemT3eBw8',
      'Resident Advisor': 'https://es.ra.co/dj/koletobeatz',
      Beatport: 'https://www.beatport.com/es/artist/koleto/330910',
      SoundCloud: 'https://soundcloud.com/koleto-1',
    },
  },
  {
    id: 'la-cintia',
    nombre: 'LA CINTIA',
    booking: true,
    management: false,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb79a2b057ef01035fd7837f8f',
    redes: {
      Instagram: 'https://www.instagram.com/lacintia_/',
      TikTok: 'https://www.tiktok.com/@lacintiadj',
      Spotify: 'https://open.spotify.com/artist/1fNABhEytJVAJtJJQaejiP',
      Beatport: 'https://www.beatport.com/es/artist/la-cintia/1034576',
      SoundCloud: 'https://soundcloud.com/lacintia',
    },
  },
  {
    id: 'londonground',
    nombre: 'Londonground',
    booking: true,
    management: true,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb789e8610d0394abfb20eeab0',
    redes: {
      Instagram: 'https://www.instagram.com/londonground_/?hl=es',
      Spotify: 'https://open.spotify.com/artist/1KrOwCpc0OZhhJIW3wWgl8',
      'Resident Advisor': 'https://es.ra.co/dj/londonground',
      Beatport: 'https://www.beatport.com/es/artist/londonground/123294',
      SoundCloud: 'https://soundcloud.com/londonground',
      YouTube: 'https://www.youtube.com/@londonground',
    },
  },
  {
    id: 'los-canarios',
    nombre: 'Los Canarios',
    booking: true,
    management: true,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb08a9eee844cdec942979caac',
    redes: {
      Instagram: 'https://www.instagram.com/loscanariosofc/',
      Spotify: 'https://open.spotify.com/artist/2pfJEs1V2CK5txzhA6lOHO',
      'Resident Advisor': 'https://es.ra.co/dj/loscanarios',
      Beatport: 'https://www.beatport.com/artist/los-canarios/1171511',
      SoundCloud:
        'https://soundcloud.com/los_canarios?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
      YouTube: 'https://www.youtube.com/@LosCanariosofc',
    },
  },
  {
    id: 'marcel-bs',
    nombre: 'Marcel BS',
    booking: true,
    management: true,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb23548e94169e252f0504565f',
    redes: {
      Instagram: 'https://www.instagram.com/marcel_bs/',
      Spotify: 'https://open.spotify.com/artist/5fZ3mroQWZS2T8V7ZUlSZo',
      'Resident Advisor': 'https://es.ra.co/dj/marcelbs',
      Beatport: 'https://www.beatport.com/artist/marcel-bs/1270307',
      SoundCloud: 'https://soundcloud.com/djmarcelbs',
    },
  },
  {
    id: 'marian-ariss',
    nombre: 'Marian Ariss',
    booking: true,
    management: false,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb334947e46ab9ee2da50187ec',
    redes: {
      Instagram: 'https://www.instagram.com/marian.ariss/',
      Spotify: 'https://open.spotify.com/artist/3RHn1BesFDaH5eX5jnYYMh',
      'Resident Advisor': 'https://es.ra.co/dj/marianariss',
      SoundCloud: 'https://soundcloud.com/marian-ariss',
      YouTube: 'https://www.youtube.com/@marianariss',
    },
  },
  {
    id: 'milan-torne',
    nombre: 'Milan Torne',
    booking: true,
    management: true,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5ebe9303824cd35ff52b197317a',
    redes: {
      Instagram: 'https://www.instagram.com/milantorne/',
      Spotify: 'https://open.spotify.com/artist/6HpQJ9lY91mewk0dEfE99q',
      Beatport: 'https://www.beatport.com/artist/milan/48891',
      SoundCloud: 'https://soundcloud.com/ayymilan',
      YouTube: 'https://www.youtube.com/@milantorne',
    },
  },
  {
    id: 'nacho-scoppa',
    nombre: 'Nacho Scoppa',
    booking: true,
    management: false,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb7fd3dcce415d97d4d726525d',
    redes: {
      Instagram: 'https://www.instagram.com/nachoscoppa/?hl=es',
      Spotify: 'https://open.spotify.com/artist/53c3s3SEmRB6OlD1fG7BqA',
      'Resident Advisor': 'https://ra.co/dj/nachoscoppa',
      Beatport: 'https://www.beatport.com/artist/nacho-scoppa/827979',
      SoundCloud: 'https://soundcloud.com/nachoscoppaofficial',
      YouTube: 'https://www.youtube.com/channel/UCILqld5ENcxk3TUyA466Ixg',
    },
  },
  {
    id: 'olivia-bass',
    nombre: 'Olivia Bass',
    booking: true,
    management: false,
    fotoUrl: null,
    redes: {
      Instagram: 'https://www.instagram.com/eterna.olivia/',
      TikTok: 'https://www.tiktok.com/@iamoliviabass',
      YouTube: 'https://www.youtube.com/channel/UCEjAuSBBtatq-hbgVKhW8Gg',
    },
  },
  {
    id: 'parsa-jafari',
    nombre: 'Parsa Jafari',
    booking: true,
    management: false,
    fotoUrl: null,
    redes: {},
  },
  {
    id: 'pau-guilera',
    nombre: 'Pau Guilera',
    booking: true,
    management: false,
    fotoUrl:
      'https://imgproxy.ra.co/_/quality:66/aHR0cHM6Ly9zdGF0aWMucmEuY28vaW1hZ2VzL3Byb2ZpbGVzL3NxdWFyZS9wYXVndWlsZXJhLmpwZz9kYXRlVXBkYXRlZD0xNDc4MjU5NDY5MjMw',
    redes: {
      Instagram: 'https://www.instagram.com/pauguilera/',
      Spotify: 'https://open.spotify.com/artist/7iE3xZnWXBM32TjHfCVKLv',
      'Resident Advisor': 'https://ra.co/dj/pauguilera',
      Beatport: 'https://www.beatport.com/artist/pau-guilera/947113',
      SoundCloud: 'https://soundcloud.com/pauguilera',
    },
  },
  {
    id: 'prophecy',
    nombre: 'Prophecy',
    booking: true,
    management: false,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb6495c60f5ed717cf80c19d49',
    redes: {
      Instagram: 'https://www.instagram.com/prophecylive/',
      Spotify: 'https://open.spotify.com/artist/03O6WINYmDJRCE2EUFaykv',
      'Resident Advisor': 'prophecyofficial.com',
      Beatport: 'https://www.beatport.com/artist/prophecy/68593',
      SoundCloud: 'https://soundcloud.com/prophecylive',
      YouTube: 'www.youtube.com/@prophecylivetv',
    },
  },
  {
    id: 'rivellino',
    nombre: 'Rivellino',
    booking: true,
    management: true,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb282159b9b0ad10214fc1a1ff',
    redes: {
      Instagram: 'https://instagram.com/rivellino.music',
      Facebook: 'https://facebook.com/rivellino.music',
      Spotify: 'https://open.spotify.com/artist/7d6jWwaojbxvCPszX8qdRx',
      'Resident Advisor': 'https://ra.co/dj/rivellino',
      Beatport: 'https://www.beatport.com/artist/rivellino/806753',
      SoundCloud: 'https://soundcloud.com/rivellino_music',
      YouTube: 'https://www.youtube.com/@rivellino.music_',
    },
  },
  {
    id: 'rubenus',
    nombre: 'Rubenus',
    booking: true,
    management: false,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eba9eadab612f7f88fe06be958',
    redes: {
      Instagram: 'https://www.instagram.com/rubenus_dj/',
      Spotify: 'https://open.spotify.com/artist/5WAxcFgkkZxPEF1j7VQJ9X',
      Beatport: 'beatport.com/artist/rubenus/1179889',
      SoundCloud: 'soundcloud.com/ruben-nieto-campo',
      YouTube: 'https://www.youtube.com/user/rubenus',
    },
  },
  {
    id: 'sadkiel',
    nombre: 'Sadkiel',
    booking: true,
    management: false,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5ebdc12153b011e58aa05cfed74',
    redes: {
      Instagram: 'https://www.instagram.com/sadkiel.music',
      Spotify: 'https://open.spotify.com/artist/6JFspbPYcL5Lwr3iaOriYo?si=iexzqKE4QAWZpSw1FDzGLg',
      'Resident Advisor': 'https://ra.co/dj/sadkiel',
      Beatport: 'https://www.beatport.com/artist/sadkiel/487260',
      SoundCloud: 'https://soundcloud.com/sadkiel',
      YouTube: 'https://www.youtube.com/@sadkielmusic',
    },
  },
  {
    id: 'saldivar',
    nombre: 'Saldivar',
    booking: true,
    management: false,
    fotoUrl: null,
    redes: {
      Instagram: 'https://www.instagram.com/saldivarofficial',
      'Resident Advisor': 'https://ra.co/dj/saldivar',
      SoundCloud: 'https://soundcloud.com/dj-saldivar',
    },
  },
  {
    id: 'sebastian-ledher',
    nombre: 'Sebastian Ledher',
    booking: true,
    management: true,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5ebe63bf05d2a6546e2204e3a0f',
    redes: {
      Spotify: 'https://open.spotify.com/artist/6KUSLPXO8e94sZWVksv4nn',
    },
  },
  {
    id: 'sera-de-villalta',
    nombre: 'Sera De Villalta',
    booking: true,
    management: false,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5ebf409538e20ec37ed362cdaad',
    redes: {
      Spotify: 'https://open.spotify.com/artist/36QNZGUOB4BqczrvthRI3T',
    },
  },
  {
    id: 'sergio-saffe',
    nombre: 'Sergio Saffe',
    booking: true,
    management: false,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5ebdc25b48ce38ea4ed6ac902a1',
    redes: {
      Spotify: 'https://open.spotify.com/artist/2qPuQhV7c2QJ5jV7EUVtnT',
    },
  },
  {
    id: 'sumia',
    nombre: 'SUMIA',
    booking: true,
    management: false,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb4a7506d506529c8592cd37f7',
    redes: {
      Spotify: 'https://open.spotify.com/artist/0GNaI8xPr4mxPoF5Ku8Rpa',
    },
  },
  {
    id: 'test-artist',
    nombre: 'Test Artist',
    booking: true,
    management: false,
    fotoUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSre5cHBDZ3q07Wh7K1rLT_O0eKAT5bRCf5V4QOkj0YVg&amp;s=10',
    redes: {
      Instagram: 'https://www.instagram.com/carlospeggo/',
    },
  },
  {
    id: 'tomi-kesh',
    nombre: 'Tomi & Kesh',
    booking: true,
    management: false,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eba44095c5439d60306fca47e2',
    redes: {
      Instagram: 'https://www.instagram.com/tomiandkesh/',
      TikTok: 'https://www.tiktok.com/@tomiandkesh',
      Spotify: 'https://open.spotify.com/artist/464Y3iRMbG7QHLhpQnMkxG',
      'Resident Advisor': 'https://es.ra.co/dj/tomikesh',
      Beatport: 'https://www.beatport.com/artist/tomikesh/652731',
      SoundCloud: 'https://soundcloud.com/tomi-and-kesh',
    },
  },
  {
    id: 'tony-guerra',
    nombre: 'Tony Guerra',
    booking: true,
    management: true,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb2f6528aa9cde122804e73da8',
    redes: {
      Instagram: 'https://www.instagram.com/djtonyguerra/',
      TikTok: 'https://www.tiktok.com/@djtonyguerra_',
      Spotify: 'https://open.spotify.com/artist/5qURuhcV6ZjUfe1iYsC2Py',
      'Resident Advisor': 'https://es.ra.co/dj/tonyguerra',
      Beatport: 'https://www.beatport.com/artist/tony-guerra/119169',
      SoundCloud: 'https://soundcloud.com/tonyguerradj',
    },
  },
  {
    id: 'vidaloca',
    nombre: 'Vidaloca',
    booking: true,
    management: true,
    fotoUrl: 'https://i.scdn.co/image/ab6761610000e5eb15a0215a39ed1fefa51f2d4d',
    redes: {
      Instagram: 'https://www.instagram.com/vidalocamusic/',
      Spotify: 'https://open.spotify.com/artist/41gjvtc6EWrQLdBSPlpLy9',
      'Resident Advisor': 'https://es.ra.co/dj/vidaloca-es',
      Beatport: 'https://www.beatport.com/artist/vidaloca/106957',
      SoundCloud: 'https://soundcloud.com/vidaloca',
    },
  },
];
