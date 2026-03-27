# SENAR Guide: Requirements Engineering for AI-Native Development

## Why Requirements Matter More with AI

In traditional development, a vague requirement leads to a conversation: "Did you mean X or Y?" The developer asks, clarifies, and implements correctly.

With AI, a vague requirement leads to a confident, plausible implementation of the wrong thing. AI does not ask clarifying questions — it picks an interpretation silently. The resulting code compiles, passes the tests the AI wrote (which test the wrong behavior), and looks correct on review.

**The cascade principle:** A defect at the requirement level is the most expensive defect. It produces correct-looking code that solves the wrong problem, correct-looking tests that verify the wrong behavior, and correct-looking documentation that describes the wrong system. Every downstream artifact inherits the original defect.

This is why SENAR's first value is "Context over Code" — and requirements are the most important context.

---

## The Three Levels

SENAR defines three requirement levels. Not all are needed for every task — depth scales with complexity and team size.

### BR — Business Requirement

**What:** A stakeholder-level need expressed in business terms.
**Who writes it:** Stakeholder, Product Owner, or Context Architect.
**Where it lives:** Increment objective, Epic goal, or dedicated BR entry in the knowledge base.

**Examples:**
- "Users must be able to reset their password without contacting support"
- "The system must process orders within 30 seconds during peak load"
- "API must support OAuth 2.0 for third-party integrations"

**Properties:** A good BR is:
- Business-oriented (no implementation details)
- Verifiable (you can determine if the system satisfies it)
- Independent (achievable without solving another BR first, or dependency is explicit)

### SR — System Requirement

**What:** A system-level capability derived from a BR. Describes what the system must do, not how.
**Who writes it:** Context Architect (Team+) or Supervisor (Core).
**Where it lives:** Story goal, or dedicated SR entry linked to parent BR.

**Examples** (derived from BR "password reset"):
- "POST /auth/reset-password sends a reset link to the user's email"
- "Reset link expires after 1 hour"
- "User can set a new password using a valid reset token"
- "System logs all password reset attempts for security audit"

**Properties:** A good SR is:
- Specific enough to decompose into Tasks
- Traceable to a parent BR
- Testable at the system level (integration test or E2E test)

### TR — Task Requirement

**What:** An implementation-level requirement. Corresponds directly to a Task's goal and acceptance criteria.
**Who writes it:** Supervisor.
**Where it lives:** Task goal + acceptance criteria fields.

**Example** (derived from SR "POST /auth/reset-password"):
- **Goal:** Implement POST /auth/reset-password endpoint
- **AC:**
  1. Returns 200 and sends email for existing user
  2. Returns 200 for non-existing user (no information leak)
  3. Returns 422 if email field missing
  4. Reset token is cryptographically random, 32 bytes
  5. Token stored hashed in database (not plaintext)
  6. Rate limited to 3 requests per email per hour

**Properties:** A good TR (= good acceptance criteria) is:
- Independently verifiable (each AC can be tested separately)
- Includes at least one negative scenario (error case)
- Specifies behavior, not implementation ("returns 422" not "use Pydantic validator")

---

## Test Model (TM) — the Verification Bridge

The Test Model is NOT a fourth requirement level. It is a verification artifact derived from Task Requirements.

```
BR → SR → TR → [TM] → Code + Tests
                 ↑ requirement    ↑ verification artifact
```

**What a Test Model contains:**
- Test cases for each AC (what to test)
- Test data (boundary values, error inputs)
- Expected results (what "pass" looks like)
- Verification method (automated unit test, integration test, manual demo, measurement)

**In AI-native development**, AI typically generates tests alongside code. The danger: AI generates tests that pass but don't actually exercise the stated AC. The Test Model is the Supervisor's check that generated tests match the requirements, not just achieve coverage.

| Configuration | Test Model Discipline |
|---------------|----------------------|
| Core | Implicit — Supervisor reviews generated tests against AC |
| Foundation | Implicit — same as Core; combined Supervisor role performs AC review |
| Team | SHOULD be explicitly reviewed — each AC has a corresponding test |
| Enterprise/Regulated | SHALL be documented, traceable to TRs, independently verifiable |

**Why not a requirement level?** Test cases describe *how to verify*, not *what the system must do*. This follows ISO/IEC 29119 (software testing) which separates test design from requirements. Making TM a requirement level would force Core users to manage 4 levels — overhead that kills adoption.

---

## Requirement Quality Properties

| Property | Definition | Core | Team+ |
|----------|-----------|-----------|-------|
| **Verifiability** | Each requirement can be tested, measured, or demonstrated | SHALL | SHALL |
| **Consistency** | No contradictions between requirements at same or higher level | SHOULD | SHALL |
| **Sufficiency** | The set of child requirements fully covers the parent | SHOULD | SHALL |
| **Non-redundancy** | No duplicate requirements across Stories | SHOULD | SHALL |
| **Traceability** | Every TR traces up to a BR; every BR decomposes down to TRs | SHOULD | SHALL |
| **Reusability** | Verified requirements can be parameterized for similar tasks | MAY | SHOULD |

### Verifiability in Practice

Bad: "The system should be fast" — fast by whose standard?
Good: "API response time < 200ms at p95 under 100 concurrent users"

Bad: "Error handling should be robust" — what does robust mean?
Good: "All API endpoints return structured error responses with HTTP status code, error code, and human-readable message"

Bad: "The UI should be user-friendly" — unmeasurable.
Good: "A new user can complete the registration flow in under 2 minutes without external help"

---

## AC Templates for Common Tasks

### REST API Endpoint
1. Returns expected status code and body for valid input
2. Returns 401/403 for unauthorized/forbidden access
3. Returns 422 with descriptive error for invalid input
4. Returns 404 for non-existent resource
5. Response matches documented schema
6. Rate limiting applied per configuration

### Database Migration
1. Migration is idempotent (safe to run multiple times)
2. Rollback migration exists and works
3. No data loss during migration
4. Migration completes within acceptable time for production data volume
5. Indexes created for new query patterns

### UI Component
1. Renders correctly in target viewport range (320–1920px)
2. Accessible: keyboard navigable, screen reader compatible (WCAG AA)
3. Handles loading, empty, and error states
4. Responsive to theme/dark mode if applicable

### Integration / External API
1. Handles success response correctly
2. Handles timeout (configurable, default 5s)
3. Handles error response with structured error
4. Retry policy for transient failures
5. Credentials not hardcoded (env/config)

### Infrastructure / DevOps
1. Configuration change is reversible
2. Health check endpoint updated if applicable
3. Monitoring/alerting covers the change
4. Documentation updated (runbook, architecture diagram)

---

## Anti-Patterns

### Specification Vacuum
**Problem:** Task has a goal but no acceptance criteria. AI produces something that "looks right" but nobody can verify it.
**Fix:** Every Task SHALL have acceptance criteria (QG-0). No AC = no start.

### Over-Specification
**Problem:** 20 acceptance criteria for a trivial task. Overhead exceeds value.
**Fix:** Match AC depth to task complexity. Trivial: 2–3 AC. Complex: 5–8 AC. If you need 15+ AC, the task should be split.

### Copy-Paste AC
**Problem:** Same AC copied across tasks without adaptation. "Returns 200" everywhere, but some endpoints should return 201 or 204.
**Fix:** Use templates as starting points, then customize. Templates save time; blind copying introduces bugs.

### Untraceable Requirements
**Problem:** Tasks exist without any link to why they exist. When priorities change, nobody knows which tasks to drop.
**Fix:** Every Task links to a Story or BR (Rule 9.10). If you can't explain why a task exists, it probably shouldn't.

### Ambiguous Criteria
**Problem:** "System should handle edge cases properly." Which edge cases? What is "properly"?
**Fix:** Name the specific edge cases. "System returns 409 when duplicate email. System returns 413 when file exceeds 10MB. System returns 429 when rate limit exceeded."

---

## Scaling by Configuration

| Aspect | Core (1–2 Pairs) | Foundation (1–3 Pairs) | Team (3–10 Pairs) | Enterprise (10+) |
|--------|------------------|------------------------|-------------------|------------------|
| Hierarchy depth | BR → TR (2 levels) | BR → TR (2 levels) | BR → SR → TR (3 levels) | Full + test derivation |
| Who manages | Supervisor | Supervisor (combined roles) | Context Architect | Context Architect + review |
| Storage | Task fields | Task fields + KB entries | Knowledge Base | Versioned + auditable |
| Reuse | Informal patterns | Informal patterns | KB templates | Cross-project library |
| Traceability | SHOULD | SHOULD | SHALL | SHALL + audit trail |
| Quality review | Self-review | Monthly Quality Sweep | QG-1 | QG-1 + independent review |
| Overhead per task | ~1 min (write AC) | ~1–2 min (write AC + log) | ~3 min (decompose + link) | ~5 min (full traceability) |
| Test Model | Implicit (review tests vs AC) | Implicit (review tests vs AC) | Explicit review | Formal TM documentation |

---

## Requirements-as-Code (Enterprise)

At Enterprise scale, requirements are managed with the same discipline as code: versioned, reviewed, tested by CI.

### What This Means

```
requirements/
  BR-001-oauth.md          # Business Requirement
  SR-001-google-oauth.md   # System Requirement (links to BR-001)
  SR-002-token-refresh.md  # System Requirement (links to BR-001)
```

Each requirement file contains:
- Unique ID and title
- Level (BR/SR)
- Parent link (SR → BR)
- Status (draft/approved/verified/deprecated)
- Version history (git log)
- Child links (BR → list of SRs, SR → list of Task slugs)

Task Requirements (TR) remain in the task tracker as goal + AC — they don't need separate files because they ARE the task.

### CI Checks for Requirements

| Check | What It Catches |
|-------|----------------|
| **Orphan detection** | BRs with no child SRs; SRs with no Tasks |
| **Traceability validation** | Tasks without requirement links; broken parent references |
| **Status consistency** | Tasks referencing `deprecated` requirements |
| **Coverage report** | % of BRs fully decomposed and implemented |
| **Change impact** | When a BR changes, list all affected SRs and Tasks |

### Requirement Library and Reuse

Verified requirements (status: `verified`, used successfully in N projects) become library entries:

```
library/
  patterns/
    rest-api-endpoint.md    # Template: AC for any REST endpoint
    db-migration.md         # Template: AC for any migration
    auth-integration.md     # Template: AC for auth flows
```

A new project imports a library pattern, parameterizes it, and gets proven AC that have been tested across multiple implementations. This directly improves First-Pass Success Rate — AI receives battle-tested context instead of first-draft requirements.

### When to Adopt

Requirements-as-code adds overhead. It pays off when:
- 10+ Supervisor+AI Pairs share requirements across projects
- Regulatory compliance requires audit trails (ISO 9001, ASPICE, medical devices)
- Cross-project requirement reuse is a strategic goal
- Requirement changes are frequent and impact analysis is needed

For SENAR Core and most Team configurations, requirements in the task tracker and Knowledge Base are sufficient.
