# 1. Scope

## 1.1 Purpose

SENAR defines a methodology for software development where AI agents are the primary producers of engineering artifacts and human engineers serve as Supervisors — directing, verifying, and governing the AI-driven process.

## 1.2 Intended Audience

- **Organizations** transitioning to AI-native software development;
- **Supervisors** — engineers who direct AI agents;
- **Managers** responsible for delivery, quality, and cost;
- **Tool vendors** building AI-native development platforms;
- **Auditors** evaluating quality practices of AI-native teams.

## 1.3 Applicability

This standard applies where:

a) AI agents generate a substantial portion of production artifacts (code, tests, configuration, documentation);
b) Human engineers direct, review, and approve AI-generated output;
c) Traceability from requirements to delivered artifacts is required;
d) Quality assurance is enforced through automated mechanisms.

SENAR is tool-agnostic. It applies to any AI coding platform — autonomous agents, IDE assistants, terminal-based tools, or custom pipelines.

## 1.4 Out of Scope

a) AI model training, fine-tuning, or evaluation;
b) Traditional development where humans write the majority of code;
c) Organizational change management;
d) Specific tool implementations.

## 1.5 Relationship to Other Standards

SENAR extends and adapts concepts from established methodologies:

- **SAFe 6.0** — SENAR reimagines SAFe concepts for AI-native teams. SAFe comparison notes are provided throughout the document.
- **ISO 9001:2015** — SENAR Quality Gates support selected ISO 9001 clauses. Organizations should conduct gap analysis for full compliance.
- **ISO/IEC 25010:2023** — SENAR metrics align with the software quality model.
- **Scrum / Kanban** — SENAR borrows iterative delivery and flow measurement while replacing human-centric ceremonies with AI-appropriate alternatives.

SENAR may be extended with domain-specific profiles for regulated industries (medical devices, financial services, aerospace) that add controls required by sector-specific standards.
