# RULES.md

# Deterministic Assessment Rules

## 1. Purpose

This document defines the deterministic rule engine of the KI-System-Check prototype.

The rule engine evaluates structured questionnaire data and produces:

* findings;
* risk signals;
* recommended actions;
* missing-information warnings;
* contradiction warnings;
* review requirements;
* an overall assessment status.

The deterministic rule engine is intentionally conservative.

It does **not** provide:

* legal advice;
* formal compliance certification;
* definitive AI Act classification;
* definitive GDPR assessment;
* a complete high-risk assessment;
* a complete prohibited-practice assessment.

Its purpose is to answer:

> What should the organisation investigate, clarify or do next?

---

# 2. Two Independent Assessment Layers

The application contains two independent assessment mechanisms:

```text
                    Questionnaire
                         │
             ┌───────────┴───────────┐
             │                       │
             ▼                       ▼
      DETERMINISTIC RULES          LLM
             │                       │
             │                       │
             ▼                       ▼
      Structured findings      Business explanation
             │                       │
             └───────────┬───────────┘
                         ▼
                  Combined Result
```

The two mechanisms must remain logically independent.

## 2.1 Deterministic assessment

The deterministic engine:

* uses only structured questionnaire data;
* executes predefined rules;
* produces predictable results;
* is testable;
* is versionable;
* does not require an LLM;
* must work if the LLM provider is unavailable.

The deterministic engine is the authoritative source for the application's rule-based findings.

## 2.2 LLM assessment

The LLM:

* receives the questionnaire data and deterministic findings;
* explains the results in understandable business language;
* summarizes important risks;
* explains open questions;
* helps formulate next steps;
* may identify ambiguities for human review.

The LLM must not replace the deterministic engine.

The LLM must not create a new legal classification independently.

The LLM must not override deterministic findings.

---

# 3. Rule Categories

Every rule must belong to one of the following categories.

```text
LEGAL_REQUIREMENT
LEGAL_RELEVANCE
GOVERNANCE_BEST_PRACTICE
INFORMATION_QUALITY
SECURITY_CONTROL
```

## 3.1 LEGAL_REQUIREMENT

Use only where the relevant legal requirement and its applicability are sufficiently established.

Example:

```text
Article 4 AI literacy
```

The application should still avoid declaring a legal violation unless all necessary facts are established.

## 3.2 LEGAL_RELEVANCE

Used when the facts indicate that a legal provision may become relevant and further assessment is required.

Example:

```text
Recruitment AI
→ Annex III / Article 6 may become relevant
→ further assessment required
```

## 3.3 GOVERNANCE_BEST_PRACTICE

Organisational recommendations that are useful but are not presented as direct statutory requirements.

Examples:

* responsible person missing;
* internal usage rules missing;
* provider approval unclear;
* output review process unclear.

## 3.4 INFORMATION_QUALITY

Used when the system cannot safely assess the situation because information is:

* missing;
* contradictory;
* unknown;
* incomplete.

## 3.5 SECURITY_CONTROL

Used for application-level security and data integrity.

Examples:

* invalid input;
* unsafe payload;
* missing server-side validation.

---

# 4. Assessment Status

The deterministic engine produces exactly one overall status.

```text
UNAUFFÄLLIG
HANDLUNGSBEDARF
PRÜFUNG_ERFORDERLICH
```

## 4.1 UNAUFFÄLLIG

Use when:

* no significant deterministic findings exist;
* required information is sufficiently complete;
* no unresolved contradiction exists;
* no specialist review is triggered.

Important:

`UNAUFFÄLLIG` does not mean:

```text
"compliant"
"legally safe"
"no risk exists"
```

It means:

> No significant issue was identified by this prototype's configured rules.

## 4.2 HANDLUNGSBEDARF

Use when:

* governance improvements are recommended;
* transparency should be reviewed;
* training should be improved;
* provider controls should be clarified;
* documentation should be improved.

## 4.3 PRÜFUNG_ERFORDERLICH

Use when:

* legal relevance is significant;
* high-risk classification may be relevant;
* potentially prohibited practices are indicated;
* material human-oversight concerns exist;
* important information is missing;
* contradictory information prevents a reliable conclusion.

`PRÜFUNG_ERFORDERLICH` takes precedence over `HANDLUNGSBEDARF`.

---

# 5. Rule Priority

Rules have priorities.

```text
P0 — Information integrity / critical uncertainty
P1 — Potential legal or specialist review
P2 — Material governance risk
P3 — Governance improvement
P4 — Informational recommendation
```

Priority determines ordering of findings.

It does not mean that a P3 finding is legally unimportant.

---

# 6. Information Completeness Rules

The engine must evaluate questionnaire completeness before making substantive conclusions.

## RULE-INFO-001 — Missing Essential Information

### Trigger

An essential questionnaire field is missing or explicitly unknown.

### Category

```text
INFORMATION_QUALITY
```

### Result

```text
status: PRÜFUNG_ERFORDERLICH
```

### Finding

```text
Wesentliche Informationen fehlen.
```

### Action

```text
Die fehlenden Angaben ergänzen, bevor eine belastbare Bewertung vorgenommen wird.
```

### Principle

The system must not convert unknown information into a safe assumption.

---

# 7. Contradiction Rules

## RULE-INFO-002 — Contradictory Answers

### Trigger

Two or more questionnaire answers contradict each other.

Example:

```text
directInteraction = false
```

but:

```text
transparencyDisclosure = false
```

is not necessarily a contradiction by itself.

A contradiction exists only where the domain logic explicitly defines one.

Example:

```text
humanOversight = "none"
```

and:

```text
humanApprovalRequired = true
```

### Category

```text
INFORMATION_QUALITY
```

### Result

```text
status: PRÜFUNG_ERFORDERLICH
```

### Finding

```text
Die Angaben sind widersprüchlich.
```

### Action

```text
Angaben überprüfen und vor der Bewertung klären.
```

---

# 8. AI Literacy

## RULE-AI-001 — Missing AI Training / Literacy Measures

### Trigger

AI is used by employees or other persons acting on behalf of the organisation.

AND:

```text
training = missing
```

OR:

```text
internalUsageRules = missing
```

### Category

```text
LEGAL_RELEVANCE
```

### Legal basis

```text
Article 4
```

Article 4 requires providers and deployers to take measures to ensure a sufficient level of AI literacy, taking into account factors such as technical knowledge, experience, education, training and context.

### Finding

```text
AI-Kompetenz und Nutzungsregeln sollten überprüft und gegebenenfalls verbessert werden.
```

### Action

```text
Schulung, klare Nutzungsregeln und Verantwortlichkeiten prüfen.
```

### Important

The rule must NOT output:

```text
"Article 4 violation."
```

unless a future version implements a sufficiently complete legal assessment.

---

# 9. Direct AI Interaction Transparency

## RULE-TRANSPARENCY-001 — Direct Interaction

### Trigger

```text
directInteraction = true
```

AND:

```text
aiDisclosure = false
```

or:

```text
aiDisclosure = unknown
```

### Category

```text
LEGAL_RELEVANCE
```

### Legal basis

```text
Article 50(1)
```

Article 50(1) addresses AI systems intended to interact directly with natural persons and requires the relevant persons to be informed that they are interacting with an AI system, subject to the provision's conditions and exception.

### Finding

```text
Transparenz bei der direkten Interaktion mit dem KI-System sollte geprüft werden.
```

### Action

```text
Prüfen, ob und wie Nutzer über die Interaktion mit dem KI-System informiert werden.
```

### Important

Do NOT automatically output:

```text
"Article 50 violation."
```

because applicability and exceptions require contextual assessment.

---

# 10. AI-Generated Content

## RULE-TRANSPARENCY-002 — Generated Content

### Trigger

The system generates:

```text
audio
image
video
text
```

AND the relevant Article 50 context may apply.

### Category

```text
LEGAL_RELEVANCE
```

### Finding

```text
Die Transparenz- und Kennzeichnungspflichten für KI-generierte Inhalte sollten geprüft werden.
```

### Action

```text
Art des erzeugten Inhalts, Veröffentlichungskontext und geltende Kennzeichnungspflichten prüfen.
```

### Important

The engine must NOT implement:

```text
AI-generated content
+
no human review
=
legal violation
```

Human review and Article 50 transparency are separate concepts.

The exact obligation depends on the type and context of the generated content.

---

# 11. Public AI-Generated Content

## RULE-TRANSPARENCY-003 — Public Publication

### Trigger

```text
contentPublishedPublicly = true
```

AND:

```text
aiGeneratedContent = true
```

### Category

```text
LEGAL_RELEVANCE
```

### Finding

```text
Bei öffentlich veröffentlichten KI-generierten Inhalten sollte die einschlägige Transparenz- und Kennzeichnungspflicht geprüft werden.
```

### Action

```text
Prüfen, ob für den konkreten Inhalt und Veröffentlichungskontext eine Kennzeichnung erforderlich ist.
```

### Important

Do not assume that every publicly published AI-generated text is subject to the same obligation.

---

# 12. Recruitment / Candidate Prioritisation

## RULE-HIGHRISK-001 — Recruitment AI

### Trigger

The system:

```text
affectsRecruitment = true
```

AND:

```text
candidatePrioritisation = true
```

or:

```text
candidateSelection = true
```

### Category

```text
LEGAL_RELEVANCE
```

### Legal basis

```text
Article 6
Annex III
```

### Result

```text
status: PRÜFUNG_ERFORDERLICH
```

### Finding

```text
Eine Prüfung der möglichen Einstufung als Hochrisiko-KI-System ist erforderlich.
```

### Action

```text
Anwendungsfall, Zweck, Einfluss auf Entscheidungen und weitere Voraussetzungen für die Hochrisiko-Einstufung fachlich prüfen.
```

### Important

The prototype must NOT automatically output:

```text
"This AI system is high-risk."
```

The deterministic engine only identifies a potentially relevant high-risk scenario.

Article 6 contains both the high-risk framework and conditions affecting whether certain Annex III systems fall within or outside the high-risk classification. Therefore classification must remain conservative.

---

# 13. Human Decision-Making

## RULE-HUMAN-001 — AI Influences Decisions About People

### Trigger

```text
decisionImpact = supports
```

or:

```text
decisionImpact = partiallyAutomated
```

or:

```text
decisionImpact = fullyAutomated
```

AND:

```text
affectedPersons != none
```

### Category

```text
LEGAL_RELEVANCE
```

### Finding

```text
Der Einfluss des KI-Systems auf Entscheidungen über Personen sollte besonders geprüft werden.
```

### Action

```text
Menschliche Kontrolle, Eingriffsmöglichkeiten, Verantwortlichkeiten und Eskalationswege dokumentieren.
```

---

# 14. Missing Human Oversight

## RULE-HUMAN-002 — No Human Control

### Trigger

```text
decisionImpact != informationOnly
```

AND:

```text
humanOversight = none
```

### Category

```text
LEGAL_RELEVANCE
```

### Priority

```text
P1
```

### Result

```text
status: PRÜFUNG_ERFORDERLICH
```

### Finding

```text
Menschliche Kontrolle bei entscheidungsrelevanter KI-Nutzung ist nicht erkennbar.
```

### Action

```text
Menschliche Prüfung, Eingriffsmöglichkeit und Eskalationsweg definieren und dokumentieren.
```

### Important

Do NOT automatically claim:

```text
"Article 14 violation."
```

Article 14 applies specifically to high-risk AI systems and contains detailed conditions. The prototype may identify the need for review without performing the complete legal test.

---

# 15. Personal Data

## RULE-DATA-001 — Personal Data

### Trigger

```text
personalData = true
```

### Category

```text
LEGAL_RELEVANCE
```

### Finding

```text
Die Verarbeitung personenbezogener Daten erfordert eine separate Datenschutzprüfung.
```

### Action

```text
Datenschutzgrundlage, Zweck, Datenminimierung, Zugriff, Speicherung und weitere relevante Datenschutzanforderungen prüfen.
```

### Important

The application is NOT a GDPR assessment tool.

Never output:

```text
"GDPR compliant"
```

or:

```text
"GDPR violation"
```

based only on this questionnaire.

---

# 16. Sensitive / Special Category Data

## RULE-DATA-002 — Sensitive Data

### Trigger

```text
specialCategoryData = true
```

### Category

```text
LEGAL_RELEVANCE
```

### Priority

```text
P1
```

### Finding

```text
Besonders schützenswerte Daten können verarbeitet werden. Eine vertiefte Datenschutzprüfung ist erforderlich.
```

### Action

```text
Datenschutzrechtliche Grundlage, Zulässigkeit, Schutzmaßnahmen und Datenflüsse fachlich prüfen.
```

---

# 17. External AI Provider + Personal Data

## RULE-DATA-003 — External Provider

### Trigger

```text
externalProvider = true
```

AND:

```text
personalData = true
```

### Category

```text
GOVERNANCE_BEST_PRACTICE
```

with:

```text
LEGAL_RELEVANCE
```

for the data-protection review component.

### Finding

```text
Personenbezogene Daten könnten an einen externen KI-Anbieter übermittelt werden.
```

### Action

```text
Anbieter, Datenverarbeitung, Vertragsgrundlagen, erlaubte Datennutzung, Speicherung, Sicherheitsmaßnahmen und relevante Datenflüsse prüfen.
```

### Important

Do not present every provider-control item as a direct AI Act requirement.

---

# 18. Confidential Company Data + External Provider

## RULE-DATA-004 — Confidential Data

### Trigger

```text
confidentialCompanyData = true
```

AND:

```text
externalProvider = true
```

### Category

```text
GOVERNANCE_BEST_PRACTICE
```

### Finding

```text
Vertrauliche Unternehmensdaten könnten an einen externen KI-Anbieter übermittelt werden.
```

### Action

```text
Freigabeprozess, zulässige Datentypen, Anbieterbedingungen und technische Schutzmaßnahmen prüfen.
```

---

# 19. External Provider + Unknown Approval

## RULE-GOV-001 — Provider Approval Unclear

### Trigger

```text
externalProvider = true
```

AND:

```text
providerApproval = unknown
```

### Category

```text
GOVERNANCE_BEST_PRACTICE
```

### Finding

```text
Die Freigabe des externen KI-Anbieters ist nicht eindeutig dokumentiert.
```

### Action

```text
Verantwortlichen Freigabeprozess und zulässige Nutzung des Anbieters klären.
```

---

# 20. Missing Responsible Person

## RULE-GOV-002 — Responsibility

### Trigger

```text
responsiblePerson = missing
```

### Category

```text
GOVERNANCE_BEST_PRACTICE
```

### Finding

```text
Eine fachliche Verantwortlichkeit ist nicht eindeutig festgelegt.
```

### Action

```text
Eine verantwortliche Person oder Rolle benennen und dokumentieren.
```

---

# 21. Missing Usage Rules

## RULE-GOV-003 — Internal Usage Rules

### Trigger

Employees use the AI system.

AND:

```text
internalUsageRules = missing
```

### Category

```text
GOVERNANCE_BEST_PRACTICE
```

### Finding

```text
Klare interne Nutzungsregeln fehlen oder sind nicht dokumentiert.
```

### Action

```text
Zulässige Nutzung, verbotene Eingaben, Umgang mit vertraulichen Daten und Verantwortlichkeiten definieren.
```

---

# 22. Missing Output Control

## RULE-GOV-004 — Output Review

### Trigger

AI generates business-relevant outputs.

AND:

```text
outputControl = none
```

### Category

```text
GOVERNANCE_BEST_PRACTICE
```

### Finding

```text
Für relevante KI-Ausgaben ist keine dokumentierte Kontrolle erkennbar.
```

### Action

```text
Prüf- und Freigabeprozess für relevante KI-Ausgaben definieren.
```

This rule is a governance recommendation.

It must not automatically be described as an AI Act violation.

---

# 23. Public-Facing Chatbot

## RULE-CHATBOT-001 — Customer-Facing AI

### Trigger

```text
affectedPersons includes customers
```

AND:

```text
directInteraction = true
```

### Result

Evaluate:

```text
RULE-TRANSPARENCY-001
```

### Finding

```text
Bei direkter Interaktion mit Kunden sollte die Transparenz über den KI-Einsatz überprüft werden.
```

---

# 24. Recruitment Bias / Quality Controls

## RULE-HIRING-001 — Missing Quality or Bias Controls

### Trigger

```text
recruitment = true
```

AND:

```text
qualityChecks = missing
```

or:

```text
biasChecks = missing
```

### Category

```text
GOVERNANCE_BEST_PRACTICE
```

### Finding

```text
Qualitäts- und mögliche Bias-Kontrollen sind nicht dokumentiert.
```

### Action

```text
Geeignete Qualitätskontrollen, Monitoring und Prüfprozesse definieren.
```

### Important

Do not state:

```text
"Bias violation."
```

---

# 25. Automated Decision-Making

## RULE-DECISION-001 — Fully Automated Decision

### Trigger

```text
decisionImpact = fullyAutomated
```

AND:

```text
affectedPersons != none
```

### Category

```text
LEGAL_RELEVANCE
```

### Priority

```text
P1
```

### Result

```text
status: PRÜFUNG_ERFORDERLICH
```

### Finding

```text
Das KI-System trifft oder beeinflusst Entscheidungen über Personen weitgehend automatisiert.
```

### Action

```text
Anwendungsfall, menschliche Kontrolle, rechtliche Grundlage und mögliche Auswirkungen auf betroffene Personen fachlich prüfen.
```

This rule intentionally triggers further review rather than declaring a legal violation.

---

# 26. Potentially Prohibited AI Practice

## RULE-PROHIBITED-001 — Potential Article 5 Scenario

### Trigger

The questionnaire contains information that may indicate a scenario covered by Article 5.

Examples may include:

* potentially manipulative AI behaviour;
* certain prohibited biometric categorisation scenarios;
* certain prohibited exploitation scenarios;
* other Article 5-specific use cases.

### Category

```text
LEGAL_RELEVANCE
```

### Priority

```text
P0
```

### Result

```text
status: PRÜFUNG_ERFORDERLICH
```

### Finding

```text
Der Anwendungsfall könnte einen Bereich berühren, der einer besonderen Prüfung nach dem AI Act unterliegt.
```

### Action

```text
Fachliche bzw. rechtliche Prüfung des konkreten Anwendungsfalls durchführen.
```

### Critical restriction

The prototype must NOT automatically claim:

```text
"Prohibited AI practice."
```

Article 5 contains specific legal conditions and exceptions. The prototype does not implement the complete legal test.

---

# 27. Logging / Traceability

## RULE-TRACE-001 — Assessment Traceability

Every completed assessment must store:

```text
assessmentId
systemId
timestamp
ruleVersion
inputSnapshot
deterministicFindings
overallStatus
```

### Category

```text
SECURITY_CONTROL
```

and:

```text
GOVERNANCE_BEST_PRACTICE
```

### Purpose

The organisation must be able to understand:

```text
What was assessed?
When?
Using which rule version?
Based on which answers?
What findings were produced?
```

---

# 28. Rule Versioning

Every deterministic assessment must contain a rule version.

Example:

```text
ruleVersion: "1.0.0"
```

When deterministic rules change:

```text
1.0.0
→
1.1.0
```

or:

```text
2.0.0
```

the previous assessment must retain its original version.

Old assessments must not silently change because the current rule set changed.

---

# 29. Reassessment

A system may be assessed multiple times.

Each assessment creates a new assessment record.

Example:

```text
System
  │
  ├── Assessment 2026-08-11
  │     ruleVersion 1.0.0
  │
  ├── Assessment 2026-09-03
  │     ruleVersion 1.1.0
  │
  └── Assessment 2026-10-15
        ruleVersion 1.2.0
```

Previous assessments remain immutable.

---

# 30. Demo Case Expectations

The deterministic engine must produce meaningful findings for the three required demo cases.

# 30.1 Customer Service Chatbot

Expected signals:

```text
direct interaction = true
AI disclosure = missing
human pre-review = none
customers = affected
```

Expected findings:

```text
transparency review required
output-control governance recommendation
```

Expected overall status:

```text
PRÜFUNG_ERFORDERLICH
```

Reason:

Direct interaction with customers combined with unclear AI disclosure requires transparency review.

---

# 30.2 CV Pre-Screening

Expected signals:

```text
recruitment = true
candidate prioritisation = true
personal data = true
final decision = human
quality/bias checks = missing
```

Expected findings:

```text
potential high-risk classification review
data-protection review
quality/bias control recommendation
human oversight review
```

Expected overall status:

```text
PRÜFUNG_ERFORDERLICH
```

Important:

The result must say:

```text
"High-risk classification should be assessed."
```

not:

```text
"This is definitely high-risk."
```

---

# 30.3 Internal Sales Copilot

Expected signals:

```text
employees = affected
external provider = true
confidential customer data = possible
training = unclear
approval = unclear
usage rules = unclear
```

Expected findings:

```text
external provider review
confidential-data governance review
AI literacy / training review
usage rules review
responsibility / approval review
```

Expected overall status:

```text
HANDLUNGSBEDARF
```

unless missing information is significant enough to trigger:

```text
PRÜFUNG_ERFORDERLICH
```

---

# 31. Rule Evaluation Algorithm

The engine should conceptually execute:

```text
1. Validate input
2. Detect missing information
3. Detect contradictions
4. Evaluate deterministic rules
5. Assign categories
6. Assign priorities
7. Deduplicate findings
8. Calculate overall status
9. Store rule version
10. Return structured assessment
```

Example:

```ts
const assessment = evaluateSystem(systemInput);
```

The engine must be a pure deterministic function whenever possible.

Example conceptual structure:

```ts
evaluateSystem(input): AssessmentResult
```

The same input and same rule version must produce the same result.

---

# 32. Rule Result Structure

Each finding should contain at least:

```ts
{
  ruleId: string;
  category: RuleCategory;
  priority: RulePriority;
  title: string;
  explanation: string;
  recommendedAction: string;
  legalBasis?: LegalBasis;
}
```

Example:

```ts
{
  ruleId: "RULE-TRANSPARENCY-001",
  category: "LEGAL_RELEVANCE",
  priority: "P1",
  title: "Transparenz bei direkter KI-Interaktion prüfen",
  explanation: "...",
  recommendedAction: "...",
  legalBasis: {
    source: "EU AI Act",
    article: "Article 50(1)"
  }
}
```

---

# 33. Rule Engine Must Be Explainable

Every finding must answer:

```text
WHY?
```

```text
Because direct AI interaction was reported
and AI disclosure is missing or unknown.
```

And:

```text
WHAT NEXT?
```

```text
Review how users are informed about AI interaction.
```

The UI should never show an unexplained risk score.

---

# 34. No Arbitrary Risk Score

The prototype does not require a numerical score such as:

```text
87 / 100
```

unless a clearly justified scoring methodology is introduced.

The preferred model is:

```text
status
+
findings
+
priority
+
recommended actions
+
open questions
```

This is easier to explain and less likely to create false precision.

---

# 35. LLM Must Not Override Rules

The LLM receives deterministic findings.

It may:

```text
summarize
explain
prioritize wording
identify ambiguities
suggest questions
```

It may NOT:

```text
remove a deterministic finding
change its legal basis
change its priority
declare compliance
declare violation
change high-risk classification
```

Example:

```text
Deterministic engine:
"High-risk classification should be assessed."

LLM:
"This means the recruitment use case deserves additional specialist review..."
```

Allowed.

Example:

```text
Deterministic engine:
"High-risk classification should be assessed."

LLM:
"This system is definitely not high-risk."
```

Not allowed.

---

# 36. Web-Based Legal Research

The system's development process must include web-based verification of legal sources.

Before adding or materially changing a legal rule, the developer/AI development agent should:

```text
1. Search the current official EU legal sources.
2. Locate the relevant Article / Annex.
3. Verify the current wording.
4. Check applicability dates.
5. Check official European Commission guidance where available.
6. Check whether amendments or current guidance affect the rule.
7. Compare the source with the proposed rule.
8. Update LEGAL_BASIS.md.
9. Update RULES.md.
10. Add/update tests.
```

Preferred search sources:

```text
EUR-Lex
European Commission
Official EU institutional sources
```

The AI agent may use internet search to locate and verify these sources.

However:

```text
LLM-generated legal interpretation
≠
legal source
```

Search results must be verified against the underlying official source.

---

# 37. Legal Research Metadata

When a legal rule is based on researched material, the rule definition should be traceable to:

```text
source
article
paragraph where relevant
research date
```

Example:

```ts
legalBasis: {
  source: "Regulation (EU) 2024/1689",
  article: "Article 50(1)",
  verifiedAt: "2026-08-11"
}
```

This metadata is for traceability.

It does not turn the application into a legal advice system.

---

# 38. Current Legal Status Must Be Checked

The legal status of the relevant provision must not be assumed from an old AI-generated answer.

The development process must check:

```text
Is the provision currently applicable?
Has the text been amended?
Is there current Commission guidance?
Are there relevant exceptions?
```

EUR-Lex currently identifies Regulation (EU) 2024/1689 as in force and shows staged application dates, including 2 August 2026 for the main application stage.

Therefore the application must keep legal research date-sensitive.

---

# 39. Conservative Interpretation

When there is uncertainty:

```text
uncertainty
→
open question
→
specialist review
```

Never:

```text
uncertainty
→
safe
```

and never:

```text
uncertainty
→
violation
```

unless the rule has enough information to establish the relevant condition.

---

# 40. Rule Precedence

When multiple rules produce different statuses:

```text
PRÜFUNG_ERFORDERLICH
        ↓
HANDLUNGSBEDARF
        ↓
UNAUFFÄLLIG
```

The highest applicable status wins.

Example:

```text
Training missing
→ HANDLUNGSBEDARF

Recruitment high-risk review required
→ PRÜFUNG_ERFORDERLICH

Final status:
→ PRÜFUNG_ERFORDERLICH
```

---

# 41. No False Certainty

The following statements are prohibited in deterministic output unless the application is explicitly expanded to support the necessary legal assessment:

```text
"Fully compliant."
"AI Act compliant."
"GDPR compliant."
"Definitely high-risk."
"Definitely not high-risk."
"Legal violation."
"No legal risk."
```

Preferred language:

```text
"should be reviewed"
"may be relevant"
"further assessment required"
"open information"
"specialist review recommended"
```

---

# 42. Testing Requirements

Every deterministic rule must have automated tests.

At minimum:

```text
positive case
negative case
unknown/missing case
boundary case
```

Example:

```text
RULE-TRANSPARENCY-001

Test 1:
directInteraction = true
disclosure = false
→ finding exists

Test 2:
directInteraction = false
disclosure = false
→ finding does not exist

Test 3:
directInteraction = true
disclosure = unknown
→ finding exists

Test 4:
directInteraction = true
disclosure = true
→ finding does not exist
```

Critical legal-relevance rules must have explicit regression tests.

---

# 43. Rule IDs

Rule IDs must remain stable.

Recommended naming:

```text
RULE-INFO-xxx
RULE-TRANSPARENCY-xxx
RULE-HIGHRISK-xxx
RULE-HUMAN-xxx
RULE-DATA-xxx
RULE-GOV-xxx
RULE-DECISION-xxx
RULE-PROHIBITED-xxx
RULE-TRACE-xxx
```

Never silently reuse an old rule ID for a different meaning.

---

# 44. Rule Changes

When changing the semantic meaning of an existing rule:

```text
create a new rule ID
```

or:

```text
increment the major rule version
```

When making a non-breaking clarification:

```text
increment the minor version
```

The exact semantic-versioning policy is defined by the implementation.

---

# 45. Scope of the Prototype

The rule engine intentionally covers only a selected subset of AI governance and AI Act-related concerns.

It does not attempt to implement the entire AI Act.

It does not replace:

```text
legal counsel
data protection officer
AI governance specialist
security assessment
formal conformity assessment
```

The rule engine is an early-warning and decision-support mechanism.

Its central principle is:

```text
Detect → Explain → Recommend → Escalate when uncertain
```

not:

```text
Detect → Declare legal compliance
```

---

# 46. Final Rule

The most important architectural principle is:

> The deterministic rule engine determines what the application knows from its configured rules. The LLM explains and contextualises those findings. Neither component should pretend to know more than the available evidence supports.
