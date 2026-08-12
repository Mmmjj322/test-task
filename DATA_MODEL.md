# KI-System-Check --- DATA_MODEL.md

## 1. Zweck

Dieses Dokument definiert das fachliche Datenmodell des
KI-System-Check-Prototyps.

Es beschreibt:

-   welche Daten die Anwendung über ein KI-System erfasst,
-   welche Daten für eine Evaluation benötigt werden,
-   welche Daten dauerhaft gespeichert werden,
-   wie historische Bewertungen nachvollziehbar bleiben,
-   wie Rule Engine und LLM voneinander getrennt werden.

Dieses Dokument ist die fachliche Grundlage für die spätere
Prisma-Schema-Definition.

------------------------------------------------------------------------

# 2. Grundprinzip

Die Anwendung unterscheidet strikt zwischen:

1.  **KI-System-Daten**
2.  **Evaluation Input Snapshot**
3.  **Rule-based Assessment**
4.  **LLM-generated Explanation**
5.  **Evaluation Metadata**

Eine Evaluation ist eine Momentaufnahme einer Bewertung zu einem
bestimmten Zeitpunkt.

Eine spätere Änderung des KI-Systems oder der Regeln darf eine bereits
gespeicherte Evaluation nicht rückwirkend verändern.

------------------------------------------------------------------------

# 3. Entity Overview

``` text
AISystem
   │
   ├── Evaluation
   │       ├── InputSnapshot
   │       ├── RuleAssessment
   │       └── LLMAssessment
   │
   └── Evaluation History
```

## Kern-Entities

### AISystem

Beschreibt das registrierte KI-System.

### Evaluation

Beschreibt eine konkrete Bewertung dieses KI-Systems.

### InputSnapshot

Enthält die exakten fachlichen Eingaben, die zum Zeitpunkt der
Evaluation bewertet wurden.

### RuleAssessment

Enthält ausschließlich das Ergebnis der deterministischen Rule Engine.

### LLMAssessment

Enthält ausschließlich die vom LLM erzeugte erklärende Ergänzung.

------------------------------------------------------------------------

# 4. AISystem

## 4.1 Identität

``` text
id
name
description
department
status
createdAt
updatedAt
```

### `id`

Eindeutige interne ID.

### `name`

Name des KI-Systems.

Beispiel:

``` text
Customer Service Chatbot
```

### `description`

Kurze verständliche Beschreibung.

### `department`

Fachbereich, in dem das System eingesetzt wird.

### `status`

Erlaubte Werte:

``` text
IDEA
PILOT
PRODUCTION
```

UI labels:

``` text
Idee
Pilot
Produktiv
```

------------------------------------------------------------------------

# 5. Purpose

Das Datenmodell muss den Zweck des Systems beschreiben.

``` text
purpose
process
```

### `purpose`

Welches Problem löst das KI-System?

### `process`

Welchen Prozess unterstützt das System?

Beispiele:

``` text
Customer service
Recruiting
Sales communication
Document analysis
```

Freitext ist zulässig, da der geschäftliche Zweck nicht vollständig
durch feste Kategorien beschrieben werden kann.

------------------------------------------------------------------------

# 6. AI Usage

``` text
aiType
provider
model
usageType
```

## `aiType`

Beispielhafte Kategorien:

``` text
GENERATIVE
PREDICTIVE
CLASSIFICATION
RECOMMENDATION
CONVERSATIONAL
OTHER
UNKNOWN
```

Die konkrete Liste soll klein bleiben und nur für die Bewertung
relevante Unterschiede abbilden.

## `provider`

Anbieter des KI-Systems bzw. Modells.

Beispiele:

``` text
OpenAI
Microsoft
Google
Internal
Unknown
```

## `model`

Optionaler Modellname.

Beispiel:

``` text
GPT-...
```

Die Anwendung darf keine Modellnamen erfinden.

Wenn unbekannt:

``` text
UNKNOWN
```

## `usageType`

``` text
INTERNAL
EXTERNAL
BOTH
UNKNOWN
```

Hier wird beschrieben, ob das System ausschließlich intern, mit externen
Personen oder mit beiden Gruppen verwendet wird.

------------------------------------------------------------------------

# 7. Affected Persons

Ein KI-System kann mehrere Personengruppen betreffen.

``` text
affectedPersons[]
```

Erlaubte Werte:

``` text
EMPLOYEES
CUSTOMERS
APPLICANTS
PUBLIC
NONE
UNKNOWN
```

Es handelt sich um eine Mehrfachauswahl.

Beispiel:

``` text
[
  CUSTOMERS,
  PUBLIC
]
```

`NONE` darf nicht gleichzeitig mit anderen konkreten Personengruppen
gesetzt werden.

Wenn keine belastbare Angabe vorliegt:

``` text
UNKNOWN
```

------------------------------------------------------------------------

# 8. Decision Impact

Die Anwendung muss unterscheiden, wie stark KI Entscheidungen
beeinflusst.

``` text
decisionType
```

Erlaubte Werte:

``` text
INFORMATION_ONLY
DECISION_SUPPORT
PRIORITIZATION
PARTIALLY_AUTOMATED
FULLY_AUTOMATED
UNKNOWN
```

## Bedeutung

### INFORMATION_ONLY

Das System liefert Informationen, trifft oder beeinflusst aber keine
Entscheidung.

### DECISION_SUPPORT

Das System unterstützt einen Menschen bei einer Entscheidung.

### PRIORITIZATION

Das System priorisiert, sortiert oder rankt Fälle bzw. Personen.

### PARTIALLY_AUTOMATED

Ein Teil der Entscheidung oder des Entscheidungsprozesses wird
automatisiert durchgeführt.

### FULLY_AUTOMATED

Die Entscheidung wird ohne vorgesehenen menschlichen
Entscheidungsschritt automatisiert getroffen.

### UNKNOWN

Die Angaben reichen nicht für eine sichere Einordnung.

------------------------------------------------------------------------

# 9. Data Categories

Ein System kann mehrere Datenkategorien verarbeiten.

``` text
dataCategories[]
```

Erlaubte Werte:

``` text
NO_PERSONAL_DATA
PERSONAL_DATA
SPECIAL_CATEGORY_DATA
CONFIDENTIAL_BUSINESS_DATA
UNKNOWN
```

`NO_PERSONAL_DATA` bedeutet nicht automatisch, dass keinerlei
vertrauliche Unternehmensdaten verarbeitet werden.

Deshalb wird `CONFIDENTIAL_BUSINESS_DATA` separat erfasst.

### Regeln

`NO_PERSONAL_DATA` darf zusammen mit:

``` text
CONFIDENTIAL_BUSINESS_DATA
```

auftreten.

`NO_PERSONAL_DATA` darf nicht gleichzeitig mit:

``` text
PERSONAL_DATA
SPECIAL_CATEGORY_DATA
```

gesetzt werden.

Wenn die Situation nicht bekannt ist:

``` text
UNKNOWN
```

------------------------------------------------------------------------

# 10. External Data Transfer

Da ein externer KI-Anbieter für die Risikobewertung relevant sein kann,
muss die Datenübertragung separat modelliert werden.

``` text
dataTransferredToExternalProvider
```

Erlaubte Werte:

``` text
YES
NO
UNKNOWN
```

Das Feld ist insbesondere relevant, wenn:

``` text
usageType = EXTERNAL
```

oder

``` text
provider != INTERNAL
```

oder sensible Daten verarbeitet werden.

------------------------------------------------------------------------

# 11. Human Control

Menschliche Kontrolle wird als eigener Bereich modelliert.

``` text
humanReview
approvalProcess
outputControl
logging
interventionAvailable
escalationProcess
```

## `humanReview`

``` text
YES
NO
UNKNOWN
```

## `approvalProcess`

``` text
YES
NO
UNKNOWN
```

## `outputControl`

``` text
YES
NO
UNKNOWN
```

## `logging`

``` text
YES
NO
UNKNOWN
```

## `interventionAvailable`

``` text
YES
NO
UNKNOWN
```

## `escalationProcess`

``` text
YES
NO
UNKNOWN
```

Nicht jedes Feld ist für jedes System zwingend relevant.

Die Rule Engine entscheidet, welche Informationen im jeweiligen Kontext
relevant sind.

------------------------------------------------------------------------

# 12. Transparency

``` text
directHumanInteraction
aiUsageNotice
aiGeneratedContentPublished
contentHumanReviewed
```

## `directHumanInteraction`

``` text
YES
NO
UNKNOWN
```

Zeigt, ob Menschen direkt mit dem KI-System interagieren.

## `aiUsageNotice`

``` text
YES
NO
UNKNOWN
NOT_APPLICABLE
```

Zeigt, ob ein entsprechender Hinweis auf die KI-Nutzung vorhanden ist.

## `aiGeneratedContentPublished`

``` text
YES
NO
UNKNOWN
```

Zeigt, ob KI-generierte Inhalte veröffentlicht werden.

## `contentHumanReviewed`

``` text
YES
NO
UNKNOWN
NOT_APPLICABLE
```

Zeigt, ob veröffentlichte KI-Inhalte vor Veröffentlichung menschlich
geprüft bzw. redaktionell kontrolliert werden.

Die Rule Engine muss zwischen unterschiedlichen Transparenzsituationen
unterscheiden und darf nicht aus `aiUsageNotice = NO` allein pauschal
einen Rechtsverstoß ableiten.

------------------------------------------------------------------------

# 13. Responsibility

``` text
responsibleRole
trainingProvided
usageRulesDefined
```

## `responsibleRole`

Fachlich verantwortliche Person oder Rolle.

Es wird bewusst zunächst eine Rolle statt einer persönlichen Identität
gespeichert.

Beispiele:

``` text
Head of Customer Service
HR Lead
AI Product Owner
```

## `trainingProvided`

``` text
YES
NO
UNKNOWN
```

## `usageRulesDefined`

``` text
YES
NO
UNKNOWN
```

------------------------------------------------------------------------

# 14. Assessment Input

Für die Bewertung wird aus den AISystem-Daten ein normalisiertes
Input-Modell erzeugt.

Konzeptionell:

``` text
EvaluationInput
├── system
├── purpose
├── aiUsage
├── affectedPersons
├── decisionImpact
├── data
├── humanControl
├── transparency
└── responsibility
```

Die Rule Engine arbeitet mit diesem normalisierten Input und nicht
direkt mit UI-State.

------------------------------------------------------------------------

# 15. Input Snapshot

Jede Evaluation speichert einen unveränderlichen Snapshot der fachlichen
Eingaben.

Konzeptionell:

``` text
InputSnapshot
{
  system: {...},
  purpose: {...},
  aiUsage: {...},
  affectedPersons: [...],
  decisionImpact: {...},
  data: {...},
  humanControl: {...},
  transparency: {...},
  responsibility: {...}
}
```

Der Snapshot kann in PostgreSQL als JSON/JSONB gespeichert werden.

Der Snapshot ist kein Ersatz für die normalisierten AISystem-Spalten.

Er dient der historischen Reproduzierbarkeit einer konkreten Evaluation.

------------------------------------------------------------------------

# 16. Evaluation

``` text
Evaluation
├── id
├── aiSystemId
├── ruleVersion
├── evaluatedAt
├── inputSnapshot
├── overallStatus
├── professionalReviewRequired
├── ruleAssessment
├── llmAssessment
├── llmStatus
└── createdAt
```

## `overallStatus`

Wird ausschließlich aus der Rule Engine übernommen.

``` text
UNREMARKABLE
ACTION_REQUIRED
REVIEW_REQUIRED
```

Das LLM darf diesen Wert nicht verändern.

------------------------------------------------------------------------

# 17. Professional Review

``` text
professionalReviewRequired
```

Erlaubte Werte:

``` text
YES
NO
UNKNOWN
```

Wichtig:

Dieses Feld bedeutet nicht:

> "Das System ist rechtswidrig."

Es bedeutet:

> "Die vorhandenen Informationen bzw. die regelbasierten Kriterien
> sprechen dafür, dass eine fachliche oder rechtliche Prüfung
> erforderlich ist."

------------------------------------------------------------------------

# 18. Rule Assessment

Die Rule Engine liefert ein strukturiertes Ergebnis.

``` text
RuleAssessment
├── status
├── findings[]
├── actions[]
├── missingInformation[]
├── contradictions[]
├── professionalReviewRequired
└── ruleVersion
```

------------------------------------------------------------------------

# 19. Rule Finding

Ein Finding beschreibt einen festgestellten Punkt.

``` text
Finding
├── ruleId
├── category
├── severity
├── title
├── description
└── evidence[]
```

## `ruleId`

Stabile ID des angewendeten Rules.

## `category`

Beispiel:

``` text
TRANSPARENCY
HUMAN_OVERSIGHT
DATA
GOVERNANCE
TRAINING
DOCUMENTATION
UNCERTAINTY
```

## `severity`

``` text
INFO
LOW
MEDIUM
HIGH
CRITICAL
```

`CRITICAL` sollte im MVP nur sehr sparsam verwendet werden.

## `evidence`

Strukturierte Hinweise darauf, welche Eingaben das Finding ausgelöst
haben.

Beispiel:

``` text
[
  "directHumanInteraction = YES",
  "aiUsageNotice = NO"
]
```

Evidence darf keine erfundenen Informationen enthalten.

------------------------------------------------------------------------

# 20. Action

Eine Action ist eine konkrete nächste Maßnahme.

``` text
Action
├── actionId
├── title
├── description
├── priority
├── sourceRuleId
└── rationale
```

## Priority

``` text
HIGH
MEDIUM
LOW
```

Die Priority wird deterministisch durch die Rule Engine vergeben.

Das LLM darf die Priority nicht neu bestimmen.

------------------------------------------------------------------------

# 21. Missing Information

``` text
MissingInformation
├── field
├── category
├── importance
└── description
```

Importance:

``` text
REQUIRED
IMPORTANT
OPTIONAL
```

`REQUIRED` bedeutet, dass ohne diese Information eine belastbare
Einschätzung für den entsprechenden Bereich nicht möglich ist.

------------------------------------------------------------------------

# 22. Contradiction

``` text
Contradiction
├── contradictionId
├── fields[]
├── description
└── severity
```

Beispiel:

``` text
decisionType = FULLY_AUTOMATED
humanReview = YES
```

Wenn die Kombination im konkreten Kontext nicht eindeutig ist, wird ein
Widerspruch erzeugt.

------------------------------------------------------------------------

# 23. LLM Assessment

Das LLM-Ergebnis ist vollständig von der Rule Assessment getrennt.

``` text
LLMAssessment
├── status
├── summary
├── riskExplanation[]
├── openQuestions[]
├── nextStepsExplanation[]
├── generatedAt
├── provider
└── model
```

## `status`

``` text
SUCCESS
FAILED
SKIPPED
```

Bei `FAILED` darf die Evaluation trotzdem erfolgreich sein.

------------------------------------------------------------------------

# 24. LLM Summary

Kurze verständliche Zusammenfassung der regelbasierten Ergebnisse.

Beispiel:

``` text
Das System wird direkt von Kunden genutzt. Ein dokumentierter Hinweis auf die KI-Nutzung ist derzeit nicht vorhanden. Zusätzlich fehlt eine dokumentierte menschliche Kontrolle der Antworten.
```

Die Zusammenfassung muss auf den Rule Findings basieren.

------------------------------------------------------------------------

# 25. LLM Risk Explanation

Das LLM erklärt bereits identifizierte Findings in Business-Sprache.

Es darf keine neue fachliche Bewertung erzeugen.

Beispiel:

``` text
Das Fehlen eines Transparenzhinweises sollte geprüft werden, da Kunden direkt mit dem System interagieren.
```

------------------------------------------------------------------------

# 26. LLM Open Questions

Das LLM kann aus bekannten Missing Information verständliche Fragen
formulieren.

Beispiel:

``` text
Wer trägt die fachliche Verantwortung für das System?
```

Die zugrunde liegende fehlende Information muss bereits aus dem Rule
Engine Result stammen.

------------------------------------------------------------------------

# 27. LLM Next Steps Explanation

Das LLM darf die bereits durch Rules bestimmten Maßnahmen verständlich
erläutern.

Es darf keine neue Priorität oder Maßnahme erfinden.

------------------------------------------------------------------------

# 28. LLM Metadata

Für Nachvollziehbarkeit können gespeichert werden:

``` text
provider
model
generatedAt
status
```

Optional können technische Nutzungsdaten gespeichert werden, sofern sie
für Kostenkontrolle oder Debugging sinnvoll sind.

Keine Secrets speichern.

------------------------------------------------------------------------

# 29. Demo Data

Demo-Systeme werden als normale AISystem-Daten behandelt.

Es gibt keine separate Evaluation-Logik für Demo-Fälle.

``` text
Demo Data
   ↓
AISystem
   ↓
Evaluation
   ↓
Rule Engine
   ↓
LLM
```

Die drei vorgeschriebenen Fälle:

``` text
CUSTOMER_SERVICE_CHATBOT
CV_SCREENING
SALES_COPILOT
```

verwenden ausschließlich fiktive Daten.

------------------------------------------------------------------------

# 30. Historical Integrity

Eine historische Evaluation muss mindestens reproduzierbar machen:

``` text
inputSnapshot
ruleVersion
evaluatedAt
ruleAssessment
llmAssessment
```

Wenn eine neue Rule Version veröffentlicht wird, werden alte
Evaluationen nicht neu berechnet.

------------------------------------------------------------------------

# 31. Data Ownership

``` text
AISystem
    owns
    └── Evaluations

Evaluation
    owns
    ├── InputSnapshot
    ├── RuleAssessment
    └── LLMAssessment
```

Das Löschen eines AISystems muss im finalen Implementierungsplan bewusst
behandelt werden.

Für den MVP ist kein komplexes Soft-Delete-System erforderlich, sofern
es nicht für die gewählte Datenbankstrategie notwendig ist.

------------------------------------------------------------------------

# 32. Data Model Rules

Folgende Grundregeln gelten:

1.  Unbekannte Informationen werden als `UNKNOWN` bzw. explizit fehlend
    modelliert.
2.  `null` und `UNKNOWN` dürfen nicht semantisch beliebig vermischt
    werden.
3.  Keine Daten werden automatisch als sicher angenommen.
4.  Rule Results werden nicht aus LLM-Text rekonstruiert.
5.  LLM Results werden nicht als fachliche Fakten gespeichert.
6.  Historische Evaluationen bleiben unverändert.
7.  Rule Version gehört zu jeder Evaluation.
8.  Input Snapshot gehört zu jeder Evaluation.
9.  Demo-Daten sind vollständig fiktiv.
10. Keine personenbezogenen Echt-Daten für das Testprojekt.

------------------------------------------------------------------------

# 33. Source of Truth

Für unterschiedliche Informationen gelten unterschiedliche Sources of
Truth:

  Information           Source of Truth
  --------------------- -----------------------------
  User input            Evaluation Input / Snapshot
  Overall status        Rule Engine
  Finding               Rule Engine
  Action                Rule Engine
  Priority              Rule Engine
  Missing information   Rule Engine
  Contradiction         Rule Engine
  LLM summary           LLM
  LLM explanation       LLM
  Rule version          Rule Engine configuration
  Evaluation time       Server
  Historical state      Input Snapshot

Wichtig:

> **LLM text is not source of truth for the assessment.**

------------------------------------------------------------------------

# 34. Prisma Mapping

Das endgültige Prisma-Modell wird erst nach Abschluss von `RULES.md` und
`API.md` implementiert.

Die fachlichen Entities sind jedoch bereits festgelegt:

``` text
AISystem
Evaluation
```

Zusätzliche Ergebnisse können zunächst als JSON/JSONB innerhalb von
Evaluation gespeichert werden.

Eine Normalisierung einzelner Findings/Actions in eigene Tabellen ist
nur erforderlich, wenn dies für Abfragen oder zukünftige Funktionen
tatsächlich gebraucht wird.

Für den MVP soll die Datenbank nicht unnötig komplex werden.
