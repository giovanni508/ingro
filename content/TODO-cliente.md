# Cosa ci serve da Ingromoda

Elenco delle informazioni e dei materiali da chiedere al cliente prima della pubblicazione. Niente di quanto segue è stato inventato: dove mancava un dato, il sito lo omette o usa ciò che era già pubblicato sul vecchio sito.

## Priorità alta (prima della messa online)

1. **Palinsesto TV: conferma del formato.** Sul vecchio sito: "LUN. ORE 12,00 -14,00 -22,30" e così via. Sono tre orari di inizio delle messe in onda su TVM CH19 (come li mostriamo ora) oppure fasce orarie? Il sito li presenta sempre come "in onda su TVM CH19", mai come orari del negozio. La funzione "prossimo appuntamento in TV / in diretta" è pronta ma spenta: si accende con `nextBroadcast: true` in `content/features.json` dopo la conferma.
2. **Orari del negozio: conferma.** Il sito mostra quelli della vecchia pagina Contatti: lunedì-sabato 8:30-13:00 e 15:30-20:00; prima domenica del mese 10:00-13:00 e 16:00-20:00, esclusi agosto e settembre. Confermare o correggere. Dopo la conferma si può accendere l'indicatore "Aperto ora" (`openNow` in `content/features.json`).
3. **"Reparto outlet": cosa significa?** Sul vecchio sito compare solo come etichetta sopra "Abbigliamento bambino" e nel titolo "Cerimonia - reparto outlet", senza spiegazione (e il testo sotto parla di "ultime tendenze"). Per ora l'etichetta non è mostrata. Se il reparto bambino è davvero un outlet (prezzi ribassati, fine serie?), ci serve una frase che lo spieghi.
4. **Consenso per i nomi del personale.** Il sito nomina solo Loredana (già pubblicata come contatto WhatsApp). Le recensioni citano anche Barbara, Gabriella e "il proprietario": nei testi mostrati questi nomi sono omessi con "…". Se lo staff è d'accordo, possiamo mostrare le recensioni per intero.
5. **Consenso all'uso delle foto con persone riconoscibili.** In particolare: la cliente in abito fucsia con piume e quella in abito di paillettes rosa (foto in negozio con i manichini), la sposa con le damigelle, le clienti negli abiti in raso (giallo, verde, ottanio, nero di paillettes), la signora in abito nero alla serata con i palloncini, la bambina negli abiti da cerimonia. Sono foto già caricate sul vecchio sito, ma serve conferma che si possano usare in evidenza.
6. **Indirizzo email per il modulo di contatto** (variabile `CONTACT_TO`) e scelta del servizio di invio (vedi README). Consigliato un indirizzo col dominio, per esempio `info@ingromoda.com`: è più credibile di `ingromoda@gmail.com` e il dominio già funziona (esiste `accessibilita@ingromoda.com`).
7. **CAP.** La privacy del vecchio sito indica 90125; OpenStreetMap assegna 90124 a quel tratto di Viale Regione Siciliana. Confermare il CAP corretto.

## Materiali

8. **Servizio fotografico vero del negozio e dei capi.** È la richiesta più importante per la qualità del sito. In particolare:
   - il negozio (ingresso, vetrine, camerini, salottino, pedana con i manichini), meglio di sera con le luci accese: il sito è costruito sull'idea della luce;
   - abiti da cerimonia donna, uomo e bambino indossati, in verticale (formato 4:5), su fondo neutro o in negozio;
   - **taglie comode donna e uomo**: oggi le uniche foto disponibili (donna) sembrano generate al computer, per uomo non ce ne sono;
   - **bambino**: servono più foto, soprattutto per i maschietti;
   - lo staff al lavoro (solo con consenso).
9. **Foto dall'aspetto "generato".** Circa 80 immagini caricate nel 2026 sul vecchio sito (passerelle con pubblico sfocato, scalinate, spiagge) sembrano generate con intelligenza artificiale. Il nuovo sito le usa solo dove non c'era alternativa (taglie comode donna, due look bambino: elenco in `content/media-map.json`, voce `look: "generata"`). Confermare che corrispondano a capi realmente in negozio, oppure sostituirle.
10. **Diritti d'uso dei lookbook dei marchi.** Il sito usa foto della collezione Laura Biagiotti e di un lookbook uomo (giacche sulla costa) trovate nella libreria del vecchio sito. Confermare che il fornitore ne consenta l'uso.
11. **Video in alta qualità** (negozio, sfilate, dirette, TV): oggi ci sono solo due clip brevi (Romeo Gigli, Laura Biagiotti). Un video di 10-20 secondi del negozio sarebbe perfetto per la hero.
12. **Elenco dei marchi trattati.** Oggi il sito cita solo Laura Biagiotti e Romeo Gigli (gli unici loghi presenti sul vecchio sito).
13. **Logo vettoriale originale** (AI, EPS, SVG o PDF). Quello attuale è stato ricostruito in vettoriale dal PNG: è fedele, ma l'originale è sempre meglio.

## Storia e contenuti

14. **Tappe storiche della famiglia e del negozio**: anno di apertura, generazioni, momenti importanti. Il vecchio sito dice sia "da generazioni" sia "da diversi anni": per coerenza il nuovo sito usa "Da generazioni" solo nel sottotitolo della home (richiesto) e non pubblica date. Con le tappe vere si può aggiungere una linea del tempo in "Chi siamo".
15. **Media delle recensioni Google verificata.** Il vecchio widget mostrava "ECCELLENTE" e "In base a 513 recensioni", senza un numero medio. Con la media verificata (e la data di rilevazione) si può aggiungere ai dati strutturati per Google (`aggregateRating`).
16. **Spedizioni**: costi, tempi e modalità per Italia ed Europa (il vecchio sito dice solo che il servizio è attivo).
17. **Annunci**: la barra in alto oggi ricorda le dirette Facebook fino al 31/12/2026. Testo, link e date si cambiano in `content/features.json`.

## Accessi e aspetti tecnici

18. **Accesso a DNS e hosting** per pubblicare il nuovo sito e attivare i redirect 301 dalle vecchie pagine.
19. **Google Search Console** (accesso o invito) per inviare la nuova sitemap e controllare i redirect.
20. **Google Business Profile**: verificare che sito, orari e foto coincidano con il nuovo sito.
21. **Statistiche**: il vecchio sito usava Google Analytics (G-J7SZTSN0EK). Il nuovo sito non ha statistiche. Se servono, si può aggiungere uno strumento rispettoso della privacy (o Analytics con consenso preventivo): da decidere.

## Testi legali (da far rivedere a un consulente)

22. **Privacy policy**: riformattata e corretta nei refusi, contenuto invariato. Va integrata con il trattamento dei dati del nuovo modulo di contatto e del servizio di invio email scelto. Rimosso dal riquadro "Informazioni utili" il riferimento all'"Ufficio delle imprese Milano Monza Brianza Lodi", che sembra un residuo di un modello (la società è registrata a Palermo, REA PA-160643): confermare.
23. **Cookie policy**: la versione precedente prevedeva il consenso "scorrendo la pagina" e citava servizi non più in uso (Google+, Google Analytics). È stata riscritta per descrivere ciò che il nuovo sito fa davvero (solo strumenti tecnici, Google Maps solo con consenso). Da far validare.
24. **Dichiarazione di accessibilità**: la precedente citava XHTML 1.0 e Internet Explorer 6, non più veri. La parte tecnica è stata aggiornata al nuovo sito e la data di riesame impostata al 28/10/2026: da confermare.
