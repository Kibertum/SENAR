# SENAR Quick Start: 5 Minutes to Better AI Development

You use AI to write code. SENAR makes the result reliable.

No meetings. No mandatory certifications. These habits are the **SENAR Core** — 8 rules, 2 quality gates, 2 metrics — everything you need to start. Adoption overhead: under 1 hour, about 5 minutes per session after that.

---

## The 6 Habits

### BEFORE you tell the AI what to build

**1. Write the WHAT and the DONE**

Before starting, write two things:
- **Goal** — what must be accomplished (one sentence)
- **Acceptance Criteria** — how you'll know it's done (numbered list, each independently testable)

Bad: "Add login functionality"
Good: "Implement email/password login. AC: 1. POST /auth/login returns JWT on valid credentials. 2. Returns 401 on invalid password. 3. Returns 422 on missing email field. 4. Token expires in 24h."

*Why this matters:* AI output quality equals input quality. A vague goal produces plausible-looking code that fails in production. A precise goal with clear acceptance criteria produces testable, correct code on the first try.

**2. Set boundaries**

Tell the AI what NOT to touch:
- "Change ONLY the users/ directory"
- "Do NOT modify the database schema"
- "Follow patterns from auth/router.py"

Without boundaries, AI will confidently refactor half your codebase to "improve" things you didn't ask about.

### WHILE the AI works

**3. Verify against your criteria, not your intuition**

Don't just glance at the code and think "looks right." Check each acceptance criterion:
- AC 1: Does POST /auth/login return JWT? → Check the test or run it.
- AC 2: Does it return 401 on invalid password? → Check the test.
- AC 3: Missing email → 422? → Check the test.

If there's no test for a criterion, the criterion isn't verified.

**4. Document dead ends**

When an approach fails, write one sentence about why:
- "Tried bcrypt for password hashing — import fails on Python 3.14, switched to argon2"
- "SQLAlchemy async session: can't use lazy loading, need selectinload"

This takes 10 seconds and saves hours — for you next week, for your teammate, for any AI that reads your knowledge base.

### AFTER it's done

**5. Run the tests**

If tests pass AND all acceptance criteria are met → done. If not → not done. No exceptions, no "it probably works."

**6. Capture what you learned**

If you discovered something non-obvious during this task, write it down:
- A decision you made and why
- A pattern that worked well
- A gotcha that surprised you

> **Note — 6 habits vs. 8 Core rules:** These 6 habits cover the essence of the 8 SENAR Core rules. The full Core adds two explicit practices: a tiered verification checklist for latent defects (Rule 5) and root-cause analysis before patching symptoms (Rule 7). If you are working in a regulated or high-stakes context, read the full Core document before relying on this Quick Start alone.

---

## Before & After: Real Data

These numbers come from one project (6 microservices, 552 tasks, $989 in AI costs, 38 sessions). They are illustrative, not universal — your numbers will differ. SENAR requires you to establish your own baselines before setting targets.

**Without structured process (sessions 1–3, ad hoc):**
- Tasks started without acceptance criteria → AI produced code that "looked right" but failed edge cases
- No dead ends documented → same failed approaches repeated across sessions
- No session discipline → 200+ minute marathon sessions with noticeable efficiency decline
- Defects discovered after "done" → estimated rework cost ~$105 per escaped defect (estimated from project data: average rework cost of defects found after task completion)

**With SENAR habits adopted (sessions 4–38):**
- Every task has goal + AC before start → First-Pass Success Rate improved to 85%+ (tasks correct on first try)
- Dead ends documented → repeated failures eliminated for documented cases
- Sessions capped at 120 min with checkpoints → consistent throughput, no context crashes
- QG-0 blocks taskless work → zero "what was this for?" tasks

**Caveat:** This is a single team's experience (N=1), not a controlled study. The improvement conflates methodology adoption with natural team learning. Independent replications are needed — and that's why we published the standard, so others can measure too.

**The cost of SENAR:** ~5 minutes session overhead + 1–3 minutes per task.
**What you avoid:** rework from vague requirements, repeated dead-end approaches, marathon sessions with declining output.

---

## That's It

These habits correspond directly to the **SENAR Core** rules — the self-contained subset of the SENAR Standard. Everything else in the methodology builds on this foundation.

**What you get:**
- Fewer "works on my machine" surprises
- AI produces correct code on the first try more often (we measure this — it's called First-Pass Success Rate)
- Knowledge accumulates instead of evaporating between sessions
- You can hand off to another developer (or your future self) without losing context

**What it costs:** ~5 minutes session overhead + 1–3 minutes per task for goals, criteria, and verification.

---

## Next Steps

| You want to... | Read |
|----------------|------|
| Read the formal SENAR Core document (8 rules, 2 gates, 2 metrics) | **SENAR Core** |
| See a complete task start-to-finish | Guide: Worked Example |
| Set up SENAR with your AI tool | Guide: Tool Integration (Claude Code, Cursor, Copilot) |
| Adopt SENAR in an existing codebase | Guide: Legacy Adoption |
| Learn about requirement levels | Guide: Requirements Engineering |
| Understand the philosophy | Guide: Philosophy |
| Upgrade from Core to the full Standard | Guide: Transition — Core to Standard |
| Scale to a team | Standard, Section 11: Configurations |
| Evaluate your current practice | Standard, Section 12: Maturity Model |
