# Critica e cicli di verifica

Ogni giro: screenshot reali con Playwright (`scripts/shots.mjs`) a 390, 768, 1440 e 1920 px, in modalità statica (movimento ridotto, pagine intere) e a scene (movimento attivo, una schermata per scena e per stato dei pin), Lighthouse mobile, build, lint, typecheck. Critica con le lenti di impeccable (craft floor), taste e frontend-design. I problemi trovati sono elencati con la correzione applicata.

## Giro 0 (solo home, in sviluppo)

| Problema | Dove | Correzione |
|---|---|---|
| Le classi CSS custom (`.btn`) battevano le utility Tailwind (`hidden`): "Portami lì" visibile e header fuori schermo a 390 px | header mobile | Tutto il CSS custom spostato nel layer `base`, sotto le utility. Tailwind 4 eliminava la dichiarazione dell'ordine dei layer: documentato in DESIGN.md |
| Citazioni delle recensioni in Jost con corsivo finto | scena 8 | `.t-quote` usa Bodoni Moda corsivo vero |
| Immagini della sequenza cerimonia troppo scure su mobile e con movimento ridotto | scena 4 | overlay base al 40%, scurimento solo come stato iniziale dell'animazione |
| Pin della cerimonia troppo lungo (4,6 schermate) | scena 4 | ridotto a 3,6 schermate |

## Giro 1 (tutte le pagine, produzione)

Lighthouse mobile (prima delle correzioni): home 94/94/100/100, 1 errore di accessibilità; Contatti LCP 3,5 s; Chi siamo LCP 3,8 s.

| Problema | Dove | Correzione |
|---|---|---|
| `aria-label` su un `<p>` (SplitText) e parole a opacità 0,16 sotto il contrasto AA | scena 2 | copia per screen reader + strato visivo `aria-hidden`; le parole partono da opacità 0,6 (contrasto 4,6:1) e arrivano a 1 |
| Il banner cookie compariva solo dopo l'idratazione e diventava l'elemento LCP (3,5 s) | Contatti, tutte | banner renderizzato lato server, mostrato prima del primo paint dallo script di boot (`html.needs-consent`) |
| `priority` di `next/image` deprecato in Next 16, immagine hero senza `fetchpriority` | hero di home, reparti, Chi siamo | `loading="eager"` + `fetchPriority="high"` |
| Overflow orizzontale di 15 px a 390: il "Chiedete" accanto alla didascalia in colonne strette | Donna, Uomo, Bambino | didascalia e pulsante impilati |
| Citazione della filosofia in sans invece che in Didone | Chi siamo | `.t-hero`, `.t-display`, `.t-title` impostano sempre il carattere display |
| Passi della videochiamata sovrapposti a 768 px | scena 6 | layout a due colonne solo da `lg`; passi in riga da `sm` |
| Footer a 4 colonne compresso a 768 px | footer | 2 colonne fino a `lg` |
| Testo dell'occasione schiacciato accanto al bottone a 768-1280 px | scena 3 | bottone sotto il testo fino a `xl` |
| Sequenza cerimonia lunghissima su tablet | scena 4 | due colonne sfalsate da `md` |
| Pulsante WhatsApp flottante ridondante e sovrapposto alle "porte" di contatto | Contatti | nascosto su `/contatti` |
| Hero di Donna uguale alla hero della home | Donna | nuova immagine (abito in raso ottanio) |
| Galleria a 4 colonne con 6 foto: ultima riga monca | Taglie comode | 4 colonne solo oltre 8 foto |
| "Seguici" (tu) nella barra annunci | header | "Seguiteci" |

Cosa regge già bene: la hero come locandina con il faro sui tre abiti, il cartamodello che combacia col vestito, i camerini con le tende, la linea del tempo TV, le citazioni editoriali, la mappa luminosa, il ritmo palco / luci di sala.

Cosa resta debole (non risolvibile senza il cliente): alcune foto sono a bassa risoluzione (768 px: negozio e abiti indossati) e su schermi grandi si vedono morbide; le foto di taglie comode hanno l'aspetto di immagini generate. Entrambi i punti sono in `content/TODO-cliente.md`.
