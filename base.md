# KI-System-Check --- Base Specification

## 1. Zweck des Projekts

KI-System-Check ist ein kleiner Web-Prototyp für Unternehmen, mit dem
einzelne KI-Systeme erfasst und einer ersten strukturierten Einschätzung
unterzogen werden können.

Die Anwendung soll Geschäftsführern, Bereichsleitern und
KI-Verantwortlichen schnell verständlich machen:

-   welches KI-System eingesetzt wird,
-   welche relevanten Risiken oder offenen Punkte bestehen,
-   welche Informationen noch fehlen,
-   welche nächsten Schritte sinnvoll sind,
-   wann eine fachliche oder rechtliche Prüfung erforderlich ist.

Die Anwendung ist **kein Rechtsberatungs-, Compliance- oder
Zertifizierungssystem**. Sie darf keine endgültige rechtliche Einordnung
oder verbindliche Konformität behaupten.

------------------------------------------------------------------------

## 2. Grundprinzip

Die Anwendung arbeitet mit zwei klar getrennten Bewertungswegen:

### A. Regelbasierte Bewertung

Eine deterministische Backend-Logik wertet strukturierte Angaben aus und
erzeugt nachvollziehbare Findings, Prioritäten und nächste Schritte.

Die Regeln müssen:

-   serverseitig ausgeführt werden,
-   klar strukturiert sein,
-   testbar sein,
-   erweiterbar sein,
-   versioniert werden,
-   nachvollziehbare Ergebnisse liefern.

**Die Regel-Logik ist die fachliche Grundlage der Bewertung.**

### B. LLM-gestützte Ergänzung

Ein LLM erhält die strukturierten Angaben und die Ergebnisse der
Regel-Logik.

Das LLM darf:

-   wesentliche Risiken verständlich erklären,
-   offene Fragen formulieren,
-   empfohlene nächste Schritte verständlich erläutern,
-   die regelbasierte Bewertung in Geschäftssprache zusammenfassen.

Das LLM darf **nicht**:

-   eigenständig eine verbindliche Rechts- oder Compliance-Einstufung
    erzeugen,
-   die Regel-Logik ersetzen,
-   unbegründete neue Risiken erfinden,
-   behaupten, dass ein System rechtlich konform oder nicht konform ist.

Die Oberfläche muss klar unterscheiden zwischen:

-   **regelbasierten Ergebnissen**
-   **LLM-generierten Erklärungen**

Ein Ausfall des LLM darf die regelbasierte Bewertung nicht unbrauchbar
machen.

------------------------------------------------------------------------

## 3. Nutzerperspektive

Der typische Nutzer ist kein Entwickler und kein Jurist.

Der Ablauf soll möglichst einfach sein:

1.  Nutzer öffnet die Anwendung.
2.  Nutzer legt ein KI-System an oder öffnet einen Demo-Fall.
3.  Nutzer beantwortet einen verständlichen Fragebogen.
4.  Das Backend validiert die Angaben.
5.  Die Regel-Logik erstellt eine erste Einschätzung.
6.  Optional bzw. zusätzlich ergänzt das LLM die Ergebnisse in
    verständlicher Geschäftssprache.
7.  Die Anwendung zeigt eine übersichtliche Ergebnisansicht.
8.  Nutzer sieht Gründe, Prioritäten, offene Punkte und nächste
    Schritte.
9.  Eine Bewertung kann später nachvollzogen bzw. neu durchgeführt
    werden.

Die Oberfläche soll **klar, ruhig, vertrauenswürdig und
entscheidungsorientiert** wirken.

------------------------------------------------------------------------

## 4. Zu erfassende Informationen

Ein KI-System muss mindestens folgende Informationen erfassen.

### Grunddaten

-   Name
-   kurze Beschreibung
-   Fachbereich
-   Status:
    -   Idee
    -   Pilot
    -   produktiv

### Zweck

-   welches Problem löst das System?
-   welchen Prozess unterstützt es?

### KI-Einsatz

-   Art der KI
-   Anbieter bzw. Modell
-   interne oder externe Nutzung

### Betroffene Personen

-   Mitarbeiter
-   Kunden
-   Bewerber
-   Öffentlichkeit
-   keine externen Personen

### Entscheidung

Das System:

-   informiert nur,
-   unterstützt Entscheidungen,
-   priorisiert oder beeinflusst Entscheidungen,
-   trifft Entscheidungen teilweise oder vollständig automatisiert.

### Daten

Es werden verarbeitet:

-   keine relevanten personenbezogenen Daten,
-   personenbezogene Daten,
-   besonders schützenswerte Daten,
-   vertrauliche Unternehmensdaten.

Zusätzlich soll relevant sein, ob Daten an einen externen KI-Anbieter
übertragen werden.

### Kontrolle

-   menschliche Prüfung
-   Freigaben
-   Output-Kontrollen
-   Protokollierung
-   Eingriffsmöglichkeit / Eskalationsweg, soweit relevant

### Transparenz

-   interagieren Menschen direkt mit KI?
-   werden KI-generierte Inhalte veröffentlicht?
-   gibt es einen entsprechenden Hinweis auf KI-Nutzung?

### Verantwortung

-   fachlich verantwortliche Person / Rolle
-   Schulungen
-   klare Nutzungsregeln

Der Fragebogen soll nur relevante Folgefragen stellen und unnötige
Komplexität vermeiden.

------------------------------------------------------------------------

## 5. Ergebnisansicht

Nach einer Bewertung müssen mindestens sichtbar sein:

### Gesamteinschätzung

Eine der folgenden Kategorien:

-   unauffällig
-   Handlungsbedarf
-   Prüfung erforderlich

Die Kategorien dürfen nicht ausschließlich durch Farben vermittelt
werden.

### Wichtigste Gründe

Die wesentlichen regelbasierten Findings müssen verständlich dargestellt
werden.

### Nächste Schritte

Konkrete Maßnahmen mit Priorität, z. B.:

-   hoch
-   mittel
-   niedrig

### Offene / fehlende Informationen

Nicht bekannte Angaben müssen ausdrücklich sichtbar sein.

### Widersprüchliche Informationen

Wenn Angaben sich widersprechen, darf keine scheinbar sichere Bewertung
erzeugt werden.

Stattdessen:

-   Widerspruch anzeigen,
-   betroffene Angaben nennen,
-   Klärung verlangen,
-   bei Bedarf Bewertung als nicht sicher einstufbar behandeln.

### Fachliche / rechtliche Prüfung

Wenn eine solche Prüfung erforderlich ist, muss dies klar und
unmissverständlich angezeigt werden.

### Nachvollziehbarkeit

Jede Bewertung enthält mindestens:

-   Zeitpunkt der Bewertung
-   verwendete Regelversion

Zusätzlich soll die Grundlage der Bewertung nachvollziehbar bleiben.

------------------------------------------------------------------------

## 6. Umgang mit fehlenden und widersprüchlichen Angaben

Das System darf Unwissen nicht als Sicherheit behandeln.

Es muss zwischen mindestens folgenden Zuständen unterscheiden können:

-   bekannt
-   unbekannt / nicht angegeben
-   widersprüchlich

Beispiel:

Wenn angegeben wird:

-   KI trifft Entscheidungen vollständig automatisiert
-   gleichzeitig menschliche Kontrolle vorhanden

muss dies erkannt und transparent gemacht werden, sofern die Angaben
nicht eindeutig zusammenpassen.

Grundsatz:

> Keine ausreichenden Informationen = keine sichere Aussage.

------------------------------------------------------------------------

## 7. Regelbasierte Bewertung

Die Regeln bilden die primäre Bewertungslogik.

Beispiele:

### Transparenz

Wenn externe Personen direkt mit einem KI-Chatbot interagieren und kein
Hinweis auf KI-Nutzung dokumentiert ist:

-   Transparenzprüfung erforderlich
-   entsprechende Maßnahme erzeugen

### Bewerberauswahl

Wenn KI Bewerbungen priorisiert oder vorsortiert:

-   fachliche bzw. rechtliche Prüfung erforderlich
-   keine endgültige automatische rechtliche Einordnung behaupten

### Externer Anbieter + sensible Daten

Wenn personenbezogene oder vertrauliche Daten an einen externen
KI-Anbieter gelangen und Freigaben bzw. Kontrollen unklar sind:

-   Datenschutzprüfung
-   Anbieterprüfung
-   Freigabeprüfung

### Entscheidungen über Personen

Wenn KI Entscheidungen über Personen beeinflusst und menschliche
Kontrolle fehlt:

-   menschliche Prüfung definieren
-   Eingriffsmöglichkeit definieren
-   Eskalationsweg definieren

### Schulung

Wenn Mitarbeiter KI verwenden und Schulung bzw. klare Nutzungsregeln
fehlen:

-   Schulung planen
-   verbindliche Nutzungsregeln definieren

### Fehlende / widersprüchliche Angaben

Wenn wesentliche Informationen fehlen oder sich widersprechen:

-   keine sichere Aussage treffen
-   offene Punkte klar ausweisen

Die Regeln dürfen nicht ausschließlich im Frontend implementiert sein.

------------------------------------------------------------------------

## 8. Architekturprinzipien

Für den Prototyp wird eine einfache Fullstack-Architektur bevorzugt.

Vorläufiger Stack:

-   Next.js
-   TypeScript
-   Prisma
-   PostgreSQL
-   LLM API

Ein separater Express-Server ist zunächst nicht erforderlich.

Die Anwendung soll Frontend und serverseitige Logik in einem klar
strukturierten Projekt vereinen.

### Verantwortlichkeiten

Frontend:

-   Formulare
-   UX
-   Ergebnisdarstellung
-   Demo-Auswahl
-   API-Kommunikation

Backend:

-   Servervalidierung
-   KI-Systeme speichern
-   Evaluationen erstellen
-   Rule Engine ausführen
-   LLM aufrufen
-   Ergebnisse speichern
-   Fehlerbehandlung

Rule Engine:

-   deterministische Bewertung
-   Findings
-   Prioritäten
-   Maßnahmen
-   fehlende Informationen
-   Gesamtstatus

LLM:

-   verständliche Erklärung
-   Zusammenfassung
-   offene Fragen
-   Erklärung nächster Schritte

Database:

-   KI-Systeme
-   Bewertungen
-   Eingabe-Snapshots
-   Rule-Version
-   Zeitstempel
-   regelbasierte Ergebnisse
-   LLM-Ergebnisse

------------------------------------------------------------------------

## 9. Evaluation und Nachvollziehbarkeit

Eine Bewertung soll nicht nur ein flüchtiges API-Ergebnis sein.

Eine Evaluation muss mindestens nachvollziehbar machen:

-   welches KI-System bewertet wurde,
-   welche Eingaben zum Bewertungszeitpunkt vorlagen,
-   welche Regelversion verwendet wurde,
-   wann die Bewertung durchgeführt wurde,
-   welches Ergebnis die Rule Engine erzeugt hat,
-   welche LLM-Ergänzung erzeugt wurde.

Ein Input-Snapshot soll verhindern, dass historische Bewertungen nach
Änderungen am KI-System oder an Regeln nicht mehr nachvollziehbar sind.

Neubewertungen müssen als neue Bewertung nachvollziehbar bleiben.

------------------------------------------------------------------------

## 10. LLM-Regeln

LLM-Aufrufe erfolgen ausschließlich über das Backend.

API Keys und Secrets dürfen niemals:

-   im Frontend,
-   in Client-Code,
-   im Repository,
-   in Demo-Daten

liegen.

Das LLM erhält keine echten personenbezogenen Daten.

Für Demo und Entwicklung werden ausschließlich fiktive Daten verwendet.

Das Prompting muss das LLM ausdrücklich darauf beschränken:

-   keine Rechtsberatung,
-   keine verbindlichen Compliance-Aussagen,
-   keine endgültige Klassifizierung,
-   keine Ersetzung der Regel-Logik,
-   keine erfundenen Fakten.

LLM-Ausgaben müssen serverseitig kontrolliert und für die erwartete
Struktur validiert werden.

Fehlerfälle müssen berücksichtigt werden:

-   Timeout
-   API-Fehler
-   Rate Limit
-   ungültige Antwort
-   Provider nicht erreichbar

Wenn das LLM nicht verfügbar ist, muss die regelbasierte Bewertung
weiterhin funktionieren.

Kostenkontrolle soll berücksichtigt werden, z. B. durch begrenzte
Eingaben, kompakte Prompts und Vermeidung unnötiger Aufrufe.

------------------------------------------------------------------------

## 11. Sicherheit

Mindestens folgende Maßnahmen müssen berücksichtigt werden:

-   Server-side validation aller relevanten Eingaben
-   keine vertrauenswürdige Geschäftslogik ausschließlich im Browser
-   Schutz gegen typische XSS-Angriffe
-   sichere Verarbeitung von User Input
-   Schutz gegen Injection
-   Secrets nur serverseitig
-   keine API Keys im Repository
-   keine sensiblen Demo-Daten an das LLM
-   ausschließlich fiktive Daten
-   klare Fehlerbehandlung
-   keine scheinbar sicheren Aussagen bei fehlenden Informationen

Eine vollständige Enterprise-Security-Lösung ist nicht erforderlich.

Wichtig ist, relevante Risiken zu erkennen, angemessene Schutzmaßnahmen
umzusetzen und verbleibende Grenzen offen zu dokumentieren.

------------------------------------------------------------------------

## 12. Demo-Fälle

Mindestens drei Demo-Fälle müssen vorhanden sein.

### Kundenservice-Chatbot

-   generative KI auf einer Website
-   Kunden interagieren direkt mit dem System
-   kein dokumentierter Hinweis auf KI-Nutzung
-   Antworten werden nicht vorab durch Menschen geprüft

### CV-Vorsortierung

-   KI priorisiert eingehende Bewerbungen
-   Bewerberdaten werden verarbeitet
-   finale Entscheidung trifft ein Mensch
-   Qualitäts- oder Bias-Prüfungen sind nicht dokumentiert

### Interner Vertriebs-Copilot

-   Mitarbeiter erstellen Angebotsentwürfe und Kundenkommunikation
-   externer KI-Anbieter
-   Kundendaten könnten in Eingaben enthalten sein
-   Schulung, Freigabeprozess und Nutzungsregeln sind unklar

Die Demo-Daten müssen vollständig fiktiv sein.

------------------------------------------------------------------------

## 13. EU AI Act

Die Anwendung berücksichtigt nur die für dieses Testprojekt relevanten
Aspekte und erhebt keinen Anspruch auf vollständige Abdeckung des EU AI
Act.

Besonders relevant:

-   Transparenz bei Interaktion mit KI und KI-generierten Inhalten
-   AI literacy / Schulung
-   menschliche Kontrolle bei KI-gestützten Entscheidungen
-   Dokumentation und Nachvollziehbarkeit
-   Grenzen automatisierter rechtlicher Einschätzungen

Für die Recherche und Dokumentation sollen bevorzugt offizielle
EU-Quellen verwendet werden.

Der zugrunde gelegte Rechtsstand muss im README mit Datum dokumentiert
werden.

Die Anwendung darf aus diesen Informationen keine vollständige
automatische Rechtsberatung oder verbindliche Compliance-Bewertung
ableiten.

------------------------------------------------------------------------

## 14. Was ausdrücklich nicht Teil des MVP ist

Nicht ohne konkreten Bedarf implementieren:

-   Benutzerregistrierung
-   Login / Passwortsystem
-   Rollen- und Rechteverwaltung
-   Multi-Tenancy
-   komplexe Administration
-   vollständiger EU-AI-Act-Classifier
-   vollständiger GDPR-Compliance-Checker
-   juristischer Chatbot
-   umfangreiche Microservice-Infrastruktur
-   unnötige Enterprise-Infrastruktur

Der Fokus liegt auf einem klaren, sauberen und lokal reproduzierbaren
Prototyp.

------------------------------------------------------------------------

## 15. Qualitätsprinzipien

Das Projekt soll folgende Prioritäten haben:

1.  Korrekte Umsetzung des fachlichen Konzepts
2.  Klare Trennung zwischen Rule Engine und LLM
3.  Nachvollziehbare Ergebnisse
4.  Saubere Servervalidierung und Sicherheitsmaßnahmen
5.  Verständliche Business-UX
6.  Testbarkeit der kritischen Logik
7.  Gute Dokumentation
8.  Kleine und kontrollierbare Architektur
9.  Keine unnötige Infrastruktur
10. Keine erfundenen technischen oder fachlichen Annahmen

Wenn Informationen für eine Implementierung fehlen, dürfen sie nicht
stillschweigend erfunden werden. Zuerst sollen vorhandene Anforderungen,
Dateien, APIs, Datenmodelle oder technische Vorgaben geprüft werden.

------------------------------------------------------------------------

## 16. Abgabe

Die finale Abgabe muss enthalten:

### Repository

Vollständiger und lauffähiger Code.

### README.md

Mindestens:

-   Setup
-   Architektur
-   Datenmodell
-   Backend
-   Oberfläche
-   Rule Engine
-   LLM-Anbindung
-   Sicherheitsmaßnahmen
-   Annahmen
-   Grenzen
-   EU-AI-Act-Quellen
-   zugrunde gelegener Rechtsstand

### AI_USAGE.md

Dokumentieren:

-   welche KI-Tools während der Entwicklung genutzt wurden,
-   wofür sie genutzt wurden,
-   welche Ergebnisse selbst überprüft wurden,
-   welche Ergebnisse angepasst oder verworfen wurden.

### Demo-Video

Maximal 8 Minuten.

Zeigen:

-   Anwendung anhand eines Demo-Falls
-   regelbasierte Bewertung
-   LLM-Ergänzung
-   mindestens eine Sicherheitsentscheidung
-   ein Beispiel, bei dem das System bewusst keine abschließende Aussage
    trifft

Automatisierte Tests für Rule Engine und kritische Validierungen sind
optional, aber ausdrücklich willkommen.

------------------------------------------------------------------------

## 17. Zentrale Architekturentscheidung

Der wichtigste Grundsatz des Projekts lautet:

> **Rules decide. LLM explains.**

Die Rule Engine ist deterministisch, nachvollziehbar, versionierbar und
testbar.

Das LLM ist eine unterstützende Schicht für verständliche
Geschäftssprache und darf die fachliche Grundlage der Bewertung не
заменять.

Das gesamte System soll zeigen не количество инфраструктуры, а качество
инженерных решений.
