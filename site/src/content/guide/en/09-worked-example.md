# SENAR Guide: A Complete Task, Start to Finish

This is not a diagram. This is one task, from requirement to done, exactly as it happens in practice. The task: add a password reset endpoint to a REST API.

Stack: Python 3.14, FastAPI, PostgreSQL, pytest. Configuration: SENAR Core (solo Supervisor).

---

## 1. The Requirement

The product backlog has a business requirement:

> **BR-042:** Users must be able to reset their passwords without contacting support.

The Supervisor decomposes this into a Task Record:

```yaml
task: impl-password-reset
story: user-authentication
goal: >
  Implement POST /auth/password-reset/request and
  POST /auth/password-reset/confirm endpoints that allow
  users to reset their password via a time-limited token.
acceptance_criteria:
  1. POST /auth/password-reset/request with valid email returns 202 and creates a reset token
  2. POST /auth/password-reset/request with unknown email returns 202 (no information leak)
  3. Reset token expires after 30 minutes
  4. POST /auth/password-reset/confirm with valid token + new password updates the password and invalidates the token
  5. POST /auth/password-reset/confirm with expired or invalid token returns 400
  6. POST /auth/password-reset/confirm with password shorter than 8 chars returns 422
role: supervisor
complexity: M
```

Time spent: ~2 minutes.

---

## 2. Start Gate (QG-0 in the Standard) Check

Before the task goes to `active`, the system checks Context Gate criteria:

| Criterion | Status |
|-----------|--------|
| Goal is non-empty | **PASS** — goal describes both endpoints and their purpose |
| Acceptance criteria exist | **PASS** — 6 criteria, each independently testable |
| Story link set | **PASS** — linked to `user-authentication` |
| Role assigned | **PASS** — `supervisor` |

Start Gate (QG-0): **PASS**. Task moves to `active`.

---

## 3. The AI Prompt

The Supervisor opens the terminal and gives this prompt to the AI agent:

```
Implement password reset for our auth module.

Goal: POST /auth/password-reset/request and POST /auth/password-reset/confirm
endpoints. Request creates a time-limited token. Confirm validates the token
and updates the password.

Acceptance criteria:
1. POST /request with valid email → 202, creates reset token
2. POST /request with unknown email → 202 (no information leak)
3. Token expires after 30 minutes
4. POST /confirm with valid token + new password → updates password, invalidates token
5. POST /confirm with expired/invalid token → 400
6. POST /confirm with password < 8 chars → 422

Scope:
- Change ONLY files in src/auth/ and tests/auth/
- Follow the patterns in src/auth/router.py and src/auth/service.py
- Do NOT modify the User model — add a new PasswordResetToken model
- Use the existing get_password_hash() for hashing
- Do NOT add new dependencies without asking

Plan:
1. Create PasswordResetToken model in src/auth/models.py
2. Add reset request/confirm logic in src/auth/service.py
3. Add endpoints in src/auth/router.py
4. Add schemas in src/auth/schemas.py
5. Write tests for all 6 AC
```

Time spent: ~1 minute (most of it was already in the task record).

---

## 4. The AI Output

The AI generates four files:

**`src/auth/models.py`** — adds `PasswordResetToken` model:

```python
class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    token: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    expires_at: Mapped[datetime] = mapped_column()
    used: Mapped[bool] = mapped_column(default=False)
```

**`src/auth/schemas.py`** — adds request/response schemas:

```python
class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(min_length=8)
```

**`src/auth/service.py`** — adds two service functions:

```python
from datetime import timezone

async def request_password_reset(db: AsyncSession, email: str) -> None:
    user = await get_user_by_email(db, email)
    if user is None:
        return  # AC-2: no information leak
    token = secrets.token_urlsafe(48)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)  # AC-3
    reset = PasswordResetToken(user_id=user.id, token=token, expires_at=expires_at)
    db.add(reset)
    await db.commit()


async def confirm_password_reset(
    db: AsyncSession, token: str, new_password: str
) -> None:
    reset = await db.execute(
        select(PasswordResetToken).where(
            PasswordResetToken.token == token,
            PasswordResetToken.used == False,
        )
    )
    reset = reset.scalar_one_or_none()
    if reset is None or reset.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    user = await db.get(User, reset.user_id)
    user.password_hash = get_password_hash(new_password)
    reset.used = True  # AC-4: invalidate token
    await db.commit()
```

**`src/auth/router.py`** — adds two endpoints:

```python
@router.post("/password-reset/request", status_code=202)
async def password_reset_request(
    body: PasswordResetRequest, db: AsyncSession = Depends(get_db)
):
    await request_password_reset(db, body.email)
    return {"detail": "If the email exists, a reset link has been sent"}


@router.post("/password-reset/confirm", status_code=200)
async def password_reset_confirm(
    body: PasswordResetConfirm, db: AsyncSession = Depends(get_db)
):
    await confirm_password_reset(db, body.token, body.new_password)
    return {"detail": "Password updated"}
```

**`tests/auth/test_password_reset.py`** — six tests:

```python
async def test_request_reset_valid_email(client, db, user):
    """AC-1: valid email returns 202, creates token."""
    resp = await client.post("/auth/password-reset/request", json={"email": user.email})
    assert resp.status_code == 202
    token = await db.execute(select(PasswordResetToken).where(
        PasswordResetToken.user_id == user.id
    ))
    assert token.scalar_one_or_none() is not None


async def test_request_reset_unknown_email(client):
    """AC-2: unknown email returns 202 (no leak)."""
    resp = await client.post("/auth/password-reset/request",
                             json={"email": "nobody@example.com"})
    assert resp.status_code == 202


async def test_token_expires_after_30_minutes(client, db, user):
    """AC-3: token created with 30-minute expiry."""
    await client.post("/auth/password-reset/request", json={"email": user.email})
    token = (await db.execute(select(PasswordResetToken))).scalar_one()
    delta = token.expires_at - datetime.now(timezone.utc)
    assert 29 * 60 < delta.total_seconds() < 31 * 60


async def test_confirm_reset_valid_token(client, db, user, reset_token):
    """AC-4: valid token + new password → password updated, token invalidated."""
    resp = await client.post("/auth/password-reset/confirm",
                             json={"token": reset_token.token, "new_password": "newsecure123"})
    assert resp.status_code == 200
    await db.refresh(reset_token)
    assert reset_token.used is True
    await db.refresh(user)
    assert verify_password("newsecure123", user.password_hash)


async def test_confirm_reset_expired_token(client, expired_reset_token):
    """AC-5: expired token returns 400."""
    resp = await client.post("/auth/password-reset/confirm",
                             json={"token": expired_reset_token.token, "new_password": "newsecure123"})
    assert resp.status_code == 400


async def test_confirm_reset_short_password(client, reset_token):
    """AC-6: password < 8 chars returns 422."""
    resp = await client.post("/auth/password-reset/confirm",
                             json={"token": reset_token.token, "new_password": "short"})
    assert resp.status_code == 422
```

---

## 5. Verification Against AC

The Supervisor does not skim the code and say "looks good." The Supervisor goes through the acceptance criteria one by one:

| AC | What to Check | Verdict |
|----|--------------|---------|
| 1. Valid email → 202 + token created | `test_request_reset_valid_email` asserts 202 and token exists in DB | **PASS** |
| 2. Unknown email → 202 | `test_request_reset_unknown_email` asserts 202, no error | **PASS** |
| 3. Token expires in 30 min | `test_token_expires_after_30_minutes` checks `expires_at` delta | **PASS** |
| 4. Valid confirm → updates password, invalidates token | `test_confirm_reset_valid_token` checks `used=True` and password changed | **PASS** |
| 5. Expired/invalid token → 400 | `test_confirm_reset_expired_token` asserts 400 | **PASS** |
| 6. Short password → 422 | `test_confirm_reset_short_password` asserts 422 | **PASS** |

Every criterion has a corresponding test. Every test asserts the expected behavior, not the implementation.

Time spent: ~3 minutes reading tests and confirming the mapping.

---

## 6. A Dead End

But first — something went wrong during execution.

The AI's first attempt used `bcrypt` for the password hashing utility it added alongside the endpoint:

```python
from bcrypt import hashpw, gensalt

def get_password_hash(password: str) -> str:
    return hashpw(password.encode(), gensalt()).decode()
```

When tests ran:

```
E   ModuleNotFoundError: No module named '_bcrypt'
```

The `bcrypt` package has a C extension that does not compile on Python 3.14 (as of March 2026). The Supervisor directed the AI to switch:

```
bcrypt import fails on Python 3.14. Switch to argon2-cffi with argon2id hasher.
The existing get_password_hash() already uses argon2 — don't create a new one,
use the existing function.
```

The AI corrected to use the existing `get_password_hash()` from `src/auth/utils.py` (which already uses `argon2-cffi`). Tests pass.

The Supervisor writes a dead end entry:

```
Dead end: bcrypt package — C extension fails to compile on Python 3.14.
Switched to argon2-cffi (argon2id). The existing get_password_hash() utility
already uses argon2id. Don't add bcrypt to new endpoints.
```

Time spent: ~30 seconds to write the entry.

---

## 7. Done Gate (QG-2 in the Standard) Check

The Supervisor runs the Implementation Gate:

```
$ pytest tests/auth/test_password_reset.py -v
======================== 6 passed in 2.14s ========================

$ mypy src/auth/ --strict
Success: no issues found in 6 source files

$ ruff check src/auth/
All checks passed!
```

| Criterion | Status |
|-----------|--------|
| CI pipeline passes | **PASS** — all green |
| All tests pass | **PASS** — 6/6 |
| Type checking clean | **PASS** — mypy strict, zero errors |
| No new linting violations | **PASS** — ruff clean |
| Acceptance criteria verified | **PASS** — all 6 AC checked in Section 5 |
| No security vulnerabilities | **PASS** — `argon2id` is OWASP-recommended; no new deps with CVEs |

Done Gate (QG-2): **PASS**. Task moves to `done`.

Time spent: ~2 minutes (mostly waiting for CI).

> **Measuring FPSR in practice:** Count a task as 'first-pass success' if it passes QG-2 without returning to active status. Track via your task management tool: tasks that go planning→active→done = success; tasks that go active→done→active→done = rework. FPSR = successes / total completed × 100%.

---

## 8. Knowledge Capture

The Supervisor creates a knowledge entry for the decision made during this task:

```yaml
type: decision
title: "Using argon2id for all password hashing"
context: >
  Password reset endpoint needed hashing. bcrypt fails on Python 3.14.
  argon2id is the OWASP recommendation and already used in get_password_hash().
decision: >
  All password operations use argon2-cffi with argon2id algorithm via
  the shared get_password_hash() utility in src/auth/utils.py.
  Do not introduce bcrypt or any other hashing library.
related_dead_end: "bcrypt C extension incompatible with Python 3.14"
```

Time spent: ~30 seconds.

---

## 9. Session End Snippet

At session end, the handoff captures everything a future session (or a different Supervisor) needs:

```
Session #12 — 2026-03-22 — 95 minutes — 4 tasks done

Completed:
  - impl-password-reset (this task)
  - impl-email-verification
  - fix-jwt-refresh-race
  - impl-logout-endpoint

Dead ends:
  - bcrypt C extension fails on Python 3.14 → use argon2-cffi

Knowledge entries:
  - decision: argon2id for all password hashing (OWASP, Python 3.14 compat)
  - gotcha: JWT refresh token race condition — need DB-level locking

Next session:
  - impl-oauth-google — Google OAuth integration
  - impl-rate-limiting — rate limit on auth endpoints (5 req/min)

Warnings:
  - OAuth requires new env vars (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
    — add before starting the task
```

---

## What This Cost

| Step | Time |
|------|------|
| Writing goal + acceptance criteria | ~2 min |
| Writing the AI prompt | ~1 min |
| AI generates code + tests | ~3 min (waiting) |
| Verification against AC | ~3 min |
| Dead end documentation | ~30 sec |
| Knowledge entry | ~30 sec |
| **Total** | **~10 min** |

Without AI, this task — two endpoints, a model, schemas, six tests, hashing research — would take approximately 25–40 minutes of manual coding.

The overhead of SENAR discipline (goal, AC, verification, knowledge capture) adds roughly 4 minutes to a task. The AI generates the remaining 6 minutes of work. The net result: a fully tested, documented, traceable endpoint in under 10 minutes.

But the real savings are not in this session. They are in the next session, when someone (or an AI agent) needs to add another auth endpoint and finds:
- The dead end that prevents them from wasting 15 minutes on bcrypt.
- The decision that tells them to use `get_password_hash()`.
- The acceptance criteria pattern they can copy for the next endpoint.

That future time saved is where SENAR pays for itself many times over.

---

## Key Takeaways

1. **The AC did the heavy lifting.** Six criteria, written in 2 minutes, drove the entire implementation — what the AI generated, what the tests checked, what the Supervisor verified. Without them, the Supervisor would have been reading code and guessing whether it's correct.

2. **The dead end is an investment, not overhead.** Thirty seconds of typing saves the next person (or AI) from repeating the same failure. In a knowledge base with 100+ dead ends, this compounds into hours saved per increment.

3. **Done Gate (QG-2) is not a ceremony.** It's your test runner, type checker, linter, and a verification table — the specific tools depend on your stack. It takes 2 minutes. If any line is red, the task is not done. No judgment calls, no "it's probably fine."

4. **The handoff makes sessions independent.** Session #13 can be started by a different person, a different AI agent, or the same Supervisor after a weekend. Everything needed is in the handoff — no tribal knowledge, no "let me remember where I was."

---

## A Note on This Example

This walkthrough shows a clean-pass scenario: one dead end, one retry, everything green on the second attempt. Real sessions are often messier — multiple dead ends, partial test failures, AC that turn out ambiguous mid-implementation, unexpected dependency conflicts. This example demonstrates the SENAR workflow structure, not the typical difficulty level. Your sessions will vary.

---

## Stack Variations

The practices above apply identically regardless of technology stack. Here are the same acceptance criteria patterns for common stacks:

> **Note:** Stack variations illustrate framework-specific patterns, not exact translations of the Python example. Adapt acceptance criteria to your stack's conventions.

### Java / Spring Boot
**Task:** Implement password reset endpoint
**AC:**
1. POST /api/v1/auth/reset-password accepts {email} → returns 200 (no email enumeration)
2. Token stored with BCrypt hash, expires in 1 hour
3. Rate limited: 3 requests per email per hour (@RateLimiter annotation or filter)
4. Integration test with @SpringBootTest and MockMvc
5. Negative: invalid token returns 400, expired token returns 410

### Go / Gin
**Task:** Implement password reset endpoint
**AC:**
1. POST /api/v1/auth/reset-password accepts {email} → returns 200
2. Token stored with bcrypt.GenerateFromPassword, 1h expiry
3. Rate limited: middleware with sync.Map or Redis
4. Table-driven tests with testify
5. Negative: invalid/expired token returns appropriate status

### TypeScript / NestJS
**Task:** Implement password reset endpoint
**AC:**
1. POST /api/v1/auth/reset-password accepts {email} → returns 200
2. Token stored with bcrypt.hash, 1h TTL
3. @Throttle() decorator or custom guard
4. Jest e2e test with supertest
5. Negative: ValidationPipe rejects malformed input

Full worked examples for Java/Spring Boot, Go, and TypeScript/NestJS are planned for the SENAR Guide v1.4.
