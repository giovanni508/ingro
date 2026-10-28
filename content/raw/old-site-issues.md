# Ingromoda – audit notes on the old site (www.ingromoda.com)

Snapshot of the live WordPress site taken on 2026-10-28 with GET requests only. These are facts observed in the HTML, REST API and media files. Quoted text is verbatim.
Stack: WordPress 7.1.3, Astra theme + Astra Pro addon, Elementor 4.3.5 (Elementor Pro is not loaded), Happy Elementor Addons, Essential Addons for Elementor, Ultimate Addons for Elementor, Rank Math, CookieYes, Chaty, GTranslate, Trustindex.

---

## 1. Global / template problems (every page)

- **WordPress login form in the DOM of every page.** The Astra "account" popup (`#ast-hb-account-login-wrap`) is printed after the footer on all 9 pages. It has a real `<form action="https://www.ingromoda.com/wp-login.php" method="post">` with fields `log`, `pwd` and `rememberme`, the button "Accedi", and an English link "Lost your password?" → `/wp-login.php?action=lostpassword`. No visible header trigger was found, so this is dead markup that exposes the login URL.
- **Header printed three times.** There is `#masthead`, a sticky copy `#ast-fixed-header`, and the mobile off-canvas `#ast-mobile-popup`. Each copy contains the button **"PORTAMI Lì"** as two anchors (`.ast-custom-button-link` with `aria-label="PORTAMI Lì"` plus a `.menu-link` fallback), which gives 9 occurrences of the string in the raw HTML. The button links to Google Maps (`https://maps.app.goo.gl/spZBRF3R9h3C8s9z5`) and opens in a new tab. The label is a first-person CTA ("take me there").
- **Broken image in the mobile menu.** `ast-header-html-1` shows `https://www.ingromoda.com/wp-content/uploads/2023/11/cropped-logo-ingromoda-1-1-300x150.png` with `alt=""`. The URL returns **HTTP 404**, and media ID 1177 no longer exists in the REST API.
- **Logo repeated / duplicated.**
  - Home shows the logo three times: header; section 2 (big `logo-ingromoda-1-1.png`, alt "logo ingromoda 1 1"); bottom contact block (`logo-ingromoda-1.png`).
  - Donna, Uomo and Bambino show the logo again in their intro section.
  - The header `<img>` `src` is the 120×60 thumbnail. The full 1821×909 PNG is only in the srcset as `2x`.
  - There is no SVG logo anywhere: the media library has 4 PNGs and no SVG.
- **Logo alt texts are filename-derived:** "logo ingromoda 1", "logo ingromoda 1 1", "cropped logo ingromoda 1" (the last is also the og:image:alt).
- **Footer.** It reads "Copyright © 2026 Ingromoda srl | P. IVA 03761640824 | Privacy Policy | Cookie Policy | Accessibilità". Privacy and Cookie open with `target="_blank"` but Accessibilità does not. The footer has no address, phone or hours; those only appear in page content on Home and Contatti.
- **Footer TikTok icon** uses Astra's `ast-dribbble` slot, with an inline TikTok SVG and aria-label "TikTok". It renders correctly but is a hack.
- **Floating widgets on every page:**
  - Chaty ("Contattaci"), with phone `tel:+39091445150`, WhatsApp `https://web.whatsapp.com/send?phone=393760096564` (a desktop web URL, also used on mobile) and Messenger `https://m.me/ingromodasrl`.
  - GTranslate floating switcher (it/en, machine translation).
  - CookieYes banner. Its description says “Accetta tutti” while the button reads "Accettare tutto".
- **Legal pages (privacy, cookie, accessibilità) show the default WordPress sidebar:** "Cerca", "Articoli recenti", "Commenti recenti" ("Nessun commento da mostrare."), "Archivi", "Categorie" ("Nessuna categoria"). The same widgets appear again in English: "Recent Posts", "Recent Comments", "Archives", "Categories". The site has no posts (`/wp/v2/posts` returns `[]`).
- **Information disclosure.**
  - `<meta name="generator" content="WordPress 7.1.3">` and the Elementor generator meta are present.
  - The Rank Math JSON-LD exposes the author username `ingromodasrl` (`/author/ingromodasrl/`) and a Gravatar hash.
  - The REST API is fully open (pages, and media with 342 items).

## 2. SEO / head

- **Title tags are bare "Page - Ingromoda"**, with no city or keyword: "Home - Ingromoda", "Donna - Ingromoda", "Uomo - Ingromoda", "Bambino - Ingromoda", "Chi siamo - Ingromoda", "Contatti - Ingromoda", "Privacy Policy - Ingromoda", "Cookie Policy - Ingromoda", "Accessibilità - Ingromoda".
- **Meta descriptions are auto-generated (first paragraph) and cut mid-sentence.**
  - Donna "...in cui volete uscire dai vostri soliti"; Uomo "...perfetti per tutti i"; Bambino "...vogliono sentirsi belli e alla moda. Per"; Chi siamo "...un'ampia"; Contatti "...Aperture straordinarie".
  - Contatti's description is about Sunday opening hours. Privacy's is "Gentile Utente, ti ringraziamo per aver visitato il nostro sito."
  - Only Home has a written description: "Ingromoda, un’elegante boutique che da anni è il punto di riferimento per l'abbigliamento di alta qualità a Palermo."
- **OG image is always a logo, never a photo.**
  - Home, Chi siamo, Contatti and legal pages use `cropped-logo-ingromoda-1.png` (1820×907, og:image:alt "cropped logo ingromoda 1").
  - Donna, Uomo and Bambino use `logo-ingromoda-1.png` (og:image:alt "logo ingromoda 1").
  - og:title equals the title tag ("Home - Ingromoda"). Home has og:type "website"; all others have "article".
- **JSON-LD (Rank Math) is wrong for a shop.**
  - The organisation is typed `["Person","Organization"]`. There is no `LocalBusiness`/`ClothingStore`, and no address, geo, telephone, openingHours or sameAs (socials).
  - Every page also carries an `Article` schema (Home included), plus a `SearchAction` pointing to `?s=` on a site without searchable content.
  - On Home, `primaryImageOfPage` is `logo-ingromoda-1-1-1024x511.png`, declared as 200×200.
- **Home has no H1.** It starts with H2 "Abiti alla moda per tutte le occasioni a Palermo", and H4 "INGROMODA" eyebrows sit above H2s.
- **Heading order problems on other pages.**
  - Contatti: H1 "I nostri contatti" is followed by H4 "I nostri contatti" (duplicate), then an H2.
  - Privacy: H1 then H4 "Privacy Policy" (duplicate), then H3, then H4s.
  - Cookie policy goes H1 → H6 "Cookie Policy" → H5 → H4 → H3 (inverted).
  - Accessibilità: the section titles "Stato di conformità", "Redazione della dichiarazione di accessibilità" and "Modalità di invio delle segnalazioni e recapiti del soggetto erogatore" are plain `<p>`, not headings.
- **Internal links without trailing slash.** The buttons "DONNA", "UOMO" and "BAMBINO" on Home link to `/donna`, `/uomo` and `/bambino`, which return a 301 redirect to the slash version.

## 3. "Reparto outlet" – where it appears

The string appears in exactly 3 places, all of them headings. **No text anywhere on the site explains what "outlet" means** (no discount, past-season or price wording near it or elsewhere). The Bambino body copy instead talks about "ultime tendenze".

1. **Home**, section 5 (kids teaser): H4 eyebrow **"Reparto outlet"** directly above H2 "Abbigliamento bambino". The equivalent eyebrows for Donna and Uomo read "INGROMODA".
2. **/bambino/**, hero: H4 eyebrow **"reparto outlet"** (lower case) above H1 "Abbigliamento Bambino".
3. **/bambino/**, section `#cerimonia`: H2 **"Cerimonia - reparto outlet"**. The text under it reads: "Le nostre collezioni di abiti da cerimonia seguono sempre le ultime tendenze, per rendere i vostri piccoli protagonisti di ogni evento speciale, che siano comunioni, matrimoni o compleanni." This contradicts the "outlet" label.

It does not appear in the media library, alt texts, menus or any other page. The section-nav button on /bambino/ is just "CERIMONIA".

## 4. Content / copy problems

- **Empty testimonial sections.**
  - Home has H2 "La passione... fa la differenza" and Chi siamo has H2 "La passione fa la differenza" (two different spellings).
  - Each is followed by an Elementor **testimonial-carousel** widget that renders an empty `<div class="elementor-widget-container"></div>`. This widget belongs to Elementor Pro, which is not loaded, so the headings sit over nothing.
- **The reviews widget shows a negative review.** Trustindex embeds 7 Google reviews on Home and Chi siamo. One of them is 3★, by Marcella Guadagna ("...ma abbiamo conosciuto una commessa poco empatica con noi clienti..."). The visible count is "In base a 513 recensioni" and the label is "ECCELLENTE". No numeric average is shown. Review dates are filled in only client-side.
- **Typos / errors (verbatim).**
  - Donna casual: "dalle -t-shirt estrose alle classiche camicie" (stray hyphen).
  - Uomo casual: "t-shirt in cotone o camice in lino" ("camice" should be "camicie").
  - Home uomo: "sia per chi ama vestire casual o che per chi invece sogna ogni giorno di sfoggiare abiti raffinati" ("o che per").
  - Contatti: "Seguici nelle dirette il martedì e venerdì dalle 17.00 suFacebook" (missing space; Home has "su Facebook").
  - Privacy: "all’’utilizzo", "d)Verificabilità", "dalla normativa vigente normativa", "di trasferire trasmettere", "puoi opporsi".
  - Accessibilità: "all’indirizzo indirizzo email:", and "...con contenuto nullo)testo e grafica sono comprensibili..." (two list items fused).
- **Inconsistent dashes and time formats.**
  - TV schedule: "LUN. ORE 12,00 -14,00 -22,30" vs "GIO. ORE 12,00 -14,00 – 22,30" (hyphen vs en-dash).
  - Opening hours: "LUN – SAB 08,30 -13,00 | 15,30 – 20,00" (comma times).
  - The Sunday paragraph uses "10:00 ... 13:00" (colon times).
  - The Facebook live heading uses "17.00" (dot).
- **Inconsistent claims of seniority:** "da anni" (Home meta and intro), "Da generazioni curiamo il vostro look" (Home H2), "Da diversi anni" (Chi siamo), "da qualche anno" (social live sales, Chi siamo).
- **Inconsistent company name and address spellings.**
  - Company: "Ingromoda srl", "Ingromoda s.r.l.", "Ingromoda Srl".
  - Address: "Viale Regione Siciliana S.E. 4325", "Viale Regione Siciliana, 4325, Palermo", "VIALE REGIONE SICILIANA S.E, 4325", "VIALE REGIONE SICILIANA S E 4325 CAP 90125".
- **The Privacy "Informazioni Utili" block says "Ufficio delle imprese Milano Monza Brianza Lodi"** for a Palermo company whose registration is "REA: PA – 160643". This looks like template leftover.
- **Cookie policy is outdated or generic.**
  - It says consent is given by "chiudendo il banner, scorrendo la pagina che ospita il banner o cliccando qualunque suo elemento (puoi vedere come funziona cliccando qui)". "cliccando qui" is not a link.
  - It cites "Google+".
  - It ends with plain-text list items "Accetto" / "Non Accetto" that do nothing.
  - It does not name the real third parties in use: Google Analytics G-J7SZTSN0EK, YouTube, Google Maps, Trustindex, GTranslate, Chaty.
  - Both policies say "ULTIMO AGGIORNAMENTO" January 2024.
- **The accessibility statement is boilerplate and contradicts the site.**
  - It claims "XHTML 1.0 Strict", tested on "Explorer versione 6 e successive", pages "accessibili anche nel caso in cui i javascript non siano supportati", and that all content images have an ALT description.
  - In fact 76 of the 110 content/gallery images on the three department pages have empty alt (donna 51/57, uomo 21/36, bambino 4/17).
  - It says "conforme" and then "...conforme ai requisiti ... a causa dei casi di non conformità e/o delle deroghe elencate di seguito", but no list follows.
- **Inline style pasted into copy.** In the Contatti paragraph, "Aperture straordinarie per festività: contattaci per informazioni." is wrapped in `<span style="background-color: var(--ast-global-color-5); color: var(--ast-global-color-3)...">`.
- **WhatsApp is not linked as WhatsApp.** "Loredana: per videochiamate WhatsApp" shows "+39 3760096564" linked as `tel:3760096564`. The landline link `tel:091445150` has no +39 prefix.
- **The Google Maps embed on Contatti** is a query embed (`maps.google.com/maps?q=ingromoda%20palermo&t=m&z=10...`) at zoom 10 (city level), not the place.
- **No e-commerce or catalogue.** "Scopri gli articoli" (Home hero) only jumps to the `#donna` anchor on the same page. The gallery images have no product information.

## 5. tu / voi / lei inconsistency (verbatim examples)

- **voi** is the main register on marketing pages:
  - Home: "Da generazioni curiamo il **vostro** look", "che **vi** saprà guidare ... della **vostra** personalità", "**potrete** trasformare il vostro stile".
  - Donna: "occasioni in cui **volete** uscire dai **vostri** soliti schemi", "E non **dimenticate**", "**affidatevi** alle nostre stylist!", "**trovate** un’ampia scelta".
  - Uomo: "**potrete** scoprire", "**troverete** l’abbigliamento casual perfetto per **voi**".
  - Bambino: "i **vostri** piccoli".
  - Chi siamo: "per **permettervi** di sostare", "**Seguite** le nostre dirette programmate", "il **vostro** ordine".
  - Accessibilità: "**vi** invitiamo".
- **tu** is used in CTAs and headings:
  - "**Scopri** gli articoli", "**VIENI** A TROVARCI", "**Seguici** tutti i giorni su TVM CH19", "**Seguici** nelle dirette...", "**contattaci** per informazioni" (Contatti).
  - CookieYes banner: "la **tua** esperienza".
  - "PORTAMI Lì" is first person.
- **Privacy policy mixes tu and lei in the same paragraphs:**
  - tu: "**ti** ringraziamo", "dei **tuoi** dati personali ... **hai** diritto", "**puoi** opporsi".
  - lei: "**può** esercitare ... il **tuo** diritto", "**ha** diritto di proporre reclamo", "da **lei** indicato", "senza il **suo** consenso", "le **sue** richieste".
- The cookie policy uses tu ("spiegarti", "tuo terminale") but writes "**Tuo** consenso" with a capital T.

## 6. Images

Full detail is in `media-manifest.json`; every used image was viewed on a contact sheet.

- **Stock-library photos (8):**
  - Home: `fashion-portrait-young-elegant-woman-1.jpg`, `children-getting-ready-their-first-communion-1.jpg`, `142358874_lel-1920w-copia.jpg` (stock-agency ID), and `ingromoda-abbigliamento-uomo.jpg` (a renamed stock image from the same "lambersexual model" series).
  - Uomo hero: `portrait-handsome-stylish-hipster-lambersexual-model-1.jpg`.
  - Bambino hero: `boy-girl-standing-pink-1.jpg`.
  - Chi siamo backgrounds: `attractive-fashion-couple-posing-old-street-sunny-spring-pretty-beautiful-woman-her-handsome-stylish-boyfriend-hugging-outdoor-1.jpg` and `husband-clasping-suit-1.jpg`.
  - Alt texts on Home repeat the filenames ("fashion portrait young elegant woman 1", "children getting ready their first communion 1", "142358874 lel 1920w copia", "19 1920w").
- **AI-generated stock with the label in the filename (Home backgrounds):**
  - `young-woman-standing-fashionable-clothing-boutique-generative-ai.jpg`.
  - `beautiful-young-woman-elegant-fashion-looking-camera-generated-by-ai-1.jpg`. This one is the hero background on mobile only; desktop uses the real `ingromoda-hero-principale.jpg`.
- **2026 galleries look AI-generated (81 files, all 2026/05–08 uploads):**
  - Synthetic models on runways with smeared audiences, beaches, marble staircases and Art-Deco streets.
  - Typical generator sizes: 1024×1536, 848×1264, 922×1152.
  - Names: `ingromoda-N.jpeg`, `ingromoda-accessori-N.jpeg`, `cerimonia*.jpeg`, `cerimonia-uomo-*`, `cerimonia-bambino-*`, `curvy*.jpeg`, `donna*.jpeg`, `abbigliamento-donna*.jpg`, `header-donna.jpeg`, `ingromoda-home.jpg`. None was shot in the store.
  - Most have `alt=""`. Three have alt "Abbigliamento donna taglie comode".
- **Brand-campaign photos inherited from the previous site** (`SPORT*UO*-1920w.webp`, `UOSPORTIVO1-1920w.webp`, alt = filename) are used under Uomo "Taglie Comode". They are slim models in sportswear, which does not match the copy about comfortable sizes.
- **Genuine material:**
  - `ingromoda-hero-principale.jpg` and `abbigliamento-donna-ingromoda.jpg`: a real photoshoot of a real woman.
  - `Accessori-ingromoda-{3,35,36,40,41,45}.jpg`: real shoe and belt product photos (alt "Accessori ingromoda NN").
  - `bimba{1,2,3,5,6}-1920w.webp` and `19-1920w.webp`: a girl in a ceremony dress on the shop's black sofas, and a dress on a hanger, apparently in-store.
  - Two own MP4 videos and two own YouTube videos.
- **Duplicate gallery.** On /bambino/ the "Taglie Comode" gallery is the same 6 images as the first 6 of the "Cerimonia" gallery.
- **Filenames don't match sections.**
  - Donna "Cerimonia" contains `ingromoda-accessori-4/5/7/17`.
  - Uomo "Casual" contains `cerimonia-uomo-1/2/6`.
  - Uomo "Cerimonia" contains `ingromoda-accessori-11`.
- **Gallery links are `href="#"`:** 54 links on Donna, 35 on Uomo, 16 on Bambino (Happy Addons justified gallery).
- **Unused media.** The media library has 342 items and only 122 are used. Unused items include what look like real product photos: about 175 files from 2024/02–2024/04 such as `giacca-casual-uomo-blu-a-quadri.jpg`, `smoking-blu-elegante-uomo.jpg` and `laura-biagiotti-completo.jpg`, plus `Ingromoda*-1920w.jpg` from the previous site. See `media-library.json`.
- **YouTube iframes have no `title` attribute; the 2 MP4 videos have no poster.** The MP4s are 6.4 MB (`Ingromoda-Romeo-Gigli-2.mp4`, 1080×1920) and 4.8 MB (`Whatsapp-Video-2024-03-27-At-09.33.26.mp4`) and use `preload="metadata"`.

## 7. Performance / third-party scripts

- **Page weight.** Each page's HTML is 245–337 KB, including about 145 KB of inline CSS and 62–70 KB of inline JS. Elementor pages load 19–22 `<script src>` tags and 23–33 stylesheets.
- **External script and asset domains:**
  - `www.googletagmanager.com`: gtag.js for GA4 `G-J7SZTSN0EK`, loaded in `<head>` as a normal async script.
  - `cdn.trustindex.io`: `loader.js`, which also references `admin.trustindex.io` and `de-proxy.trustindex.io`, plus the review-widget CSS. Reviewer avatars come from `lh3.googleusercontent.com`.
  - `cdn.gtranslate.net`, loaded by GTranslate `float.js`.
  - `fonts.googleapis.com` / `fonts.gstatic.com` (Google Fonts: Gloock).
  - Elementor's self-hosted Roboto and Roboto Slab.
  - `www.youtube.com`: 2 iframes on Donna.
  - `maps.google.com`: iframe on Contatti.
  - `web.whatsapp.com` and `m.me`, as Chaty links.
- **Plugin assets loaded on the front end:**
  - Elementor core.
  - Happy Elementor Addons, including its own DOMPurify; Astra Addon loads a second DOMPurify.
  - Essential Addons for Elementor.
  - Ultimate Addons for Elementor (CSS on every page; JS config lists particle and snowflake/halloween assets).
  - Astra Addon, and `astra-pro-sites/.../template-preview/main.js` (an admin template-preview script on the public site).
  - Chaty, plus `chaty/admin/assets/js/mailcheck.js` (an admin script).
  - CookieYes, GTranslate, jQuery 3.7.1, jQuery Migrate and jQuery UI core.
- **Elementor footprint.** The word "elementor" appears 336–736 times per Elementor page. There are per-page CSS files `/uploads/elementor/css/post-{20,22,362,496,576,578,580}.css` and Happy Addons CSS `ha-{576,578,580}.css`. The Elementor kit (post 362) still has default globals (#6EC1E4, #54595F, #7A7A7A, #61CE70) alongside the Astra palette (#FF6A97, #e5097f, #2B161B, #645659, #F8F3F5).
- **Consent cannot be verified statically.** GA's `gtag.js` is not marked `type="text/plain"`, so whether CookieYes really blocks it before consent cannot be confirmed from the HTML (CookieYes `_block: "1"`).

---

## 8. Occasions mentioned anywhere (exact phrase → page)

| Occasion | Exact phrase | Page |
|---|---|---|
| tutte le occasioni | "Abiti alla moda per tutte le occasioni a Palermo" (H2) | home |
| occasione speciale | "Ingromoda offre un’ampia selezione di capi perfetti per ogni occasione speciale, dai semplici tailleur ad abiti raffinati e splendenti..." | home |
| cerimonia | "Ma ciò che ci contraddistingue sono gli abiti da cerimonia, unici ed originali." | home |
| occasioni particolari / cerimonia (kids) | "una collezione interamente scelta per le occasioni più particolari, con abiti da cerimonia sofisticati ed eleganti." | home |
| elegante / casual / sportswear | "La nostra proposta spazia da stili eleganti a casual fino allo sportswear..." | home |
| casual vs raffinato | "pensato sia per chi ama vestire casual o che per chi invece sogna ogni giorno di sfoggiare abiti raffinati" | home |
| lavoro / quotidiano | "Dai classici look giornalieri, ideali per il lavoro, a capi più ricercati e originali, perfetti per quelle occasioni in cui volete uscire dai vostri soliti schemi" | donna |
| matrimonio, battesimo, laurea | "Che sia un matrimonio, un battesimo o una laurea, da Ingromoda troverete l’abito che metterà in risalto ogni vostra qualità" | donna |
| cerimonia | "E non dimenticate la nostra collezione di abiti da cerimonia, pensata per aiutarvi a brillare in ogni occasione." / H2 "Cerimonia" / "Per scegliere l’abito da cerimonia perfetto..." | donna |
| tutti i giorni (casual) | "L’abbigliamento casual è intramontabile: perfetto per tutti i giorni e per ogni occasione." | donna |
| ogni occasione (curvy) | "Con il nostro aiuto è possibile trovare il look perfetto per ogni occasione, senza rinunciare alla propria femminilità." | donna |
| tutti i giorni / raffinato / sportswear | "...una moda casual, caratterizzata da capi comodi e pratici, perfetti per tutti i giorni; sia per chi ricerca un modo di vestire raffinato...; sia per chi invece desidera trovare un abbigliamento sportswear che includa t-shirt, felpe, pantaloni da jogging o capi pensati per il mondo dello sport." | uomo |
| matrimoni, battesimi, comunioni, eventi formali | "L’abbigliamento da cerimonia maschile è un must-have per ogni uomo che voglia apparire elegante e raffinato in occasioni speciali, come matrimoni, battesimi, comunioni o eventi formali." | uomo |
| cerimonia (accessori) | "L’abbigliamento da cerimonia, con inclusi gli accessori quali gemelli, cravatte o papillon, vanta infine una qualità eccezionale!" | uomo |
| completi eleganti | "Maglieria, camicie, pantaloni o completi eleganti pensati per far sentire a proprio agio chi li indossa" | uomo |
| scarpe eleganti / sportive | "una vasta gamma di scarpe: eleganti, da ginnastica, sportive o casual." | uomo |
| cerimonia (2–16 anni) | "Ingromoda offre un assortimento di abiti da cerimonia per bambini, dai 2 ai 16 anni" | bambino |
| comunioni, matrimoni, compleanni | "per rendere i vostri piccoli protagonisti di ogni evento speciale, che siano comunioni, matrimoni o compleanni." | bambino |
| cerimonia → sportswear | "un’ampia gamma di proposte di moda, dalla cerimonia allo sportswear, anche nelle taglie calibrate." | chi-siamo |
| eventi speciali / ogni giorno | "Dagli abiti pensati per gli eventi speciali all’abbigliamento casual da indossare ogni giorno" | chi-siamo |
| 18° compleanno | "ero alla ricerca di un abito da indossare in occasione del 18^ compleanno di mia figlia" | review (Fabio), home + chi-siamo |
| laurea | "Ho comprato qui da Ingromoda il tailleur per la mia laurea" | review (Denise Pizzo) |
| cerimonia | "Ci servivano 3 abiti da cerimonia due donna e uno uomo" | review (Maria Solito) |
| prima comunione (image only) | stock image `children-getting-ready-their-first-communion-1.jpg`, alt "children getting ready their first communion 1" | home |

Not mentioned anywhere in the copy: cresima, sposa/sposo/nozze (only the unused media file `abito-nozze-ingromoda.jpeg`), gala/serata, prom, 18 anni (only in a review).

## 9. Product categories and brands per department page

- **Donna** (`/donna/`)
  - Section nav: CERIMONIA · CASUAL · TAGLIE COMODE · ACCESSORI.
  - Sizes: "dalla taglia 38 alla 70, anche nei vari drop".
  - Cerimonia: "abiti lunghi", "corti", "tailleur in ogni colorazione"; materials "raso, il pizzo o lo chiffon"; details "ricami, applicazioni o strass".
  - Casual: "jeans in denim", "gonne", "abiti adatti alla stagione", "-t-shirt estrose", "camicie".
  - Taglie comode: generic, no garment types named.
  - Accessori: "borse, collane, orecchini, foulard, bracciali, occhiali da sole".
  - **Brands:**
    - **Laura Biagiotti**: carousel logo `LOGO-NUOVO.jpg`, alt "logo laura biagiotti", and YouTube video "Ingromoda nuova collezione Laura Biagiotti".
    - **Romeo Gigli**: carousel logo `romeo-gigli-1.jpg`, alt "romeo gigli 1", and video `Ingromoda-Romeo-Gigli-2.mp4`.
    - Neither brand is named in the body text.
- **Uomo** (`/uomo/`)
  - Section nav: CERIMONIA · CASUAL · TAGLIE COMODE · SCARPE · ACCESSORI.
  - Sizes: "dalla taglia 44 alla 78, anche nei vari drop".
  - Intro: "cravatta", "pantalone", "sportswear", "t-shirt, felpe, pantaloni da jogging", "gemelli, cravatte o papillon".
  - Cerimonia: "abiti di alta sartoria", "spezzato", "classico completo", "completo di lino".
  - Casual: "jeans in denim, t-shirt in cotone o camice in lino", "jeans strappati o pantaloni cargo oversize".
  - Taglie comode: "Maglieria, camicie, pantaloni o completi eleganti".
  - Scarpe: "eleganti, da ginnastica, sportive o casual".
  - Accessori: "Foulard, cravatte, gemelli, papillon, cinture o occhiali da sole".
  - **Brands: none named.**
- **Bambino** (`/bambino/`)
  - Section nav: CERIMONIA · TAGLIE COMODE.
  - "abiti da cerimonia per bambini, dai 2 ai 16 anni"; "abbigliamento Kids"; taglie comode "dalla taglia 44 alla 52".
  - "Reparto outlet" label: see §3.
  - **Brands: none named.**
- **Home / Chi siamo:** "tailleur", "abiti raffinati e splendenti", "sportswear", "taglie calibrate" (the Home/Chi siamo wording for the larger sizes that Donna/Uomo/Bambino call "taglie comode"), "capi e accessori".
