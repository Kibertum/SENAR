# SENAR Guide: Philosophy

This document expands on the SENAR Values and explains the six pillars that underpin the methodology.

## SENAR Values

1. **Context over Code** — AI output quality is determined by input context quality. Invest in requirements, not in coding speed.

2. **Verification over Speed** — AI generates at machine speed. Correctness, not velocity, is the constraint.

3. **Knowledge over Experience** — AI has no memory between sessions. What's not documented doesn't exist for AI.

4. **Enforcement over Agreement** — Quality gates as automated code, not meetings people can skip.

5. **Judgment over Keystrokes** — Human attention on decisions (what to build, is it correct), not on typing code.

---

## Pillar 1: Context-First (Quality at Input)

The quality of AI output is a direct function of input context quality.

**The cascade principle:** Quality is built at input, not checked at output. A defect in a Business Requirement propagates to all downstream System Requirements, Task Requirements, and ultimately to code. By the time a defective requirement reaches AI execution, it produces plausible-looking code that passes automated checks but solves the wrong problem. No amount of testing at the output (QG-2, QG-3) can catch a requirement that was wrong from the start.

This is why SENAR invests in requirement quality (QG-0, QG-1) before implementation begins — not as bureaucracy, but as the highest-leverage quality investment.

**Requirements ARE context.** A well-defined Business Requirement that decomposes into clear System Requirements and Task Requirements IS the primary input to AI-generated code quality. The requirement hierarchy (BR → SR → TR) is not paperwork — it is the structured context that determines whether AI produces correct output.

**Context components:**
- Task goal and acceptance criteria (= Task Requirements)
- Requirement links to parent Story/BR/SR (= traceability)
- Architectural constraints and conventions
- Relevant knowledge (decisions, dead ends, gotchas)
- Examples and anti-patterns
- Scope boundaries (what NOT to change)

**Common failures:**
- *Vibe prompting* — vague instructions without structure. Appropriate for trivial tasks; dangerous for complex work.
- *Context dumping* — flooding AI with unstructured information. Critical constraints get buried.
- *Implicit assumption* — expecting AI to know conventions without documentation.
- *Ambiguous requirements* — requirements that a human would clarify in conversation but AI interprets literally or hallucinates a resolution. Unlike human teams, AI does not ask "did you mean X or Y?" — it picks one silently.

---

## Pillar 2: AI-First, Not AI-Only

The Supervisor's primary mode is AI-directed work. Manual coding is a justified exception, not a prohibition.

**When manual intervention is appropriate:**
- Micro-fixes (1–3 lines) cheaper than context preparation
- AI stuck in a loop on wrong approach
- Infrastructure config where AI hallucinates
- Time-critical hotfixes
- AI got 90% right — easier to fix 3 lines than re-explain

**Common failures:**
- *Shadow coding* — writing code and hiding it from traceability
- *Micromanaging* — rewriting >30% of output instead of improving context
- *Rubber stamping* — accepting without verification

---

## Pillar 3: Enforcement over Ceremony

Quality is enforced through automated gates, not meetings.

AI agents don't attend meetings, feel accountability, or learn from retrospectives. The only reliable quality mechanism is automated enforcement.

| Purpose | Mechanism |
|---------|-----------|
| Decide what to build | Ceremony |
| Verify code quality | Gate |
| Review with stakeholder | Ceremony |
| Verify requirement met | Gate |

---

## Pillar 4: Knowledge Persistence

What is not documented does not exist for AI.

**Code documentation is context, not afterthought.** In AI-native development, code documentation serves a dual purpose: it helps human Supervisors understand the system AND reduces the context volume AI needs per Task. A well-documented module (docstring explaining purpose, public API contracts, architectural boundaries) means the Supervisor doesn't need to re-explain these things in every Task goal. AI reads the docs, understands the module's role, and produces code that fits.

Undocumented code forces the Supervisor to compensate: longer Task goals, more explicit constraints, more scope boundaries. This is expensive context that should live in the code itself. Documentation that says "handles OAuth flow for Google and GitHub, stores tokens encrypted in session table, refreshes automatically" saves 5 lines of Task context on every auth-related task.

**Rule 9.11 (Code Documentation as Context)** makes this a SHALL requirement: code documentation sufficient for AI to understand module purpose, API contracts, and boundaries without reading the full implementation.

**What to capture:** decisions (with rationale), patterns, gotchas, dead ends (highest reuse value), observations.

**Knowledge delivery to AI:** static context files, search APIs, MCP integrations, or RAG. Choose deliberately.

**Knowledge lifecycle:** `current` → `needs_review` (flagged as potentially stale) → `deprecated`. Stale entries actively harm output quality — they give AI incorrect context.

---

## Pillar 5: Interaction Patterns

AI supervision is a dialogue, not a one-shot command.

| Pattern | When to Use |
|---------|-------------|
| **Plan-then-Execute** | Complex tasks: ask AI for plan → review → approve → execute |
| **Iterative Refinement** | Most tasks: generate → review → course correct → improve |
| **Example-Driven** | UI/patterns: "do it like this but with X change" |
| **Negative Example** | Known pitfalls: "don't do X because Y" |
| **Checkpoint-and-Verify** | Multi-step: AI does step 1 → verify → step 2 |
| **Constraint Fence** | Scope control: "change ONLY files X, Y. Do NOT touch A, B" |
| **Rollback-and-Retry** | Wrong direction: git rollback, restart with different context |
| **Exploration** | Unknown territory: investigate before committing to approach |

### Context Window Management

- AI context degrades as conversation grows (saturation)
- Progressive disclosure: provide information as needed, not all at once
- Strategic checkpoints clear context and restart fresh
- For large codebases: targeted file reads over bulk dumps
- Handoffs serialize essential context for new sessions
- If AI starts confusing things, it's not the model — the context is full

### Hallucination Management

Common types: non-existent APIs/methods/CLI flags, non-existent files, correct-looking code with subtle edge case bugs, confident but wrong assertions.

Detection heuristics:
- Excessive confidence in novel solutions (red flag)
- "Suspiciously perfect" code handling every edge case
- References to paths/APIs you don't recognize
- Always run the code — don't trust AI's claim about what it does

---

## Pillar 6: Empirical Calibration

Every rule and target should be calibrated to your data.

SENAR provides formulas, not targets. Organizations establish baselines by measuring for 3+ Increments, then set targets based on their own reality.

**Common failures:**
- *Cargo culting* — adopting another org's targets
- *Premature optimization* — aggressive targets before understanding baselines
- *Metric fixation* — optimizing for metric rather than outcome
