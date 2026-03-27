# 6. Units of Work

## 6.1 Exploration

Time-bounded investigation without full Task formality.

a) Explorations SHOULD be time-bounded (organization defines limit);
b) If Exploration yields implementation, a Task SHALL be created before changes are committed;
c) Explorations SHOULD be logged with a summary.

## 6.2 Task

The atomic unit of tracked work.

### Required Attributes

| Attribute | Description |
|-----------|-------------|
| Goal | What must be accomplished |
| Acceptance Criteria | Verifiable conditions defining done |
| Requirement Link | Link to parent Story, Business Requirement, System Requirement, or Task Requirement (SHALL) |
| Work Type | Functional category (development, architecture, QA, documentation) |

### Lifecycle States

| Transition | Gate |
|-----------|------|
| planning → active | QG-0 |
| active → done | QG-2 |
| done → merged (Team+) | QG-3 |
| merged → released (Team+) | QG-4 |
| active → blocked | None |
| blocked → active | None |

At Team configuration and above, the `done` state leads to merge review (QG-3) and release approval (QG-4).

## 6.3 Story

An intermediate grouping of Tasks representing a deliverable visible to stakeholders. Links Tasks to requirements.

### Required Attributes

| Attribute | Description |
|-----------|-------------|
| Title | One-sentence description of the deliverable |
| Acceptance Criteria | Story-level verifiable conditions defining done (independent of individual Task AC) |
| Linked Tasks | References to all Tasks that compose this Story |
| Requirement Link | Link to parent Business Requirement (BR) or System Requirement (SR) (SHALL) |

### Completion Criteria

A Story is complete when all its Tasks have reached the `done` state AND the story-level Acceptance Criteria have been verified by the Supervisor.

## 6.4 Session

A time-bounded period of supervised AI work.

a) Organizations SHALL establish and document a maximum Session duration;
b) Checkpoints SHALL be performed at intervals documented by the organization;
c) Sessions SHALL begin with context loading and end with metrics capture and handoff;
d) Ceremonies MAY be automated tooling commands;
e) Version control discipline: commits SHALL be atomic; secrets detection SHALL be automated; AI changes SHALL be reviewed for scope creep.

## 6.5 Increment

A scope-bounded batch of work with defined objectives, planned budget, and risk register.

a) Each Increment SHALL have 3–5 measurable objectives;
b) Task pool SHOULD be prioritized (WSJF recommended);
c) Each Increment ends with Quality Sweep and Retrospective.
