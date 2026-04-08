# SENAR Reference: Tooling Requirements

This document specifies what tooling must support for each SENAR component. Requirements are split into two tiers:

- **Core/Foundation** — minimum for SENAR Core (1 Pair) and Foundation (1-3 Pairs) configurations, Maturity Level 2
- **Team+** — full requirements for SENAR Team and Enterprise configurations (3+ Pairs, Maturity Level 3+)

SENAR is tool-agnostic by design. These are capability requirements, not product recommendations.

---

## 1. Task Tracker

The task tracker is the system of record for all units of work. Every Task, Story, and Increment lives here.

### 1.1 Required Fields

| Field | Type | Core/Foundation | Team+ | Notes |
|-------|------|-----------------|-------|-------|
| `goal` | Text | SHALL | SHALL | What the Task must accomplish, stated as an outcome |
| `acceptance_criteria` | Text | SHALL | SHALL | Verifiable conditions for Task completion |
| `status` | Enum | SHALL | SHALL | Minimum states: `planning`, `active`, `done`, `blocked` |
| `work_type` | Enum | SHALL | SHALL | Values: `dev`, `arch`, `qa`, `docs`, `infra`, `ops` |
| `complexity` | Enum | SHOULD | SHALL | Values: `trivial`, `simple`, `moderate`, `complex` |
| `story_id` | Reference | SHOULD | SHALL | Link to parent Story or requirement |
| `requirement_link` | Reference | SHOULD | SHALL | Traceability link to BR/SR/TR (Standard 3.21) |
| `requirement_level` | Enum | — | SHALL | Values: `BR`, `SR`, `TR` — level of the linked requirement |
| `requirement_status` | Enum | — | SHALL | Values: `draft`, `approved`, `verified`, `deprecated` |
| `requirement_parent` | Reference | — | SHALL | Link to parent requirement (for hierarchy navigation) |
| `attempt_count` | Integer | SHOULD | SHALL | Number of implementation attempts (for FPSR calculation) |
| `created_at` | Timestamp | SHALL | SHALL | Auto-set on creation |
| `started_at` | Timestamp | SHALL | SHALL | Auto-set on transition to `active` |
| `completed_at` | Timestamp | SHALL | SHALL | Auto-set on transition to `done` |
| `session_id` | Reference | SHALL | SHALL | Which Session completed this Task |
| `supervisor_id` | Reference | — | SHALL | Who supervised this Task |
| `bypass_reason` | Text | SHOULD | SHALL | Justification if any Quality Gate was bypassed |
| `knowledge_refs` | List | — | SHOULD | Links to relevant Knowledge Base entries |
| `cross_deps` | List | — | SHALL | Cross-project dependency references |
| `cost` | Numeric | — | SHOULD | Token/API cost for this Task |

### 1.2 Required Automations

| Automation | Core/Foundation | Team+ | Description |
|-----------------|-----------|-------|-------------|
| QG-0 field validation | SHALL | SHALL | Block transition to `active` unless `goal` and `acceptance_criteria` are non-empty |
| State transition timestamps | SHALL | SHALL | Auto-capture `started_at`, `completed_at` on state change |
| State transition rules | SHOULD | SHALL | Enforce valid transitions: `planning` -> `active` -> `done`; `blocked` can enter/exit from any state |
| Attempt counter increment | SHOULD | SHALL | Increment `attempt_count` each time Task returns from `done` to `active` |
| Story completion roll-up | — | SHALL | Auto-calculate Story status from child Task statuses |
| Increment progress tracking | — | SHALL | Dashboard showing Increment completion percentage |
| Bypass tracking | SHOULD | SHALL | Record which gate was bypassed, by whom, with what justification |
| Duplicate detection | — | SHOULD | Warn when a new Task goal closely matches an existing Task |
| Requirement orphan detection | — | SHOULD | Identify requirements without implementation Tasks and Tasks without requirements |
| Requirement change impact | — | SHOULD | When a BR/SR changes, list all affected downstream artifacts |

### 1.3 Required Reports

| Report | Core/Foundation | Team+ | Description |
|--------|-----------------|-------|-------------|
| Throughput | SHALL | SHALL | Tasks completed per Session, with trend over time |
| Lead Time distribution | SHALL | SHALL | Histogram of `completed_at - created_at`, segmented by complexity |
| FPSR | SHALL | SHALL | % of Tasks completed with `attempt_count = 1` |
| DER | SHALL | SHALL | % of Tasks where defects found after `done` status |
| Task status summary | SHALL | SHALL | Count of Tasks by status, filterable by Increment/Session |
| Cycle Time | — | SHALL | `completed_at - started_at` distribution |
| Cost per Task | — | SHALL | Total cost / Tasks done, segmented by complexity and work type |
| Cost Predictability | — | SHALL | Actual vs. planned cost per Increment |
| Bypass rate | — | SHALL | Gate bypasses / total gate evaluations, by gate type |
| Supervisor workload | — | SHOULD | Tasks per Supervisor per Session, with complexity weighting |
| Cross-dependency status | — | SHALL | Status of all cross-project dependencies |

---

## 2. CI/CD Pipeline

Automated enforcement of QG-2 (Implementation Gate) and supporting infrastructure for QG-3 and QG-4.

### 2.1 QG-2: Implementation Gate (Automated)

All checks run on every commit or merge request. Pipeline must block merge if any check fails.

| Check | Core/Foundation | Team+ | Notes |
|-------|-----------------|-------|-------|
| Unit tests pass | SHALL | SHALL | 100% pass rate required |
| Type checking passes | SHALL | SHALL | Language-appropriate: TypeScript strict, mypy, etc. |
| Linter passes | SHALL | SHALL | Zero warnings policy (not just errors) |
| Security scan (dependencies) | SHOULD | SHALL | Known CVE detection in dependencies |
| Security scan (SAST) | — | SHOULD | Static analysis for security anti-patterns |
| Build succeeds | SHALL | SHALL | Clean build from scratch, no cached state |
| Test coverage threshold | SHOULD | SHALL | Configurable minimum (recommendation: 70%+) |
| Dependency change detection | — | SHOULD | Flag new dependencies for review |
| Breaking change detection | — | SHOULD | API compatibility checks for shared interfaces |

**Pipeline configuration requirements:**

| Requirement | Core/Foundation | Team+ |
|------------|-----------------|-------|
| Pipeline runs automatically on push/MR | SHALL | SHALL |
| Pipeline blocks merge on failure | SHALL | SHALL |
| Pipeline results visible to Supervisor | SHALL | SHALL |
| No `allow_failure` — every job either works or is removed | SHALL | SHALL |
| Pipeline execution time < 10 minutes | SHOULD | SHALL |
| Pipeline provides clear failure messages | SHALL | SHALL |
| Pipeline is version-controlled (pipeline-as-code) | SHOULD | SHALL |

### 2.2 QG-3: Verification Gate (Review)

| Requirement | Core/Foundation | Team+ | Notes |
|------------|-----------------|-------|-------|
| Branch protection on main/production branches | — | SHALL | No direct push |
| Merge request required | — | SHALL | All changes go through MR |
| Minimum 1 approval required | — | SHALL | Approver must be different from the Supervisor who created the MR |
| Review checklist integration | — | SHOULD | AI Review Checklist (Guide 02) embedded in MR template |
| Approval cannot be from the MR author | — | SHALL | Enforce independent verification |
| Stale approval invalidation | — | SHOULD | Re-approve after new commits |

### 2.3 QG-4: Acceptance Gate (Deployment)

| Requirement | Core/Foundation | Team+ | Notes |
|------------|-----------------|-------|-------|
| Staging environment exists | — | SHALL | Mirrors production configuration |
| Staging deployment is automated | — | SHALL | Same pipeline as production, different target |
| Staging verification step | — | SHALL | Manual or automated acceptance test on staging |
| Production deployment requires explicit approval | — | SHALL | Human gate — not auto-deploy on merge |
| Rollback capability | — | SHALL | Ability to revert to previous version within minutes |
| Deployment tracking | — | SHALL | Record what was deployed, when, by whom |
| Smoke tests post-deployment | — | SHOULD | Automated verification that deployment succeeded |
| Feature flags | — | SHOULD | Ability to disable features without redeployment |

---

## 3. Knowledge Base

The Knowledge Base is the persistent memory of the project. AI Agents have no memory between sessions — the KB is how knowledge survives.

### 3.1 Core Requirements

| Requirement | Core/Foundation | Team+ | Notes |
|------------|-----------------|-------|-------|
| Searchable (full-text) | SHALL | SHALL | Supervisor and AI Agent must be able to search by keyword |
| Categorized by entry type | SHALL | SHALL | Minimum types: `decision`, `pattern`, `gotcha`, `dead_end`, `observation` |
| Entry has title and body | SHALL | SHALL | Title for scanning, body for detail |
| Entry has creation timestamp | SHALL | SHALL | When was this knowledge created |
| Entry has project/scope tag | SHOULD | SHALL | Which project or area this knowledge applies to |
| Versioned entries | — | SHALL | Track changes to knowledge entries over time |
| Freshness tracking | — | SHALL | `last_reviewed` timestamp, updated when entry is confirmed still accurate |
| Entry status | — | SHALL | Values: `current`, `needs_review`, `deprecated` |
| Cross-references between entries | — | SHOULD | Link related knowledge entries |
| Bulk export | SHOULD | SHALL | Export all entries in a portable format (JSON, markdown) |
| Entry author tracking | — | SHALL | Who created or last updated this entry |

### 3.2 Entry Types

| Type | Purpose | Example |
|------|---------|---------|
| `decision` | Architectural or design choice with rationale | "We use UUIDs for all entity IDs because..." |
| `pattern` | Reusable approach for common tasks | "Error handling in API endpoints follows this structure..." |
| `gotcha` | Non-obvious behavior that causes problems | "CouchDB bulk_docs silently ignores conflicts unless..." |
| `dead_end` | Approach that was tried and abandoned, with reason | "Tried using WebSockets for SSE replacement — failed because..." |
| `observation` | Empirical finding worth remembering | "Build times increase 2x when running TypeScript strict mode on..." |
| `template` | Reusable requirement/AC pattern for common task types | "REST API endpoint AC: 1. Returns 200 for valid input. 2. Returns 401 without auth..." |

### 3.3 AI Agent Integration

| Requirement | Core/Foundation | Team+ | Notes |
|------------|-----------------|-------|-------|
| AI Agent can search KB during session | SHALL | SHALL | Via tool/function call or context injection |
| AI Agent can create KB entries during session | SHALL | SHALL | Dead Ends and Gotchas discovered during work |
| Relevant KB entries injected into session context | SHOULD | SHALL | Based on task area, project, or explicit references |
| AI Agent can update existing KB entries | — | SHALL | Correct or extend existing knowledge |
| KB query results are structured | SHOULD | SHALL | Title, type, body, freshness — not raw text dumps |
| KB access is scoped | — | SHALL | Agent sees relevant project knowledge, not everything |
| KB entry creation triggers review queue | — | SHOULD | Human reviews AI-created knowledge entries |

### 3.4 Freshness Management

| Requirement | Core/Foundation | Team+ | Notes |
|------------|-----------------|-------|-------|
| Entries older than N increments flagged for review | — | SHALL | Configurable threshold (recommendation: 3 Increments) |
| Freshness report available | — | SHALL | Distribution of entry ages, count by status |
| Deprecated entries excluded from AI context | — | SHALL | Stale context is worse than no context |
| Quality Sweep includes KB freshness audit | SHOULD | SHALL | Part of the ceremony checklist |

---

## 4. Session Management

Sessions are SENAR's primary rhythm mechanism. The tooling must support the full session lifecycle.

### 4.1 Session Lifecycle

| Requirement | Core/Foundation | Team+ | Notes |
|------------|-----------------|-------|-------|
| Session start with timestamp | SHALL | SHALL | Records when the Session began |
| Session end with timestamp | SHALL | SHALL | Records when the Session ended |
| Session has unique identifier | SHALL | SHALL | For linking Tasks, metrics, handoffs |
| Session links to Supervisor | SHOULD | SHALL | Who ran this Session |
| Session links to Tasks worked | SHALL | SHALL | Which Tasks were active during this Session |
| Previous session handoff available at start | SHALL | SHALL | Context continuity |

### 4.2 Checkpoint Capability

| Requirement | Core/Foundation | Team+ | Notes |
|------------|-----------------|-------|-------|
| Mid-session checkpoint | SHOULD | SHALL | Save context state without ending the Session |
| Checkpoint captures current task status | SHOULD | SHALL | What's in progress, what's done |
| Checkpoint reminder | — | SHOULD | Alert at configurable intervals (e.g., every 40-60 tool calls) |
| Checkpoint restores context on session crash | — | SHOULD | Recover from unexpected session termination |

### 4.3 Handoff Documents

| Requirement | Core/Foundation | Team+ | Notes |
|------------|-----------------|-------|-------|
| Handoff document created at Session End | SHALL | SHALL | Summary of what was done and what's next |
| Handoff includes completed Tasks | SHALL | SHALL | List of Tasks done in this Session |
| Handoff includes in-progress Tasks | SHALL | SHALL | State of Tasks not finished |
| Handoff includes blockers/risks | SHOULD | SHALL | What might prevent the next Session from succeeding |
| Handoff includes knowledge captured | — | SHALL | KB entries created or updated during the Session |
| Handoff stored and searchable | SHOULD | SHALL | Historical handoffs available for reference |
| Handoff loaded automatically at next Session Start | SHOULD | SHALL | No manual searching for the latest handoff |

### 4.4 Metrics Capture

| Requirement | Core/Foundation | Team+ | Notes |
|------------|-----------------|-------|-------|
| Tool call count per Session | SHOULD | SHALL | Leading indicator of session complexity and fatigue |
| Session duration | SHALL | SHALL | Derived from start/end timestamps |
| Tasks completed per Session | SHALL | SHALL | Throughput input |
| Session cost (tokens/API spend) | — | SHALL | For Cost per Task calculation |
| Error/retry count | — | SHOULD | How many times the AI needed correction |

---

## 5. AI Agent Integration

Requirements for how AI Agents are configured, monitored, and managed within SENAR.

### 5.1 Context Injection

| Requirement | Core/Foundation | Team+ | Notes |
|------------|-----------------|-------|-------|
| Structured project instructions | SHALL | SHALL | Project-level context loaded at session start (e.g., CLAUDE.md, .cursorrules) |
| Task context injection | SHALL | SHALL | Goal, AC, and relevant constraints provided to agent |
| KB entry injection | SHOULD | SHALL | Relevant knowledge entries available during work |
| Codebase conventions | SHOULD | SHALL | Coding standards, architectural patterns, naming conventions |
| Scope boundaries | SHOULD | SHALL | Explicit "do not change" instructions |
| Session history/handoff injection | SHOULD | SHALL | Previous session context for continuity |

### 5.2 Output Capture

| Requirement | Core/Foundation | Team+ | Notes |
|------------|-----------------|-------|-------|
| Code changes captured in version control | SHALL | SHALL | Standard git workflow |
| Session logs available for review | SHOULD | SHALL | What the AI did, what the Supervisor approved |
| AI reasoning visible | SHOULD | SHOULD | Why the AI made specific choices (for verification) |
| Output linked to Task | SHALL | SHALL | Which Task produced which code changes |

### 5.3 Cost and Token Tracking

| Requirement | Core/Foundation | Team+ | Notes |
|------------|-----------------|-------|-------|
| Token usage per session | — | SHALL | Input + output tokens |
| API cost per session | — | SHALL | Dollar cost derived from token usage |
| Cost per task (derived) | — | SHALL | Session cost / tasks completed |
| Cost trend over time | — | SHALL | Is the process becoming more or less expensive? |
| Budget alerts | — | SHOULD | Warn when session/increment cost approaches budget |
| Cost by model/provider | — | SHOULD | If multiple models are used, track cost separately |

### 5.4 Multi-Agent Orchestration (Team+)

| Requirement | Core/Foundation | Team+ | Notes |
|------------|-----------------|-------|-------|
| Workspace isolation | — | SHOULD | Agents work in isolated environments (worktrees, containers) |
| Agent-to-agent communication | — | SHOULD | Delegate subtasks to specialized agents |
| Parallel agent execution | — | SHOULD | Multiple agents working simultaneously under supervision |
| Agent output aggregation | — | SHOULD | Collect results from multiple agents into unified review |
| Agent capability profiles | — | SHOULD | Different agents for different task types (code, test, docs) |

### 5.5 Agent Configuration Management

Requirements for managing Agent Profiles, Operational Scripts, and the Programmatic Interface (Standard Section 5).

| Requirement | Core/Foundation | Team+ | Notes |
|------------|-----------------|-------|-------|
| Script storage in version control | SHALL | SHALL | Scripts stored alongside project code |
| Script versioning (change history) | SHOULD | SHALL | Track who changed what, when, and why |
| Profile definition storage | SHOULD | SHALL | Agent Profiles stored as structured configuration |
| Profile switching support | — | SHOULD | Ability to switch agent context between profiles within a session |
| Permission scoping per profile | — | SHALL | Enforce read/write boundaries per Agent Profile |
| Script propagation mechanism | — | SHALL | Propagate script changes across multiple projects |
| Script rollback capability | SHOULD | SHALL | Revert any script change to previous version |
| Active script registry | — | SHALL | Inventory of active scripts with version identifiers |
| Script change audit trail | — | SHALL | Log of all script modifications with rationale |
| Tool inventory per profile | SHOULD | SHALL | Document which tools each profile can access |
| Hook execution engine | — | SHOULD | Automated actions triggered by events (post-session, pre-commit) |
| Script effectiveness metrics | — | SHOULD | Track FPSR and error rate per script version |

---

## 6. Integration Requirements

How the components connect to form a functioning SENAR toolchain.

### 6.1 Core/Foundation Integrations

| Integration | Description |
|------------|-------------|
| Task Tracker <-> Session Management | Sessions reference Tasks; Tasks reference Sessions |
| Task Tracker <-> CI/CD | Pipeline results linked to Tasks and merge requests |
| Knowledge Base <-> AI Agent | Agent can search, read, and create KB entries during sessions |
| Session Management <-> AI Agent | Session start/end driven by or coordinated with agent lifecycle |

### 6.2 Team+ Integrations

| Integration | Description |
|------------|-------------|
| Task Tracker <-> Knowledge Base | Tasks link to relevant KB entries; KB entries link to originating Tasks |
| CI/CD <-> Task Tracker | Pipeline failures auto-update Task status to `blocked` |
| Session Management <-> Metrics | Session metrics auto-populated from session data |
| Knowledge Base <-> CI/CD | Architectural constraint KB entries enforced in pipeline (aspirational) |
| Federation <-> Task Tracker | Cross-project dependency status synchronized |
| Federation <-> Knowledge Base | Cross-project knowledge accessible with proper scoping |

---

## 7. Selection Guidance

When evaluating tooling options, prioritize:

1. **Automation over manual process** — if a ceremony step can be automated, it should be. Manual steps are failure points (see Guide 06, PF-3: Gate Bypass Normalization).

2. **Portability over features** — data must be exportable. Vendor lock-in (Guide 06, OF-3) is a recognized failure mode.

3. **AI-accessible over human-only** — every data store the Supervisor uses should also be queryable by the AI Agent. If the AI can't access it, it doesn't exist for SENAR purposes.

4. **Simple over comprehensive** — a task tracker with 5 well-implemented fields beats one with 50 fields nobody fills in. Start with Core/Foundation requirements and add Team+ requirements when needed.

5. **Composable over monolithic** — prefer tools that integrate via APIs over all-in-one platforms. SENAR components evolve at different rates; replacing one component should not require replacing all of them.
