---
name: get-shit-done
description: A high-performance, structured workflow for software development. Orchestrates work through Discuss, Plan, Execute, and Verify phases with atomic git commits and rigorous validation.
---

# GET SHIT DONE (GSD) Workflow

## Overview

GSD is an orchestration framework designed to maximize reliability and output quality by separating work into distinct, verifiable phases.

## Phase 1: Initialize Project (`/gsd:new-project`)

When starting a new project or a major feature (milestone):

1. **Questions**: Ask the user clarifying questions until the goal is 100% understood.
2. **Research**: (Optional) Investigate the domain and tech stack.
3. **Requirements**: Define scope (v1, v2, out of scope).
4. **Roadmap**: Create or update `ROADMAP.md` with numbered phases.

**Artifacts created:** `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`.

## Phase 2: Discuss Phase (`/gsd:discuss-phase [N]`)

Before planning a specific phase:

1. **Analyze**: Identify gray areas (UI interactions, API formats, logic edge cases).
2. **Consult**: Ask the user for preferences in these areas.
3. **Capture**: Save decisions to `CONTEXT.md` for the current phase.

## Phase 3: Plan Phase (`/gsd:plan-phase [N]`)

1. **Research**: Detailed technical investigation for the phase implementation.
2. **Plan**: Create atomic, small-scale tasks.
3. **Verify**: Ensure tasks cover all requirements and context decisions.

**Artifacts created:** `PLAN.md`.

## Phase 4: Execute Phase (`/gsd:execute-phase [N]`)

1. **Run**: Implement the code as specified in the plans.
2. **Commit**: Perform atomic git commits for every completed sub-task.
3. **Verify**: Run a quick validation to ensure the code exists and basics work.

**Artifacts created:** `SUMMARY.md`.

## Phase 5: Verify Work (`/gsd:verify-work [N]`)

1. **Extract**: List testable deliverables.
2. **UAT**: Walk the user through each deliverable for confirmation.
3. **Fix**: If something fails, diagnose and create fix plans for immediate re-execution.

## Quick Mode (`/gsd:quick`)

For small bugs or minor tweaks:

1. **Plan**: Quick mental or written plan.
2. **Execute**: Implement directly with an atomic commit.
3. **Verify**: Brief check.

## Operational Rules

- **Atomic Commits**: Every meaningful unit of work MUST have its own commit.
- **Context Preservation**: Update `STATE.md` or similar to track progress between steps.
- **Zero Hallucination**: If details are missing, default to Phase 2 (Discuss).
- **XML Structure**: Use structured placeholders (like those in task.md) to manage complexity.
