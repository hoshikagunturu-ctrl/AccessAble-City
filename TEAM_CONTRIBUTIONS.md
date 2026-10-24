Team Contribution Workflow
Thank you for contributing to AccessAble City. This guide explains how to propose changes safely and transparently.
1. Choose a focused task
Before editing code, check the existing implementation, tests, issues, and open pull requests. Avoid duplicating work. Prefer a small change that solves one clearly described problem.

Examples of useful contributions include:
- fixing a reproducible bug;
- adding a test for behavior that is not already covered;
- improving keyboard navigation or screen-reader support;
- documenting an API behavior or setup step that is currently unclear;
- improving how missing or unverified accessibility data is communicated.
2. Use your own GitHub account
Each contributor must work under their own GitHub account. Do not share account credentials or commit work under another person's identity.
3. Create a branch
Create a separate branch from the current main branch. Use a short, descriptive name, for example:
- fix/route-error-handling
- test/route-edge-case
- docs/accessibility-data-status
- feat/keyboard-navigation
Do not make unrelated changes in the same branch.
4. Make and review the change
- Read the surrounding code before editing.
- Keep the change focused.
- Add or update tests when behavior changes.
- Do not claim that accessibility infrastructure is verified unless a reliable verification source supports that claim.
- Do not add secrets, API keys, personal data, or private credentials.
- Review the diff in GitHub before opening a pull request.
5. Commit with a clear message
Use a concise message describing the change, for example:
- fix: handle missing route endpoints
- test: cover inaccessible route edge case
- docs: clarify accessibility data limitations
Use the prefix that best describes the actual work. Do not use a test or fix prefix if the change does not do that work.
6. Open a pull request
Target main unless the repository maintainers specify another base branch. Include:
- Purpose: what problem the change addresses.
- Changes: what was modified.
- Validation: tests or checks actually run, and their results.
- Limitations: anything not tested or still uncertain.
A suggested pull request description:
Purpose: Explain the problem this change addresses.
Changes: Summarize the implementation.
Validation: List the checks actually run and their results.
Limitations: State anything that remains unverified.

7. Review and merge responsibly
A maintainer should inspect the Files changed tab, confirm the change matches its description, review automated checks, and request revisions when necessary. Merge only when the change is understood and the required checks pass. If a check fails or the behavior has not been verified, resolve that first rather than claiming success.
8. Keep accessibility claims honest
AccessAble City helps compare routes using available data. A computed route is not automatically proof that a real-world path is safe or independently verified. Clearly distinguish verified information, community reports, and unknown or incomplete data whenever the application has evidence for those categories.
9. After merging
The contributor may delete the feature branch after the pull request is merged. The merged changes remain in the target branch. Check the repository's contribution rules if you expect the work to appear on a GitHub contribution graph.
