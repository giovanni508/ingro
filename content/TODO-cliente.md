# Cosa ci serve da Ingromoda

Elenco delle informazioni e dei materiali da chiedere al cliente. Niente di quanto segue è stato inventato: dove mancava un dato, il sito lo omette o usa ciò che il cliente ha fornito o già pubblicato.

Aggiornato il 18/11/2026 dopo le modifiche richieste dal cliente (cartella "FILE PER SITO INGROMODA"): nuove foto e video, reparto Bambino tolto, linea curvy, oltre 40 anni di attività, dirette social senza giorni fissi.

## Priorità alta

1. **Palinsesto TV: conferma del formato.** Sul vecchio sito: "LUN. ORE 12,00 -14,00 -22,30" e così via. Sono tre orari di inizio delle messe in onda su TVM CH19 (come li mostriamo ora) oppure fasce orarie? Il sito li presenta sempre come "in onda su TVM CH19", mai come orari del negozio. La funzione "prossimo appuntamento in TV" è pronta ma spenta: si accende con `nextBroadcast: true` in `content/features.json` dopo la conferma.
2. **Orari del negozio: conferma.** Il sito mostra quelli della vecchia pagina Contatti: lunedì-sabato 8:30-13:00 e 15:30-20:00; prima domenica del mese 10:00-13:00 e 16:00-20:00, esclusi agosto e settembre. Confermare o correggere. Dopo la conferma si può accendere l'indicatore "Aperto ora" (`openNow` in `content/features.json`).
3. **Taglie della linea curvy: conferma.** Il sito indica donna dalla 38 alla 70 e uomo dalla 44 alla 78 (dati del vecchio sito). Confermare che valgano anche per la linea curvy, o indicare le taglie esatte.
4. **Consenso per i nomi del personale.** Il sito nomina solo Loredana (già pubblicata come contatto WhatsApp). Le recensioni citano anche Barbara, Gabriella e "il proprietario": nei testi mostrati questi nomi sono omessi con "…". Se lo staff è d'accordo, possiamo mostrare le recensioni per intero.
5. **Consenso all'uso della foto di copertina.** La foto "Francesca orizzontale" è la prima immagine del sito e dell'anteprima sui social: serve il consenso scritto della persona ritratta. Il sito non scrive il suo nome né il suo ruolo; se volete presentarla (per esempio come titolare o personal shopper), ci serve la frase esatta.
6. **Indirizzo email per il modulo di contatto** (variabile `CONTACT_TO`) e scelta del servizio di invio (vedi README). Consigliato un indirizzo col dominio, per esempio `info@ingromoda.com`.
7. **CAP.** La privacy del vecchio sito indica 90125; OpenStreetMap assegna 90124 a quel tratto di Viale Regione Siciliana. Confermare il CAP corretto.

## Materiali

8. **Foto ancora mancanti.** Con le foto di novembre 2026 il sito usa solo immagini inviate da voi. Restano senza foto, e quindi mostrate solo con testo:
   - **linea curvy uomo** (e più foto curvy donna: oggi ce n'è una sola, piccola, 513 pixel di larghezza);
   - **accessori donna**, **scarpe e accessori uomo**;
   - **sportswear uomo** (oggi una sola foto casual);
   - il negozio senza scritte sovrapposte (ingresso, vetrine, camerini), meglio di sera con le luci accese.
   Formato ideale: verticale 4:5, almeno 1200 pixel di larghezza.
9. **Foto dall'aspetto "generato".** Molte delle foto inviate (passerelle, scalinate, strade del centro storico) hanno l'aspetto di immagini generate o ritoccate al computer. Le abbiamo usate come richiesto: confermate che i capi mostrati siano realmente disponibili in negozio.
10. **Diritti d'uso delle immagini dei marchi.** Il sito mostra il piumino della collezione Laura Biagiotti (dal vostro trittico) e cita Laura Biagiotti, Romeo Gigli e Navigare (quest'ultimo compare nello spot). Confermare che i fornitori ne consentano l'uso.
11. **Testo dello spot.** Se nello spot c'è una voce narrante, ci serve il testo esatto per aggiungere i sottotitoli (obbligatori per l'accessibilità). Oggi sotto il video c'è una descrizione scritta di ciò che mostra.
12. **Elenco completo dei marchi trattati.** Oggi il sito cita Laura Biagiotti, Romeo Gigli e Navigare.
13. **Logo vettoriale originale** (AI, EPS, SVG o PDF). Quello attuale è stato ricostruito in vettoriale dal PNG: è fedele, ma l'originale è sempre meglio.

## Storia e contenuti

14. **Anno di apertura e tappe del negozio.** Il sito ora dice "da oltre 40 anni", come richiesto. Con l'anno esatto possiamo aggiungerlo ai dati strutturati per Google (`foundingDate`) e, con qualche tappa, creare una linea del tempo in "Chi siamo".
15. **Media delle recensioni Google verificata.** Il vecchio widget mostrava "ECCELLENTE" e "In base a 513 recensioni", senza un numero medio. Il sito mostra le 6 recensioni da 5 stelle presenti nel widget (ricontrollato il 18/11/2026: nessuna nuova). Con la media verificata (e la data di rilevazione) si può aggiungere ai dati strutturati (`aggregateRating`); con un accesso a Google Business Profile si possono mostrare recensioni più recenti.
16. **Spedizioni**: costi, tempi e modalità per Italia ed Europa (il vecchio sito dice solo che il servizio è attivo).
17. **Annunci**: la barra in alto invita a seguire Facebook, Instagram e TikTok per sapere quando andate in diretta, fino al 31/12/2026. Testo, link e date si cambiano in `content/features.json`.

## Accessi e aspetti tecnici

18. **Accesso a DNS e hosting** per pubblicare il nuovo sito e attivare i redirect 301 dalle vecchie pagine (compresa la vecchia pagina `/bambino/`, che ora porta alla home).
19. **Google Search Console** (accesso o invito) per inviare la nuova sitemap e controllare i redirect.
20. **Google Business Profile**: verificare che sito, orari, categorie (niente più abbigliamento bambino) e foto coincidano con il nuovo sito.
21. **Statistiche**: il vecchio sito usava Google Analytics (G-J7SZTSN0EK). Il nuovo sito non ha statistiche. Se servono, si può aggiungere uno strumento rispettoso della privacy (o Analytics con consenso preventivo): da decidere.

## Testi legali (da far rivedere a un consulente)

22. **Privacy policy**: riformattata e corretta nei refusi, contenuto invariato. Va integrata con il trattamento dei dati del nuovo modulo di contatto e del servizio di invio email scelto. Rimosso dal riquadro "Informazioni utili" il riferimento all'"Ufficio delle imprese Milano Monza Brianza Lodi", che sembra un residuo di un modello (la società è registrata a Palermo, REA PA-160643): confermare.
23. **Cookie policy**: la versione precedente prevedeva il consenso "scorrendo la pagina" e citava servizi non più in uso (Google+, Google Analytics). È stata riscritta per descrivere ciò che il nuovo sito fa davvero (solo strumenti tecnici, Google Maps solo con consenso). Da far validare.
24. **Dichiarazione di accessibilità**: la precedente citava XHTML 1.0 e Internet Explorer 6, non più veri. La parte tecnica è stata aggiornata al nuovo sito e la data di riesame impostata al 28/10/2026: da confermare.
