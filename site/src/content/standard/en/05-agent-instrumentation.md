# 5. Agent Instrumentation

## 5.1 Overview

AI-native development requires explicit management of the AI agent's behavior, capabilities, and constraints. This section defines how organizations SHALL configure, version, and govern the instruments that control AI agent behavior.

Agent instrumentation operates at three levels:

| Level | Artifact | Purpose | Analogy |
|-------|----------|---------|---------|
| Behavioral Contract | Project rules file | Define boundaries, prohibitions, conventions | Job description |
| Operational Scripts | Procedural instructions | Algorithmic steps for specific actions | Machine work instructions |
| Programmatic Interface | API / Tools / Hooks | Instruments for agent-platform interaction | Machine control panel |

Each level SHALL be version-controlled and subject to change management (see Section 10.14).

## 5.2 Agent Profiles

An Agent Profile defines a specific configuration of scripts, permissions, and context for an AI agent performing a particular function.

Organizations SHALL define at minimum the following profiles:

| Profile | Scripts | Access | Purpose |
|---------|---------|--------|---------|
| Generator | Implementation, commit, debug | Read/write code and tasks | Primary development |
| Reviewer | Review, security audit | Read-only code and tasks | Independent verification |
| Planner | Planning, retrospective | Write epics/stories, read all | Architecture, decomposition |
| Documenter | Documentation | Write knowledge base | Documentation and knowledge capture |
| Verifier | Quality sweep, testing | Read all, write findings | Quality audit |

**Separation of concerns:** A Reviewer profile SHALL NOT have write access to the artifacts being reviewed. This separation is the foundation of adversarial review — the same agent cannot both generate and approve its own output.

Organizations MAY define additional profiles. One physical AI agent MAY switch between profiles within a session, provided each profile switch is logged.

NOTE: At Foundation configuration (1–3 Pairs), organizations MAY use fewer than five profiles. The 5-profile requirement is SHOULD at Foundation, SHALL at Team+. Foundation teams typically combine Generator and Reviewer into fewer profiles matching their combined role structure (Section 4.8, Section 11.1).

Team configuration: Organizations SHALL define all five profiles with enforced permission boundaries.
Enterprise configuration: Organizations SHALL define all five profiles with enforced permission boundaries and audit trail for profile switches.

## 5.3 Operational Scripts

An Operational Script is a structured natural-language instruction that defines how an AI agent performs a specific action. Scripts are the primary mechanism for encoding organizational process into agent behavior.

### 5.3.1 Script Structure

Each script SHOULD contain:
- **Trigger**: When the script is invoked (command, event, condition)
- **Preconditions**: What must be true before execution
- **Algorithm**: Numbered steps with decision points
- **Postconditions**: What must be true after execution
- **Outputs**: What the script produces (artifacts, state changes, reports)

### 5.3.2 Script Governance

Scripts define agent behavior. Changing a script changes the production process. For the operational rule governing script changes, see Section 10.14.

SHALL (all configurations):
- Operational scripts stored in version control system
- Script changes reviewed before deployment (as code changes)
- Decision to change a script recorded in knowledge base with rationale

SHALL (Team+ configurations):
- Script changes tested on an isolated project before propagation to all projects
- Active script registry maintained with version identifiers
- Rollback capability: any script change can be reverted to previous version
- Script change audit trail maintained

SHOULD:
- Scripts have acceptance criteria (what the script does, does not do, edge cases)
- Script effectiveness tracked via metrics (e.g., FPSR of tasks executed under a given script)

## 5.4 Programmatic Interface

The Programmatic Interface defines what tools, APIs, and automated actions are available to the AI agent.

### 5.4.1 Tool Inventory

Organizations SHALL maintain an inventory of tools available to each Agent Profile:
- Which API endpoints are accessible
- Which file system operations are permitted
- Which external services are reachable
- Which actions require human confirmation

### 5.4.2 Principle of Least Privilege

Each Agent Profile SHALL have access only to the tools required for its function:
- A Reviewer SHALL NOT have write access to production code
- A Generator SHALL NOT have access to deployment credentials
- A Verifier SHALL NOT have access to modify quality gate results

### 5.4.3 Automated Actions (Hooks)

Organizations MAY define automated actions triggered by events:
- Post-session: metrics collection, knowledge sync
- Post-task-completion: quality gate validation, notification
- Pre-commit: lint check, security scan

Hooks SHALL be version-controlled alongside scripts.

## 5.5 Security Boundaries

### 5.5.1 Prompt Injection Defense

Organizations SHALL ensure that AI agents do not process untrusted user-supplied content as instructions. When agents read external data (user input, file contents, API responses), that data SHALL be treated as data, not as commands. Operational Scripts SHOULD include explicit instruction boundaries.

**Practical measures:**

a) Agent prompts SHALL clearly delimit system instructions from user-supplied data;
b) External data ingested by agents (API responses, file contents, database records) SHALL NOT be interpreted as agent commands or modifications to the agent's behavioral contract;
c) Organizations SHOULD test agent configurations against known prompt injection patterns as part of Quality Sweeps (Section 7.4).

## 5.6 Structured Tool Protocol

Organizations SHALL expose platform capabilities through a structured, self-describing tool protocol rather than CLI commands or direct database access. The chosen protocol SHOULD provide:

a) Self-describing schemas — the agent receives tool definitions with parameter types and descriptions, reducing hallucinated arguments;
b) Atomic operations — each tool invocation is a single transaction, avoiding the "chained command" failure mode;
c) Structured input/output — eliminating parsing errors from text-based CLI output;
d) Audit logging — every tool invocation is recorded with parameters and results.

NOTE: Examples of qualifying protocols include Model Context Protocol (MCP), OpenAI function calling, and custom REST/gRPC tool APIs.

**CLI as fallback:** CLI commands SHOULD remain available when the structured tool protocol is unavailable. Organizations SHALL document which operations have CLI fallback and which are protocol-only.

**Direct database access:** AI agents SHALL NOT use direct database access for write operations. Read operations MAY use direct access for debugging, but production workflows SHALL use protocol or CLI abstractions.

## 5.7 Agent Dispatch and Execution Isolation

Agent dispatch — delegating a Task or sub-task to a separate AI agent instance — introduces unique risks:

a) The dispatched agent operates with reduced context (no session history, limited knowledge);
b) Multiple dispatched agents may modify the same files concurrently;
c) The Supervisor cannot observe the dispatched agent's reasoning in real-time.

Organizations using agent dispatch SHALL:

1. **Isolate**: dispatched agents SHOULD work in isolated working copies to prevent file conflicts;
NOTE: Examples of isolation mechanisms include version control worktrees, separate repository checkouts, containerized build environments, and ephemeral cloud workspaces.
2. **Scope**: dispatch prompts SHALL include explicit boundaries — which files to modify, which to leave unchanged;
3. **Review**: all dispatched agent output SHALL undergo L3 Adversarial Review (Section 10.15) — agent dispatch is the highest-risk scenario for latent defects. For Foundation configuration, L2 Review with High-tier checklist MAY substitute when independent agent access is unavailable (Section 10.15);
4. **Context**: dispatch prompts SHOULD include relevant Code Standards, architectural constraints, and known issues from the knowledge base;
5. **Limit**: organizations SHALL define a maximum parallel dispatch count per Supervisor (Section 10.7 applies).

Dispatched agents SHALL NOT:
- Modify files outside the scoped boundary without explicit approval;
- Commit directly to shared branches;
- Access other agents' isolated working copies or session state.

**Pattern:** Supervisor dispatches → agent works in isolated copy → agent returns result → Supervisor reviews → Supervisor merges to main branch.

## 5.8 Federation — Scaling SENAR Across Projects

When an organization manages multiple projects (a "federation"), SENAR practices scale with additional coordination requirements.

### 5.8.1 Project Independence

Each project in a federation SHALL maintain its own:
- Task tracker and session history
- Knowledge base (patterns, known issues, dead ends)
- Metric baselines and targets
- Agent configuration (profiles, scripts, permissions)

### 5.8.2 Cross-Project Coordination

A federation SHOULD designate a coordination project (analogous to a SAFe Release Train Engineer) responsible for:
- Cross-project dependency tracking
- Federated knowledge routing (a pattern discovered in Project A that affects Project B)
- Aggregate metrics (federation-level throughput, cost, quality)
- Shared Code Standards and review criteria

### 5.8.3 Knowledge Routing

Knowledge entries SHALL be scoped:
- **Project-specific**: patterns, known issues, and decisions relevant only to one project — stored in that project's knowledge base;
- **Cross-project**: patterns affecting multiple projects (e.g., API contract changes, shared library updates) — stored in the coordination project and routed to affected projects;
- **Global**: methodology-level insights — stored in the coordination project, available to all.

Organizations SHALL define routing rules: which knowledge types are automatically shared vs. manually promoted.

Cross-project knowledge entries SHALL require approval from the receiving project's Supervisor before entering that project's active context. Global knowledge entries SHALL require coordination project Supervisor approval. Knowledge entries that reference security-sensitive topics (authentication, authorization, encryption, secrets, CORS, CSRF, permissions) SHALL be flagged for human review regardless of routing rules.

### 5.8.4 Federated Metrics

Federation-level metrics aggregate project metrics:

| Metric | Federation Computation |
|--------|----------------------|
| Throughput | Sum of project throughputs (tasks/session across all projects) |
| FPSR | Weighted average by project task count |
| DER | Weighted average by project task count |
| ADR | Weighted average by project agent task count |
| Cost | Sum of project costs |

Organizations SHALL NOT compare raw metric values across projects with different stacks, team sizes, or maturity levels. Comparison SHOULD use normalized metrics (e.g., cost per story point by complexity).

## 5.9 Portability

This standard is not bound to any specific AI agent, tool, or platform.

Operational Scripts SHOULD be written in structured natural language interpretable by any AI agent of sufficient capability:
- Clear algorithmic steps (not platform-specific SDK calls)
- Explicit inputs and outputs per step
- Conditional logic expressed in natural language
- No assumptions about specific tool implementations

The Programmatic Interface MAY be platform-specific (structured tool protocols, function calling APIs, etc.), but the Behavioral Contract and Operational Scripts SHALL be portable across AI agent implementations.

When migrating between AI platforms, organizations SHALL:
- Verify that all Operational Scripts execute correctly on the new platform
- Recalibrate baseline metrics (Section 10.13: AI Model Governance)
- Update the Programmatic Interface layer while preserving Contract and Script layers
