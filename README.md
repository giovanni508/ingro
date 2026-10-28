# Ingromoda: nuovo sito "Sotto i riflettori"

Sito vetrina di Ingromoda srl, boutique di abbigliamento donna, uomo e bambino a Palermo (Viale Regione Siciliana S.E. 4325), specializzata in abiti da cerimonia.

- **Stack:** Next.js 16 (App Router, Cache Components, Turbopack), React 19, TypeScript, Tailwind CSS 4, GSAP 3 (ScrollTrigger, SplitText, CustomEase) con Lenis, `next/image`, `next/font`.
- **Pagine:** home (9 scene), `/donna`, `/uomo`, `/bambino`, `/chi-siamo`, `/contatti`, `/privacy`, `/cookie`, `/accessibilita`, 404, `/styleguide` (interna, non indicizzata).
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

Copiate `.env.example` in `.env.local` (in locale) o impostatele su Vercel. Nessuna è obbligatoria per vedere il sito.

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
| `content/site.json` | Dati aziendali: indirizzo, telefono, WhatsApp, email, social, orari del negozio, P. IVA |
| `content/home.json` | Testi delle 9 scene della home |
| `content/departments.json` | Reparti Donna, Uomo, Bambino: testi, taglie, categorie, foto, messaggi WhatsApp |
| `content/chi-siamo.json` | Pagina Chi siamo |
| `content/reviews.json` | Recensioni Google mostrate (testo originale) e conteggio |
| `content/tv.json` | Palinsesto TVM CH19 e dirette Facebook |
| `content/features.json` | Interruttori: barra annunci (testo e date), "prossima messa in onda", "aperto ora" |
| `content/legal/*.md` | Privacy, cookie, accessibilità |
| `content/media-map.json` | Elenco curato delle immagini: file sorgente, nome finale, testo alternativo |
| `content/raw/` | Estrazione integrale del vecchio sito (solo archivio) |

**Barra degli annunci:** in `content/features.json` impostate `enabled`, `start`, `end` (formato ISO con fuso orario), `text`, `linkLabel`, `href`. Fuori dalle date sparisce da sola, senza rifare il deploy.

**Immagini:** mettete l'originale in `assets/library/` (o `assets/original/`), aggiungete una voce in `content/media-map.json` con `id`, `from`, `to`, `alt` in italiano, poi:

```bash
npm run media
```

Lo script ridimensiona, comprime, ritaglia le bande nere degli screenshot (`"crop": true`) e aggiorna `content/media.json`. Nei testi si usa poi l'`id`.

**Mappa:** è disegnata da dati OpenStreetMap con `node scripts/map.mjs` (rigenerare solo se cambia indirizzo).

## Deploy di anteprima su Vercel

1. Create un progetto su Vercel collegato a questo repository (framework: Next.js, impostazioni predefinite).
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
