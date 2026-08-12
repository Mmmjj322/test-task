# KI-System-Check

## Kurzbeschreibung
Ein lokaler Prototyp für die Erfassung und Bewertung einzelner KI-Systeme. Die Anwendung kombiniert eine deterministische Regel-Logik mit einer optionalen LLM-Ergänzung, um Entscheidern eine verständliche erste Einschätzung zu geben.

## Funktionalität
- Fragebogen zur Erfassung von KI-Systemen
- Regelbasierte Bewertung mit nachvollziehbaren Findings und Maßnahmen
- Optionale LLM-Erklärung in verständlicher Geschäftssprache
- Ergebnisansicht mit Gesamtstatus, Begründung, nächsten Schritten und offenen Punkten
- Speicherung von Bewertungen inklusive Regelversion und Zeitstempel
- Demo-Fälle für typische Anwendungsfälle

## Technik
- Next.js mit React und TypeScript
- Prisma + SQLite für Speicherung
- Zod für Server-Validierung
- Vitest für Regel- und Validierungs-Tests
- Optionales Gemini-LLM über ein Backend

## Setup
1. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
2. Datenbank anlegen:
   ```bash
   npx prisma db push
   ```
3. Optional: LLM aktivieren
   ```bash
   set GEMINI_API_KEY=your-key
   ```
4. Starten:
   ```bash
   npm run dev
   ```

## Architektur
- Das Frontend besteht aus einem mehrstufigen Fragebogen und einer Ergebnisansicht.
- Die API-Endpunkte liegen unter app/api und leiten Eingaben an die Anwendungslogik weiter.
- Die Bewertung wird in server/application/evaluations/service.ts orchestriert.
- Die Regel-Logik liegt in server/domain/rules/engine.ts und ist bewusst getrennt vom LLM.
- Die LLM-Anbindung ist in server/infrastructure/llm/provider.ts umgesetzt und wird nur als sekundäre Erklärung verwendet.

## Sicherheitsmaßnahmen
- Eingaben werden serverseitig mit Zod validiert.
- Kritische Prüfungen laufen im Backend und nicht nur im Browser.
- Keine Secrets werden im Repository oder im Frontend gespeichert.
- Die LLM-Anbindung verwendet kein Backend-Frontend-Weiterreichen von sensiblen Demo-Daten; nur strukturierte, minimierte Kontextdaten werden übergeben.
- Fiktive Demo-Daten werden verwendet.

## Annahmen und Grenzen
- Die Bewertung ist ein Governance-Prototyp und keine Rechtsberatung.
- Die Regel-Logik ist bewusst nicht vollständig; sie soll nachvollziehbar und erweiterbar sein.
- Eine vollständige EU-AI-Act-Abdeckung ist nicht Ziel dieses Prototyps.
- Eine finale Rechts- oder Compliance-Einschätzung erfordert fachliche Prüfung.

## Quellen
- Regulation (EU) 2024/1689 (EU AI Act)
- European Commission guidance on transparency obligations under the AI Act
- Relevant official EU guidance on AI literacy and human oversight
