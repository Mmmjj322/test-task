# LLM.md

# LLM Analysis & AI-Assisted Assessment

## 1. Purpose

The application uses an LLM as a secondary analysis layer.

The LLM does **not** replace the deterministic rule engine.

Its purpose is to transform structured assessment findings into clear,
business-oriented language for decision-makers.

The architecture is:

```text
Questionnaire
    ↓
Validated assessment data
    ↓
Deterministic Rule Engine
    ↓
Structured findings
    ↓
LLM
    ↓
Business-language explanation
```

The LLM may explain, summarize and prioritize information already identified
by the application.

It must not independently establish legal compliance.

---

# 2. Two Independent Assessment Approaches

The application deliberately contains two independent approaches.

## 2.1 Deterministic Rule Analysis

The rule engine is the authoritative assessment layer of the prototype.

It:

* evaluates structured questionnaire data;
* applies explicit versioned rules;
* detects missing information;
* detects contradictions;
* creates findings;
* assigns priorities;
* recommends concrete actions;
* stores the rule version used for the assessment.

The rule engine must be deterministic.

Given the same:

```text
input data
+
rule version
```

it should produce the same result.

The rule engine does not require an LLM.

---

## 2.2 LLM-Assisted Analysis

The LLM receives the structured result of the rule engine.

It may:

* summarize the most important findings;
* explain why the findings matter;
* formulate open questions;
* explain recommended next steps;
* translate technical or regulatory concepts into business language;
* help a manager understand the assessment.

The LLM must not:

* override deterministic findings;
* invent legal requirements;
* invent facts about the assessed AI system;
* claim legal compliance;
* claim legal non-compliance;
* independently classify an AI system as legally high-risk;
* turn uncertainty into certainty;
* invent missing questionnaire information;
* cite laws that were not provided or verified;
* create new mandatory actions unsupported by the rule result.

---

# 3. Source of Truth

The source-of-truth hierarchy is:

```text
Official EU legislation
        ↓
Official European Commission guidance
        ↓
Other official EU institutional material
        ↓
Verified secondary sources
        ↓
LLM-generated explanation
```

The LLM is the lowest-level explanatory layer.

If an LLM response conflicts with:

* the EU AI Act;
* official EU guidance;
* the deterministic rule engine;

the LLM response must not be treated as authoritative.

---

# 4. LLM Input Contract

The LLM should receive structured data rather than the raw questionnaire whenever
possible.

Example:

```json
{
  "system": {
    "name": "Customer Service Chatbot",
    "description": "Generative AI chatbot on the company website",
    "status": "productive"
  },
  "assessment": {
    "status": "ACTION_REQUIRED",
    "ruleVersion": "1.0.0",
    "assessedAt": "2026-08-11T12:00:00Z"
  },
  "findings": [
    {
      "id": "RULE-TRANSPARENCY-001",
      "category": "LEGAL_RELEVANCE",
      "priority": "HIGH",
      "title": "AI interaction transparency should be reviewed",
      "reason": "Customers directly interact with the AI system and no disclosure is documented.",
      "recommendedAction": "Review and implement an appropriate AI disclosure."
    }
  ],
  "missingInformation": [],
  "contradictions": []
}
```

The LLM should not need to infer these facts from prose.

---

# 5. Context Boundary

The LLM should receive the minimum information necessary.

Prefer:

```text
structured findings
+
relevant system context
+
missing information
+
recommended actions
```

Avoid sending:

```text
unnecessary personal data
+
real customer information
+
real employee information
+
confidential company information
+
raw production conversations
```

Demo data must be fictional.

---

# 6. Required LLM Output

The LLM should return structured output.

Preferred schema:

```json
{
  "summary": "string",
  "keyRisks": [
    {
      "findingId": "string",
      "explanation": "string"
    }
  ],
  "openQuestions": [
    "string"
  ],
  "nextSteps": [
    {
      "title": "string",
      "description": "string",
      "priority": "HIGH | MEDIUM | LOW"
    }
  ],
  "limitations": [
    "string"
  ]
}
```

The backend validates the response before returning it to the frontend.

Invalid or malformed LLM output must not be trusted.

---

# 7. Prompt Design

The system prompt must explicitly establish that the LLM is an
explanatory assistant, not a legal decision engine.

Core instructions:

```text
You are an AI governance assessment assistant.

Your task is to explain structured assessment findings in clear business
language.

The deterministic rule engine is authoritative.

Do not override, contradict or invent deterministic findings.

Do not provide legal advice.

Do not claim that an organisation is compliant or non-compliant.

Do not invent missing facts.

Do not infer certainty from incomplete information.

If information is missing or contradictory, explicitly state the uncertainty.

Explain why the identified findings matter and what the organisation should
consider doing next.

Only use the legal or regulatory context explicitly supplied to you.
```

---

# 8. Hallucination Control

The application must assume that an LLM can produce incorrect information.

Therefore:

### The LLM cannot create rule IDs.

It may reference existing finding IDs.

### The LLM cannot create legal requirements.

Legal findings originate from the rule engine.

### The LLM cannot create facts.

If information is unavailable:

```text
Information not available.
```

must be preferred over guessing.

### The LLM cannot resolve contradictions.

If the deterministic layer reports:

```text
contradiction detected
```

the LLM must explain that the information requires clarification.

---

# 9. Legal Language Constraints

The LLM should use conservative language.

Preferred:

```text
Further review may be required.
```

```text
This situation may be relevant to Article 50.
```

```text
The organisation should review whether an appropriate disclosure is in place.
```

```text
A specialist review may be appropriate.
```

Avoid:

```text
You are compliant.
```

```text
You are violating the AI Act.
```

```text
This system is definitely high-risk.
```

```text
The company is legally safe.
```

unless such a conclusion is explicitly supported by a separately implemented
legal assessment system, which is outside the scope of this prototype.

---

# 10. Error Handling

LLM failures must not break the deterministic assessment.

Possible failures:

```text
API unavailable
timeout
rate limit
invalid response
malformed JSON
provider error
content filtering
unexpected model output
```

If the LLM fails:

```text
Deterministic assessment
        ↓
still displayed
```

The UI should indicate:

```text
LLM explanation unavailable.
The assessment below is based on the deterministic rule analysis.
```

The application must remain useful without the LLM.

---

# 11. Cost Control

The prototype should minimise unnecessary LLM usage.

Recommended strategy:

```text
1 assessment
    ↓
1 LLM request
    ↓
structured response
```

Do not call the LLM:

* for every questionnaire field;
* for every rule;
* repeatedly for the same assessment;
* for validation that deterministic code can perform.

Use bounded input and output lengths.

Set:

* maximum prompt size;
* maximum response tokens;
* request timeout;
* rate limiting.

---

# 12. Sensitive Data Protection

The LLM integration must not expose unnecessary sensitive data.

The application should use fictional demo data.

For production-oriented architecture, the backend should support
data minimisation and optional redaction before sending information
to an external LLM provider.

Example:

```text
John Smith
    ↓
[REDACTED_PERSON]

john.smith@example.com
    ↓
[REDACTED_EMAIL]
```

The prototype does not attempt to implement a complete anonymisation system.

This limitation must be documented.

---

# 13. LLM Provider

The LLM provider may be changed without changing the assessment engine.

The application should therefore isolate the provider behind an interface.

Conceptually:

```ts
interface LlmProvider {
  analyzeAssessment(
    input: LlmAssessmentInput
  ): Promise<LlmAssessmentResult>
}
```

Possible implementation:

```text
LlmProvider
    │
    ├── OpenAIProvider
    ├── GeminiProvider
    └── MockLlmProvider
```

Only one real provider is required for the prototype.

A mock provider may be used for deterministic local development and tests.

---

# 14. Backend Boundary

The frontend must never call the LLM provider directly.

Correct:

```text
Browser
   ↓
Backend API
   ↓
LLM provider
```

Incorrect:

```text
Browser
   ↓
LLM provider
```

API keys and provider credentials must remain server-side.

---

# 15. Runtime Legal Research

The application itself does not use unrestricted web search to make
real-time legal decisions for users.

Legal research is part of the development and rule-maintenance workflow.

When legal rules are added or materially changed, the development process
should verify them against current official sources.

The preferred process is:

```text
New legal question
        ↓
Search official EU sources
        ↓
Locate exact provision
        ↓
Check current applicability
        ↓
Check current European Commission guidance
        ↓
Compare with existing rule
        ↓
Update LEGAL_BASIS.md
        ↓
Update RULES.md
        ↓
Update tests
        ↓
Update rule version
```

AI may assist this research by searching, comparing and challenging
interpretations.

However:

```text
AI research result ≠ legal source
```

The final source of truth remains the verified official source.

---

# 16. AI-Assisted Legal Research Requirements

When AI is used to research legal requirements, it should be instructed to:

1. search official EU sources first;
2. identify the exact Article, paragraph or Annex;
3. provide the source URL;
4. quote or reference the relevant provision where appropriate;
5. distinguish legislation from Commission guidance;
6. check whether the provision is currently applicable;
7. identify exceptions and scope limitations;
8. identify recent amendments or implementation guidance;
9. flag uncertainty;
10. never silently invent a legal basis.

For example:

```text
Question:
Does this questionnaire scenario create an Article 50 transparency issue?

Research process:
1. Search EUR-Lex.
2. Search current European Commission Article 50 guidance.
3. Locate Article 50 paragraph relevant to the scenario.
4. Check scope and exceptions.
5. Record the finding.
6. Implement a deterministic rule.
7. Add tests.
```

This is especially important because official Commission guidance can clarify
how Article 50 obligations should be applied in practice. The Commission's
current Article 50 guidance was published on 20 July 2026 and states that the
transparency obligations apply from 2 August 2026.

---

# 17. LLM vs Rule Engine Responsibility Matrix

| Responsibility                          | Rule Engine |         LLM |
| --------------------------------------- | ----------: | ----------: |
| Evaluate questionnaire conditions       |         YES |          NO |
| Detect missing information              |         YES |          NO |
| Detect contradictions                   |         YES |          NO |
| Determine finding IDs                   |         YES |          NO |
| Assign deterministic priority           |         YES |          NO |
| Select legal basis                      |         YES |          NO |
| Produce recommended actions             |         YES | MAY EXPLAIN |
| Explain risks                           |    OPTIONAL |         YES |
| Summarise findings                      |          NO |         YES |
| Explain next steps                      |          NO |         YES |
| Provide legal advice                    |          NO |          NO |
| Determine compliance                    |          NO |          NO |
| Definitively classify high-risk         |          NO |          NO |
| Invent missing information              |          NO |          NO |
| Search legal sources during development |     SUPPORT |     SUPPORT |
| Replace official legal sources          |          NO |          NO |

---

# 18. Transparency in the UI

The frontend must clearly distinguish the two sources.

For example:

```text
Deterministic assessment
Based on predefined assessment rules
```

and:

```text
AI-assisted explanation
Generated by an LLM based on the deterministic assessment
```

The user must never have to guess which information came from the
rule engine and which was generated by the LLM.

---

# 19. Assessment Integrity

The LLM layer must be optional.

The application must remain capable of producing:

```text
overall assessment
+
findings
+
priorities
+
next steps
+
missing information
+
rule version
+
timestamp
```

without an LLM.

This demonstrates that AI is being used as an enhancement rather than
as an uncontrolled decision-maker.

---

# 20. Final Principle

The architecture deliberately separates:

```text
FACTS
  ↓
DETERMINISTIC RULES
  ↓
ASSESSMENT
  ↓
LLM EXPLANATION
```

The LLM makes the assessment easier to understand.

It does not decide what the law means.

It does not decide whether the company is compliant.

It does not replace the rule engine.

It does not replace legal research.

It does not replace official EU sources.

Its role is:

```text
Explain.
Summarise.
Clarify.
Ask useful open questions.
Suggest how to approach the already identified next steps.
```

The deterministic assessment remains the stable and testable foundation
of the application.
