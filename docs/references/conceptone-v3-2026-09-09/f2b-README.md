# Evidencia `f2b-` — Faena 2, Fase C (Management II)

Capturada el **2026-09-09 entre las 11:24 y las 11:26 CEST**, con sesión iniciada y **sin escribir
nada** en el live. Complementa el barrido de las 09:20-09:40 y la tanda `f2-` de las 10:35-10:41.

Son los **estados secundarios de los filtros** de `/management/{campanas,activaciones,content}`, que
ninguna de las dos tandas anteriores cubría: los menús desplegables sólo existen en el DOM mientras
están abiertos, así que en los volcados anteriores no aparecía ni una opción.

## Qué hay

| Fichero | Qué es |
|---|---|
| `f2b-management--{campanas,activaciones,content}-filtros.txt` | Cada menú `dd` **abierto**: sus opciones y el `outerHTML` del `.dd-menu`, sin truncar |
| `f2b-management--{campanas,activaciones,content}-filtro-N.png` | La pantalla con ese menú desplegado |
| `f2b-management--campanas-contador.txt` | El contador de la derecha con y sin filtro |
| `f2b-management--contadores.txt` | Los tres contadores en singular, en plural y a cero |
| `f2b-management--vacios.txt` | El `outerHTML` de los tres estados vacíos |
| `f2b-management--campanas-filtrada-abdon.png` | La pantalla filtrada por Abdon, con sus KPI |
| `f2b-management--{campanas,activaciones,content}-vacia.png` | Las tres pantallas sin resultados |

## Lo que resuelve, y que no se podía deducir

1. **El desplegable de artistas lista los 17 del roster de management**, no los 41 ni los que
   aparecen en las filas. Se sabe porque **Fran Hernandez tiene una campaña y no está en el menú**:
   `management-roster.ts` lo tiene con `management: false`. Si se hubiera derivado la lista de las
   filas, habría salido un artista de más y habrían faltado doce.
2. **Los contadores cuentan lo filtrado, no el conjunto.** «11 campañas» pasa a «3 campañas» al
   elegir Abdon. Ojo: es lo contrario de lo que se midió en `/management/insights`, cuyo contador
   («17 con datos · 17 artistas») no se mueve con los chips. Son dos contadores distintos; hay que
   medir el de cada pantalla y no heredar el de la hermana.
3. **Los tres KPI de Campañas también se recalculan con el filtro.** Con Abdon puesto pasan de
   `1150,00 € / 450,00 € / 1` a `0,00 € / 250,00 € / 0`.
4. **Los literales de los contadores**, que tienen una irregularidad del origen que se calca tal
   cual: el plural de activaciones lleva tilde donde no toca —«31 activaciónes»—, el singular no
   —«1 activación»—, y el vacío de la lista sí está bien escrito —«Sin activaciones.».
5. **Los vacíos**: `Sin campañas.` en un `td` a 5 columnas, `Sin activaciones.` en una `card` suelta
   que sustituye a los grupos por mes, y en Content las cinco columnas con su guion.

## Cómo se sacó, y qué no se hizo

Se siguió el procedimiento fijado en el §3.2 del spec:

1. Abrir un desplegable de filtro y elegir una de sus opciones es **estado de cliente**: no escribe
   nada, se va al recargar, y es más inocuo aún que abrir un modal de edición, que ya estaba
   aprobado.
2. **No se tocó nada más:** ni una tecla en un campo, ni un guardado, ni los `<select>` de estado de
   las filas (`Programada`/`En curso`/`Hecha`/`Perdida`), ni las aspas de borrar, ni ningún
   `+ Nuevo…`.

## Un detalle de implementación que conviene saber

El `.dd-menu` **no cuelga del `.dd`**: el live lo pinta en un portal colgado del `div.apx` y le
calcula la posición con estilos en línea. Un primer intento de captura buscó el menú dentro del `.dd`
y volvió vacío tres veces seguidas aunque el PNG enseñaba el menú abierto. Si alguien vuelve a
capturar estos menús: buscar `.dd-menu` en todo el documento.

Nuestro `ApxDd` lo pinta dentro del `.dd`, que es lo que `apx.css` supone
(`position: absolute; top: calc(100% + 6px); left: 0; right: 0`). El resultado es el mismo y evita
reimplementar un portal.
