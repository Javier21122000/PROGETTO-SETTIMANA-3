//inizio il js da qui per un aspetto piu pulito e
// riprendo gli esercizi con i numeri in commento

// primo array di libri di default
let libri = [
  {
    id: 1,
    titolo: "L'alchimista",
    autore: "Paulo Coelho",
    anno: 1988,
    stato: "letto",
  },
  {
    id: 2,
    titolo: "La metamorfosi",
    autore: "Franz Kafka",
    anno: 1915,
    stato: "letto",
  },
  {
    id: 3,
    titolo: "Il Piccolo Principe",
    autore: "Antoine de Saint-Exupéry",
    anno: 1943,
    stato: "da-leggere",
  },
  {
    id: 4,
    titolo: "Il cammino di Santiago",
    autore: "Paulo Coelho",
    anno: 1987,
    stato: "da-leggere",
  },
  {
    id: 5,
    titolo: "Il monaco che vendette la sua Ferrari",
    autore: "Robin Sharma",
    anno: 1997,
    stato: "letto",
  },
  {
    id: 6,
    titolo: "Il Club delle 5 del mattino",
    autore: "Robin Sharma",
    anno: 2018,
    stato: "da-leggere",
  },
  {
    id: 7,
    titolo: "L'arte della Guerra",
    autore: "Sun Tzu",
    anno: -400,
    stato: "letto",
  },
  {
    id: 8,
    titolo: "Il Principe",
    autore: "Niccolò Machiavelli",
    anno: 1513,
    stato: "da-leggere",
  },
];

// primo filtro di default
let filtroCorrente = "tutti";

// primo ordinamento di default
let ordinamentoCorrente = "crescente";

// il testo vuoto per permettere all utente di scrvere
let ricercaCorrente = "";

// ES 1. RENDER() Una sola funzione che ridipinge la lista.

function render() {
  // 1.prendo gli elementi da aggiornardall html
  const containerLista = document.getElementById("lista-libri");
  const txtTotale = document.getElementById("quanti-totale");
  const txtLetti = document.getElementById("quanti-letti");
  const txtDaLeggere = document.getElementById("quanti-da-leggere");
  const barraProgresso = document.getElementById("barra-progresso");

  // funzione filtro libro per libro
  let libriFiltrati = libri.filter(function (libro) {
    // vediamo se scrivendo ogni lettera si matcha con i libri che ho gia
    const matchesRicerca =
      libro.titolo.toLowerCase().includes(ricercaCorrente.toLowerCase()) ||
      libro.autore.toLowerCase().includes(ricercaCorrente.toLowerCase());

    // controllo lo stato con il filtro
    const matchesFiltro =
      filtroCorrente === "tutti" || libro.stato === filtroCorrente;

    // filtro solo per entrambi le condizioni
    return matchesRicerca && matchesFiltro;
  });

  // 3. ordine in base agli anni con la funzione sort
  libriFiltrati.sort(function (a, b) {
    if (ordinamentoCorrente === "crescente") {
      return a.anno - b.anno; // dal piu vecchio al piu recente
    } else {
      return b.anno - a.anno; // viceversa
    }
  });

  // 4. svuoto html per non avere duplicati strani
  containerLista.innerHTML = "";

  // 5. creo finalmente le card usando la reference al div dell html
  libriFiltrati.forEach(function (libro) {
    // creo un oggetto card per permettermi di scrivere nell html le card
    const card = document.createElement("div");

    // collego lo stato letto o meno al css che ho dichiarato prima
    card.className = `card-libro ${libro.stato === "letto" ? "letto" : ""}`;

    // inserisco tioli , titolini e i testi dentro le card
    card.innerHTML = `
  <div class="info-libro">
    <h3>${libro.titolo}</h3>
    <p class="titolino-statistiche">Autore: ${libro.autore}</p>
    <p class="titolino-statistiche">Anno: ${libro.anno}</p>
  </div>
  <div class="azioni-libro">
    <button class="btn-stato" data-id="${libro.id}">
      ${libro.stato === "letto" ? "Da leggere" : "Segna letto"}
    </button>
    <button class="btn-elimina" data-id="${libro.id}">Elimina</button>
  </div>
`;

    // appendo la card alla lista
    containerLista.appendChild(card);
  });

  // 6.aggiorno contatori e vari barre e numeri
  const totaleLibri = libri.length;

  // conto quanti hanno los stato letto
  const libriLetti = libri.filter(function (l) {
    return l.stato === "letto";
  }).length;
  const libriDaLeggere = totaleLibri - libriLetti;

  // faccio visualizzare in html i numeri gialli che ho collegato ai filtri che ho creato sopra
  txtTotale.textContent = totaleLibri;
  txtLetti.textContent = libriLetti;
  txtDaLeggere.textContent = libriDaLeggere;

  // oggetto percentuale che allunga e cambia lo style della width a seconda dei libri letti o meno
  const percentuale =
    totaleLibri > 0 ? Math.round((libriLetti / totaleLibri) * 100) : 0;
  barraProgresso.style.width = percentuale + "%";
  localStorage.setItem("libri-salvati", JSON.stringify(libri));
}

// 7. render all avvio pagina per non averla vuota all inizio
render();

// ES 2. FORM CON VALIDAZIONE (dico a js cosa fare quando un utente vuole aggiungere un libro)

// 1. selziono dall html il form libro
const formLibro = document.getElementById("form-libro");

// 2. metto un eventlistener per capire cosa fa il submit
formLibro.addEventListener("submit", function (event) {
  // blocco il caricamento di defalut
  event.preventDefault();

  // 3. leggo cosa ce scritto come input nei vari campi e tolgo gli spazi con i value.trim
  const titoloValore = document.getElementById("input-titolo").value.trim();
  const autoreValore = document.getElementById("input-autore").value.trim();
  const annoValore = document.getElementById("input-anno").value.trim();
  const statoValore = document.getElementById("select-stato").value;

  // 4. sostitusico il requiered che avevo impostato in html e do un messaggio di warning
  if (titoloValore === "" || autoreValore === "" || annoValore === "") {
    alert("Per favore, compila tutti i campi obbligatori!");
    return;
  }

  // 5. creo un oggetto per assegnare i valori correttamente ai libri aggiunti
  const nuovoLibro = {
    id: Date.now(), // numero univoco in millisceondi per quando si aggiunge un libro nuovo
    titolo: titoloValore,
    autore: autoreValore,
    anno: Number(annoValore), // metto un typeof number per trasfromare sempre in number
    stato: statoValore,
  };

  // 6. do un push al nuovo libro cosi lo inserisco nel vero array
  libri.push(nuovoLibro);

  // 7. appena inserito svuoto i campi input per poterne isnerire altri
  formLibro.reset();
  //aggiunto dall esercizio di notifivche
  notifica("Libro aggiunto con successo!");

  // 8. un nuvo render finale per ridisegnare la pagina correttamente col nuovo libro
  render();
});

// ES 3. EVENT DELEGATION

// 1. seleziono id della lista libri
const listaLibriContainer = document.getElementById("lista-libri");

// 2. applico la event delegation per capire cosa fanno i bottoni
listaLibriContainer.addEventListener("click", function (event) {
  // cosa succede all evento cliccato
  const elementoCliccato = event.target;

  // prendo l'id e lo converto in numero
  const idLibro = Number(elementoCliccato.getAttribute("data-id"));

  // se tocco il bottone elimina
  if (elementoCliccato.classList.contains("btn-elimina")) {
    // riscrivo l'array con i libri che hanno id diverso da quello
    libri = libri.filter(function (libro) {
      return libro.id !== idLibro;
    });
    //testo che si collega all esercizio delle funzioni notifiche
    notifica("Libro eliminato dalla lista.");
    // e dopo questo un render per pulire
    render();
  }

  // parte 2, cosa fa invece il bottone di stato
  if (elementoCliccato.classList.contains("btn-stato")) {
    // uso la funzione find per cercare un id spceifico
    const libroTrovato = libri.find(function (libro) {
      return libro.id === idLibro;
    });

    // se lo trovo inverto il suo stato
    if (libroTrovato) {
      if (libroTrovato.stato === "letto") {
        libroTrovato.stato = "da-leggere";
      } else {
        libroTrovato.stato = "letto"; //viceversa
      }
    }

    // riaggiorno la pagina
    render();
  }
});

/* ES 4  RICERCA, FILTRO, ORDINAMENTO gestisco la ricerca e cosa fanno i vari filtri di stato e di anno

*/
// metto un eventlistener sull input
document
  .getElementById("input-ricerca")
  .addEventListener("input", function (event) {
    // salvo a livello globale
    ricercaCorrente = event.target.value;

    // do un render veloce per ricaricare la page istantaneamente
    render();
  });

//metto un evenmtlistener sul change per aggiornare se è letto o meno
document
  .getElementById("filtro-stato")
  .addEventListener("change", function (event) {
    // salvo il valore del filtro scleto nello stato globale
    filtroCorrente = event.target.value;

    // riaggiorno la finestra filtrata
    render();
  });

// collego l' eventlistener al change degli anni decrescenti e viceversa
document
  .getElementById("ordine-anno")
  .addEventListener("change", function (event) {
    // salvo nell ordinamento e stato globale
    ordinamentoCorrente = event.target.value;

    // render per visualizzaione immediata
    render();
  });

/* 5. NOTIFICHE TEMPORANEE
   Funzione notifica(testo) che imposta il testo del <div id="notifica">,
   lo mostra (display: block), poi dopo 3000ms (setTimeout) lo nasconde.
*/

// dichiaro le notifiche
let Notifica;

function notifica(testo) {
  // collego all html
  const boxNotifica = document.getElementById("notifica");

  // do il testo che dichiarero come parametro dentro le funzioni sopra
  boxNotifica.textContent = testo;

  // applico il css
  boxNotifica.style.display = "block";

  // timer di 3 secondi per notifica
  Notifica = setTimeout(function () {
    boxNotifica.style.display = "none";
  }, 3000);
}
//aggiunte alle funzioni di aggiungilibro ed elimina

/* ES 6 TEMA CHIARO/SCURO
   Un button che chiama document.body.classList.toggle("dark").
   In CSS scrivi le regole opposte (es. body.dark { background: #111; ... }).
*/
// 1. seleziono id nell html
const btnTema = document.getElementById("bottone-tema");

// 2. ascolto il click del bottone
btnTema.addEventListener("click", function () {
  // con il taggle aggiungo la classe dark
  document.body.classList.toggle("dark");

  // se dopo il click ho tutta la classe dark
  if (document.body.classList.contains("dark")) {
    btnTema.textContent = "Tema chiaro"; // allora proponi il tema chiaro
  } else {
    btnTema.textContent = "Tema scuro"; // altrimenti proponi tema scuro
  }

  // notifica di banner per tema aggiornato con successo
  notifica("Tema della pagina aggiornato!");
});

// ES 7. funzione di Persistenza nella pagina di dati salvati local Storage

//mi creo un oggetto di dati salavati
const datiSalvati = localStorage.getItem("libri-salvati");
// se ho dei dati salvati
if (datiSalvati) {
  // uso un jsonparse per ricreare un nuovo array con i dati salvati
  libri = JSON.parse(datiSalvati);
}

/* CATEGORIE
   Aggiungi un campo categoria nello schema. Nel form un <select> per sceglierla.
   In render(), raggruppa con reduce in { categoria: [elementi] } e disegna un
   header per categoria con sotto la lista di quella categoria.
*/

/* SCRIVI QUI LA TUA RISPOSTA */
