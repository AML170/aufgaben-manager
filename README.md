# Aufgaben-Manager

Eine schlanke Web-App zur Verwaltung von Aufgaben, komplett mit deutscher Benutzeroberfläche. Gebaut mit reinem HTML, CSS und JavaScript - ganz ohne Frameworks oder Build-Tools.

## Funktionen

- Aufgaben anlegen mit Priorität (Niedrig, Mittel, Hoch)
- Aufgaben als erledigt markieren und wieder öffnen
- Einzelne Aufgaben löschen oder alle erledigten auf einmal entfernen
- Filtern nach: Alle / Offen / Erledigt
- Zähler für offene Aufgaben
- Dauerhafte Speicherung im Browser über die Local Storage API

## Verwendete Technologien

- **HTML5** - semantische Struktur, `lang="de"`, ARIA-Labels für Barrierefreiheit
- **CSS3** - eigenes Design mit CSS Custom Properties, BEM-ähnliche Klassennamen
- **JavaScript (ES6+)** - DOM-Manipulation, Event Handling, `localStorage`

## Starten

Kein Build-Schritt nötig. Einfach die Datei `index.html` im Browser öffnen:

```bash
# optional mit einem lokalen Server
python3 -m http.server 8000
# dann http://localhost:8000 aufrufen
```

## Projektstruktur

```
aufgaben-manager/
├── index.html    # Struktur der Seite
├── style.css     # Design und Layout
├── app.js        # Logik: Zustand, Speicherung, Rendering
└── README.md
```

## Wie der Code funktioniert

- **Zustand (`state`)**: Alle Aufgaben liegen in einem Array. Jede Aufgabe ist ein Objekt mit `id`, `text`, `prioritaet`, `erledigt` und `erstelltAm`.
- **Speicherung**: Nach jeder Änderung wird das Array als JSON im Local Storage abgelegt und beim Laden wieder eingelesen.
- **Rendering**: Die Funktion `rendern()` baut die Liste bei jeder Änderung komplett neu auf. So bleibt die Anzeige immer synchron mit dem Zustand.
- **Filter**: Je nach aktivem Filter werden nur passende Aufgaben angezeigt, die Daten selbst bleiben unverändert.

## Mögliche Erweiterungen

- Fälligkeitsdatum pro Aufgabe
- Bearbeiten vorhandener Aufgaben per Doppelklick
- Sortierung nach Priorität oder Datum
- Dunkelmodus (Dark Mode)

## Grenzen und Datenschutz

Die Daten bleiben im Browser dieses Geräts. Es gibt kein Benutzerkonto, keine Cloud-Synchronisierung und keine Garantie gegen Datenverlust. Das Löschen der Browserdaten entfernt auch die Aufgaben. Keine vertraulichen Daten eingeben. Falls der Browser die Speicherung blockiert, zeigt die App eine Warnung.

## Entwicklung und Lernen

Dieses Projekt wurde mit KI-Unterstützung als Lernprojekt vorbereitet. Der nächste Schritt ist, den Code selbst nachzuvollziehen, zu testen und um eigene Änderungen zu erweitern. Es ist kein Nachweis bereits vorhandener Berufserfahrung.

## Tests

```bash
node tests/app.test.cjs
```

Die Tests prüfen Hinzufügen, Filter, Statuswechsel, Löschen, Speicherung und fehlerhafte gespeicherte Daten. Das Layout wurde bei Desktop- und Mobilbreite geprüft.
