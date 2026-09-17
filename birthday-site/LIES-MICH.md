# For My Love — neue Version

## Öffnen

Entpacke den Ordner und öffne **index.html** (Doppelklick). Der Code zum
Entsperren ist weiterhin ihr Geburtstag: `29.09.2006`.

Damit Musik und Videos zuverlässig laufen, starte die Seite am besten über
einen kleinen lokalen Server statt per Doppelklick:

```
cd birthday-site
python3 -m http.server 8000
```

Dann im Browser `http://localhost:8000` öffnen.

## Was ich geändert habe

**Struktur & Code**
- Drei verschiedene `DOMContentLoaded`-Blöcke und doppelt registrierte
  Klick-Listener zusammengeführt. Vorher wurde `openPage()` bei jedem
  Nav-Klick zweimal ausgelöst.
- Alles Einstellbare steht jetzt oben in `script.js` im `CONFIG`-Objekt
  (Geburtsdatum, Jahrestag, Lautstärke, Text beim Zahlen-Reveal).
- Ihr Alter wird aus dem Geburtsdatum berechnet. Die 19 → 20 Animation
  funktioniert nächstes Jahr also automatisch als 20 → 21.
- Countdown: vorher sprang er am Geburtstag selbst sofort auf 364 Tage.
  Jetzt erkennt die Seite den Geburtstag und zeigt den Tag selbst an.

**Ablauf**
- Die 19 → 20 Sequenz lief früher sofort beim Laden, also noch vor dem
  Login, und war nach neun Sekunden weg. Jetzt kommt sie **nach** dem
  Entsperren, als einziger großer Moment, mit „Skip"-Knopf.
- Die Musik startet mit Fade-in und pausiert automatisch, wenn sie ein
  Video abspielt.

**Design**
- Ein Farbsystem statt vieler Einzelfarben: Schwarz-Pflaume, Rosé, Gold.
  Das Gold kommt aus ihren Fotos (die Stickerei auf den Abayas).
- Zwei Schriften: Instrument Serif für Überschriften und den Brief,
  Karla für alles andere.
- Handy zuerst gebaut — sie wird das auf dem Telefon öffnen. Navigation
  scrollt seitlich, nichts läuft mehr über den Rand.
- Der lange Brief steht jetzt in Absätzen mit „Keep reading", statt
  hunderte Zeilen `<br><br>` am Stück. Deine Worte, nur geordnet.
  („Husbend" → „husband" habe ich korrigiert.)

**Neu**
- Tage zusammen werden live gezählt (seit 31.07.2022).
- Galerie mit Lightbox: vor/zurück, Wischen am Handy, Pfeiltasten, Esc.
- Quiz mit vier Fragen statt einer, mit Punktestand.
- Herz-Spiel als 10-Sekunden-Runde mit gespeichertem Rekord.
- Zeitleiste „Our story" nutzt jetzt euren echten Screenshot vom
  31.07.2022 und einen Chat als Erinnerungsstücke.

**Technik**
- Bilder verkleinert und als JPEG gespeichert: aus ~8 MB wurden ~1,4 MB.
  Lädt auf Handydaten deutlich schneller.
- Tastatur-Fokus sichtbar, Alt-Texte, `prefers-reduced-motion` wird
  respektiert (falls sie Animationen im System abgeschaltet hat).

## Texte ändern

- Brief, Bildunterschriften, Zeitleiste: direkt in `index.html`.
- Quizfragen: in `script.js`, Abschnitt `QUESTIONS`.
- Farben: in `style.css` ganz oben unter `:root`.

## Bilder austauschen

Neue Datei in `assets/` legen und in `index.html` den Dateinamen
ersetzen. In der Galerie stehen Pfad und Vorschau im selben
`<button class="cell">` — beide anpassen.

## Online stellen

Den Ordner auf [netlify.com/drop](https://app.netlify.com/drop) ziehen.
Nach ein paar Sekunden gibt es einen Link, den du ihr schicken kannst.
Achtung: der Link ist öffentlich, wenn ihn jemand hat. Die Abfrage mit
dem Geburtstag ist ein netter Türsteher, kein echter Schutz — der Code
steht im JavaScript. Für private Fotos also lieber nur den Ordner
verschicken oder ihr die Seite direkt zeigen.
