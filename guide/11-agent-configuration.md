# SENAR Guide: Agent Configuration in Practice

This chapter bridges the normative requirements of Standard Section 5 (Agent Instrumentation) with practical implementation. It covers how to write operational scripts, define agent profiles, manage script changes, and apply these concepts across different AI development tools.

---

## Anatomy of an Operational Script

An Operational Script is a structured natural-language instruction. Unlike code, scripts are interpreted by an AI agent — which means they must be unambiguous, self-contained, and testable.

### Minimal Script Structure

```
Script: commit
Trigger: /commit command or explicit user request

Preconditions:
- Changes exist in the working tree
- No failing tests

Algorithm:
1. Run git status to see all changes
2. Run git diff to review staged and unstaged changes
3. Analyze changes and draft a commit message:
   - Summarize the nature of changes (feature, fix, refactor...)
   - Keep message under 72 characters for the subject line
4. Stage relevant files (prefer specific files over git add -A)
5. Create the commit
6. Run git status to verify success

Postconditions:
- Commit exists in local repository
- Working tree is clean for committed files

Outputs:
- Commit hash
- Summary of what was committed
```

### What Makes a Good Script

1. **Explicit preconditions.** If a script assumes something is true, state it. "Tests pass" is a precondition, not an assumption.

2. **Numbered steps with decision points.** When step 3 depends on the outcome of step 2, say so. "If tests fail, stop and report. If tests pass, continue to step 4."

3. **Defined outputs.** What does the script produce? A commit? A report? A status change? Be specific.

4. **Edge cases documented.** "If no changes exist, report this and exit without creating an empty commit."

5. **No platform-specific calls.** Write "Run the test suite" not "Run `npm test`." The script should work regardless of the project's tech stack.

### Anti-Patterns

- **Vague instructions:** "Make sure everything is good" — not verifiable
- **Implicit knowledge:** "Use the standard approach" — which standard?
- **Missing error handling:** No guidance for when steps fail
- **Overcoupled scripts:** One script that does planning, implementation, and review

---

## Defining Agent Profiles

An Agent Profile restricts what an AI agent can do. The restriction is the point — it prevents the agent from performing actions outside its designated function.

### Generator Profile (Primary Development)

```
Profile: Generator
Purpose: Implement code changes for a specific Task

Scripts available:
- implement: Write code to satisfy Task acceptance criteria
- debug: Investigate and fix failures
- commit: Create version-controlled commits
- test: Run and verify test results

Access:
- Read/write: source code, tests, configuration
- Read: task definitions, knowledge base
- Write: task status updates, knowledge entries
- NO access to: deployment, infrastructure, other projects' code

Constraints:
- Changes must stay within Task scope boundaries
- Commits must be atomic (one logical change)
- Must not modify files outside defined scope
```

### Reviewer Profile (Independent Verification)

```
Profile: Reviewer
Purpose: Independently verify code changes against acceptance criteria

Scripts available:
- review: Check code against acceptance criteria and standards
- security-audit: Scan for security issues
- report: Generate review findings

Access:
- Read-only: source code, tests, configuration, task definitions
- Write: review comments, findings
- NO access to: code modification, commits, deployment

Constraints:
- Cannot modify any code being reviewed
- Findings must reference specific acceptance criteria
- Must check for AI-specific issues (hallucinated APIs, self-validating tests)
```

### Minimum Viable Profiles

At SENAR Core level, you need at minimum:
1. **Generator** — for development work
2. **Reviewer** — for independent verification

The key insight: even if the same AI agent switches between profiles, the profile switch enforces a cognitive boundary. The Reviewer profile cannot write code, so it evaluates rather than fixes.

---

## Managing Script Changes

Changing a script changes how your AI agent behaves in production. Treat script changes with the same rigor as production code changes.

### The Script Change Workflow

```
1. Identify need for change
   ↓
2. Draft the change with rationale
   ↓
3. Review (peer or self, depending on configuration)
   ↓
4. Test on isolated project (Team+)
   ↓
5. Deploy to target project
   ↓
6. Monitor effectiveness (FPSR, error rate)
   ↓
7. Record decision in knowledge base
```

### Testing Script Changes

Before deploying a script change across all projects:

1. **Select a representative task** — pick a task similar to what the script will handle
2. **Run the task with the old script** — record FPSR and any issues
3. **Run a similar task with the new script** — compare results
4. **Check for regressions** — did the change break any existing behavior?

### Rollback

Every script change should be reversible:
- Scripts are in version control — `git revert` works
- Maintain a version identifier in each script (date or semver)
- Document what to watch for after rollback (tasks in progress may be affected)

---

## Tool-Specific Examples

### Claude Code

Claude Code uses `CLAUDE.md` for the Behavioral Contract and `.claude/skills/` for Operational Scripts.

**Behavioral Contract** (`CLAUDE.md`):
```markdown
# Project Rules
- NEVER commit without explicit permission
- NEVER modify files outside src/ and tests/
- Run tests before every commit
- Ask before installing new dependencies
```

**Operational Script** (`.claude/skills/review.md`):
```markdown
# Review Skill
Trigger: /review command

Steps:
1. Read the current git diff
2. For each changed file, check:
   a. Does the change match the stated Task goal?
   b. Are there any hardcoded values that should be configurable?
   c. Are error cases handled?
   d. Do tests cover the acceptance criteria, not just code paths?
3. Check for AI-specific issues:
   a. Hallucinated APIs or methods
   b. Non-existent package references
   c. Self-validating test patterns
4. Report findings with specific line references
```

**Profile switching:** Claude Code does not natively enforce profile permissions. Implement via CLAUDE.md rules: "When performing a review, you are in Reviewer mode. Do NOT modify any code. Only report findings."

### OpenAI ChatGPT / GPT-4

**Behavioral Contract** (system prompt or custom instructions):
```
You are working in Generator mode. You may:
- Read and write source code and tests
- Create commits with descriptive messages
- Search the codebase

You may NOT:
- Modify deployment configuration
- Access external APIs
- Create files outside the project directory
```

**Operational Scripts** (structured prompts or saved workflows):
ChatGPT / GPT-4 does not have a native skill/script mechanism. Scripts are implemented as structured prompt templates that the Supervisor provides at the start of each task.

### Cursor

**Behavioral Contract** (`.cursorrules`):
```
Rules:
- Always run type checking before suggesting changes as complete
- Never modify files not mentioned in the current task
- Prefer editing existing files over creating new ones
```

**Operational Scripts** (`.cursor/prompts/` or manual invocation):
Cursor supports custom prompts that function similarly to operational scripts. Store these in version control alongside the project.

---

## Practical Workflow: Script Change Lifecycle

**Scenario:** Your "implement" script produces code that frequently has type errors. You want to add a "run type checking" step before marking the implementation as complete.

### Step 1: Document the Problem

In your knowledge base:
```
Type: observation
Title: Implementation script produces type errors
Body: In the last 5 tasks, 3 had type checking failures caught at CI
  (QG-2). Adding a type check step to the implement script should
  catch these earlier and improve FPSR.
```

### Step 2: Draft the Change

Add to the implement script, after the "write code" step:
```
5. Run the project's type checker
6. If type errors exist:
   a. Fix them
   b. Re-run type checker
   c. Repeat until clean
7. Continue to tests
```

### Step 3: Review

For Core: self-review — does the addition make sense? Does it conflict with other steps?

For Team+: peer review — another Supervisor reviews the script change. Check: is the new step clear? Are edge cases handled (what if the project has no type checker)?

### Step 4: Test (Team+)

Run one task with the new script on a non-critical project. Did the type check step execute correctly? Did it catch type errors before CI? Did it add unreasonable time?

### Step 5: Deploy

Commit the script change. Update the version identifier.

### Step 6: Monitor

Over the next 5–10 tasks, track:
- Did type checking failures at CI (QG-2) decrease?
- Did task completion time change significantly?
- Any unexpected side effects?

### Step 7: Record

```
Type: decision
Title: Added type checking step to implement script
Body: After 3/5 tasks had type errors at CI, added explicit type check
  step to implement script. First 5 tasks after change: 0/5 type
  errors at CI. ~2 min added per task, saves ~10 min rework.
```

---

## Summary

| Concept | Core | Team+ |
|---------|-----------|-------|
| Agent Profiles | Generator + Reviewer (SHOULD) | All 5 with permission enforcement (SHALL) |
| Operational Scripts | In version control, self-reviewed | Reviewed, tested, registry maintained |
| Script Changes | Treated as process changes | Tested on isolated project first |
| Rollback | Version control provides | Registry + explicit rollback procedure |
| Audit Trail | Knowledge entries | Formal change log |
