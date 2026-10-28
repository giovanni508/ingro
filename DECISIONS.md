# Registro delle decisioni

Ogni scelta presa in autonomia durante il restyling, con il motivo. Le domande aperte per il cliente sono in `content/TODO-cliente.md`.

## Processo

- **Nessuna domanda al cliente durante il lavoro.** Il brief chiede esplicitamente di non fermarsi. Le skill di design (impeccable) prevedono un'intervista iniziale per PRODUCT.md: è stata sostituita dal brief stesso e dall'audit del sito; i fatti dedotti sono marcati come tali in `PRODUCT.md`.
- **Skill usate:** impeccable (craft floor, critique, audit, polish), frontend-design, design-taste-frontend (taste), motion-design. Dove una regola delle skill contrasta con il brief vince il brief (vedi "Conflitti" sotto).
- **Estrazione contenuti delegata a un subagente** (solo richieste GET, nessun form inviato). Output in `content/raw/`.

## Contenuti e dati

- **Orari del negozio: mostrati.** Il brief diceva "solo se forniti": sono scritti nella pagina Contatti del vecchio sito ("LUN – SAB 08,30 -13,00 | 15,30 – 20,00", prima domenica del mese 10-13 e 16-20, esclusi agosto e settembre). Li uso, in un blocco separato e ben distinto dal palinsesto TV. L'indicatore "Aperto ora" esiste ma è spento (`content/features.json › openNow`) finché il cliente non riconferma gli orari.
- **CAP 90125:** preso dalla privacy del vecchio sito ("CAP 90125"). OpenStreetMap indica 90124 per il viale: segnalato nel TODO.
- **Coordinate:** 38.0894474, 13.3739767, dalla scheda Google Maps del link "Portami lì".
- **Palinsesto TV:** riportato come scritto; mostrato sempre come "in onda su TVM CH19". La funzione "prossima messa in onda" è implementata (`src/lib/schedule.ts`) ma spenta (`features.nextBroadcast: false`).
- **"Reparto outlet": non mostrato.** Nessun testo del sito ne spiega il significato e il testo sotto lo contraddice ("seguono sempre le ultime tendenze").
- **Recensioni:** 7 visibili sul vecchio sito (6 da 5 stelle, 1 da 3). Ne mostro 5 da 5 stelle, testo originale; dove una recensione nomina una commessa diversa da Loredana il nome è omesso con "…" (consenso non disponibile). Nessun giudizio modificato. Il conteggio "513 recensioni" e il giudizio "ECCELLENTE" sono riportati come stampati; **nessuna media numerica** (non è pubblicata da nessuna parte), quindi niente `aggregateRating` nel JSON-LD.
- **Spedizioni e acquisto da casa:** dichiarati nella pagina Chi siamo ("servizio di spedizioni attivo in tutta Italia ed Europa"). Per questo il terzo passo della videochiamata è "provate in negozio o ricevete a casa".
- **Persona grammaticale: "voi"** su tutto il sito. È il registro dominante dei testi originali e quello del sottotitolo imposto dal brief ("Da generazioni curiamo il vostro look"). I bottoni usano l'imperativo plurale ("Scoprite", "Scriveteci") o forme impersonali.
- **YouTube:** aggiunto ai social (canale @ingromodaSrl, trovato tramite il video "Ingromoda nuova collezione Laura Biagiotti" incorporato nella pagina Donna).
- **Marchi citati:** solo Laura Biagiotti e Romeo Gigli, perché il vecchio sito ne mostra i loghi e i video. L'elenco completo è richiesto nel TODO.
- **Taglie comode Uomo:** il vecchio sito metteva foto sportswear (file SPORT*) sotto "Taglie comode". Le foto vanno nella nuova categoria "Sportswear" (citata nel testo Uomo: "abbigliamento sportswear che includa t-shirt, felpe, pantaloni da jogging"); "Taglie comode" diventa un blocco tipografico con le taglie reali (dalla 44 alla 78) senza foto inventate.

## Immagini

- **Priorità alle foto reali.** La media library WordPress conteneva circa 150 foto non pubblicate e molto migliori di quelle in pagina: il negozio con i manichini sulla pedana a specchio, abiti da cerimonia indossati, lookbook Laura Biagiotti 2024, lookbook uomo sulla costa, accessori fotografati in negozio. Le ho scaricate (`assets/library/`) e usate al posto di stock e immagini dall'aspetto generato.
- **Immagini stock (9) escluse** del tutto.
- **Immagini dall'aspetto generato:** usate solo dove non esiste alternativa reale (Taglie comode donna, due look bambino). Segnalate come `look: "generata"` in `content/media-map.json` e nel TODO.
- **Nomi file e alt text riscritti** in italiano descrittivo (es. `donna/cerimonia-raso-ottanio.jpg`, "Abito in raso ottanio con spalle scoperte, maniche a sbuffo e spacco").
- **Screenshot con bande nere** (storie Instagram) ritagliati automaticamente da `scripts/media.mjs`.
- **Logo vettorializzato** dal PNG ufficiale con potrace: due tracciati (wordmark e "M" fucsia `#E5097F`). Favicon = la "M" su velluto.
- **Video:** i due MP4 originali (6,3 MB e 4,8 MB) ricompressi a circa 1,2 MB, senza audio, 540-720 px, con poster.
- **Mappa:** disegnata da dati OpenStreetMap (© OpenStreetMap contributors, ODbL) con `scripts/map.mjs`; nessun iframe Google prima del consenso. Overpass API era sovraccarico, usata una singola chiamata all'API `map` di OSM per un'area piccola.

## Design

- **Accento = fucsia del logo** (`#E5097F`). Il brief chiedeva un accento "ricco e disciplinato" e diceva che vincono i colori del logo. Il fucsia è anche il colore della gelatina magenta dei fari di scena: tiene insieme marchio e concetto.
- **Velluto prugna-nero invece di rosso teatro**: il rosso classico litiga col fucsia; un prugna profondo (`#160A10`) è velluto e insieme si accorda al logo.
- **Sezioni chiare in "cipria"** (`#F6EEEA`), un avorio rosato: il colore della cerimonia, non un beige generico.
- **Tipografia: Bodoni Moda + Jost.** Il logo è una Didone condensata: Bodoni Moda ne riprende il DNA. Jost è un revival di Futura: Didot + Futura è la coppia classica delle riviste di moda. Entrambi self-hosted con `next/font`.
- **Forme:** immagini e riquadri a spigolo vivo; elementi interattivi (bottoni, chip) a pillola. Regola unica, applicata ovunque.

## Conflitti tra skill e brief (vince il brief)

- **Cursore personalizzato:** la skill taste lo sconsiglia; il brief lo chiede ("cursore faro"). Compromesso: il cursore di sistema resta visibile, il faro è un alone che lo accompagna, solo con mouse e senza riduzione del movimento.
- **Serif display:** la skill taste lo scoraggia come default; qui è giustificato dal logo Didone e dal mondo editoriale moda.
- **Tema unico vs sezioni alternate:** la skill vieta di alternare chiaro/scuro; il brief chiede sezioni chiare editoriali alternate. L'alternanza segue la metafora "palco / luci di sala" ed è documentata in DESIGN.md.
- **Titoli giganti oltre 6rem:** solo l'H1 della home, come richiesto dal brief.
- **Palette cipria:** la skill vieta il "beige+ottone" di default; qui l'avorio è richiesto dal brief e il secondo colore è il fucsia del logo, non ottone.

## Decisioni tecniche

- **Next.js 16.4 con Cache Components:** tutte le pagine sono prerenderizzate statiche; solo `/api/contact` è dinamica. Nessun `new Date()` nei componenti server: annuncio, "aperto ora" e "prossima messa in onda" si calcolano nel browser.
- **CSS custom nel layer `base`:** Tailwind 4 scarta la dichiarazione dell'ordine dei layer e "srotola" `@layer components`; mettendo i componenti in `base` le utility Tailwind vincono sempre (così `hidden md:inline-flex` funziona anche su `.btn`).
- **Preloader solo CSS:** la timeline (2,2 s) parte al primo paint, senza aspettare l'idratazione; uno script inline prima del paint lo salta se già visto nella sessione o con movimento ridotto. Il JavaScript serve solo per "Salta" e per dare il via alla coreografia della hero.
- **Banner cookie renderizzato lato server** e mostrato dallo stesso script inline: nessun salto di layout e nessun LCP ritardato.
- **Immagini LCP:** `loading="eager"` + `fetchPriority="high"` (in Next 16 `priority` è deprecato).
- **Redirect 301 espliciti** (`statusCode: 301`) con `skipTrailingSlashRedirect`, così anche gli slash finali di WordPress rispondono 301 e non 308.
- **Modulo contatti:** destinatario solo da `CONTACT_TO`; invio tramite Resend se configurato; in sviluppo il messaggio va in console; in produzione senza configurazione il modulo lo dice chiaramente e propone WhatsApp e telefono.
- **Nessuna statistica** installata: il vecchio sito aveva Google Analytics; se il cliente la vuole va aggiunta con consenso (TODO).
- **Shader "luce su tessuto":** WebGL puro (nessuna libreria), solo desktop con puntatore fine, almeno 4 core e senza movimento ridotto; si ferma fuori schermo; disattivabile con `fabricShader` in `content/features.json`. Su mobile non viene nemmeno inizializzato, quindi non pesa sui punteggi mobile.
- **Cursore faro** aggiunto al cursore di sistema (non lo sostituisce): niente perdita di precisione né problemi di accessibilità.
- **Etichette del cursore e bottoni al "voi"** ("Scoprite", "Guardate", "Scriveteci"); "Portami lì" resta in prima persona come sul vecchio sito, perché è la voce del cliente.
- **YouTube:** nessun iframe; il video della collezione Laura Biagiotti è un link esterno, e in pagina ci sono i due video del negozio, ospitati sul sito, muti e con pausa.
