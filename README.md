# Ingromoda: nuovo sito "Sotto i riflettori"

Sito vetrina di Ingromoda srl, boutique di abbigliamento uomo e donna a Palermo (Viale Regione Siciliana S.E. 4325) da oltre 40 anni, specializzata in abiti da cerimonia e nella linea curvy.

- **Repository:** https://github.com/giovanni508/ingro (ramo `main`; ogni modifica viene pubblicata qui).
- **Stack:** Next.js 16 (App Router, Cache Components; Turbopack in sviluppo, webpack per la build di produzione), React 19, TypeScript, Tailwind CSS 4, GSAP 3 (ScrollTrigger, SplitText, CustomEase) con Lenis, `next/image`, `next/font`.
- **Pagine:** home (11 scene), `/donna`, `/uomo`, `/chi-siamo`, `/contatti`, `/privacy`, `/cookie`, `/accessibilita`, 404, `/styleguide` (interna, non indicizzata).
- **Documenti:** [DESIGN.md](DESIGN.md) (sistema visivo e motion), [DECISIONS.md](DECISIONS.md) (scelte e motivi), [AUDIT.md](AUDIT.md) (vecchio sito), [PROGRESS.md](PROGRESS.md), [CRITIQUE.md](CRITIQUE.md), [PRESENTAZIONE.md](PRESENTAZIONE.md), [content/TODO-cliente.md](content/TODO-cliente.md).

## Avvio in locale

Serve Node.js 20.9 o superiore (testato con Node 24).

```bash
npm install
```

```bash
npm run dev
```

Il sito è su http://localhost:3000. Per provare la versione di produzione:

```bash
npm run build
```

```bash
npm run start
```

Controlli di qualità:

```bash
npm run lint
```

```bash
npm run typecheck
```

## Variabili d'ambiente

Copiate `.env.example` in `.env.local` (in locale) o impostatele nel pannello dell'hosting (Hostinger o Vercel). Nessuna è obbligatoria per vedere il sito.

| Variabile | A cosa serve |
|---|---|
| `CONTACT_TO` | Destinatario/i dei messaggi del modulo contatti (separati da virgola). Mai scritto nel codice. |
| `CONTACT_FROM` | Mittente verificato presso il servizio di invio, es. `Sito Ingromoda <sito@ingromoda.com>`. |
| `RESEND_API_KEY` | Chiave del servizio [Resend](https://resend.com) usato per inviare le email del modulo. |

Comportamento del modulo (`src/app/api/contact/route.ts`):
- **in sviluppo**, senza servizio configurato, il messaggio viene scritto nella console del server (nessun invio reale);
- **in produzione** con le tre variabili impostate, il messaggio parte via email;
- **in produzione senza configurazione** il modulo risponde con un messaggio chiaro che invita a usare WhatsApp o il telefono (nessun messaggio va perso in silenzio).

Protezioni: campo trappola invisibile (honeypot), tempo minimo di compilazione, validazione lato client e lato server, messaggi d'errore in italiano.

## Aggiornare i contenuti

Tutti i testi e i dati sono in `content/`, in file JSON e Markdown leggibili, pensati per essere poi alimentati da un CMS (per esempio WordPress via REST API, mappando un file per tipo di contenuto).

| File | Contenuto |
|---|---|
| `content/site.json` | Dati aziendali: indirizzo, telefono, WhatsApp, email, social, orari del negozio, P. IVA, nota sul pagamento con Klarna (footer) |
| `content/home.json` | Testi delle 11 scene della home (compresi linea curvy e spot) |
| `content/departments.json` | Reparti Donna e Uomo: testi, taglie, categorie, foto, video, messaggi WhatsApp |
| `content/chi-siamo.json` | Pagina Chi siamo |
| `content/reviews.json` | Recensioni Google mostrate (testo originale) e conteggio |
| `content/tv.json` | Palinsesto TVM CH19 e dirette Facebook |
| `content/features.json` | Interruttori: barra annunci (testo e date), "prossima messa in onda", "aperto ora" |
| `content/legal/*.md` | Privacy, cookie, accessibilità |
| `content/media-map.json` | Elenco curato delle immagini: file sorgente, nome finale, testo alternativo |
| `content/raw/` | Estrazione integrale del vecchio sito (solo archivio) |

**Barra degli annunci:** in `content/features.json` impostate `enabled`, `start`, `end` (formato ISO con fuso orario), `text`, `linkLabel`, `href`. Fuori dalle date sparisce da sola, senza rifare il deploy.

**Immagini:** dal 18/11/2026 il sito usa solo le foto inviate dal cliente, in `assets/cliente-2026-11/` (le vecchie foto restano in `assets/original/` e `assets/library/` come archivio, non pubblicate). Per aggiungerne una, mettete l'originale in `assets/` (per esempio in una nuova cartella datata), aggiungete una voce in `content/media-map.json` con `id`, `from`, `to`, `alt` in italiano (e `extract` per ritagliare un pannello da un trittico), poi:

```bash
npm run media
```

Lo script ridimensiona, comprime, ritaglia le bande nere degli screenshot (`"crop": true`) e aggiorna `content/media.json`. Nei testi si usa poi l'`id`.

**Video:** sono in `public/media/video/`. Lo spot (`spot-ingromoda.mp4`, 1280×720, con la copertina `spot-ingromoda.jpg`) è ricavato dal file originale di 23 MB con:

```bash
ffmpeg -i "INGROMODA 20sec NOv 2026.mp4" -vf scale=1280:-2 -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart public/media/video/spot-ingromoda.mp4
```

Le tre clip "In vetrina" della pagina Donna (`vetrina-1..3.mp4`) sono senza audio; percorsi e titoli sono in `content/departments.json`.

**Mappa:** è disegnata da dati OpenStreetMap con `node scripts/map.mjs` (rigenerare solo se cambia indirizzo).

## Deploy su Hostinger (Node.js)

Il sito si pubblica dal repository GitHub `giovanni508/ingro` (ramo `main`) come applicazione Node.js.

| Impostazione | Valore |
|---|---|
| Versione di Node.js | 22.x (va bene anche 20.x; non la 18) |
| Comando di installazione | `npm install` (oppure `npm ci`) |
| Comando di build | `npm run build` |
| Comando di avvio | `npm run start` |
| Variabili d'ambiente | `CONTACT_TO`, `CONTACT_FROM`, `RESEND_API_KEY` (vedi sopra) |

Il comando di build deve essere `npm run build`, non `next build`. Lo script usa **webpack** (`next build --webpack`) invece di Turbopack, il bundler predefinito di Next 16: sugli hosting condivisi Turbopack può fermarsi con "FATAL: An unexpected Turbopack error occurred" per i limiti di processi e memoria. Per lo stesso motivo la build usa al massimo 2 processi (`experimental.cpus`) e le ottimizzazioni di memoria di webpack.

Se il pannello non permette di cambiare il comando e lancia comunque `next build`, aggiungete la variabile d'ambiente `IS_WEBPACK_TEST=1`: Next la legge e usa webpack.

I pacchetti necessari alla build (Tailwind, TypeScript, tipi, sharp) sono tra le `dependencies`, così la build funziona anche se l'hosting installa senza le devDependencies. `npm run start` ascolta sulla porta indicata dall'hosting nella variabile `PORT`.

In locale `npm run dev` resta su Turbopack (più veloce); `npm run build:turbopack` prova la build con Turbopack.

## Deploy di anteprima su Vercel

1. Su Vercel: "Add New Project", importate il repository `giovanni508/ingro` (framework: Next.js, impostazioni predefinite). Da quel momento ogni push su `main` aggiorna il sito.
2. Aggiungete le variabili d'ambiente (sopra) per gli ambienti Preview e Production.
3. Ogni push crea un'anteprima con un URL dedicato; il dominio `www.ingromoda.com` va collegato solo dopo l'approvazione del cliente.

In alternativa, da terminale:

```bash
npx vercel
```

I redirect 301 dalle vecchie URL WordPress (`/donna/`, `/privacy-policy/`, `/cookie-policy/`, `/wp-login.php`…) sono in `next.config.ts` e funzionano su qualsiasi hosting Node.

## Verifiche

- `node scripts/shots.mjs <url> <cartella> static|scenes`: screenshot reali con Playwright a 390, 768, 1440, 1920 px (`static` = movimento ridotto, pagine intere; `scenes` = movimento attivo, una schermata per scena) e controllo automatico di overflow orizzontale, errori di console e richieste fallite.
- `node scripts/lighthouse.mjs <url> / /donna …`: Lighthouse mobile, report in `lighthouse/`.

## Struttura

```
src/app/             pagine, API del modulo, sitemap, robots, manifest, icone
src/components/      brand, layout, home, department, contact, legal, motion, ui, seo
src/lib/             gsap e token di movimento, consenso, palinsesto, contenuti
content/             testi e dati
assets/              originali delle immagini (non pubblicati)
public/media/        immagini ottimizzate, video, mappa
scripts/             media, mappa, screenshot, Lighthouse
```
