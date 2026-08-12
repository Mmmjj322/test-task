# KI-System-Check — Architecture

## 1. Архитектурная цель

KI-System-Check — это небольшой fullstack-прототип для структурированной оценки отдельных KI-Systeme.

Архитектура должна быть:

* простой;
* локально воспроизводимой;
* типобезопасной;
* тестируемой;
* понятной для разработчика;
* пригодной для расширения;
* без ненужной enterprise-инфраструктуры.

Главный архитектурный принцип:

> **Rules decide. LLM explains.**

Rule Engine является источником фактической оценки.

LLM является вспомогательной системой, которая объясняет результаты понятным бизнес-языком.

LLM не является источником юридической или compliance-логики.

---

# 2. Технологический стек

## Frontend + Backend

**Next.js + TypeScript**

Используется один Next.js application.

Отдельный Express backend не нужен.

Причина:

* приложение небольшое;
* отдельный backend не дает существенной архитектурной выгоды;
* Next.js Route Handlers достаточно для API;
* server-side logic можно четко отделить от UI;
* секреты и LLM API keys остаются на сервере.

---

## Database

**PostgreSQL**

ORM:

**Prisma**

PostgreSQL используется для persistence:

* AI systems;
* evaluations;
* input snapshots;
* rule version;
* evaluation timestamps;
* rule-based results;
* LLM results.

---

## Validation

Для server-side validation использовать:

**Zod**

Один validation schema должен использоваться как контракт входных данных API.

Frontend validation может использовать те же схемы для UX, но серверная validation является обязательной и авторитетной.

---

## LLM

LLM вызывается только из server-side code.

Конкретный provider должен быть изолирован через отдельный LLM service / adapter.

Остальная система не должна напрямую зависеть от конкретного LLM SDK.

Принцип:

```text
Application
    ↓
LLM Service
    ↓
Provider Adapter
    ↓
LLM Provider
```

Это позволяет заменить provider без переписывания основной бизнес-логики.

---

# 3. Высокоуровневая архитектура

```text
┌───────────────────────────────────────────────┐
│                    Browser                    │
│                                               │
│  Questionnaire / Systems / Results / History │
└──────────────────────┬────────────────────────┘
                       │
                       │ HTTP
                       ▼
┌───────────────────────────────────────────────┐
│                  Next.js                      │
│                                               │
│  Route Handlers / Server-side Application     │
│                                               │
│  ┌─────────────┐      ┌───────────────────┐  │
│  │ Validation  │      │ Application Logic │  │
│  └─────────────┘      └─────────┬─────────┘  │
│                                  │            │
│              ┌───────────────────┼────────┐   │
│              ▼                   ▼        ▼   │
│        ┌────────────┐     ┌──────────┐  ┌───┐│
│        │ Rule       │     │ LLM      │  │DB ││
│        │ Engine     │     │ Service  │  │   ││
│        └────────────┘     └────┬─────┘  └───┘│
│                                │             │
└────────────────────────────────┼─────────────┘
                                 ▼
                          External LLM API
```

---

# 4. Архитектурные слои

Проект логически разделяется на следующие слои:

```text
Presentation
    ↓
API
    ↓
Application
    ↓
Domain
    ↓
Infrastructure
```

## Presentation

Отвечает только за UI.

Примеры:

* pages;
* forms;
* cards;
* result views;
* dialogs;
* loading states;
* error states.

Presentation не должна содержать основную бизнес-логику оценки.

---

## API

Отвечает за HTTP interface.

Задачи:

* принять request;
* проверить authentication, если authentication появится в будущем;
* провалидировать input;
* вызвать application service;
* вернуть структурированный response.

API layer не должен самостоятельно содержать десятки бизнес-правил.

---

## Application

Оркестрирует use cases.

Например:

```text
CreateAISystem
GetAISystem
UpdateAISystem
CreateEvaluation
GetEvaluation
ReevaluateAISystem
```

Application layer определяет последовательность действий.

Например:

```text
CreateEvaluation
    ↓
Validate input
    ↓
Load AI system
    ↓
Run Rule Engine
    ↓
Generate LLM explanation
    ↓
Persist Evaluation
    ↓
Return Evaluation
```

---

## Domain

Содержит основную бизнес-логику.

Главный компонент:

**Rule Engine**

Здесь находятся:

* rules;
* findings;
* priorities;
* assessment statuses;
* missing information logic;
* contradiction logic;
* evaluation logic.

Domain logic не должна зависеть от React или browser APIs.

---

## Infrastructure

Отвечает за внешние зависимости:

* Prisma;
* PostgreSQL;
* LLM provider;
* environment variables;
* external services.

Domain и application logic не должны напрямую зависеть от конкретного LLM SDK или Prisma API там, где это можно избежать.

---

# 5. Основные сущности

На первом этапе используются две основные persistence-сущности.

## AI System

Представляет зарегистрированную в приложении KI-System.

Пример:

```text
AISystem
├── id
├── name
├── description
├── department
├── status
├── purpose
├── aiType
├── provider
├── model
├── usageType
├── affectedPersons
├── decisionType
├── dataCategories
├── humanControl
├── transparency
├── responsibility
├── createdAt
└── updatedAt
```

Конкретная структура полей должна быть определена отдельно в `DATA_MODEL.md`.

---

## Evaluation

Представляет одну конкретную оценку AI System.

```text
Evaluation
├── id
├── aiSystemId
├── inputSnapshot
├── ruleVersion
├── overallStatus
├── ruleResult
├── llmResult
├── createdAt
└── ...
```

Evaluation является историческим результатом.

Каждая новая Bewertung создаёт новую Evaluation.

---

# 6. Почему Evaluation хранится отдельно

Нельзя просто изменять один результат внутри AI System.

Например:

```text
10.08.2026
Rule version: 1.0.0
Status: Handlungsbedarf
```

Позже:

```text
11.08.2026
Rule version: 1.1.0
Status: Prüfung erforderlich
```

Обе оценки должны оставаться доступными.

Поэтому:

```text
AISystem
   │
   ├── Evaluation #1
   ├── Evaluation #2
   └── Evaluation #3
```

---

# 7. Input Snapshot

Каждая Evaluation сохраняет snapshot исходных данных.

Это необходимо для auditability.

Например:

```text
Evaluation
├── inputSnapshot
├── ruleVersion
├── ruleResult
├── llmResult
└── createdAt
```

Если AI System позже изменится, старая Evaluation всё равно должна отражать состояние системы на момент оценки.

---

# 8. Evaluation Flow

Основной flow приложения:

```text
User
 ↓
Questionnaire
 ↓
POST /api/evaluations
 ↓
Server Validation
 ↓
Load / create AI System
 ↓
Rule Engine
 ↓
Rule Result
 ↓
LLM Service
 ↓
LLM Result
 ↓
Persist Evaluation
 ↓
Return Evaluation
 ↓
Result Page
```

---

# 9. Server Validation

Все данные, поступающие с клиента, считаются недоверенными.

Нельзя полагаться только на frontend validation.

Flow:

```text
Request
   ↓
Parse JSON
   ↓
Zod validation
   ↓
Invalid?
 ├── YES → 400 response
 └── NO
       ↓
Application logic
```

Frontend validation используется для удобства пользователя.

Backend validation используется для безопасности и корректности системы.

---

# 10. Rule Engine

Rule Engine является центральным бизнес-компонентом.

Он получает нормализованные данные:

```text
EvaluationInput
```

и возвращает:

```text
RuleEvaluation
```

Концептуально:

```text
Input
 ↓
Normalize facts
 ↓
Check contradictions
 ↓
Run rules
 ↓
Collect findings
 ↓
Generate actions
 ↓
Determine overall status
 ↓
Return RuleEvaluation
```

---

# 11. Rule Engine не должен знать о UI

Rule Engine не должен возвращать React-компоненты, CSS-классы или UI-specific значения.

Плохо:

```text
{
  color: "red",
  icon: "warning"
}
```

Хорошо:

```text
{
  severity: "high",
  category: "transparency",
  code: "TRANSPARENCY_DISCLOSURE_MISSING"
}
```

Frontend самостоятельно решает, как визуально представить `severity` и `category`.

---

# 12. Rule IDs

Каждое правило должно иметь стабильный уникальный ID.

Пример:

```text
TRANSPARENCY_DISCLOSURE_MISSING
HUMAN_OVERSIGHT_MISSING
EXTERNAL_PROVIDER_DATA_REVIEW
TRAINING_MISSING
MISSING_CRITICAL_INFORMATION
CONTRADICTORY_INFORMATION
```

Это позволяет:

* тестировать правила;
* хранить findings;
* анализировать результаты;
* менять UI независимо от rule implementation;
* поддерживать versioning.

---

# 13. Rule Version

Все правила принадлежат определённой версии.

Пример:

```text
RULE_VERSION = "1.0.0"
```

Evaluation сохраняет эту версию.

```text
Evaluation
    ruleVersion: "1.0.0"
```

Изменение существенной бизнес-логики должно приводить к изменению версии.

---

# 14. Rule Result

Rule Engine должен возвращать структурированный результат.

Концептуально:

```text
RuleEvaluation
├── overallStatus
├── findings[]
├── actions[]
├── missingInformation[]
├── contradictions[]
├── requiresProfessionalReview
└── ruleVersion
```

Например:

```text
overallStatus:
    ACTION_REQUIRED

findings:
    - TRANSPARENCY_DISCLOSURE_MISSING
    - HUMAN_OVERSIGHT_MISSING

actions:
    - CHECK_TRANSPARENCY
    - DEFINE_HUMAN_REVIEW

missingInformation:
    - RESPONSIBLE_PERSON
```

Точная schema будет определена в `RULES.md`.

---

# 15. Overall Status

Основные статусы:

```text
UNREMARKABLE
ACTION_REQUIRED
REVIEW_REQUIRED
```

В UI они отображаются понятными бизнес-терминами:

```text
Unauffällig
Handlungsbedarf
Prüfung erforderlich
```

Правила определения статуса должны быть детерминированными.

LLM не выбирает `overallStatus`.

---

# 16. Missing Information

Missing information должна быть частью результата Rule Engine.

Например:

```text
missingInformation:
[
    "RESPONSIBLE_PERSON",
    "DATA_TRANSFER_DETAILS"
]
```

Если критически важные данные отсутствуют, система не должна создавать ложное ощущение безопасности.

---

# 17. Contradictions

До или во время оценки должна выполняться проверка противоречий.

Пример:

```text
decisionType:
    FULLY_AUTOMATED

humanControl:
    FULL_REVIEW
```

Если комбинация противоречит сама себе, создаётся finding:

```text
CONTRADICTORY_INFORMATION
```

И система должна объяснить:

> Die Angaben zur Automatisierung und menschlichen Kontrolle sind nicht eindeutig.

---

# 18. LLM Architecture

LLM находится после Rule Engine.

```text
Input
  ↓
Rule Engine
  ↓
Rule Result
  ↓
LLM Service
  ↓
Explanation
```

Не:

```text
Input
  ↓
LLM
  ↓
Compliance Decision
```

---

# 19. LLM Input

LLM должен получать только необходимый контекст.

Пример:

```text
{
  system: {
    name,
    description,
    usage,
    affectedPersons,
    decisionType,
    dataCategories,
    ...
  },

  ruleEvaluation: {
    overallStatus,
    findings,
    actions,
    missingInformation
  }
}
```

Не следует передавать ненужные или чувствительные данные.

---

# 20. LLM Output

LLM должен возвращать структурированный результат.

Концептуально:

```text
LLMResult
├── summary
├── riskExplanation
├── openQuestions[]
└── nextStepsExplanation[]
```

LLM не должен возвращать:

```text
isCompliant: true
```

или:

```text
legalClassification: high-risk
```

если такая классификация не является частью заранее определённой deterministic logic.

---

# 21. LLM Provider Abstraction

Приложение не должно вызывать provider SDK непосредственно из route handler.

Вместо этого:

```text
Route Handler
      ↓
Evaluation Service
      ↓
LLM Service
      ↓
Provider Adapter
      ↓
LLM API
```

Это позволяет:

* заменить provider;
* тестировать приложение без реального LLM;
* создавать mock LLM;
* централизовать error handling;
* контролировать расходы.

---

# 22. LLM Failure Handling

LLM является non-critical enhancement.

Если:

```text
LLM timeout
LLM 429
LLM 500
Invalid response
Provider unavailable
```

основная evaluation всё равно должна быть сохранена.

Результат:

```text
Rule-based assessment:
AVAILABLE

LLM explanation:
UNAVAILABLE
```

Frontend должен показать понятное сообщение, а не сломаться.

---

# 23. API Architecture

Основные API endpoints:

```text
GET    /api/systems
POST   /api/systems

GET    /api/systems/:id
PATCH  /api/systems/:id

POST   /api/systems/:id/evaluations
GET    /api/systems/:id/evaluations

GET    /api/evaluations/:id
```

Точная API specification будет описана отдельно в `API.md`.

---

# 24. Создание Evaluation

Endpoint:

```text
POST /api/systems/:id/evaluations
```

Flow:

```text
Request
 ↓
Validate
 ↓
Load AI System
 ↓
Create input snapshot
 ↓
Run Rule Engine
 ↓
Run LLM
 ↓
Persist Evaluation
 ↓
Return Evaluation
```

Если LLM падает:

```text
Rule Engine
    ↓
SUCCESS

LLM
    ↓
FAILURE

Database
    ↓
Save evaluation with LLM failure state
```

---

# 25. Re-evaluation

Re-evaluation не должна перезаписывать старую Evaluation.

```text
Evaluation #1
Evaluation #2
Evaluation #3
```

Каждая содержит:

* собственный timestamp;
* собственный input snapshot;
* собственную rule version;
* собственный result.

Это позволяет видеть историю изменения оценки.

---

# 26. Frontend Architecture

Frontend организуется вокруг feature-based structure.

Основные features:

```text
systems
questionnaire
evaluations
results
```

Пример:

```text
features/
├── systems/
├── questionnaire/
├── evaluations/
└── results/
```

Shared UI:

```text
components/
├── ui/
└── layout/
```

---

# 27. Frontend Responsibilities

Frontend отвечает за:

* отображение данных;
* пользовательский ввод;
* локальное состояние формы;
* client-side validation для UX;
* loading states;
* error states;
* отображение результатов.

Frontend НЕ отвечает за:

* финальную оценку;
* rule execution;
* secret management;
* LLM API calls;
* authoritative validation.

---

# 28. State Management

Не использовать Redux без необходимости.

Для MVP достаточно:

* React state;
* server state;
* URL state;
* form state.

Если появится необходимость в сложном shared state, решение принимается отдельно.

Не добавлять state management library только ради наличия библиотеки.

---

# 29. Form Architecture

Questionnaire должен быть разбит на логические sections:

```text
Grunddaten
Zweck
KI-Einsatz
Betroffene Personen
Entscheidung
Daten
Kontrolle
Transparenz
Verantwortung
```

Форма должна использовать условные вопросы.

Например:

```text
"Interagieren externe Personen direkt mit dem System?"
```

Если:

```text
YES
```

может появиться:

```text
"Gibt es einen Hinweis auf die KI-Nutzung?"
```

Таким образом пользователь не отвечает на нерелевантные вопросы.

---

# 30. Demo Data

Demo cases должны находиться в отдельном источнике данных.

Например:

```text
demo/
├── customer-service-chatbot
├── cv-screening
└── sales-copilot
```

Demo data должна проходить через тот же application flow, что и обычные пользовательские данные.

Нельзя создавать отдельную fake evaluation logic только для demo.

---

# 31. Database Access

Prisma Client должен быть централизован.

Не создавать новый Prisma Client в каждом файле.

Использовать единый database layer.

Концептуально:

```text
Infrastructure
└── database
    └── prisma
```

Application services работают с database abstraction, а не с SQL непосредственно.

---

# 32. Security Boundaries

Главная граница доверия:

```text
Browser = untrusted
Server = trusted execution environment
Database = protected persistence
LLM = external service
```

Следовательно:

```text
Browser
   ↓ untrusted input
Server validation
   ↓
Business logic
   ↓
Database / LLM
```

Никогда:

```text
Browser
   ↓
LLM API key
```

---

# 33. Environment Variables

Secrets хранятся только в environment variables.

Например:

```text
DATABASE_URL
LLM_API_KEY
LLM_MODEL
```

`.env` не должен попадать в Git.

В repository должен находиться только:

```text
.env.example
```

без настоящих секретов.

---

# 34. Error Architecture

Ошибки должны быть разделены.

Например:

```text
400
Invalid input

404
AI System not found

409
Conflict / invalid state

500
Internal server error

503
LLM provider unavailable
```

Frontend получает структурированный error response.

Не отдавать пользователю stack traces или внутренние ошибки базы данных.

---

# 35. Testing Architecture

Минимально тестируются:

### Rule Engine

Это наиболее важная часть для unit tests.

Тесты должны проверять:

```text
input → expected rule result
```

Например:

```text
external chatbot
+
no disclosure
=
TRANSPARENCY_DISCLOSURE_MISSING
```

### Contradiction detection

Проверить известные конфликтующие комбинации.

### Validation

Проверить:

* invalid enum;
* missing required fields;
* invalid values;
* malformed input.

### LLM

Реальный LLM не должен быть обязательным для большинства automated tests.

Использовать mock adapter.

---

# 36. Testability

Архитектура должна позволять тестировать Rule Engine без:

* Next.js;
* browser;
* PostgreSQL;
* LLM API.

Например:

```text
evaluateRules(input)
```

должна быть обычной детерминированной функцией.

Это позволяет быстро запускать unit tests.

---

# 37. Suggested Folder Structure

Предварительная структура:

```text
ki-system-check/
│
├── app/
│   ├── page.tsx
│   │
│   ├── systems/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── evaluations/
│   │           └── page.tsx
│   │
│   └── api/
│       ├── systems/
│       │   ├── route.ts
│       │   └── [id]/
│       │       ├── route.ts
│       │       └── evaluations/
│       │           └── route.ts
│       │
│       └── evaluations/
│           └── [id]/
│               └── route.ts
│
├── components/
│   ├── ui/
│   └── layout/
│
├── features/
│   ├── systems/
│   ├── questionnaire/
│   ├── evaluations/
│   └── results/
│
├── server/
│   ├── application/
│   │   ├── systems/
│   │   └── evaluations/
│   │
│   ├── domain/
│   │   ├── rules/
│   │   ├── evaluation/
│   │   └── types/
│   │
│   └── infrastructure/
│       ├── database/
│       └── llm/
│
├── lib/
│   ├── validation/
│   └── utils/
│
├── prisma/
│   └── schema.prisma
│
├── tests/
│   ├── rules/
│   ├── validation/
│   └── application/
│
├── demo/
│   └── ...
│
├── public/
│
├── base.md
├── ARCHITECTURE.md
├── RULES.md
├── DATA_MODEL.md
├── API.md
├── LLM.md
├── SECURITY.md
├── README.md
└── AI_USAGE.md
```

Эта структура является предварительной.

Не следует создавать файлы или директории только потому, что они перечислены здесь. Если конкретный файл не нужен после детализации архитектуры, его можно убрать.

---

# 38. Dependency Direction

Зависимости должны двигаться внутрь:

```text
Presentation
    ↓
API
    ↓
Application
    ↓
Domain
```

Infrastructure подключается к application/domain через необходимые interfaces.

Domain не должен импортировать:

* React;
* Next.js;
* Prisma;
* конкретный LLM SDK.

Это делает основную бизнес-логику независимой и тестируемой.

---

# 39. Главный Evaluation Service

Основной application use case можно концептуально представить так:

```text
EvaluationService
```

Он оркестрирует:

```text
Validation
    ↓
RuleEngine
    ↓
LLMService
    ↓
EvaluationRepository
```

Но сам EvaluationService не должен содержать конкретные правила.

Он только управляет процессом.

---

# 40. Что происходит при создании оценки

Полный flow:

```text
1. Browser sends questionnaire
           ↓
2. API validates request
           ↓
3. Application loads AI System
           ↓
4. Application creates immutable input snapshot
           ↓
5. Rule Engine evaluates facts
           ↓
6. Rule Engine detects:
      - findings
      - missing information
      - contradictions
      - actions
      - overall status
           ↓
7. LLM receives:
      - structured system data
      - rule findings
      - actions
      - missing information
           ↓
8. LLM generates business explanation
           ↓
9. LLM output is validated
           ↓
10. Evaluation is persisted
           ↓
11. API returns structured evaluation
           ↓
12. Frontend renders result
```

---

# 41. Что происходит при ошибке LLM

```text
Rule Engine
    ↓
SUCCESS
    ↓
LLM
    ↓
FAILURE
    ↓
Persist rule result
    ↓
Persist LLM unavailable state
    ↓
Return evaluation
```

Система не должна превращать:

```text
LLM unavailable
```

в:

```text
Evaluation unavailable
```

---

# 42. Что происходит при отсутствии данных

Например:

```text
responsiblePerson = null
```

Rule Engine определяет:

```text
missingInformation:
    RESPONSIBLE_PERSON
```

Если информация критична:

```text
overallStatus:
    REVIEW_REQUIRED
```

или другой статус согласно правилам.

Нельзя:

```text
missing data
    ↓
assume safe
```

---

# 43. Что происходит при противоречии

```text
Input
 ↓
Contradiction Detection
 ↓
CONTRADICTORY_INFORMATION
 ↓
Evaluation cannot confidently determine status
```

UI должен показать:

> Die Angaben sind widersprüchlich. Eine sichere Einschätzung ist derzeit nicht möglich.

---

# 44. UI / Backend Contract

Frontend не должен знать внутреннюю структуру Rule Engine.

Frontend получает DTO:

```text
EvaluationResponse
```

Например:

```text
{
  id,
  status,
  ruleVersion,
  evaluatedAt,
  findings,
  actions,
  missingInformation,
  contradictions,
  professionalReviewRequired,
  llmExplanation
}
```

Это позволяет менять внутреннюю реализацию Rule Engine без изменения UI.

---

# 45. Design Principles

UI должен соответствовать целевой аудитории:

* Geschäftsführer;
* Bereichsleiter;
* KI-Verantwortliche.

Поэтому:

* минимум технического жаргона;
* короткие тексты;
* четкая визуальная иерархия;
* понятные статусы;
* конкретные действия;
* спокойный B2B дизайн;
* отсутствие визуального перегруза.

Результат должен отвечать на три вопроса:

> **Was ist das Thema?**

> **Warum ist es wichtig?**

> **Was sollten wir jetzt tun?**

---

# 46. Что намеренно не делаем

Не добавлять архитектурную сложность без требования.

Не использовать:

* microservices;
* отдельный Express API;
* Redis;
* message broker;
* Kubernetes;
* Redux;
* authentication;
* background workers;

если конкретная функциональная необходимость не появится.

Цель — качественный прототип, а не демонстрация количества технологий.

---

# 47. Архитектурный принцип для AI coding agent

AI coding agent должен рассматривать этот файл как архитектурный контракт.

Agent должен:

1. следовать существующей архитектуре;
2. не менять stack без необходимости;
3. не добавлять новые библиотеки без причины;
4. не придумывать отсутствующие API;
5. не придумывать модели данных;
6. не придумывать environment variables;
7. не создавать дополнительные сервисы без требования;
8. не переносить Rule Engine во frontend;
9. не переносить LLM API key во frontend;
10. не заменять deterministic rules LLM-логикой.

Если для реализации не хватает информации:

> **не придумывать значение молча.**

Сначала проверить существующие файлы проекта, документацию и доступные конфигурации.

Если информация действительно отсутствует и влияет на корректность реализации, остановиться на границе этой неопределенности и явно сообщить о ней.

---

# 48. Архитектурный итог

Итоговая система:

```text
                    ┌─────────────────┐
                    │     Browser     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Next.js      │
                    │                 │
                    │  UI + API       │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Application   │
                    │     Layer       │
                    └───────┬─┬───────┘
                            │ │
              ┌─────────────┘ └──────────────┐
              ▼                              ▼
      ┌───────────────┐              ┌───────────────┐
      │  Rule Engine  │              │  LLM Service  │
      │               │              │               │
      │ deterministic │              │ explanation   │
      └───────┬───────┘              └───────┬───────┘
              │                              │
              └──────────────┬───────────────┘
                             ▼
                    ┌─────────────────┐
                    │    Evaluation   │
                    │     Result      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │                 │
                    │ Systems         │
                    │ Evaluations     │
                    │ Snapshots       │
                    └─────────────────┘
```

Главное разделение ответственности:

```text
User input
    ↓
Validation
    ↓
Rules → determine
    ↓
LLM → explain
    ↓
Database → remember
    ↓
UI → communicate
```

Это является основной архитектурой проекта.
