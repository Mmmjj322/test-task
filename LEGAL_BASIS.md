# LEGAL_BASIS.md

# Legal Basis & Research

## 1. Purpose

This document records the legal and regulatory sources used to design the
initial assessment rules of the KI-System-Check prototype.

The purpose is not to reproduce the EU AI Act or provide legal advice.

Instead, this document establishes a traceable connection between:

```text
Official legal source
        ↓
Relevant requirement
        ↓
Application rule
        ↓
Assessment finding
        ↓
Recommended action
```

The application is an early-risk and governance assessment tool.

It does not provide a legally binding compliance assessment.

---

# 2. Source of Truth

The primary source of legal requirements is:

Regulation (EU) 2024/1689 of the European Parliament and of the Council
of 13 June 2024 laying down harmonised rules on artificial intelligence
(Artificial Intelligence Act).

Official source:

https://eur-lex.europa.eu/eli/reg/2024/1689/oj

Source type:

Official Journal of the European Union / EUR-Lex

The official legal text is the source of truth.

Secondary explanations, summaries, blog posts, AI-generated explanations,
and other material must not override the official legal text.

---

# 3. Official EU Sources

The project uses official European Commission sources to complement
and explain the legal text where official guidance is available.

## 3.1 European Commission — AI Act

https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai

Purpose:

General information about the AI Act, implementation and related
official resources.

---

## 3.2 European Commission — Article 50 Guidelines

https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems

Publication date:

2026-07-20

Purpose:

Official guidance concerning the scope and implementation of the
transparency obligations under Article 50.

The guidelines are particularly relevant to:

* direct interaction with AI systems;
* AI-generated and manipulated content;
* deepfakes;
* AI-generated text concerning matters of public interest;
* exceptions and scope;
* practical compliance approaches.

The Commission states that Article 50 transparency obligations
apply from 2026-08-02.

---

## 3.3 European Commission — Article 50 Quick Facts

https://digital-strategy.ec.europa.eu/en/factpages/quick-facts-transparency-rules-ai-systems

Purpose:

Official high-level explanation of the four main Article 50
transparency situations.

The page identifies:

### Providers

* direct interaction with AI;
* AI-generated or manipulated content requiring marking/detection.

### Deployers

* exposure to emotion recognition or biometric categorisation;
* certain AI-generated or manipulated content, including deepfakes
  and certain AI-generated text concerning matters of public interest.

The page was updated on 2026-07-29.

---

## 3.4 European Commission — Article 4 AI Literacy Q&A

https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers

Purpose:

Current official explanation of Article 4 and its enforcement.

The Commission states that Article 4 entered into application on
2025-02-02.

The Commission also confirms that Article 4 was amended by the
Digital Omnibus in July 2026.

The current rule remains an obligation for providers and deployers
to take measures supporting AI literacy.

However, the amended Article 4 does not prescribe a specific
or "sufficient" level of AI literacy for an individual.

This distinction is important for the prototype.

The application should therefore identify missing or unclear
AI-literacy measures without claiming that a specific training
level is legally mandatory.

---

## 3.5 European Commission — AI Literacy

https://digital-strategy.ec.europa.eu/en/policies/ai-talent-skills-and-literacy

Purpose:

Additional official context concerning AI literacy and Article 4.

The Commission describes AI literacy as an obligation for providers
and deployers and explains that measures should take into account
the technical knowledge, experience, education, training and context
of use. It also confirms that no particular individual literacy
level is prescribed.

---

## 3.6 European Commission — Code of Practice on Transparency

https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content

Purpose:

Supporting instrument for Article 50 obligations concerning
marking and labelling of AI-generated content.

The Code of Practice is not itself the AI Act.

It is therefore treated by this project as supporting guidance and
not as an independent statutory source.

The Commission and AI Board assessed the Code as an adequate
instrument for facilitating compliance with the relevant
Article 50 obligations. However, adherence does not constitute
conclusive evidence of compliance.

---

# 4. Research Date and Legal Version

Initial legal research and verification:

```text
2026-08-11
```

Relevant current implementation context:

```text
Article 4:
Applicable since 2025-02-02

Article 50:
Applicable since 2026-08-02

Article 50 final Commission Guidelines:
Published 2026-07-20

AI Omnibus:
Entered into force in July 2026
```

The AI Act and its implementation framework can change.

The legal basis must therefore be reviewed when:

* the rule set is materially changed;
* official guidance is updated;
* relevant legislation is amended;
* a new version of the application is released.

---

# 5. AI-Assisted Legal Research

AI tools were used as a research and verification aid during development.

The AI-assisted research process included:

1. locating relevant provisions of the EU AI Act;
2. searching the internet for relevant official EU sources;
3. identifying relevant Articles and Annexes;
4. checking current European Commission guidance;
5. comparing preliminary interpretations with the official wording;
6. identifying potentially over-broad or misleading rules;
7. checking whether recent legislative changes affected previously
   identified requirements;
8. identifying exceptions and transitional provisions;
9. challenging preliminary assumptions before implementing rules.

AI was explicitly used as a research assistant and not as an authoritative
legal source.

The research process follows:

```text
AI-assisted search
        ↓
Official EU source
        ↓
Verification against legal text
        ↓
Interpretation
        ↓
Application rule
```

AI-generated legal interpretations must never be treated as the final
legal authority.

Where AI output conflicts with an official source, the official source
takes precedence.

---

# 6. Research Source Hierarchy

The project follows this hierarchy:

```text
1. EU legislation / EUR-Lex
2. Official European Commission guidance
3. Other official EU institutional material
4. Secondary legal or technical sources
5. AI-generated explanations
```

A lower-level source must not override a higher-level source.

AI-generated information may help locate or explain a source but cannot
replace the source itself.

---

# 7. Relevant AI Act Areas

Only selected parts of the AI Act are relevant to this prototype.

The application does not attempt to implement the complete Regulation.

Initial legal research scope:

```text
Article 2
    Scope

Article 3
    Definitions

Article 4
    AI literacy

Article 5
    Prohibited AI practices

Article 6
    Classification of high-risk AI systems

Article 9
    Risk management system

Article 14
    Human oversight

Article 26
    Obligations of deployers

Article 50
    Transparency obligations

Annex III
    High-risk AI system use cases
```

These provisions provide legal context for the questionnaire and
deterministic rule engine.

They do not represent complete implementation of the corresponding
AI Act requirements.

---

# 8. Article 2 — Scope

Article 2 defines the scope of the AI Act and identifies relevant
categories of actors and situations.

For this prototype, the most relevant concept is the organisation
using an AI system.

The application is primarily designed from the perspective of an
organisation assessing an AI system that it deploys or uses.

The prototype does not attempt to determine every possible operator
role under Article 2.

If the scope of the AI Act is unclear based on the questionnaire,
the application should produce an uncertainty / review finding.

It must not claim that the AI Act definitely applies or definitely
does not apply unless the necessary conditions are explicitly
implemented and verified.

---

# 9. Article 3 — Definitions

Several definitions are relevant to the questionnaire.

## 9.1 AI system

Article 3 defines the concept of an AI system.

The prototype uses this definition as legal context for the systems
being assessed.

The prototype does not implement a complete legal determination of
whether every arbitrary technology qualifies as an AI system.

---

## 9.2 Provider

Article 3 defines a provider as a natural or legal person, public
authority, agency or other body that develops an AI system or
general-purpose AI model and places it on the market or puts the
AI system into service under its own name or trademark.

The prototype does not perform a complete provider-status assessment.

---

## 9.3 Deployer

Article 3 defines a deployer as a natural or legal person, public
authority, agency or other body using an AI system under its authority,
except for personal non-professional activity.

This is particularly relevant to the intended target audience.

The prototype primarily models the organisation as a practical
deployer-side assessment context.

---

## 9.4 Intended purpose

Article 3 defines intended purpose in relation to the use for which
an AI system is intended by the provider, including the specific
context and conditions of use.

This supports collecting:

* purpose;
* supported process;
* intended users;
* context of use.

---

## 9.5 Reasonably foreseeable misuse

Article 3 also defines reasonably foreseeable misuse.

The concept is relevant to future risk-analysis extensions.

The initial prototype does not perform a comprehensive misuse analysis.

---

# 10. Article 4 — AI Literacy

Article 4 establishes an obligation for providers and deployers to
take measures to support the development of AI literacy of relevant
staff and persons dealing with AI systems on their behalf.

The current European Commission guidance confirms:

* Article 4 applies from 2025-02-02;
* the obligation remains applicable after the 2026 amendment;
* the Digital Omnibus entered into force in July 2026;
* no specific or "sufficient" level of AI literacy is prescribed
  for an individual.

## Application relevance

The questionnaire therefore asks about:

* whether employees use the AI system;
* whether users receive relevant training;
* whether AI usage guidance exists;
* whether responsibilities and expected use are communicated.

The application may produce:

```text
AI literacy and usage guidance should be reviewed.
```

It must NOT produce:

```text
Article 4 is violated.
```

It must also NOT assume that the absence of a particular training
certificate automatically means non-compliance.

The application assesses whether organisational AI-literacy measures
appear to exist and whether further review is warranted.

---

# 11. Article 5 — Prohibited AI Practices

Article 5 contains prohibitions concerning certain AI practices.

The prototype does not attempt to implement the complete Article 5
prohibition framework.

This is deliberate.

A complete Article 5 assessment would require substantially more
context and specialised legal analysis.

If questionnaire information potentially indicates a prohibited
practice, the application should produce:

```text
Potentially relevant prohibited-practice scenario.
Specialist / legal review required.
```

It must NOT automatically produce:

```text
Prohibited AI practice.
```

---

# 12. Article 6 — High-Risk Classification

Article 6 establishes rules for determining whether certain AI systems
are high-risk.

The prototype must distinguish between:

```text
Potentially relevant high-risk use case
```

and:

```text
Confirmed high-risk AI system
```

The rule engine may identify situations that warrant a high-risk
assessment.

It must not claim definitive classification unless the necessary
classification requirements have actually been implemented.

---

# 13. Annex III — High-Risk Use Cases

Annex III identifies certain areas in which AI systems can fall into
the high-risk category.

The prototype is particularly interested in:

* employment;
* recruitment;
* candidate selection;
* candidate prioritisation;
* other decisions affecting natural persons.

The CV pre-screening demo intentionally represents such a scenario.

The application may therefore produce:

```text
High-risk classification should be assessed.
```

It must not automatically produce:

```text
This system is legally classified as high-risk.
```

The prototype does not implement the complete Annex III analysis.

---

# 14. Article 9 — Risk Management

Article 9 is relevant to risk management for high-risk AI systems.

The prototype does not implement a complete Article 9 risk-management
system.

Instead, the prototype uses the concept of structured risk management
to encourage identification of:

* relevant risks;
* affected persons;
* controls;
* human oversight;
* monitoring;
* open questions;
* mitigation actions.

This is a simplified governance assessment and must not be represented
as a complete Article 9 compliance assessment.

---

# 15. Article 14 — Human Oversight

Article 14 establishes human-oversight requirements for relevant
high-risk AI systems.

The questionnaire therefore collects information about:

* human review;
* approval;
* output controls;
* intervention;
* responsibility;
* escalation.

When an AI system materially influences decisions about people and
human oversight is absent or unclear, the application may produce:

```text
Human oversight should be defined and reviewed.
```

It must not automatically state:

```text
Article 14 violation.
```

The complete legal applicability of Article 14 depends on the system's
classification and circumstances.

---

# 16. Article 26 — Deployer Obligations

Article 26 contains obligations relevant to deployers of high-risk
AI systems.

The prototype uses this area as context for organisational controls,
including:

* appropriate use;
* human oversight;
* monitoring;
* documentation;
* responsibility;
* user awareness;
* handling of AI outputs.

The prototype does not implement every Article 26 obligation.

Therefore Article 26-related findings should be expressed as
assessment or review recommendations rather than definitive
compliance conclusions.

---

# 17. Article 50 — Transparency

Article 50 is one of the most directly relevant parts of the
prototype.

The final European Commission guidelines were published on
2026-07-20. The Article 50 transparency obligations apply from
2026-08-02.

The application must not treat Article 50 as one generic
"AI transparency" rule.

The relevant obligations must be represented separately.

---

# 18. Article 50(1) — Direct AI Interaction

Article 50(1) concerns AI systems intended to interact directly with
natural persons.

The relevant principle is that individuals should be informed that
they are interacting with an AI system unless the situation falls
within the applicable exception.

The prototype may detect:

```text
direct AI interaction
+
AI disclosure missing / unknown
```

and produce:

```text
Transparency requirement should be reviewed.
```

Example rule identifier:

```text
RULE-TRANSPARENCY-001
```

The rule must not automatically produce:

```text
Article 50 violation.
```

The actual applicability of the obligation depends on the relevant
scope and exceptions.

---

# 19. Article 50(2) — AI-Generated or Manipulated Content

Article 50(2) concerns certain AI-generated or manipulated content
and corresponding machine-readable marking obligations for providers.

The prototype must not simplify this to:

```text
AI-generated content
+
no human review
=
violation
```

The application should instead collect relevant context such as:

* type of content;
* whether the content is generated or manipulated;
* whether the system is a provider or deployer context;
* whether applicable marking/detection requirements are relevant;
* whether an exception applies.

The European Commission also identifies a transitional provision for
certain AI systems placed on the market before 2026-08-02.

For those systems, the marking/detection obligation under Article 50(2)
has a transition until 2026-12-02.

The prototype should not hard-code a simplistic universal deadline
without considering this transitional condition.

---

# 20. Article 50(4) — Emotion Recognition and Biometric Categorisation

Article 50 contains specific transparency obligations concerning
certain deployer use of emotion recognition and biometric
categorisation systems.

The questionnaire should therefore identify whether:

```text
emotion recognition
```

or:

```text
biometric categorisation
```

is involved.

If relevant, the application should produce a transparency-review
finding.

The prototype must not automatically determine that an Article 50
violation exists without assessing the relevant scope and exceptions.

---

# 21. Article 50(5) — Deepfakes and Certain Public-Interest Text

Article 50 also contains obligations for certain deployer-published
AI-generated or manipulated content.

The relevant scenarios include:

* deepfakes;
* certain AI-generated or manipulated text;
* publication concerning matters of public interest;
* circumstances involving the absence of human review or editorial
  control.

The current European Commission guidance explicitly addresses these
concepts and their exceptions.

The prototype should therefore collect relevant context rather than
using a generic "AI-generated content" rule.

Potential questionnaire inputs include:

* public publication;
* content type;
* public-interest context;
* human review;
* editorial control.

The result should be expressed as a review requirement where the
available information is insufficient for a reliable conclusion.

---

# 22. Article 50 — Code of Practice

The European Commission's Code of Practice on Transparency of
AI-Generated Content is a supporting compliance instrument.

The Commission and AI Board assessed it as an adequate instrument for
facilitating compliance with the relevant Article 50 obligations.

However:

```text
Code of Practice ≠ AI Act itself
```

and:

```text
following the Code ≠ conclusive proof of compliance
```

Therefore the prototype must not create a rule such as:

```text
Code of Practice not adopted
=
Article 50 violation
```

The Code may instead be presented as one possible implementation
or evidence mechanism where relevant.

---

# 23. Article 50 — Current Status

As of:

```text
2026-08-11
```

Article 50 transparency obligations are applicable from:

```text
2026-08-02
```

The final Commission guidelines were published:

```text
2026-07-20
```

The application therefore treats Article 50 as an active requirement.

The application must also account for applicable transitional provisions,
including the Article 50(2) transition described by the Commission.

---

# 24. Data Protection Boundary

The AI Act does not replace EU personal-data protection law.

Article 2 preserves the application of relevant Union law concerning
personal data and privacy.

Therefore, when the questionnaire indicates that an AI system processes
personal or sensitive data, the application may identify:

```text
Data-protection review required.
```

It must NOT claim:

```text
GDPR compliant.
```

or:

```text
GDPR violation.
```

The prototype is not a GDPR assessment tool.

---

# 25. External AI Providers

When personal or confidential company data may be sent to an external
AI provider, the application should flag the need to review:

* provider approval;
* contractual arrangements;
* data-processing roles;
* permitted data use;
* retention;
* security;
* data location where relevant;
* organisational controls.

These are application-level governance considerations.

They must not automatically be presented as individual requirements
of one specific AI Act article.

---

# 26. Relationship Between Law and Rules

The legal source does not directly define every application rule.

For example:

```text
responsiblePerson is missing
```

is primarily a governance or information-quality finding.

It is not necessarily a direct implementation of one specific
AI Act paragraph.

Every deterministic rule should therefore have a classification:

```text
LEGAL_REQUIREMENT
LEGAL_RELEVANCE
GOVERNANCE_BEST_PRACTICE
INFORMATION_QUALITY
SECURITY_CONTROL
```

This prevents the application from falsely presenting internal
governance recommendations as statutory requirements.

---

# 27. Rule Traceability

Every legal or legally relevant deterministic rule should be traceable
to this document.

The intended relationship is:

```text
LEGAL_BASIS.md
        ↓
RULES.md
        ↓
Rule Engine
        ↓
Assessment Finding
        ↓
Recommended Action
```

Example:

```text
LEGAL_BASIS
Article 50(1)
        ↓
RULES.md
RULE-TRANSPARENCY-001
        ↓
Condition:
Direct AI interaction
+
Disclosure missing / unknown
        ↓
Finding:
Transparency requirement should be reviewed.
        ↓
Action:
Check and implement an appropriate AI disclosure.
```

This allows each rule to be reviewed independently.

---

# 28. Source Verification Process

Before adding or materially changing a legal or legally relevant rule:

1. Locate the relevant provision in the official EU legal text.
2. Check the current consolidated/legal version.
3. Check the effective date of the requirement.
4. Check current European Commission guidance where available.
5. Check relevant exceptions and transitional provisions.
6. Determine whether the proposed application rule is actually supported
   by the source.
7. Record the legal basis in this document.
8. Define the deterministic rule separately in RULES.md.
9. Document limitations and uncertainty.
10. Add or update automated tests.

A rule must not be implemented solely because an AI model suggested it.

---

# 29. Research Verification Requirements

When AI is used to research a legal requirement, the following process
must be followed:

```text
1. AI identifies a potentially relevant provision
2. Official source is located
3. Exact provision is checked
4. Current applicability is checked
5. Official guidance is checked where available
6. Exceptions / transitional provisions are checked
7. Rule is formulated conservatively
8. Rule is added to RULES.md
9. Rule receives automated tests
```

If the official source cannot support a proposed rule, the rule must
not be implemented as a legal requirement.

---

# 30. Legal vs. Governance Findings

The application must distinguish between:

### LEGAL_REQUIREMENT

A requirement directly supported by applicable legislation.

### LEGAL_RELEVANCE

A situation indicating that a legal requirement may become relevant
and further assessment is warranted.

### GOVERNANCE_BEST_PRACTICE

A sensible organisational control that improves responsible AI use
but is not represented as a direct statutory requirement.

### INFORMATION_QUALITY

A missing, contradictory or insufficient questionnaire response.

### SECURITY_CONTROL

A technical or organisational security measure.

These categories must not be mixed.

---

# 31. Important Uncertainty Principle

The application must prefer:

```text
Insufficient information — further review required.
```

over:

```text
No issue detected.
```

when relevant information is missing or contradictory.

Similarly, it must prefer:

```text
Potentially relevant — specialist review required.
```

over:

```text
Confirmed legal violation.
```

when the prototype does not implement the complete legal analysis.

This principle is fundamental to the application's purpose.

---

# 32. Research Limitations

This project is a prototype.

It does not provide:

* complete AI Act coverage;
* complete Article 5 analysis;
* complete high-risk classification;
* complete Annex III classification;
* complete Article 9 risk-management assessment;
* complete Article 26 assessment;
* complete Article 50 assessment in every possible scenario;
* complete GDPR assessment;
* employment-law assessment;
* sector-specific regulatory assessment;
* formal conformity assessment;
* legal advice.

The system identifies potential risks and areas requiring attention.

It does not certify compliance.

---

# 33. Current Research Status

The following areas have been researched sufficiently to form the
initial legal basis of the prototype:

```text
Article 2
Article 3
Article 4
Article 5
Article 6
Article 9
Article 14
Article 26
Article 50
Annex III
```

Article 50 has additionally been checked against current European
Commission guidance published in July 2026.

Article 4 has been checked against the Commission's current
post-Digital-Omnibus guidance.

Further detailed research is required before implementing additional
rules that make specific legal claims.

---

# 34. Final Principle

The purpose of legal research in this application is not to turn the
prototype into a legal expert.

The purpose is to make the initial assessment:

```text
traceable
conservative
explainable
current
testable
useful for business decision-makers
```

The application should answer:

```text
Which areas should the organisation investigate,
and what should it consider doing next?
```

It should not answer:

```text
Is this organisation legally compliant?
```

The final responsibility for legal interpretation and compliance
decisions remains with appropriately qualified human professionals.
