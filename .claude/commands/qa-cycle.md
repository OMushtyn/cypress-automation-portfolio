---
description: Full QA cycle for a feature — plan, approval, tests, review, investigation and defect reports
argument-hint: <feature, e.g. Registration>
---

Run the full QA cycle for the feature: $ARGUMENTS

Use the subagents in `.claude/agents/`. After each subagent, read the Handoff block at the end of its response and follow the route below. Pass each subagent the information listed in the previous Handoff (files, test case IDs, errors, screenshot paths) — subagents do not see this conversation.

## 1. Plan
- If `docs/test-plan.md` has a section for this feature with `**Status:** Approved` and test cases where Automate is Yes and Status is Missing, skip to step 2 with those IDs.
- Otherwise run `test-planner`.
  - `DRAFT_READY` → stop. Show me a short summary of the plan (number of test cases by priority, cases to automate) and ask me to review `docs/test-plan.md` and set `**Status:** Approved`. Continue only after I confirm. Never set `Approved` yourself.
  - `NEEDS_DECISION` → stop and ask me the question.

## 2. Write tests
Run `test-writer` with the approved test case IDs (Automate = Yes, Status = Missing), highest priority first.
- `DONE` → step 3.
- `NEEDS_DECISION` → stop and ask me the question.
- `FAILED` or `SITE_DEFECT_SUSPECTED` → step 4.

## 3. Review
Run `test-reviewer` with the changed files.
- `APPROVED` → step 6.
- `CHANGES_REQUESTED` → run `test-writer` with the review report, then `test-reviewer` again. At most 2 rounds; if still `CHANGES_REQUESTED`, stop and show me the remaining comments.
- If the reviewer recommends `flaky-investigator` for a test → step 4 for that test.

## 4. Investigate
Run `flaky-investigator` with the spec, test title and last error.
- `TEST_ISSUE` → run `test-writer` with the suggested fix, then step 3. At most 1 round; if the test still fails, stop and show me the findings.
- `SITE_DEFECT` → step 5.
- `ENVIRONMENT` or `NOT_REPRODUCED` → step 6, include the findings in the summary.

## 5. Report defects
Run `bug-reporter` with the runs, errors and screenshot paths.
- `REPORTED` or `UPDATED_EXISTING` → step 6.
- `NOT_A_DEFECT` or `NOT_REPRODUCED` → stop and show me both the investigation and the defect reporter's findings. Do not loop back to the investigator.

## 6. Summary
Finish with:
- Plan: feature, status, test cases automated in this cycle (IDs)
- Changed files
- Review: final status and any declined comments
- Investigations and defects: results and BUG numbers
- Next steps for me: review `git diff`, run `npm run cy:run:chrome`, update test case statuses by running `test-planner` again, commit

Rules for the whole cycle:
- Never commit or push.
- Never change `docs/test-plan.md` status to `Approved` yourself.
- If any subagent's response has no Handoff block, stop and tell me.