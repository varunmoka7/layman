# Changelog

All notable changes to layman are listed here. Versions follow
[Semantic Versioning](https://semver.org/).

## 0.1.3 - 2026-10-03

- README: one-line pitch, who the plugin is for, and how to try the rules
  without installing.

## 0.1.2 - 2026-10-03

- Manifest keywords and marketplace tags so the plugin is easier to find.
- README rewritten around install, usage and a before/after example.
- This changelog.
- GitHub Actions runs `claude plugin validate` and `claude plugin test` on every push and pull request.

## 0.1.1 - 2026-10-02

- Added `skills/layman/SKILL.md` so the Claude apps and Cowork get the same
  plain-reply rules. The hook itself still runs only in Claude Code.

## 0.1.0 - 2026-10-02

- First release. A `prompt.submit` hook that attaches plain-reply rules when a
  short prompt asks for a plain explanation, keeps replies plain from the second
  ask in a session, and a `/layman` command to switch plain mode on or off.
