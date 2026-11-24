// Kleine Regressionstests ohne zusätzliche Pakete.
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
function start(saved = null, blocked = false) {
  const elements = new Map();
  const element = () => ({
    classList: { toggle() {}, add() {}, remove() {} },
    append() {}, appendChild() {}, setAttribute() {},
    addEventListener() {}, focus() {},
  });
  const context = vm.createContext({
    document: {
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, element());
        return elements.get(id);
      },
      querySelectorAll: () => [], createElement: element,
    },
    localStorage: {
      getItem: () => saved,
      setItem(k, value) { if (blocked) throw Error('blocked'); saved = value; },
    },
    console: { error() {} },
  });
  vm.runInContext(source, context);
  return { run: (s) => vm.runInContext(s, context), elements };
}
test('Aufgabe anlegen, speichern und filtern', () => {
  const app = start();
  app.run('aufgabeHinzufuegen("  Deutsch üben  ", "hoch")');
  assert.equal(app.run('aufgaben[0].text'), 'Deutsch üben');
  assert.equal(app.run('laden().length'), 1);
  assert.equal(app.run('aktiverFilter="erledigt"; gefilterteAufgaben().length'), 0);
  app.run('aufgabeUmschalten(aufgaben[0].id)');
  assert.equal(app.run('gefilterteAufgaben().length'), 1);
  app.run('erledigteLoeschen()');
  assert.equal(app.run('aufgaben.length'), 0);
});
test('Einzelne Aufgabe löschen', () => {
  const app = start();
  app.run('aufgabeHinzufuegen("Test", "mittel"); aufgabeLoeschen(aufgaben[0].id)');
  assert.equal(app.run('aufgaben.length'), 0);
});
test('Beschädigte oder falsche Daten abfangen', () => {
  for (const value of ['{', '{}', '[null,{},42]']) {
    assert.equal(start(value).run('aufgaben.length'), 0);
  }
});
test('Blockierte Speicherung anzeigen, App weiter nutzbar', () => {
  const app = start(null, true);
  app.run('aufgabeHinzufuegen("Test", "niedrig")');
  assert.equal(app.run('aufgaben.length'), 1);
  assert.match(app.elements.get('speicher-status').textContent, /Speichern nicht möglich/);
});
