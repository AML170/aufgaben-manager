/**
 * Aufgaben-Manager
 * Eine einfache Aufgabenverwaltung mit Local Storage.
 * Alle Daten bleiben im Browser, es gibt keinen Server.
 */

"use strict";

// --- Schlüssel für den Local Storage ---
const SPEICHER_SCHLUESSEL = "aufgaben-manager:aufgaben";

// --- DOM-Elemente ---
const formular = document.getElementById("aufgaben-formular");
const eingabe = document.getElementById("aufgaben-eingabe");
const prioritaetAuswahl = document.getElementById("prioritaet-auswahl");
const liste = document.getElementById("aufgaben-liste");
const leerHinweis = document.getElementById("leer-hinweis");
const zaehler = document.getElementById("zaehler");
const erledigteLoeschenButton = document.getElementById("erledigte-loeschen");
const filterButtons = document.querySelectorAll(".filter__button");

// --- Zustand der Anwendung ---
let aufgaben = laden();
let aktiverFilter = "alle";

/** Lädt die gespeicherten Aufgaben aus dem Local Storage. */
function laden() {
  try {
    const rohdaten = localStorage.getItem(SPEICHER_SCHLUESSEL);
    const daten = rohdaten ? JSON.parse(rohdaten) : [];
    if (!Array.isArray(daten)) return [];
    return daten.filter((a) => a && typeof a.id === "string" &&
      typeof a.text === "string" && a.text.trim().length > 0 &&
      ["niedrig", "mittel", "hoch"].includes(a.prioritaet) &&
      typeof a.erledigt === "boolean");
  } catch (fehler) {
    console.error("Aufgaben konnten nicht geladen werden:", fehler);
    return [];
  }
}

/** Speichert alle Aufgaben im Local Storage. */
function speichern() {
  try {
    localStorage.setItem(SPEICHER_SCHLUESSEL, JSON.stringify(aufgaben));
    document.getElementById("speicher-status").textContent = "";
  } catch {
    document.getElementById("speicher-status").textContent =
      "Speichern nicht möglich. Änderungen bleiben nur bis zum Schließen dieser Seite erhalten.";
  }
}

/** Erzeugt eine eindeutige ID für eine neue Aufgabe. */
function neueId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/** Fügt eine neue Aufgabe hinzu. */
function aufgabeHinzufuegen(text, prioritaet) {
  aufgaben.push({
    id: neueId(),
    text: text.trim(),
    prioritaet: prioritaet,
    erledigt: false,
    erstelltAm: new Date().toISOString(),
  });
  speichern();
  rendern();
}

/** Wechselt den Erledigt-Status einer Aufgabe. */
function aufgabeUmschalten(id) {
  const aufgabe = aufgaben.find((a) => a.id === id);
  if (aufgabe) {
    aufgabe.erledigt = !aufgabe.erledigt;
    speichern();
    rendern();
  }
}

/** Löscht eine einzelne Aufgabe. */
function aufgabeLoeschen(id) {
  aufgaben = aufgaben.filter((a) => a.id !== id);
  speichern();
  rendern();
}

/** Löscht alle erledigten Aufgaben. */
function erledigteLoeschen() {
  aufgaben = aufgaben.filter((a) => !a.erledigt);
  speichern();
  rendern();
}

/** Gibt die Aufgaben passend zum aktiven Filter zurück. */
function gefilterteAufgaben() {
  if (aktiverFilter === "offen") return aufgaben.filter((a) => !a.erledigt);
  if (aktiverFilter === "erledigt") return aufgaben.filter((a) => a.erledigt);
  return aufgaben;
}

/** Baut ein Listenelement für eine Aufgabe. */
function aufgabenElementErstellen(aufgabe) {
  const element = document.createElement("li");
  element.className = "aufgabe" + (aufgabe.erledigt ? " ist-erledigt" : "");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "aufgabe__checkbox";
  checkbox.checked = aufgabe.erledigt;
  checkbox.setAttribute("aria-label", aufgabe.text + (aufgabe.erledigt ? ": wieder öffnen" : ": als erledigt markieren"));
  checkbox.addEventListener("change", () => aufgabeUmschalten(aufgabe.id));

  const text = document.createElement("span");
  text.className = "aufgabe__text";
  text.textContent = aufgabe.text;

  const badge = document.createElement("span");
  badge.className = "aufgabe__prioritaet aufgabe__prioritaet--" + aufgabe.prioritaet;
  badge.textContent = aufgabe.prioritaet.charAt(0).toUpperCase() + aufgabe.prioritaet.slice(1);

  const loeschenButton = document.createElement("button");
  loeschenButton.className = "aufgabe__loeschen";
  loeschenButton.textContent = "×";
  loeschenButton.setAttribute("aria-label", aufgabe.text + ": löschen");
  loeschenButton.addEventListener("click", () => aufgabeLoeschen(aufgabe.id));

  element.append(checkbox, text, badge, loeschenButton);
  return element;
}

/** Aktualisiert die komplette Anzeige. */
function rendern() {
  liste.innerHTML = "";
  const sichtbar = gefilterteAufgaben();

  for (const aufgabe of sichtbar) {
    liste.appendChild(aufgabenElementErstellen(aufgabe));
  }

  leerHinweis.textContent = aktiverFilter === "alle"
    ? "Keine Aufgaben vorhanden. Lege deine erste Aufgabe an!"
    : "Keine Aufgaben für diesen Filter vorhanden.";
  leerHinweis.classList.toggle("ist-sichtbar", sichtbar.length === 0);
  erledigteLoeschenButton.disabled = !aufgaben.some((a) => a.erledigt);

  const offeneAnzahl = aufgaben.filter((a) => !a.erledigt).length;
  zaehler.textContent =
    offeneAnzahl === 1 ? "1 offene Aufgabe" : offeneAnzahl + " offene Aufgaben";
}

// --- Ereignisse ---
formular.addEventListener("submit", (ereignis) => {
  ereignis.preventDefault();
  const text = eingabe.value.trim();
  if (!text) return;
  aufgabeHinzufuegen(text, prioritaetAuswahl.value);
  eingabe.value = "";
  eingabe.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((b) => {
      b.classList.remove("ist-aktiv");
      b.setAttribute("aria-pressed", "false");
    });
    button.classList.add("ist-aktiv");
    button.setAttribute("aria-pressed", "true");
    aktiverFilter = button.dataset.filter;
    rendern();
  });
});

erledigteLoeschenButton.addEventListener("click", erledigteLoeschen);

// --- Start ---
rendern();
