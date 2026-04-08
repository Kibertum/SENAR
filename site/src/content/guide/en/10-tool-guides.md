# SENAR Guide: Tool Integration

SENAR is tool-agnostic — the standard never requires a specific product. But the practices map differently to each tool. This chapter shows how to apply SENAR with the three most common AI coding tools, plus a minimal knowledge base setup for teams with no infrastructure.

---

## SENAR with Claude Code

Claude Code is a terminal-based AI agent with persistent memory, slash commands, and MCP (Model Context Protocol) integration. It is the closest match to SENAR's assumptions about AI agents.

### Goal + AC → Task Description in Prompt

Give the goal and acceptance criteria directly in the prompt. Claude Code processes structured text well:

```
Implement POST /orders/{id}/cancel endpoint.

Goal: Allow users to cancel their own orders if the order is in "pending" status.

Acceptance criteria:
1. POST /orders/{id}/cancel with valid order in "pending" → 200, status changes to "cancelled"
2. POST /orders/{id}/cancel with order in "shipped" → 409 Conflict
3. POST /orders/{id}/cancel on another user's order → 403
4. Cancelled order cannot be cancelled again → 409
5. Returns 404 for non-existent order ID

Scope: change ONLY src/orders/ and tests/orders/. Follow patterns in src/orders/router.py.
```

### Scope Boundaries → CLAUDE.md + Slash Commands

`CLAUDE.md` at the project root defines persistent boundaries the agent reads on every session:

```markdown
# Boundaries
- NEVER modify files outside src/ and tests/
- NEVER change database migration files directly — use alembic
- Follow existing patterns in router.py, service.py, schemas.py
- Do NOT add dependencies without asking
```

Use `/plan` before complex tasks to have the agent propose a plan for review before executing.

### Knowledge Base → CLAUDE.md + Memory System

Claude Code has two knowledge layers:

| Layer | SENAR Mapping | Persistence |
|-------|--------------|-------------|
| `CLAUDE.md` | Project-level knowledge (rules, patterns, boundaries) | In repo, version-controlled |
| Memory files (`~/.claude/projects/*/memory/`) | Dead ends, decisions, gotchas | Per-user, persists across sessions |

When you hit a dead end, tell Claude Code explicitly:

```
Remember this: bcrypt fails on Python 3.14. Always use argon2-cffi.
```

It writes to its memory system. Future sessions read this automatically.

For teams using MCP, knowledge entries can be pushed to a shared knowledge base:

```
Create a knowledge entry: "argon2id for password hashing — bcrypt incompatible
with Python 3.14. OWASP recommendation. Use get_password_hash() from auth/utils.py."
```

### Dead Ends → Knowledge Entries via Memory or MCP

Immediate capture during the session:

```
That approach failed. Remember: SQLAlchemy async sessions cannot use lazy
loading. Must use selectinload() or joinedload() for relationships.
```

### QG-0 → /plan Skill

Before starting a task, use `/plan` to validate that the task has sufficient context:

```
/plan — Review this task before implementation. Check that goal, AC, and scope
are clear. Flag anything ambiguous.
```

The agent reviews the task description and flags missing AC, ambiguous scope, or unstated assumptions.

### QG-2 → /review Skill

After implementation, use `/review` to run the Implementation Gate:

```
/review — Check this implementation against the acceptance criteria.
Verify: tests exist for each AC, mypy clean, no linting violations.
```

### Session Discipline

Claude Code tracks tool call counts internally. Use checkpoints:

```
/checkpoint — Save progress. 47 tool calls since last checkpoint.
```

Session handoffs go into the memory system or a handoff file the agent reads on next startup.

---

## SENAR with Cursor

Cursor is a VS Code fork with inline AI chat, file-level context via `@mentions`, and project-level rules via `.cursorrules`.

### Goal + AC → .cursorrules + Prompt Structure

Create a `.cursorrules` file with persistent instructions:

```
# Project Rules
- Every implementation MUST have tests for all acceptance criteria
- Follow patterns in existing router/service/schema files
- Never modify database migrations directly
- Use type hints on all function signatures
```

For each task, structure your Cursor chat prompt the same way:

```
Goal: [one sentence]
AC: [numbered list]
Scope: [files to change, files NOT to change]
Plan: [ordered steps]
```

Cursor does not enforce this structure — you enforce it by habit.

### Scope Boundaries → @file Mentions

Cursor's `@file` syntax controls context. Use it as a constraint fence:

```
@src/orders/router.py @src/orders/service.py
Implement order cancellation. Follow the patterns in these files.
Only change files in src/orders/ and tests/orders/.
```

Mentioning specific files focuses the model's attention and reduces the chance of it inventing patterns that don't match your codebase.

### Knowledge Base → .cursorrules + Project Docs

Cursor reads `.cursorrules` on every prompt. Use it for accumulated knowledge:

```
# Known Issues
- bcrypt fails on Python 3.14 — use argon2-cffi
- SQLAlchemy async: no lazy loading, use selectinload()
- JWT refresh: must use DB-level locking to prevent race conditions
```

For larger knowledge bases, maintain a `docs/knowledge/` directory and reference it:

```
@docs/knowledge/dead-ends.md — Read this before implementing auth-related features.
```

### Dead Ends → Comment Files or Inline Docs

Cursor does not have a built-in knowledge system. Two options:

**Option A: Knowledge files** (recommended) — maintain `docs/knowledge/dead-ends.md` and reference with `@`:

```markdown
# Dead Ends

- 2026-03-15: bcrypt C extension fails on Python 3.14 → use argon2-cffi
- 2026-03-18: Celery beat + async → use APScheduler instead
- 2026-03-20: pytest-asyncio auto mode breaks fixtures → use mode=strict
```

**Option B: Inline comments** — add dead end notes near the relevant code:

```python
# DEAD END: Do not use bcrypt here — C extension fails on Python 3.14.
# Use argon2-cffi via get_password_hash(). See docs/knowledge/dead-ends.md.
from auth.utils import get_password_hash
```

### QG-0 → Manual (Write AC Before Prompting)

Cursor has no built-in gate. You are the gate. The discipline:

1. Write goal + AC in the chat prompt **before** asking for code
2. If you catch yourself typing "implement X" without AC, stop. Write the AC first.
3. Keep a task template (see Starter Kit below) and paste it every time.

### QG-2 → Cursor Review Features + Terminal

After the AI generates code:

1. Use Cursor's diff view to review changes
2. Run tests in the terminal: `pytest tests/ -v`
3. Run type checker: `mypy src/ --strict`
4. Walk through AC one by one — does each criterion have a passing test?

---

## SENAR with GitHub Copilot

GitHub Copilot works primarily through inline completions and Copilot Chat (VS Code sidebar or PR reviews). It has the least structured context control of the three tools.

### Goal + AC → Structured Comments Before Code

Copilot reads surrounding code and comments. Use structured comments as the prompt:

```python
# TASK: Implement order cancellation endpoint
# GOAL: Allow users to cancel pending orders
# AC-1: POST /orders/{id}/cancel + pending order → 200, status=cancelled
# AC-2: POST /orders/{id}/cancel + shipped order → 409
# AC-3: POST /orders/{id}/cancel + other user's order → 403
# AC-4: Cancelled order → 409 on re-cancel
# AC-5: Non-existent order → 404
# SCOPE: src/orders/router.py, src/orders/service.py, tests/orders/

@router.post("/orders/{order_id}/cancel")
async def cancel_order(  # Copilot completes from here
```

This is more friction than Claude Code or Cursor, but it works: Copilot uses the comments as context for completions.

### Scope Boundaries → File-Level Context

Copilot's context is primarily the open file and related files. Control scope by:

- Having the right files open in tabs (Copilot reads open files)
- Keeping unrelated files closed
- Using Copilot Chat with explicit file references: "Following the pattern in `src/orders/router.py`, implement..."

### Knowledge Base → Codebase Documentation (Rule 9.11)

Copilot learns from your codebase. Rule 9.11 (Documentation Completeness) directly improves Copilot output:

- Docstrings on every public function → Copilot generates consistent new functions
- Type hints everywhere → Copilot generates typed code
- `README.md` per module → Copilot understands module purpose

```python
"""Order service — handles order lifecycle operations.

Patterns:
- All mutations go through service layer, never router
- Use get_or_404() for entity lookup
- Status transitions validated via Order.can_transition_to()
"""
```

### Dead Ends → ADR Files or Doc Comments

Use Architecture Decision Records in `docs/adr/`:

```markdown
# ADR-007: Password Hashing Algorithm

## Status: Accepted

## Context
Need password hashing for auth module. bcrypt C extension fails on Python 3.14.

## Decision
Use argon2-cffi with argon2id algorithm via shared get_password_hash() utility.

## Consequences
- All password operations use one utility function
- argon2-cffi must remain in dependencies
- Do not add bcrypt as alternative
```

Copilot reads ADR files when they are open, and Copilot Chat can be directed to them explicitly.

### QG-0 → Manual Discipline (Pre-Implementation)

Manual discipline — write goal + AC in a task tracking file or issue before starting AI work. Copilot does not have a built-in pre-implementation gate; use TASK_TEMPLATE.md or issue templates as the enforcement mechanism.

1. Write goal + AC in a GitHub issue or `TASK_TEMPLATE.md` **before** opening the editor
2. If you catch yourself prompting Copilot without AC, stop. Write the AC first.
3. Keep a task template (see Starter Kit below) and fill it in every time.

### QG-2 → PR Template + CI Pipeline + PR Review

Since Copilot integrates with GitHub, use PR templates as the post-implementation gate:

```markdown
<!-- .github/PULL_REQUEST_TEMPLATE.md -->
## Task
- [ ] Goal defined
- [ ] Acceptance criteria listed below
- [ ] Scope boundaries stated

## Acceptance Criteria
1.
2.
3.

## Verification
- [ ] Each AC has a passing test
- [ ] mypy/tsc clean
- [ ] No new linting violations

## Knowledge
- Dead ends encountered:
- Decisions made:
```

The PR cannot be opened without filling this in. Reviewers verify against it.

Additionally, Copilot's natural QG-2 includes the CI pipeline:

1. GitHub Actions runs tests, type checker, linter
2. Copilot Chat (PR review mode) reviews the diff
3. Human reviewer checks AC-to-test mapping

This is less immediate than Claude Code's in-session verification, but it works when combined with the PR template.

---

## The Core Knowledge Base (No Infrastructure Required)

You do not need a database, a wiki, or a specialized tool. You need three files in your repository:

```
docs/
  knowledge/
    dead-ends.md      — one line per dead end
    decisions.md      — one paragraph per decision
    gotchas.md        — one line per gotcha
```

### dead-ends.md

```markdown
# Dead Ends

Approaches that failed. Check here before trying something new.

- 2026-03-15: bcrypt — C extension fails on Python 3.14. Use argon2-cffi.
- 2026-03-18: Celery beat with async workers — event loop conflicts. Use APScheduler.
- 2026-03-20: pytest-asyncio auto mode — breaks fixtures with scope=session. Use mode=strict.
- 2026-03-21: SQLAlchemy lazy loading in async — not supported. Use selectinload().
- 2026-03-22: Redis Sentinel with asyncio — aioredis deprecated. Use redis-py >= 5.0.
```

Format: `date: thing tried — why it failed. What to use instead.`

One line. Ten seconds to write. Saves hours.

### decisions.md

```markdown
# Decisions

Architectural and technical decisions with context.

## Password Hashing: argon2id
**Date:** 2026-03-15
**Context:** Need password hashing for auth module.
**Decision:** Use argon2-cffi with argon2id via `get_password_hash()` in `src/auth/utils.py`.
**Reason:** OWASP recommendation, Python 3.14 compatible, bcrypt fails (see dead-ends.md).

## Task Queue: APScheduler over Celery
**Date:** 2026-03-18
**Context:** Need periodic tasks (token cleanup, report generation).
**Decision:** Use APScheduler with AsyncIOScheduler.
**Reason:** Celery beat has event loop conflicts with async FastAPI. APScheduler runs in-process.
```

Format: title, date, context (one sentence), decision (one sentence), reason (one sentence).

### gotchas.md

```markdown
# Gotchas

Things that are technically correct but surprising. Not bugs — just traps.

- SQLAlchemy: `session.refresh()` after commit or you get stale data in tests
- FastAPI: `Depends()` in test overrides must match the exact function, not just signature
- pytest: fixture scope=session + async requires `event_loop` fixture override
- Docker: `COPY requirements.txt .` before `COPY . .` — layer cache invalidation order matters
- PostgreSQL: `SERIAL` vs `GENERATED ALWAYS AS IDENTITY` — use IDENTITY for new tables
```

Format: one line. Context: behavior. That is all.

### Why This Works

AI agents read your repository. When `docs/knowledge/dead-ends.md` is in the repo, every AI prompt has access to it — whether through Claude Code's automatic file reading, Cursor's `@file` mentions, or Copilot's open-tab context.

The knowledge base is version-controlled, searchable, and grows with every session. No external tool required.

---

## SENAR Starter Kit

Copy-paste ready templates for immediate use.

### TASK_TEMPLATE.md

```markdown
# Task: [slug]

## Goal
[One sentence: what must be accomplished]

## Acceptance Criteria
1. [First criterion — independently testable]
2. [Second criterion]
3. [Third criterion]

## Requirement Link
Story: [story-slug]
BR: [business requirement ID, if applicable]

## Scope
- Change ONLY: [directories/files]
- Do NOT change: [protected files/directories]
- Follow patterns in: [reference files]

## Plan
1. [First step]
2. [Second step]
3. [Third step]

## Notes
[Context, prior dead ends to avoid, related knowledge entries]
```

### .github/PULL_REQUEST_TEMPLATE.md

```markdown
## Summary
[One sentence: what this PR does]

## Acceptance Criteria
- [ ] AC-1: [criterion from task]
- [ ] AC-2: [criterion from task]
- [ ] AC-3: [criterion from task]

## Verification
- [ ] All AC have corresponding tests
- [ ] Tests pass locally
- [ ] Type checker clean (mypy/tsc/pyright)
- [ ] Linter clean
- [ ] No new dependencies added (or justified below)

## Dead Ends Encountered
<!-- Approaches that failed during this task. Move to docs/knowledge/dead-ends.md -->
- None / [description]

## Decisions Made
<!-- Architectural or technical decisions. Move to docs/knowledge/decisions.md -->
- None / [description]

## Knowledge Entries
<!-- Gotchas, patterns, or non-obvious behaviors discovered -->
- None / [description]
```

### docs/knowledge/README.md

```markdown
# Knowledge Base

This directory contains accumulated project knowledge from SENAR sessions.

## Files

| File | Purpose | Format |
|------|---------|--------|
| `dead-ends.md` | Approaches that failed | One line per entry |
| `decisions.md` | Architectural/technical decisions | One paragraph per entry |
| `gotchas.md` | Surprising but correct behaviors | One line per entry |

## How to Use

**Before starting a task:** Check `dead-ends.md` for the area you're working in.

**During a task:** When an approach fails, add one line to `dead-ends.md`.
When you make an architectural choice, add a paragraph to `decisions.md`.
When you discover something surprising, add a line to `gotchas.md`.

**After a task:** Review what you learned. If any dead ends, decisions, or
gotchas were captured in the PR template, move them to the appropriate file.

## For AI Agents

If you are an AI coding agent reading this: check `dead-ends.md` before
attempting any approach in a domain that has entries. Check `gotchas.md`
for the libraries and frameworks you are about to use. Check `decisions.md`
for architectural context.
```

---

## Knowledge Base Options

SENAR does not prescribe a specific knowledge base tool. Common approaches by team size:

- **Solo/Core**: Markdown files in the project repo (e.g., `docs/knowledge/`)
- **Foundation (1-3 Pairs)**: Project wiki, Notion, or structured YAML/JSON in repo
- **Team (3-10)**: Dedicated tool with search — CouchDB+Meilisearch, Confluence, Linear docs
- **Enterprise (10+)**: Federated knowledge bases per project with cross-project search

The key requirement: knowledge must be searchable by AI agents in future sessions.

---

## Choosing Your Tool

| SENAR Practice | Claude Code | Cursor | GitHub Copilot |
|---------------|-------------|--------|----------------|
| Goal + AC | Prompt text | Prompt text | Structured comments |
| Scope boundaries | CLAUDE.md + prompt | .cursorrules + @file | Open tabs + prompt |
| Knowledge base | Memory + MCP | .cursorrules + docs/ | docs/ + ADRs |
| Dead end capture | Memory entries | Knowledge files | ADR files |
| QG-0 enforcement | /plan skill | Manual discipline | Task template / issue |
| QG-2 enforcement | /review skill | Terminal + diff view | PR template + CI pipeline |
| Session handoff | Memory system | Handoff file | PR description |
| Context persistence | Automatic (memory) | Manual (@file) | Manual (open files) |

The tool does not make the process. The process makes the tool useful. A Supervisor with discipline and a plain text editor will outperform a Supervisor with the best AI tool and no acceptance criteria.
