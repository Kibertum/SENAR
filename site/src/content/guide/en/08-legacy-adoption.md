# SENAR Guide: Adopting SENAR in Legacy Codebases

Most software is not greenfield. You have 200,000 lines of undocumented code, and Rule 9.11 says "documentation sufficient for AI to understand module purpose." You are not going to document everything before starting. Here's how to adopt SENAR incrementally.

---

## Principle: Next Task, Not Full Retrofit

You don't need to "SENAR everything." Start with the next task. When that task touches a module, document that module. When the next task touches another module, document that one. Over time, the documentation frontier advances with actual work.

**What NOT to do:** Don't create a "documentation sprint" that takes 3 weeks and produces docs nobody reads. Documentation written in isolation from implementation is outdated before it's finished.

---

## Phase 1: Start with Habits (Day 1)

Adopt the 6 Quick Start habits immediately. They require zero codebase preparation:

1. Write goal + AC before each AI task (even in legacy code)
2. Set scope boundaries ("change ONLY this file, don't refactor the module")
3. Verify against AC, not intuition
4. Document dead ends (especially important in legacy — "tried X, failed because Y")
5. Run tests
6. Capture knowledge

Scope boundaries (habit 2) are critical for legacy: AI agents will try to "improve" surrounding code if you don't fence them.

---

## Phase 2: Document on Contact (Week 1+)

Every time a task touches a module, add minimum documentation:

```python
"""
Module: user_auth
Purpose: Handles login, registration, and session management.
Public API:
  - login(email, password) -> Session
  - register(email, password, name) -> User
  - verify_session(token) -> User | None
Dependencies: database (PostgreSQL), redis (session store)
Boundaries: Does NOT handle OAuth (see oauth_provider module).
"""
```

This takes 5 minutes per module. It satisfies Rule 9.11 at the SENAR Core level. From this point forward, AI tasks touching this module need less explicit context in the Task goal — the docstring provides it.

**Key: Write for AI, not for humans.** The AI doesn't care about your design philosophy. It needs: what this module does, what the public interface is, what it connects to, and what it does NOT do.

---

## Phase 3: Build Knowledge Base from Tribal Knowledge (Week 2+)

Legacy codebases have tribal knowledge — things people know but haven't written down. As you encounter these during SENAR tasks:

- **Dead End:** "Can't use async in the auth module because it depends on a sync middleware chain" → document it
- **Gotcha:** "The order status field uses integers 1-7, not the enum — legacy migration never happened" → document it
- **Decision:** "We use raw SQL instead of ORM for the reporting module because of the complex join queries" → document it

These become Knowledge Base entries that AI reads in future sessions. Every documented gotcha prevents one future $105 escaped defect.

---

## Phase 4: Requirement Links for New Work (Month 1+)

New features on legacy codebases often lack clear requirements — someone says "fix the thing" and you investigate. SENAR's Exploration (Section 6.1) handles this:

1. Start an Exploration (time-bounded investigation)
2. When you understand what needs to happen, create a Task with goal + AC
3. Link the Task to a Story or BR — even if the BR is just "reduce support tickets about X"

For bug fixes in legacy code:
- BR: the original business need that the bug violates (e.g., "users must be able to reset passwords")
- TR: the specific fix with AC (e.g., "POST /reset-password returns 200 for non-existing emails — no information leak")

---

## Phase 5: Quality Gates on Legacy (Month 2+)

**QG-0** works immediately on legacy: every task has goal + AC before starting.

**QG-2** may need adaptation:
- "CI passes" requires that CI exists. If not, add minimal CI as a one-time investment.
- "Tests pass" requires tests. For untested legacy modules, the minimum is: add tests for the code you change. Don't test what you don't touch.
- "Types clean" may not apply to dynamically typed legacy. Use what's available (mypy for Python, TypeScript strict for JS migrations).

**QG-3 and QG-4** are Team+ and Enterprise — defer until SENAR Core is solid.

---

## What You Get

After 3 months of SENAR Core on a legacy codebase:
- Documentation frontier advancing with actual work (not rotting in a wiki)
- Knowledge base of gotchas that prevent repeated failures
- Measurable FPSR showing whether context quality is improving
- Dead ends that save hours per session
- No "big bang" documentation effort, no process disruption

---

## Anti-Pattern: The Documentation Sprint

**Problem:** Manager says "let's spend 2 weeks documenting everything before we start using AI."
**Why it fails:** Documentation without implementation context is abstract and immediately stale. The person documenting module X hasn't worked in it for 6 months — they'll miss the gotchas.
**SENAR approach:** Document on contact. The person documenting module X is the person implementing a task in module X right now. They know exactly what AI needs to know because they just discovered it.
