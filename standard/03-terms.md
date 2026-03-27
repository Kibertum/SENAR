# 3. Terms and Definitions

For complete glossary, see SENAR Reference.

**Configuration notation:** Where normative requirements differ by configuration, this standard uses the notation `[Team+: SHALL]` to indicate that a requirement is SHOULD at Team but SHALL at Enterprise configuration. See Section 11 for configuration definitions. For entry-level adoption, see SENAR Core.

## 3.1 AI Agent
A software system powered by a large language model that generates engineering artifacts under human direction. An AI Agent is provided by an AI Model Provider (3.25) and operates at a specific model version.

AI Agents are not stable, deterministic tools. Model versions differ in capability, hallucination profiles, and instruction following behavior. Model version changes are treated as configuration changes (see Section 10.13 for normative requirements).

## 3.2 Supervisor
A human engineer who directs AI agents, verifies output, makes architectural decisions, and enforces Quality Gates. Primary mode is AI-directed work, with manual coding as justified exception (Section 4.1).

## 3.3 Supervisor+AI Pair
The fundamental production unit: one Supervisor working with one or more AI Agents.

## 3.4 Context
The information provided to an AI Agent to produce correct output: goal, acceptance criteria, constraints, knowledge, and traceability links.

## 3.5 Task
The atomic unit of tracked work. Has a goal, acceptance criteria, and requirement link.

## 3.6 Exploration
An investigation without full Task formality. Explorations SHOULD be time-bounded (Section 6.1). If it yields implementation work, a Task is created.

## 3.7 Session
A time-bounded period of supervised AI work with defined start and end.

## 3.8 Increment
A scope-bounded batch of work with objectives and planned budget.

## 3.9 Quality Gate
An automated enforcement point that blocks work progression unless criteria are met.

## 3.10 Knowledge Entry
A documented decision, pattern, known issue, or dead end stored in a searchable knowledge base.

## 3.11 Dead End
A documented failed approach with reason for abandonment. A dead end is any investigation that takes more than 15 minutes without producing a usable result. When this threshold is reached, the Supervisor stops, documents the approach and reason for failure, and chooses an alternative path. For normative requirements governing Dead End handling, see Section 10.4.

## 3.12 Checkpoint
A context preservation action during a Session to prevent work loss.

## 3.13 Gate Bypass
A documented exception allowing work past a Quality Gate. Requires justification, risk acknowledgment, and remediation plan.

## 3.14 Federation
Coordination mechanism for multiple Supervisor+AI Pairs across one or more projects: dependency tracking, shared knowledge, cross-project alerts. See Section 5.7 for federation requirements when managing multiple projects.

## 3.15 Cycle Time

Time from Task start to Task completion (`started_at → completed_at`). Distinguishes execution time from queue time (compare with Lead Time: `created_at → completed_at`).

## 3.16 Story
An intermediate grouping of Tasks representing a deliverable visible to stakeholders.

## 3.17 Requirement
A documented, verifiable statement of a need, capability, or constraint that the system must satisfy. SENAR defines three requirement levels: Business Requirement (3.18), System Requirement (3.19), and Task Requirement (3.20). A Task's goal and acceptance criteria constitute requirements at the TR level.

## 3.18 Business Requirement (BR)
A stakeholder-level need expressed in business terms. Source of all downstream requirements. Typically corresponds to an Increment objective or Epic goal.

## 3.19 System Requirement (SR)
A system-level capability or constraint derived from one or more Business Requirements. Expressed in terms of system behavior, not implementation. Typically corresponds to a Story goal.

## 3.20 Task Requirement (TR)
An implementation-level requirement decomposed from a Business or System Requirement. Corresponds to a Task's goal and acceptance criteria. The lowest level at which requirements are formally managed; test cases are verification artifacts derived from TRs, not a requirement level.

## 3.21 Requirement Hierarchy
The decomposition chain from business need to implementation unit: BR → SR → TR. Not all levels are required for all work; depth is determined by the Context Architect based on complexity and regulatory context (see Section 8.2).

## 3.22 Test Model (TM)
A verification artifact derived from Task Requirements that defines how each TR will be verified: test cases, test data, expected results, and verification method (automated test, manual demonstration, measurement). The Test Model is NOT a requirement level — it is the bridge between requirements and verification. In AI-native development, AI typically generates tests from TRs; the Supervisor verifies that generated tests actually exercise the stated acceptance criteria.

The level of Test Model formality scales by configuration — see Section 11 and QG-2 (Section 8.3) for normative requirements.

## 3.23 Code Documentation
Module-level, API-level, and architectural documentation that serves as persistent context for AI Agents. In AI-native development, code documentation has a dual audience: human Supervisors and AI Agents. Self-contained, machine-readable documentation reduces per-Task context overhead and improves AI output quality.

## 3.24 Traceability
The ability to trace every engineering artifact back to its originating requirement through a chain of linked references. Bidirectional: every TR traces up to a BR; every BR decomposes to at least one TR. Full traceability chain: BR → SR → TR → TM → Code.

## 3.25 AI Model Provider
An external service that provides AI model inference capabilities (e.g., cloud AI inference APIs, on-premise model servers). AI Model Providers are de facto suppliers — the AI model is the primary production tool, equivalent to a compiler. Model capabilities, limitations, and pricing change with provider decisions outside the organization's control.

## 3.26 AI Model Version
A specific release of an AI model, identified by provider designation. Version changes may affect output quality, cost, and behavioral characteristics. Different versions differ in capability, hallucination profiles, cost, and instruction-following behavior. Metric baselines (FPSR, cost/task) are version-dependent — see Section 10.13 for recalibration requirements.

## 3.27 Scope Creep
Unplanned changes to a Task's implementation that go beyond the stated goal and acceptance criteria. In AI-native development, scope creep manifests when AI agents modify code outside the defined scope boundaries, add unrequested features, or refactor existing code not covered by the Task.

## 3.28 Hallucination (AI)
AI-generated output that is plausible but factually incorrect: references to non-existent APIs, methods, CLI flags, or packages; fabricated file paths; confidently stated but wrong assertions about system behavior. In dependency contexts, a hallucinated package is one that does not exist in the official package registry or that resolves to an unexpected maintainer.

## 3.29 WSJF (Weighted Shortest Job First)
A prioritization method calculating the ratio of Cost of Delay to Job Size. Used during Increment Planning (Section 7.1) to order the task pool. Adopted from SAFe without modification.

## 3.30 Value Stream
An end-to-end flow from stakeholder request to delivered, verified software. At Enterprise configuration, Increments are grouped by value stream with unified budgets (Section 11.3).

## 3.31 Adversarial Review
Independent review of AI-generated output by an agent that has no access to the generating agent's session context or reasoning. See Section 10.15, L3.

## 3.32 Agent Dispatch
Delegation of a Task or sub-task to a separate AI agent instance, typically operating in an isolated environment. See Section 5.6.

## 3.33 Agent Profile
A named configuration of scripts, permissions, and context that defines the capabilities and boundaries of an AI agent performing a specific function. See Section 5.2.

## 3.34 Structured Tool Protocol
A protocol enabling structured interaction between AI agents and platform services, providing self-describing tool schemas, atomic operations, and audit logging. See Section 5.5.

NOTE: Examples of qualifying protocols include Model Context Protocol (MCP), OpenAI function calling, and custom API interfaces.

## 3.35 Operational Script
A structured natural-language instruction that defines how an AI agent performs a specific action, containing trigger, preconditions, algorithm, postconditions, and outputs. See Section 5.3.

## 3.36 Adversarial Detection Rate (ADR)
Metric measuring the density of CRITICAL-severity findings discovered by adversarial review per task that underwent L3 review. Formula: `adversarial_critical_findings / L3_reviewed_tasks`. See Section 9.2.

## 3.37 Code Standards
A document defining mandatory code quality rules, loaded into AI agent context to guide implementation. Covers security, architecture, database, API, concurrency, and testing patterns. See Section 10.15, L2.

## 3.38 Latent Defect
AI-generated code that appears correct at surface level — passing automated checks, type validation, and self-review — but contains hidden defects (security bypasses, logic errors, architectural violations) detectable only through independent adversarial review. Latent defects arise when AI generates code by pattern matching rather than semantic understanding. See Section 10.15.

## 3.39 FPSR (First-Pass Success Rate)
The percentage of Tasks that meet all Acceptance Criteria on the first verification attempt, without requiring rework. See Section 9.1 for definition and measurement requirements.

## 3.40 Quality Sweep
A structured end-of-Increment review covering metrics, open defects, knowledge base coverage, and traceability completeness. See Section 7.4 for normative requirements.

## 3.41 Flow Manager
A Supervisor role responsible for cross-team coordination, dependency tracking, and flow efficiency within a Federation. See Section 4.4 for role definition and responsibilities.

## 3.42 Context Architect
A Supervisor role responsible for designing and maintaining the knowledge architecture, context loading strategies, and documentation standards that enable effective AI-directed work. See Section 4.2 for role definition and responsibilities.

## 3.43 Knowledge Engineer
A Supervisor role responsible for capturing, structuring, and maintaining the organization's Knowledge Entries, dead ends, and reusable patterns. See Section 4.3 for role definition and responsibilities.

## 3.44 Verification Engineer
A Supervisor role responsible for designing the Test Model, executing adversarial reviews, and enforcing Quality Gates. See Section 4.5 for role definition and responsibilities.
