# Design system: "Sotto i riflettori"

Il sistema visivo del nuovo ingromoda.com. Pagina viva: `/styleguide` (non indicizzata). Token in `src/app/globals.css` (CSS) e `src/lib/gsap.ts` (motion).

## Concetto

Ingromoda mette il cliente al centro dell'attenzione: la sua identità è la ribalta. Il sito è un palco.

- **Palco** (sezioni scure, velluto prugna): dove i capi vanno in scena e si accende la luce.
- **Luci di sala** (sezioni chiare, cipria): dove si legge con calma, come in un programma di sala.
- **La luce è il filo conduttore del movimento:** un faro scorre sui capi (hero), il cartamodello si illumina e diventa abito (scena 2), un lampo di luce cambia occasione (scena 3), un occhio di bue segue gli outfit (scena 4), i camerini si aprono e si accendono (scena 5), un punto luminoso percorre i passi della videochiamata (scena 6), l'insegna ON AIR si accende (scena 7), una luce corre lungo il viale fino al negozio (scena 9).
- **Il sipario** apre il sito (preloader) e separa le pagine (transizioni).

Riferimenti culturali: locandine teatrali ottocentesche, riviste di moda (Didone + Futura), gelatine magenta dei fari di scena, le pedane a specchio del negozio.

## Colore

Il logo impone il fucsia; tutto il resto è costruito intorno a lui.

| Token | Valore | Uso | Contrasto |
|---|---|---|---|
| `--ink` | `#0D070A` | palco più profondo, footer, menu | |
| `--velvet` | `#160A10` | fondo scuro principale | |
| `--velvet-2` / `-3` | `#221019` / `#33121F` | livelli scuri | |
| `--plum` | `#4A0F2C` | base del velluto delle tende | |
| `--cipria` | `#F6EEEA` | fondo chiaro (luci di sala) | |
| `--cipria-2` / `-3` | `#EDE1DB` / `#E2D2CA` | livelli chiari | |
| `--ivory` | `#F3EAE2` | testo su scuro | 16,3:1 su velvet |
| `--ivory-dim` | `#CBBCB5` | testo secondario su scuro | 10,5:1 su velvet |
| `--char` | `#1C1016` | testo su chiaro | 16,2:1 su cipria |
| `--char-dim` | `#5C4851` | testo secondario su chiaro | 7,3:1 su cipria |
| `--magenta` | `#E5097F` | fucsia del logo: grafica, luce, testo grande | 4,3:1 su velvet (solo testo grande) |
| `--magenta-deep` | `#C4086B` | fondo dei bottoni primari | 5,6:1 con `#FFF8F3` |
| `--magenta-text` | `#B3075F` | fucsia per testo su chiaro | 5,9:1 su cipria |
| `--magenta-glow` | `#FF5AAE` | fucsia per testo su scuro | 6,8:1 su velvet |
| `--champagne` / `--light` | `#ECD9BD` / `rgb(255 236 214)` | la luce stessa (fari, aloni) | |

Regole: un solo accento (fucsia) su tutto il sito; niente gradienti viola/blu; il nero puro e il bianco puro non esistono; i testi secondari sono tinte del colore del fondo, mai grigi neutri.

## Tipografia

- **Display:** Bodoni Moda (variabile, asse `opsz`), con corsivo. Didone come il logo. Titoli, citazioni, numeri grandi.
- **Testo e interfaccia:** Jost (revival di Futura). Paragrafi, bottoni, etichette.
- Entrambi self-hosted con `next/font`, `display: swap`.

| Classe | Dimensione (clamp) | Interlinea | Uso |
|---|---|---|---|
| `.t-hero` | 2,6rem → 8,75rem | 0,94 | solo l'H1 della home |
| `.t-display` | 2,35rem → 6rem | 0,98 | titoli di sezione |
| `.t-title` | 1,85rem → 3,6rem | 1,04 | sottotitoli |
| `.t-quote` | 1,45rem → 2,6rem, corsivo | 1,18 | recensioni |
| `.t-lead` | 1,125rem → 1,375rem | 1,55 | attacchi |
| body | 1,0625rem | 1,6 | testo corrente, misura 62ch |
| `.t-label` | 0,75rem maiuscolo, 0,2em | | etichette funzionali (orari, footer), mai sopra i titoli |

Enfasi: corsivo della stessa famiglia, a volte in fucsia (una parola per titolo al massimo).

## Griglia e spazio

- 12 colonne, gutter `clamp(1rem, …, 2rem)`, margini `clamp(1rem, …, 5rem)`, larghezza massima 1680px (`.wrap`, `.grid-12`).
- Ritmo verticale delle sezioni: `--section` = `clamp(5,5rem, …, 11rem)`.
- Asimmetria controllata: i camerini hanno larghezze 5/4/3 colonne e partenze sfalsate; le recensioni alternano colonne diverse; le immagini sono ritagliate con intenzione (`object-position`).
- Su mobile ogni layout asimmetrico torna a una colonna.

## Forma

- Immagini, riquadri, campi del form: **spigolo vivo** (raggio 0).
- Elementi interattivi (bottoni, chip, pulsanti icona): **pillola** (999px).
- Ombre solo dove c'è profondità reale (pulsante WhatsApp flottante, banner cookie), sempre tinte del fondo.

## Luce e materia

- **Grana:** tessera PNG 128px a 16 livelli, opacità 7%, solo sulle sezioni scure (`.grain`), mai animata.
- **Velluto:** gradiente ripetuto a pieghe (`.velvet`, variabile `--fold`) con vignettatura in alto e in basso.
- **Faro:** strato scuro sovradimensionato con un buco radiale, mosso solo con `transform` (`.spotlight-dark`, `SpotlightReveal`).
- **Cono di luce:** trapezio con gradiente e `mix-blend-mode: screen` (`.hero-beam`).

## Movimento

Token (CSS `--ease-*`, `--dur-*`; GSAP `EASE`, `DUR`, `STAGGER`):

| Token | Valore | Uso |
|---|---|---|
| `ingro.out` | `cubic-bezier(0.22, 1, 0.36, 1)` | entrate, rivelazioni |
| `expo.out` | `cubic-bezier(0.16, 1, 0.3, 1)` | hover, roll dei bottoni |
| `ingro.curtain` | `cubic-bezier(0.76, 0, 0.24, 1)` | sipari, cambi di scena |
| durate | 0,4 / 0,8 / 1,2 s | rapido / base / lento |
| stagger | 0,06 / 0,09 / 0,14 s | parole / righe / blocchi |

Principi:
1. Ogni animazione racconta qualcosa (vedi tabella sotto); niente decorazione fine a sé stessa.
2. Si animano solo `transform`, `opacity`, `clip-path` (più `stroke-dashoffset` per i disegni SVG).
3. Il contenuto è visibile di default: nulla viene nascosto prima che il JavaScript sia pronto; il testo sopra la piega non viene nascosto e riprodotto se la scena è già illuminata.
4. Un solo ticker: Lenis è guidato da `gsap.ticker` e alimenta ScrollTrigger.
5. `prefers-reduced-motion`: niente Lenis, niente preloader, niente pin; tende aperte, testi e immagini fermi, transizioni di pagina istantanee.
6. Nessuna interazione dipende solo dall'hover: i camerini si aprono anche al focus e, su touch, allo scroll; le occasioni si scelgono con click, tap o frecce.

| Animazione | Dove | Cosa racconta |
|---|---|---|
| Preloader "si accendono le luci" | primo accesso | il faro si accende sul velluto chiuso, il logo appare, la M viene pennellata, il sipario si apre |
| Faro che scorre | hero | i capi sono i protagonisti, uno alla volta |
| Titolo per righe da maschera | titoli | come una locandina che sale alla luce |
| Cartamodello → abito | scena 2 | tradizione sartoriale che diventa moda di oggi |
| Parole che si illuminano | scena 2 | si legge al ritmo della luce |
| Lampo circolare | scena 3 | cambio di occasione = cambio di scena |
| Pin con occhio di bue | scena 4 | dal tailleur all'abito splendente |
| Tende che si aprono | scena 5 | entrare in camerino |
| Punto di luce sui passi | scena 6 | il percorso della videochiamata |
| Insegna ON AIR | scena 7 | la TV |
| Contatore | scena 8 | 513 recensioni reali |
| Luce sul viale | scena 9 | la strada fino al negozio |
| Sipario tra pagine | navigazione | View Transitions API, fallback GSAP |
| Header che si nasconde | scroll | lascia spazio al contenuto, torna quando si risale |
| Cursore "faro" | solo mouse | un alone accompagna il cursore di sistema e nomina l'azione |
| Bottone magnetico | CTA primarie, solo mouse | invito leggero |

## Componenti

- `Button` (primary / ghost / light, opzione magnetica, label che scorre, luce che sale): `src/components/ui/Button.tsx`.
- `TextLink` (sottolineatura che si disegna): `src/components/ui/TextLink.tsx`.
- `SplitReveal`, `FadeUp`, `ParallaxImage`, `Marquee`, `CountUp`, `SpotlightReveal`, pin (scena cerimonia): `src/components/motion/`.
- `Cursor`, `Magnetic`, `Media`, `OpeningHours`: `src/components/ui/`.
- `Header`, `MobileMenu`, `Footer`, `Preloader`, `CookieBanner`, `StickyWhatsApp`, `RouteCurtain`, `PageShell`, `AnnouncementBar` (nell'header): `src/components/layout/`.
- `Logo` (tracciati vettoriali condivisi via `<use>`): `src/components/brand/`.

## Immagini

- Prima le foto reali (negozio, abiti indossati, accessori fotografati in negozio), poi i lookbook dei marchi, per ultimo (e segnalate) le immagini dall'aspetto generato.
- Trattamento coerente: sulle sezioni scure le foto entrano "al buio" e si accendono sotto il faro; sulle chiare restano naturali.
- Alt in italiano che descrivono il capo, non la foto.
- Nomi file descrittivi in italiano (`donna/cerimonia-raso-ottanio.jpg`).

## Cosa non fare

Niente caroselli generici, card tutte uguali con ombra, hero centrata con due bottoni, emoji come icone, etichette maiuscole sopra ogni titolo, numeri di sezione, gradienti nel testo, trattini lunghi nei testi, stock evidenti.
