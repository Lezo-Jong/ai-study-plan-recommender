# Project Context

## Project Overview

AI Study Plan Recommender is an AI-powered learning assistant designed to generate personalized study plans, monitor user progress, and continuously improve recommendations through adaptive feedback loops.

The project was developed while studying Google's AI Agents Intensive Course and incorporates concepts from:

* Agent Workflows
* MCP (Model Context Protocol)
* Agent Skills
* Security & Evaluation
* Spec-Driven Development

---

## Purpose

The primary goal of this project is to help learners create structured study plans and dynamically adjust learning strategies based on progress and completion history.

The system aims to:

* Generate personalized learning roadmaps
* Track study progress
* Adapt future recommendations
* Improve learning efficiency
* Demonstrate Agent-inspired AI architecture

---

## Core Agent Principles

### Workflow

The system follows a structured workflow from user input to recommendation generation.

### Tools

Core functions act as lightweight Agent Tools.

### State

User progress serves as the system state.

### Skills

Reusable reasoning skills support planning, tracking, and recommendation generation.

### Evaluation

System quality is continuously assessed through feedback and adaptation.

---

## Security Rules

### API Security

* Never expose API keys
* Store secrets in environment variables
* Avoid hardcoded credentials

### User Safety

* Validate user inputs before processing
* Sanitize user-provided content
* Prevent prompt injection where possible

### Privacy

* Do not store sensitive personal information
* Avoid collecting unnecessary user data
* Minimize exposure of learning history

### AI Safety

* Restrict model behavior to study-planning tasks
* Avoid generating harmful or misleading recommendations
* Maintain transparent AI interactions

---

## Coding Standards

### Architecture

* Prefer modular functions
* Separate UI and business logic
* Maintain clear component boundaries
* Follow reusable design patterns

### State Management

* Keep state transitions predictable
* Track user progress consistently
* Avoid hidden side effects

### Documentation

* Document major workflow changes
* Keep architecture documentation updated
* Maintain clear function descriptions

---

## Evaluation Goals

The system should be evaluated beyond simple correctness.

### Functional Quality

* Accurate study plan generation
* Reliable progress tracking
* Consistent recommendation updates

### User Experience

* Clear workflows
* Intuitive interactions
* Helpful feedback

### Agent Performance

* Adaptation quality
* Recommendation relevance
* Learning efficiency improvements

---

## Future Vision

This project serves as a foundation for future Agent-based learning systems.

Potential extensions include:

* Long-term memory
* Multi-agent collaboration
* LLM-as-a-Judge evaluation
* MCP integrations
* Cloud-hosted Agent Runtime
* Analytics dashboards
