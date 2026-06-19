# System Architecture

## High-Level Architecture

```text
User
│
▼
React Frontend
│
▼
Express Backend
│
▼
Gemini API
│
▼
Study Plan Generation
│
▼
Progress Tracking
│
▼
Adaptive Recommendation Engine
```

---

## Layered Architecture

### 1. UI Layer

Responsibilities:

* Collect user inputs
* Display study plans
* Track progress
* Present recommendations

Technologies:

* React
* TypeScript
* Tailwind CSS

---

### 2. AI Layer

Responsibilities:

* Analyze learning goals
* Generate study plans
* Produce recommendations

Technologies:

* Gemini API

---

### 3. Tool Layer

Core Agent Functions:

```text
generateStudyPlan()
trackProgress()
updateSchedule()
evaluateCompletion()
```

Responsibilities:

* Encapsulate business logic
* Provide reusable functionality
* Support adaptive workflows

---

### 4. State Layer

Responsibilities:

* Maintain progress state
* Store completion status
* Support future recommendations

State Examples:

```text
Learning Goal
Completed Tasks
Progress Percentage
Recommendation History
```

---

### 5. Evaluation Layer

Responsibilities:

* Assess recommendation quality
* Monitor adaptation effectiveness
* Improve future outputs

Evaluation Dimensions:

```text
Accuracy
Consistency
Adaptability
User Experience
```

---

## Agent-Oriented View

```text
User
↓
Gemini Agent
↓
Planning Skill
↓
Tracking Skill
↓
Recommendation Skill
↓
Updated Learning Strategy
```

---

## Future Architecture

```text
User
↓
Frontend
↓
Agent Runtime
├── Planner Agent
├── Progress Agent
├── Evaluation Agent
└── Recommendation Agent
↓
External Tools (MCP)
↓
Knowledge Sources
```

This architecture prepares the project for future expansion into a multi-agent learning platform.
