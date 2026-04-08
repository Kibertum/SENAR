# SENAR Reference: Efficiency Model

This document provides frameworks for evaluating the efficiency of SENAR adoption. All models use **ratios and multipliers**, not absolute monetary values — organizations substitute their own numbers in any currency.

---

## A. Efficiency Dimensions

SENAR efficiency is measured across four dimensions:

| Dimension | What It Measures | Key Ratio |
|-----------|-----------------|-----------|
| **Throughput** | Output per production unit | Tasks per Supervisor+AI Pair vs tasks per traditional developer |
| **Quality** | Defect prevention and detection cost | Defect cost ratio: early detection vs late detection |
| **Knowledge** | Organizational learning retention | Knowledge reuse rate: entries that prevent repeated mistakes |
| **Overhead** | Process cost as fraction of delivery | Ceremony + gate time as % of productive session time |

---

## B. Throughput Model

### B.1 Production Unit Comparison

| Model | Production Unit | Typical Composition |
|-------|----------------|-------------------|
| Traditional | Development Team | 5–9 engineers + QA + PM |
| SENAR | Supervisor+AI Pair | 1 Supervisor + AI Agent(s) |

**Throughput multiplier:**

```
T_multiplier = Tasks_per_Pair_per_period / Tasks_per_Developer_per_period
```

Organizations SHOULD measure this ratio during pilot to establish their baseline. The ratio varies significantly by: domain complexity, AI tool capability, Supervisor experience, and context quality.

### B.2 Scaling Efficiency

Traditional scaling: adding developers has diminishing returns (Brooks's Law — communication overhead grows as n²).

SENAR scaling: adding Supervisor+AI Pairs has near-linear returns up to the federation coordination limit, because Pairs operate independently with programmatic dependency tracking.

```
Traditional: Effective_capacity = n × Developer_output × (1 - communication_overhead(n))
SENAR:       Effective_capacity = n × Pair_output × (1 - federation_overhead(n))
```

Where `federation_overhead(n)` grows slower than `communication_overhead(n)` because dependencies are tracked programmatically, not through meetings.

---

## C. Quality Efficiency

### C.1 Defect Detection Cost Ratio

Defects caught earlier cost less to fix. This ratio is consistent across organizations:

| Detection Point | Relative Cost |
|----------------|--------------|
| During AI generation (same session) | **1×** (baseline) |
| During Quality Sweep (periodic audit) | **3–5×** |
| During acceptance testing | **5–10×** |
| In production | **10–50×** |

**Quality Gate ROI:**

```
Gate_ROI = (Defects_caught × Avg_late_detection_cost) / Gate_operation_cost
```

Organizations SHOULD measure defect counts at each stage and calculate their own cost ratios.

### C.2 First-Pass Efficiency

Higher First-Pass Success Rate (FPSR) means less rework:

```
Rework_cost = Tasks_total × (1 - FPSR) × Avg_rework_cost_per_task
Efficiency_gain = Rework_cost_before_SENAR - Rework_cost_after_SENAR
```

FPSR improves as context quality improves (better acceptance criteria, richer knowledge base, documented dead ends).

---

## D. Knowledge Efficiency

### D.1 Dead End Reuse

Each documented Dead End prevents future Supervisors from repeating a failed approach.

```
Dead_End_ROI = Documented_dead_ends × Avg_times_would_be_repeated × Avg_exploration_cost
```

The reuse rate for well-documented Dead Ends approaches 100% — nearly every documented dead end prevents at least one repeat within the organization.

### D.2 Knowledge Accumulation Effect

As the knowledge base grows, context quality improves, which improves FPSR, which reduces rework:

```
Session N:    FPSR = f(KB_size_at_N, Context_quality)
Session N+K:  FPSR' > FPSR  (if KB is maintained and growing)
```

This creates a compound efficiency gain — each Increment is more efficient than the last, up to the plateau where most common patterns and pitfalls are documented.

---

## E. Overhead Model

### E.1 Process Overhead Ratio

```
Overhead_ratio = Time_on_ceremonies_and_gates / Total_session_time
```

Target: overhead < 15% of session time for Core/Foundation, < 20% for Team.

| Activity | Core/Foundation | Team |
|----------|-----------|------|
| Session Start | 2–5 min | 2–5 min |
| Session End | 5–10 min | 5–10 min |
| Quality Gate checks | Automated (0 min) | Automated (0 min) |
| Quality Sweep | Periodic (amortized) | Periodic (amortized) |
| Federation Sync | N/A | 5–10 min per sync |
| Increment Planning | Amortized | 1 session per Increment |
| Retrospective | Amortized | 30–60 min per Increment |

### E.2 Overhead Break-Even

SENAR overhead pays for itself when defect prevention savings exceed process cost:

```
Break_even: Gate_cost + Ceremony_cost < Defects_prevented × Avg_defect_cost
```

Organizations SHOULD calculate this after 3 Increments with measured data.

---

## F. Comparison Framework

### F.1 Traditional Team vs SENAR Team

To compare delivery efficiency for the same scope:

| Metric | Traditional Team | SENAR Team | How to Measure |
|--------|-----------------|------------|----------------|
| Headcount | N developers + QA + PM | M Supervisors + support roles | Count |
| Throughput | Tasks per period | Tasks per period | Same task granularity |
| Defect rate | Defects per 100 tasks | Defects per 100 tasks | Same counting method |
| Lead time | Requirement → production | Requirement → production | Same milestones |
| Rework rate | % tasks requiring rework | % tasks requiring rework (1 - FPSR) | Same definition |
| Knowledge retention | Bus factor, onboarding time | KB coverage, onboarding time | Measured |

### F.2 Decision Criteria

SENAR is more efficient when:
- AI tools can generate the majority of implementation artifacts for the domain
- Throughput multiplier (B.1) exceeds overhead ratio (E.1) — net productivity gain
- Defect prevention savings (C.1) exceed quality gate costs — net quality gain
- Knowledge accumulation (D.2) provides compounding returns over time

SENAR is less efficient when:
- Domain is poorly suited for AI generation (novel research, highly regulated manual processes)
- AI tooling costs exceed the value of throughput gains
- Organization cannot invest in tooling infrastructure (task tracker, CI/CD, knowledge base)
- Team is too small to benefit from process structure (1 developer on a side project)

---

## G. Evaluation Worksheet

Organizations evaluating SENAR adoption SHOULD measure these during a pilot (minimum 3 Increments):

| Metric | Pilot Value | Baseline (before SENAR) | Delta |
|--------|------------|------------------------|-------|
| Tasks per Pair per session | ___ | ___ (per developer) | ×___ |
| FPSR | ___% | N/A (new metric) | — |
| Defect Escape Rate | ___% | ___% | ___% |
| Rework rate | ___% | ___% | ___% |
| Session overhead (min) | ___ | N/A | — |
| Knowledge entries created | ___ | 0 | +___ |
| Dead Ends documented | ___ | 0 | +___ |

### Decision Rule

```
IF throughput_multiplier > 1.0 + overhead_ratio
AND defect_escape_rate <= baseline_defect_rate
THEN SENAR is providing net efficiency gain → consider scaling
```

---

## H. Red Flags

Signs that SENAR adoption is reducing rather than improving efficiency:

| Red Flag | What It Means | Action |
|----------|--------------|--------|
| Overhead ratio > 30% | Process overhead exceeds value | Simplify: reduce to MVS, automate ceremonies |
| FPSR declining over time | Context quality degrading | Audit knowledge base, review AC quality |
| Throughput multiplier < 1.0 | Pairs slower than traditional developers | Wrong domain for AI, or insufficient Supervisor training |
| Gate Bypass rate > 20% | Gates don't match reality | Recalibrate gate criteria |
| Knowledge entries = 0 | Knowledge capture abandoned | Reinforce Dead End documentation at minimum |
| Sessions consistently exceed duration limit | No discipline | Enforce checkpoints, review causes |
