# SENAR Guide: Failure Modes

SENAR can fail. Every methodology can. This document catalogs the ways SENAR implementations break down, how to detect problems early, and what to do about them.

The failure modes are organized into three categories: process failures (the methodology is adopted but practiced incorrectly), organizational failures (the people and structures around SENAR break down), and technical failures (the AI tooling and infrastructure undermines the process).

---

## Process Failures

### PF-1: Shadow Coding

**Description:** Supervisors secretly write code instead of directing AI Agents. The Task appears AI-generated, metrics show normal throughput, but the human is doing the implementation work. This defeats the fundamental premise of SENAR: that the Supervisor's value is judgment, not keystrokes.

**Early warning signs:**
- Manual Intervention Rate climbs above 30% without corresponding Dead End entries explaining why AI couldn't do the work
- Commit timestamps cluster outside of session windows
- Supervisors report feeling "faster without the AI" but can't articulate what the AI struggled with
- Knowledge base has no Dead End or Gotcha entries — everything "just works" (because the human did it)
- Session tool call counts are suspiciously low relative to task complexity

**Recovery action:**
1. Conduct a non-punitive audit: compare git diffs against AI session logs for a sample of Tasks
2. Identify which task types trigger shadow coding — these likely have poor context templates
3. Improve context quality for those task types (better AC, patterns, architectural constraints)
4. If AI genuinely cannot handle certain task types, create an explicit "manual" work type with its own tracking

**Prevention:**
- Normalize manual intervention as a documented, tracked activity — not a shameful secret
- Track Manual Intervention Rate as a diagnostic metric, not a performance metric
- Ensure Supervisors understand that high MIR on certain task types is a signal to improve context, not a personal failure
- Session logs should be reviewed in Quality Sweeps — not to police, but to identify context gaps

---

### PF-2: Rubber Stamping

**Description:** Supervisors accept AI output without meaningful verification. Code passes QG-2 (automated tests, lint, types) but nobody checks whether it actually solves the problem correctly, handles edge cases, or fits the architecture. The human becomes a button-presser.

**Early warning signs:**
- Defect Escape Rate rises while First-Pass Success Rate stays suspiciously high (everything "passes" but bugs appear later)
- Code review comments are absent or perfunctory ("LGTM", "looks good")
- Verification time per task drops below plausible minimums (a 200-line change reviewed in 30 seconds)
- Architectural drift: patterns diverge across the codebase because nobody enforces consistency
- Security vulnerabilities appear in production that a human reviewer should have caught

**Recovery action:**
1. Mandatory Quality Sweep focused on the last 2 Increments — compare merged code against requirements
2. Introduce QG-3 (Verification Gate) if not already active: independent review by a different Supervisor
3. Establish minimum review time thresholds proportional to change size
4. Create an "AI Review Checklist" (see Guide 02) and require it to be completed per task

**Prevention:**
- QG-3 with independent verification is the strongest safeguard
- Rotate Verification Engineer assignments so reviewers stay sharp
- Track Defect Escape Rate prominently — it is the primary indicator of rubber stamping
- Quality Sweeps must sample actual code, not just metrics

---

### PF-3: Gate Bypass Normalization

**Description:** Quality Gates exist but are routinely bypassed with documented exceptions. "We'll fix it later" becomes the default. Gate bypass was designed for genuine emergencies; when it becomes normal, the gates are decorative.

**Early warning signs:**
- More than 10% of Tasks have gate bypass entries
- The same gate is bypassed repeatedly (e.g., QG-0 skipped because "we already know what to do")
- Bypass justifications become formulaic ("time pressure", "will address in next increment")
- Tech debt tickets created from bypasses are never completed
- New team members learn to bypass gates as standard practice

**Recovery action:**
1. Audit all bypass entries from the last 2 Increments — categorize by gate and justification
2. For each repeatedly-bypassed gate, determine: is the gate too strict (adjust criteria) or is the team undertrained (invest in process)?
3. Require bypass approval from someone other than the Supervisor doing the work
4. Create a "bypass budget" per Increment — a maximum number of allowed bypasses. When exhausted, the gate is hard-blocked

**Prevention:**
- Track bypass rate as a metric reviewed at Increment Retrospectives
- Retrospective must include a "bypass review" — every bypass is discussed, not just counted
- Gate criteria should be reviewed quarterly: if a gate is routinely bypassed, it may need adjustment rather than enforcement
- Distinguish between "gate too strict" (criteria problem) and "discipline too low" (culture problem) — the responses are different

---

### PF-4: Knowledge Base Staleness

**Description:** The Knowledge Base was populated during initial adoption but is no longer maintained. Entries refer to old patterns, deprecated APIs, or architectural decisions that have been superseded. AI Agents receive stale context and produce output based on outdated information.

**Early warning signs:**
- Knowledge Capture Rate drops below 0.3 entries per task for 3+ consecutive sessions
- New Supervisors report that KB entries contradict what they see in the codebase
- AI Agents produce output using patterns documented in KB that the team has since abandoned
- "Last reviewed" dates on KB entries are older than 3 Increments
- Dead End entries reference tools or libraries that are no longer in the stack

**Recovery action:**
1. Schedule a dedicated KB audit session — treat it as a Task, not a side activity
2. Mark every entry with a freshness status: current, needs-review, deprecated
3. Delete or archive deprecated entries immediately — stale context is worse than no context
4. Assign KB maintenance as an explicit responsibility (Knowledge Engineer role)

**Prevention:**
- Quality Sweep ceremony (Standard, Section 7.4) should include KB freshness audit
- Knowledge entries should have a "last verified" timestamp, updated when someone confirms the entry is still accurate
- Set a target Knowledge Capture Rate (0.3-0.5 entries/task) and review at Retrospectives
- When a Task produces output that contradicts a KB entry, the entry must be updated before the Task is marked done

---

### PF-5: Dead End Documentation Stops

**Description:** Teams stop documenting failed approaches. Dead Ends are one of the highest-value knowledge types — they prevent AI Agents from repeating mistakes. When teams are under pressure, Dead End documentation is the first thing dropped because it documents what didn't work, which feels low-priority.

**Early warning signs:**
- Dead End entries per Increment drop to zero
- AI Agents attempt approaches that were already tried and abandoned in previous sessions
- Session durations increase because the AI is exploring paths that a human remembers failing but didn't document
- Handoff documents mention "we tried X but it didn't work" without creating a KB entry

**Recovery action:**
1. Review the last 5 session handoffs for mentions of failed approaches — create Dead End entries for each
2. Add "Dead End capture" as an explicit step in the Session End ceremony
3. Make Dead End documentation part of QG-2 acceptance criteria for complex tasks

**Prevention:**
- Session End template should include a "Failed approaches" section that becomes a Dead End entry
- Knowledge Capture Rate metric should be decomposed by entry type — a healthy KB has a mix of decisions, patterns, gotchas, and dead ends
- Celebrate Dead End documentation: it is not a record of failure, it is a map of the territory

---

### PF-6: Session Discipline Erosion

**Description:** Sessions stretch beyond reasonable limits. Supervisors skip Session Start (no context loading, no task selection) or Session End (no handoff, no metrics capture). The session boundary — SENAR's primary rhythm mechanism — dissolves into continuous, unstructured work.

**Early warning signs:**
- Session durations exceed 8 hours regularly
- Session Start entries have no task list or context verification
- Handoff documents are empty or missing
- Checkpoints are never taken
- Tool call counts per session exceed 500 (fatigue territory)
- Quality of AI output degrades in the second half of sessions (context window exhaustion)

**Recovery action:**
1. Enforce hard session time limits — 4-6 hours is the recommended range
2. Make Session End a blocking step: the next session cannot start without a completed handoff
3. Implement automatic checkpoint reminders at 40-60 tool call intervals
4. Review the last 10 sessions for missing handoffs and create them retroactively

**Prevention:**
- Session Start and Session End are ceremonies, not optional steps
- Tooling should enforce: session cannot start if previous session has no handoff
- Set a maximum tool call budget per session (300-500 depending on task complexity)
- Supervisor fatigue is real: verification quality degrades after 4-6 hours. Process must acknowledge human limits

---

### PF-7: Vanity Metrics

**Description:** Teams optimize metrics without improving outcomes. Throughput is inflated by splitting tasks into trivially small units. First-Pass Success Rate is gamed by lowering acceptance criteria. Lead Time is reduced by starting tasks before they're ready. The numbers look good; the software does not.

**Early warning signs:**
- Throughput increases dramatically but stakeholder satisfaction doesn't
- Average task complexity drops to "trivial" for 80%+ of tasks
- FPSR is above 95% but Defect Escape Rate is also above 10% (contradictory signals)
- Lead Time decreases but deployed features are incomplete or buggy
- Teams resist adding new metrics or changing existing ones
- Cost per Task drops but total Increment cost doesn't

**Recovery action:**
1. Cross-reference metrics: Throughput x DER, FPSR x post-deployment defects, Lead Time x rework rate
2. Introduce "outcome metrics" alongside process metrics: deployment frequency, change failure rate, time to restore
3. Redefine task granularity guidelines — a task should represent a meaningful, verifiable change
4. Retrospective should compare metrics against actual stakeholder outcomes

**Prevention:**
- Never reward or punish based on a single metric
- Metrics exist to diagnose, not to judge — make this explicit in team norms
- DER is the hardest metric to game because it's measured by external reality (production bugs)
- Quality Sweeps should validate that metrics tell a consistent story

---

## Organizational Failures

### OF-1: Supervisor Burnout

**Description:** Constant verification of AI output creates cognitive fatigue. The Supervisor must maintain deep technical understanding while processing large volumes of generated code. Unlike traditional development where the developer builds context incrementally, the Supervisor must rapidly context-switch between tasks and verify unfamiliar code patterns.

**Early warning signs:**
- Verification quality drops in afternoon sessions (rubber stamping after lunch)
- Supervisors report feeling "drained" despite not writing code
- Increased use of gate bypasses in later sessions of the week
- Sick days and turnover increase
- Supervisors start preferring simple tasks and avoiding complex ones

**Recovery action:**
1. Reduce session length to 3-4 hours with mandatory breaks
2. Rotate between deep verification work and lighter tasks (documentation, knowledge curation)
3. Implement pair supervision: two Supervisors verify each other's complex tasks
4. Ensure Supervisors have autonomy in task selection and session planning

**Prevention:**
- Design sessions with verification load in mind — not all tasks require the same level of scrutiny
- Budget time for non-verification work: KB maintenance, context improvement, learning
- Track tool calls and session duration — these are leading indicators of burnout
- Respect the difference between "AI can work 24 hours" and "humans cannot verify for 24 hours"

---

### OF-2: Skills Atrophy

**Description:** Supervisors stop writing code entirely and gradually lose the ability to evaluate AI output at a deep technical level. They can spot surface-level issues (typos, obvious bugs) but miss architectural problems, performance anti-patterns, and subtle security issues. The "judgment over keystrokes" value requires that judgment remains sharp.

**Early warning signs:**
- Supervisors struggle to explain why a particular implementation approach is wrong
- Architectural decisions are increasingly delegated to the AI with no human challenge
- Code reviews become "does it work?" rather than "is this the right approach?"
- Supervisors avoid tasks in unfamiliar parts of the codebase
- New technologies are adopted without Supervisor understanding of tradeoffs

**Recovery action:**
1. Institute "manual implementation days" — periodic sessions where Supervisors write code without AI assistance
2. Require Supervisors to write the architectural approach before the AI implements it
3. Rotate Supervisors across different parts of the codebase to force learning
4. Include "explain the implementation" as part of verification: if you can't explain it, you can't verify it

**Prevention:**
- Supervisors should occasionally implement complex tasks manually to stay sharp
- Technical learning time should be budgeted — not as overhead, but as capability maintenance
- The Context Architect role keeps Supervisors engaged in system design, not just task verification
- Quality Sweeps that require deep code understanding serve double duty: quality assurance and skill maintenance

---

### OF-3: AI Tool Vendor Lock-in

**Description:** The SENAR implementation becomes deeply coupled to a specific AI tool, model, or platform. Session templates, knowledge base format, context injection mechanisms, and verification workflows all assume a particular vendor's API and capabilities. Switching becomes prohibitively expensive.

**Early warning signs:**
- All context templates use vendor-specific syntax or features
- Knowledge base format is optimized for one model's context window size
- Session management is embedded in a proprietary platform with no export
- Cost tracking depends on vendor-specific billing APIs
- Team expertise is in "using Tool X" rather than "supervising AI agents"

**Recovery action:**
1. Audit all touchpoints between SENAR process and AI tooling — create an abstraction inventory
2. Define a vendor-neutral interface for context injection, output capture, and session management
3. Extract knowledge base into a portable format (structured markdown, JSON)
4. Run parallel sessions with alternative tools to validate portability

**Prevention:**
- SENAR deliberately does not prescribe specific AI tools — maintain this neutrality
- Keep knowledge base in a format readable by any LLM (structured text, not proprietary embeddings)
- Session management should be a thin layer, not a platform
- Periodically evaluate alternative tools to maintain optionality

---

### OF-4: Over-Process (Bureaucratic SENAR)

**Description:** SENAR becomes an end in itself. Every task requires exhaustive documentation. Every session has a 30-minute startup ceremony. Every knowledge entry needs three approvals. The methodology that was designed to increase throughput becomes the primary obstacle to throughput.

**Early warning signs:**
- Session Start takes longer than 30 minutes
- More time is spent on SENAR ceremonies than on actual work
- Supervisors create "process compliance" tasks that produce no software value
- New Supervisors are overwhelmed by the number of required steps
- Teams maintain two systems: the "official" SENAR process and their actual workflow

**Recovery action:**
1. Measure "process overhead ratio": time on ceremonies / time on productive work. If it exceeds 20%, the process is too heavy
2. Revisit which SENAR level (Core/Team/Enterprise) actually matches the team's needs — many teams over-adopt
3. Automate everything that can be automated — manual ceremony steps should be minimized
4. Apply SENAR's own principle: "Enforcement over Ceremony" — if a step can be automated, it shouldn't be a manual ceremony

**Prevention:**
- Start with SENAR Core and upgrade only when specific pain points justify additional process
- Every ceremony should have a defined timebox
- Every manual step should have a justification: "what failure does this prevent?" If the answer is unclear, remove the step
- Periodically run a "process audit" — are all steps still earning their cost?

---

### OF-5: Under-Process (Perpetual L2)

**Description:** The team adopts SENAR Core (Maturity Level 2) and never progresses. Tasks exist, Start Gate and Done Gate are enforced, FPSR and DER are tracked — but there's no independent verification, no knowledge capture discipline, no federation coordination. The team gets the minimum benefit and plateaus.

**Early warning signs:**
- Same process for 6+ months with no evolution
- Knowledge base growth has flatlined
- DER is stable but never improves
- Cross-project dependencies are managed ad-hoc (email, chat) rather than through federation
- No Increment Retrospectives — metrics are collected but never reviewed
- Team says "SENAR is working fine" but can't point to specific improvements

**Recovery action:**
1. Run a maturity assessment across all 6 dimensions (Section 12.2) — identify the weakest
2. Pick ONE dimension to improve in the next Increment — don't try to jump from L2 to L3 across all dimensions simultaneously
3. Assign improvement ownership to a specific person (Flow Manager responsibility)
4. Set a measurable target: "Reduce DER from 12% to 8% by end of Increment"

**Prevention:**
- Include "process improvement" as a standing item in Increment Planning
- The Flow Manager role exists precisely to drive process evolution — ensure it's staffed
- Set explicit maturity targets with timelines
- Review the SENAR Maturity Model (Section 12) at each Retrospective

---

### OF-6: Supervisor Resistance

**Description:** Developers refuse to adopt the Supervisor role. They see SENAR as de-skilling: taking away the creative, satisfying work of writing code and replacing it with bureaucratic verification of machine output. The resistance may be quiet (passive non-compliance) or loud (active pushback).

**Early warning signs:**
- High shadow coding rates (PF-1) — developers code and retroactively create tasks to match
- Supervisors describe themselves as "reviewers" or "testers" rather than "engineers"
- Hiring for Supervisor roles is difficult — candidates want "real engineering" positions
- Team morale surveys show dissatisfaction with role definition
- Experienced developers leave for traditional development roles

**Recovery action:**
1. Address the identity question directly: Supervisor is a more senior role than Developer, not a lesser one
2. Highlight the aspects of the role that require deeper skill: architectural judgment, context design, verification of complex systems
3. Allow Supervisors to choose when to code manually — autonomy reduces resistance
4. Share concrete examples of how the Supervisor role amplifies individual impact (throughput multiplied by AI)

**Prevention:**
- Frame the transition as career progression, not role diminishment
- Ensure compensation reflects the increased scope and responsibility of the Supervisor role
- Provide the Transition Guide (Guide 04) and allow adequate adjustment time
- Create communities of practice where Supervisors share techniques and celebrate wins

---

### OF-7: Knowledge Silos

**Description:** Each Supervisor develops their own undocumented patterns for context preparation, task structuring, and AI interaction. These patterns are effective but exist only in the Supervisor's head. When they're unavailable, other Supervisors can't replicate their results.

**Early warning signs:**
- Throughput varies dramatically between Supervisors on similar task types
- Knowledge base entries are sparse or generic — the "real" context is in personal notes
- Supervisors can't cover for each other during absences
- Handoff documents don't capture the "tricks" that make a session productive
- New Supervisors take months to reach baseline productivity

**Recovery action:**
1. Run "context pairing" sessions: have high-performing Supervisors work alongside others, capturing their undocumented patterns
2. Convert personal notes and templates into shared knowledge entries
3. Standardize context templates for common task types
4. Include "knowledge sharing" as an explicit goal in Quality Sweeps

**Prevention:**
- Knowledge Capture Rate metric should be reviewed per Supervisor, not just in aggregate
- Context templates should be shared artifacts, not personal files
- Session handoffs should include "what worked well" for context preparation, not just task status
- The Knowledge Engineer role exists to prevent silos — ensure it's actively practiced

---

## Technical Failures

### TF-1: Model Change Breaks Baselines

**Description:** The AI model is updated (new version, different provider, or fine-tuning change) and all established baselines become invalid. Throughput, FPSR, Lead Time, and Cost per Task all shift unpredictably. The team loses its ability to detect process problems because the signal is buried in model-change noise.

**Early warning signs:**
- Sudden shift in all metrics after a model update
- Tasks that previously had high FPSR start failing
- Cost per Task changes significantly (often in both directions for different task types)
- Context templates that worked well now produce worse output
- AI behavior changes subtly: different coding style, different library preferences, different error handling patterns

**Recovery action:**
1. Treat a model change as a "baseline reset event" — document the change and mark metrics before/after
2. Run a sample of representative tasks on the new model to establish new baselines
3. Update context templates and knowledge entries that assumed specific model behavior
4. Allow 1-2 sessions of reduced throughput expectation while the team calibrates

**Prevention:**
- Pin model versions in production — don't auto-update
- When evaluating a new model, run a parallel evaluation on a representative task set before switching
- Keep context templates model-neutral: describe what you want, not how the model should produce it
- Maintain a "model change log" that records which model version was used for each Increment's baselines

---

### TF-2: Context Window Limitations

**Description:** The AI's context window is finite. As projects grow, the context required for a task (codebase knowledge, architectural constraints, related patterns, previous decisions) exceeds what fits in a single session. Tasks are artificially split not because they're naturally separable, but because the AI can't hold enough context.

**Early warning signs:**
- Tasks are split into sub-tasks that don't make sense as independent units
- AI "forgets" instructions given earlier in the session
- Late-session output contradicts early-session decisions
- Supervisors spend increasing time re-explaining context after checkpoints
- Complex refactoring tasks fail because the AI can't see enough of the codebase simultaneously

**Recovery action:**
1. Restructure context injection: prioritize high-value context (architectural constraints, active patterns) over low-value context (full file contents)
2. Use knowledge base entries as compressed context: a 5-line decision entry replaces reading 500 lines of code
3. Implement progressive context loading: start with architecture overview, load details as needed
4. Accept that some tasks require multiple sessions — design handoff documents to carry context across the boundary

**Prevention:**
- Knowledge base entries are context compression tools — invest in high-quality, concise entries
- Architectural documentation should be structured for AI consumption: clear, concise, with explicit constraints
- Design task granularity around natural boundaries, not context window size
- Monitor context window utilization and establish team conventions for context budget allocation

---

### TF-3: Architecturally Wrong but Gate-Passing Code

**Description:** AI generates code that passes all automated quality gates (tests pass, types check, linter clean, security scan clear) but is architecturally wrong. It might use the wrong pattern, create inappropriate coupling, bypass established abstractions, or introduce a dependency that will cause problems in 6 months. Automated gates verify correctness; they cannot verify judgment.

**Early warning signs:**
- Code reviews increasingly find "it works but it's wrong" issues
- Similar functionality is implemented differently in different parts of the codebase
- Established abstractions are bypassed — AI creates new patterns instead of using existing ones
- Dependency graph grows in unexpected directions
- Refactoring costs increase over time as architectural drift accumulates

**Recovery action:**
1. Strengthen the QG-3 Verification Gate with explicit architectural review criteria
2. Create "architectural constraint" knowledge entries that are injected into every session context
3. Run an architectural health audit — identify and document all established patterns
4. Consider architecture-specific linting rules that can be automated (dependency constraints, layer violations)

**Prevention:**
- Architectural decisions must be documented in the knowledge base, not just in the code
- Context templates for each area of the codebase should include "use this pattern, not that pattern" instructions
- Quality Sweeps should include architectural consistency checks
- The Context Architect role is critical here: they ensure AI receives the right architectural constraints
- Automated architectural fitness functions (dependency rules, layer checks) convert judgment into enforcement

---

### TF-4: Phantom Dependencies

**Description:** Across sessions, AI agents introduce dependencies (libraries, services, API calls, shared state) that are not explicitly tracked. Each dependency is individually reasonable, but the aggregate creates a fragile system. No single person or document captures the full dependency graph.

**Early warning signs:**
- Build times increase without obvious cause
- Package manifest (package.json, requirements.txt, go.mod) grows steadily
- "Works on my machine" issues increase — environment setup is unreliable
- Upgrading one dependency triggers cascading failures
- Nobody can explain why a particular dependency was added
- Service coupling increases: changes in one service require changes in others

**Recovery action:**
1. Run a dependency audit: for every dependency, find the Task that introduced it and verify it's still needed
2. Create a "dependency decision" knowledge entry type — every new dependency requires a documented justification
3. Implement dependency change detection in CI — any new dependency triggers a review flag
4. Prune unused dependencies

**Prevention:**
- Add dependency justification to QG-2 acceptance criteria: "no new dependencies without documented reason"
- Track dependency count as a secondary metric
- Quality Sweeps should include dependency review
- Context templates should list approved dependencies and their purposes — AI will prefer what it knows about

---

### TF-5: Meaningless Test Coverage

**Description:** AI generates tests that achieve high coverage metrics but don't actually verify meaningful behavior. Tests mirror the implementation: they test that the code does what the code does, not that the code does what the requirements say. This is particularly insidious because the coverage number looks excellent.

**Early warning signs:**
- Test coverage is above 90% but Defect Escape Rate is also high
- Tests break when implementation changes but not when behavior changes (brittle, tightly coupled tests)
- Test descriptions are generic: "should work correctly", "handles input"
- Tests don't cover edge cases, error paths, or boundary conditions
- Mutation testing kills few mutants despite high line coverage
- Integration tests are actually unit tests with mocked-out dependencies

**Recovery action:**
1. Run mutation testing to evaluate actual test effectiveness — coverage means nothing without kill rate
2. Review test quality in Quality Sweeps: do tests verify requirements or mirror implementation?
3. Require acceptance criteria to include specific test scenarios — AI writes tests from scenarios, not from code
4. Introduce property-based testing for critical paths

**Prevention:**
- Acceptance criteria should define test cases: "given X, when Y, then Z" — not "write tests for this function"
- Track mutation testing score alongside coverage
- QG-2 should include test quality checks, not just coverage thresholds
- Knowledge base should contain testing patterns: "how we test X-type functionality"
- Separate the test-writing agent prompt from the implementation agent prompt — tests should verify requirements, not mirror code

---

## Summary

No failure mode in this document is theoretical. Every one has been observed in practice, either in AI-native development or in analogous patterns from traditional Agile/SAFe adoption.

The common thread across all failure modes is the same: **when the uncomfortable parts of the process are skipped, the process stops working.** Verification is uncomfortable. Documentation is tedious. Dead Ends feel like wasted time. Gate compliance feels like bureaucracy. But these are the load-bearing elements of SENAR — remove them and the structure collapses.

The best defense is not more process but better feedback loops:
1. **Metrics that cross-reference** — no single metric tells the truth alone
2. **Quality Sweeps that sample reality** — not just metrics dashboards but actual code and actual knowledge entries
3. **Retrospectives that ask hard questions** — not "are our numbers good?" but "is our software good?"
4. **A culture where documenting failure is valued** — Dead Ends and failure mode awareness prevent repeated mistakes
