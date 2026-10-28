# Audit del vecchio sito ingromoda.com

Fotografia del sito live presa il 28 ottobre 2026, solo con richieste di lettura (nessun form inviato, nessun login). I testi tra virgolette sono riportati alla lettera. Dettagli tecnici completi in `content/raw/old-site-issues.md`, contenuti estratti in `content/raw/`.

**Stack rilevato:** WordPress 7.1.3, tema Astra + Astra Pro, Elementor 4.3.5 (senza Pro), Happy Addons, Essential Addons, Ultimate Addons, Rank Math, CookieYes, Chaty, GTranslate, Trustindex. Otto plugin di layout e widget per un sito di nove pagine.

## Verdetto in una riga

Contenuti veri e utili (palinsesto TV, videochiamate, taglie, orari, recensioni, foto reali nascoste in libreria) dentro un template generico che non li valorizza, con errori tecnici e di fiducia ben visibili.

## 1. Problemi che danneggiano la fiducia

| Problema | Dove | Gravità |
|---|---|---|
| Form di login WordPress ("Accedi", "Lost your password?") nel codice di ogni pagina | footer, tutte le pagine | Alta |
| Foto stock con alt text uguali al nome file: "fashion portrait young elegant woman 1", "children getting ready their first communion 1", "142358874 lel 1920w copia", "19 1920w" | Home | Alta |
| Due immagini AI con "generative-ai" / "generated-by-ai" nel nome file, una usata come hero su mobile | Home | Alta |
| 81 immagini di galleria del 2026 dall'aspetto generato (passerelle con pubblico sfocato, scalinate di marmo), nessuna scattata in negozio | Donna, Uomo, Bambino | Alta |
| Titolo carosello "La passione... fa la differenza" sopra un widget vuoto (Elementor Pro non caricato) | Home, Chi siamo | Media |
| Recensione negativa da 3 stelle mostrata in evidenza nel widget | Home, Chi siamo | Media |
| Barra laterale WordPress di default ("Articoli recenti", "Nessun commento da mostrare", in italiano e in inglese) sulle pagine legali | Privacy, Cookie, Accessibilità | Media |
| Logo del menu mobile rotto (404) | tutte le pagine | Media |
| Dichiarazione di accessibilità boilerplate: cita "XHTML 1.0 Strict" ed "Explorer versione 6", afferma che tutte le immagini hanno ALT (76 su 110 non lo hanno) | Accessibilità | Media |
| Refusi: "-t-shirt", "camice in lino", "o che per chi", "suFacebook", "all''utilizzo" | varie | Bassa |

## 2. Problemi di comprensione

- **Palinsesto TV confondibile con gli orari del negozio.** In Home il blocco "I nostri contatti" contiene "LUN. ORE 12,00 -14,00 -22,30" subito sotto telefono e indirizzo, senza dire che si tratta di messe in onda su TVM CH19. Il formato stesso è ambiguo (orari di inizio o fasce?).
- **"Reparto outlet" senza spiegazione.** Compare solo come etichetta sopra "Abbigliamento bambino" e nel titolo "Cerimonia - reparto outlet". Nessun testo spiega cosa significhi; anzi il testo sotto dice che le collezioni "seguono sempre le ultime tendenze".
- **Logo e "PORTAMI Lì" duplicati.** L'header è stampato tre volte nel codice; il logo appare tre volte nella sola Home (header, sezione centrale, contatti) e di nuovo in testa a Donna, Uomo, Bambino.
- **"Scopri gli articoli"** porta solo a un'ancora nella stessa pagina; non esiste catalogo.
- **Persona grammaticale incoerente:** "voi" nei testi, "tu" nei bottoni, "tu" e "lei" mescolati nella privacy.
- **Anzianità dichiarata in quattro modi diversi:** "da anni", "Da generazioni", "Da diversi anni", "da qualche anno".
- **Orari del negozio solo in Contatti**, e scritti in tre formati diversi (12,00 / 10:00 / 17.00).
- **WhatsApp di Loredana collegato come telefono** (`tel:3760096564`), non come chat.

## 3. SEO e condivisione

- Title tag nudi: "Home - Ingromoda", "Donna - Ingromoda"… senza città né "abiti da cerimonia".
- Meta description generate dal primo paragrafo e tagliate a metà frase ("…in cui volete uscire dai vostri soliti").
- Immagine Open Graph sempre e solo il logo: ogni condivisione su WhatsApp/Facebook mostra un rettangolo con la scritta.
- Dati strutturati sbagliati: il negozio è dichiarato `Person/Organization` + `Article`; mancano `ClothingStore`, indirizzo, telefono, orari, social.
- La Home non ha un H1; gerarchia dei titoli rovesciata in Cookie Policy (H1 → H6 → H5 → H4).
- Mappa Google in Contatti a zoom città (10) su una ricerca testuale, non sul punto del negozio.

## 4. Prestazioni e privacy

- Otto plugin front-end, tre header, widget Trustindex, GTranslate, Chaty, CookieYes: molto JavaScript per un sito vetrina.
- La cookie policy non nomina le terze parti realmente in uso (Google Analytics G-J7SZTSN0EK, YouTube, Google Maps, Trustindex, GTranslate, Chaty) e cita ancora "Google+".
- Generator meta e REST API aperti espongono versione di WordPress e nome utente dell'autore.

## 5. Cosa c'è di buono (e va valorizzato)

- **Contenuti unici che i concorrenti non hanno:** presenza quotidiana in TV su TVM CH19, dirette Facebook martedì e venerdì, videochiamate WhatsApp con Loredana, personal shopper, spedizioni in Italia ed Europa, parcheggio privato interno.
- **Fatti concreti:** taglie donna dalla 38 alla 70, uomo dalla 44 alla 78, bambino dai 2 ai 16 anni e taglie comode dalla 44 alla 52; orari del negozio; 513 recensioni Google con giudizio "ECCELLENTE".
- **Un marchio con carattere:** logo Didone con la "M" pennellata fucsia e la tagline "...elegante tutto l'anno...".
- **Foto vere nascoste in libreria (non pubblicate):** il negozio con i manichini sulla pedana a specchio, abiti da cerimonia indossati, la collezione Laura Biagiotti, un lookbook uomo girato sulla costa, borse, collane, papillon e scarpe fotografati in negozio. Il nuovo sito le usa al posto delle immagini stock e generate.
- **Video propri** (Romeo Gigli, Laura Biagiotti) e un canale YouTube (@ingromodaSrl).

## 6. Cosa fa il nuovo sito, punto per punto

| Vecchio | Nuovo |
|---|---|
| Login WordPress nel footer | Nessun form di login, nessun riferimento a WordPress o Elementor |
| Foto stock e alt da nome file | Foto reali dalla libreria, rinominate e con alt descrittivi in italiano |
| Palinsesto TV vicino ai contatti | Scena "In TV e in diretta" separata, sempre etichettata "in onda su TVM CH19"; orari del negozio in un blocco distinto |
| "Reparto outlet" ambiguo | Etichetta non mostrata; richiesta di chiarimento in `content/TODO-cliente.md` |
| Logo ripetuto | Un logo per posizione (header, footer, preloader) |
| Title "Home - Ingromoda", OG = logo | Title e description scritti per pagina con Palermo e abiti da cerimonia; OG con foto vera del negozio |
| JSON-LD Person/Article | `ClothingStore` con indirizzo, geo, telefono, orari, social |
| Widget recensioni esterno pesante | Recensioni reali statiche, testo intatto, link "Leggi tutte su Google" |
| Mappa Google caricata subito | Mappa stilizzata da dati OpenStreetMap, nessuno script di terze parti; Google Maps solo su richiesta |
| Cookie banner con tracciamento | Nessun tracciamento; banner con "Rifiuta" e "Accetta" equivalenti |
