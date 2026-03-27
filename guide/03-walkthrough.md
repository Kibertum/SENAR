# SENAR Guide: End-to-End Walkthrough

## Adoption Paths

SENAR has two adoption paths. Start with Core; upgrade to Standard when your needs outgrow it.

### Core Path (Individual or Small Team)

1. **Adopt the 8 rules** — Task Before Code, Scope Boundaries, Verify Against Criteria, Tests Verify Requirements, Check for Latent Defects, Zero Tolerance for Incomplete Work, Fix Causes Not Symptoms, Capture Knowledge.
2. **Enforce the 2 gates** — Start Gate (goal + AC + negative scenario + scope before implementation) and Done Gate (all AC verified, checklist passed, knowledge captured).
3. **Measure the 2 metrics** — FPSR (First-Pass Success Rate) and DER (Dead End Rate). Establish baselines for 3+ cycles before setting targets.

That is all. No roles, no ceremonies, no session management. The walkthrough below demonstrates this path.

### Standard Path (Team or Organization)

1. **Start with Core** — adopt all 8 rules, both gates, both metrics.
2. **Add Foundation configuration** — 1–3 Pairs; add session discipline (Session Start/End, monthly Quality Sweep); Supervisor combines Context Architect, Knowledge Engineer, and Verification Engineer roles. 11 rules, 4 metrics (adds Throughput, Lead Time), QG-0 + QG-2.
3. **Add Team configuration** — introduce dedicated roles (Context Architect, Flow Manager, Verification Engineer), full ceremonies (Increment Planning, Quality Sweep, Retrospective).
4. **Add Enterprise configuration** — federation coordination, cross-project metrics, portfolio governance, compliance audit trails.

The Team Walkthrough section below demonstrates the Standard path at Team configuration.

---

## Core Walkthrough (Solo Supervisor)

One person, one AI agent, one session. Building a REST API endpoint.

**Session Start (2 min):** Open terminal. Load previous handoff: "Auth module done. Next: user profile endpoint." Select task `impl-user-profile`.

**Context Gate check:** Goal: "GET /users/me returns current user profile." AC: "1. Returns 200 with user data. 2. Returns 401 without token. 3. Includes company info." Story link: `user-management`. → Passes.

**Execution:** Direct AI with Constraint Fence:
> "Implement GET /users/me. AC: [above]. Follow patterns from auth/router.py. Change ONLY users/ directory."

(This example uses Python/FastAPI. The same pattern applies to Java/Spring Boot @RequestMapping, Go/Gin router.GET, TypeScript/NestJS @Get().)

AI generates router + test. Review with checklist: scope ✓, imports ✓, no hardcoded values ✓, tests check behavior not implementation ✓. One issue: AI didn't test the 401 case.

> "Add test for unauthenticated request → 401."

AI adds test. Re-review: clean.

**Implementation Gate:** CI green, 6/6 tests pass, mypy clean, AC verified. → Done. (For other stacks: Java uses javac + SpotBugs, Go uses go vet + staticcheck, TypeScript uses tsc --strict.)

**Dead End capture:** None this task — straightforward.

**Session End (3 min):** 4 tasks done, 75 minutes. Handoff: "Profile, settings, avatar upload done. Next: password change. Warning: avatar upload needs file size validation."

**Total overhead:** 5 minutes (start + end). No ceremonies, no roles, no meetings. Just discipline.

---

---

> **The section below demonstrates Team-level SENAR.** If you're using Core only, you can stop here — the Core walkthrough above is your complete workflow.

## Team Walkthrough (3 Pairs)

A complete SENAR cycle for Team configuration. 3 Supervisor+AI Pairs, web application.

## Increment Planning

Context Architect leads:
1. Reviews backlog: 32 candidate Tasks across 6 Stories
2. Applies WSJF: Authentication scores highest (blocks other work, moderate size)
3. Assigns: Pair A → auth (6 tasks), Pair B → orders CRUD (8 tasks), Pair C → CI/CD (5 tasks)
4. Risks: "Auth library choice may need exploration" → creates Exploration
5. Budget: 19 tasks selected for this Increment

## A Supervisor's Session

**Session Start (2 min):** Load handoff → "Auth model done. Next: login endpoint." Select task `impl-login-endpoint`. Dev environment green.

**QG-0 (automatic):** Goal ✓, AC ✓ (4 criteria), requirement link ✓, work type ✓ → passes.

**Execution (Plan-then-Execute + Constraint Fence):**

> "Implement POST /auth/login. AC: [criteria]. Follow patterns in auth/models.py. Use PyJWT. Config in settings.py. Change ONLY auth/ directory."

(This example uses Python/FastAPI with PyJWT. The same constraint fence pattern applies to any stack: Java/Spring Security with jjwt, Go with golang-jwt, TypeScript/NestJS with @nestjs/jwt.)

AI generates router, service, tests. Supervisor reviews with checklist:

- Scope: ✓ only auth/ files
- Phantom imports: ⚠ AI imported `python-jose` but project uses `PyJWT`
- Hardcoded values: ✓ token secret from env
- Edge cases: ⚠ no expired token test

**Iterative Refinement:**
> "Two issues: 1) Use PyJWT not python-jose. 2) Add expired token test."

AI corrects. Re-review: clean.

**QG-2 (automatic):** CI ✓, 14/14 tests ✓, mypy ✓, lint ✓, AC verified ✓, security ✓ → passes.

**Knowledge capture:** "Gotcha: AI defaults to python-jose for JWT even when PyJWT is in requirements. Always specify library in context."

3 tasks done, 110 minutes.

**Session End (5 min):** Metrics saved, handoff written, 1 knowledge entry.

## Quality Sweep

**Quality Sweep procedure:**
1. Select 3-5 recently completed tasks (random or risk-weighted)
2. For each task, verify: (a) AC have evidence, (b) checklist was applied at correct tier, (c) knowledge was captured
3. Record findings as observations in the knowledge base
4. If FPSR drops below target, discuss root causes in the next Team Sync

After 6 sessions, Verification Engineer audits:

| Finding | Action |
|---------|--------|
| Duplicate validation utility (exists in shared/) | Fix task: refactor |
| 3 TODO comments left by AI | Fix task: resolve |
| Zero test coverage for order deletion | Fix task: add tests |
| Inconsistent error format between modules | Fix task: standardize |

Knowledge: "Pattern: AI undertests delete operations — add to standard AC template."

## Increment Retrospective

| Metric | Value |
|--------|-------|
| Throughput | 7.3 tasks/session |
| Lead Time (median) | 35 minutes |
| FPSR | 74% |
| DER | 5.3% |
| KCR | 0.42 |
| Cost Predictability | 110% |
| MIR | 12% |

Actions: improve context template (JWT library), add "test deletion" to AC template, review QG-2 for concurrency tests.
