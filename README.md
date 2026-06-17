<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# 🧠 AI Study Plan Recommender

> An AI-powered personalized learning planner that generates structured weekly study curricula, tracks progress in real time, and adapts learning paths using the Gemini API.

---

## 🛠 Tech Stack

- React
- TypeScript
- Node.js (Express)
- Vite
- Gemini API (@google/genai)
- Tailwind CSS
- dotenv

---

## ✨ Key Features

- 🎯 Personalized study plan generation based on user input
- 📅 Weekly curriculum breakdown with structured learning paths
- 📊 Real-time progress tracking with checklist system
- ✅ 100% completion state visualization
- 🧠 AI-powered adaptive recommendations using Gemini API
- 💾 Persistent state management for user progress

---

## 🚀 Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
2. Set your Gemini API key in .env.local:
   GEMINI_API_KEY=your_api_key_here
3. Start development server:
   `npm run dev`


---   
## 📸 Project Flow

### 1. Input Screen
<div align="center">
<img src="./public/screenshots/home.png" width="80%" />
</div>

---

### 2. AI Generated Plan
<div align="center">
<img src="./public/screenshots/result.png" width="80%" />
</div>

---

### 3. Progress Tracking
<div align="center">
<img src="./public/screenshots/progress.png" width="80%" />
</div>

---

### 4. Completion (100%)
<div align="center">
<img src="./public/screenshots/complete.png" width="80%" />
</div>

---

## 🧠 AI Agent Architecture (ADK / Agent Skills Inspired Design)

This project is designed with concepts inspired by Agent-based AI systems and workflow orchestration patterns.

---

### 🔹 System Structure

- **Agent Layer**: Gemini API acts as the reasoning engine for generating personalized study plans
- **Tool Layer**: 4 core utility functions handle:
  - plan generation
  - progress tracking
  - schedule adaptation
  - completion evaluation
- **Workflow Layer**: User interaction flows through:
  input → plan generation → tracking → adaptation → completion

---

### 🔹 Conceptual Mapping (Day 3 Alignment)

- Agent → Gemini-powered planner logic
- Tools → study plan / progress / evaluation functions
- Workflow → user learning lifecycle
- Nodes → each study phase (input, planning, tracking, completion)
- Edges → transitions between learning states

---

### 🔹 Design Philosophy

- Inspired by ADK 2.0 Agent Skills architecture
- Progressive disclosure of learning content
- State-based adaptive learning system
- Modular function-based architecture instead of monolithic logic

---

 ### 🔧 Core Functions

This project includes 4 core functions that act as the system’s “tool layer”:

1. generateStudyPlan()
2. trackProgress()
3. updateSchedule()
4. evaluateCompletion()

These functions simulate an Agent "Tool system" similar to ADK tools.
