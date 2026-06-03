# Fork status — vdmkenny/odysseus

Tracks the features carried in this fork, their upstream PRs, and how they
depend on each other. Upstream = `pewdiepie-archdaemon/odysseus`.

This `main` branch is the fork's running build: latest upstream `main` + all the
open-PR branches + fork-only items, combined.

_Last updated: 2026-06-03._

## Legend
- **Open PR** — proposed upstream, awaiting review/merge.
- **Merged** — landed upstream.
- **Closed** — not accepted (superseded or rejected).
- **Fork-only** — runs in the fork, not yet proposed upstream.

---

## Open PRs (proposed upstream)

| Feature | Branch | PR | State | Depends on | Notes |
|---|---|---|---|---|---|
| GitHub Copilot provider (device-flow auth) | `feat/github-copilot` | [#1480](https://github.com/pewdiepie-archdaemon/odysseus/pull/1480) | Open, mergeable | none | Modeled on opencode. OpenAI-compatible endpoint at `api.githubcopilot.com`; device-flow OAuth, token used directly as Bearer. |
| edit_file tool + file-change diffs | `file-write-diff` | [#1239](https://github.com/pewdiepie-archdaemon/odysseus/pull/1239) | Open, mergeable | none | Exact-string disk edit + unified diff; `write_file` shows diff too. |
| Workspace: confine agent tools to a folder | `workspace-confine` | [#1103](https://github.com/pewdiepie-archdaemon/odysseus/pull/1103) | Open, mergeable | none | Hard path confinement for file tools; bash/python `cwd`. Pairs with plan mode. |
| CI workflow (syntax + tests) | `ci-checks` | [#1015](https://github.com/pewdiepie-archdaemon/odysseus/pull/1015) | Open, **approved** | none | `.github/workflows/ci.yml`; py compile + node check + pytest. |
| Plan mode for the chat agent | `plan-mode` | [#638](https://github.com/pewdiepie-archdaemon/odysseus/pull/638) | Open, mergeable | none | Read-only investigate → checklist → approve → execute. |

All five rebased on fresh upstream `main` and use the upstream PR template.

## Fork-only (not yet upstreamed)

| Feature | Branch | In main build | Depends on (for clean upstream) | Notes |
|---|---|---|---|---|
| Code-navigation tools: `grep`, `glob`, `ls` + `read_file` line ranges | `feat/code-nav-tools` | yes | `workspace-confine` (#1103) path helper, `plan-mode` (#638) read-only set | ripgrep-backed grep with Python fallback; all confined by the read_file path policy. Ready to open as a PR; applies cleanly once #1103 + #638 land, trivial 2-line adapt otherwise. |
| Git branch indicator (workspace / data dir) | `feat/git-branch-indicator` | no (WIP) | `workspace-confine` (#1103) for the workspace readout | **WIP / parked.** Shows the checked-out branch of the active workspace (else data dir); reloads on each LLM message. Silent no-op when git is unavailable. |
| Continue on round limit | (in `main`) | yes | none | "Continue" affordance when the agent hits `MAX_AGENT_ROUNDS`. Not yet split into its own branch/PR. |

## Merged upstream

| Feature | PR |
|---|---|
| Fix chat offset/overlap/animation when a docked modal closes | [#1158](https://github.com/pewdiepie-archdaemon/odysseus/pull/1158) |
| Accessibility: ARIA labels and toggle states | [#1010](https://github.com/pewdiepie-archdaemon/odysseus/pull/1010) |
| Expand `~` in read_file/write_file paths | [#781](https://github.com/pewdiepie-archdaemon/odysseus/pull/781) |

## Closed (not accepted)

| Feature | PR | Why |
|---|---|---|
| edit_file (first attempt) | [#1171](https://github.com/pewdiepie-archdaemon/odysseus/pull/1171) | Superseded by the focused #1239. |
| Favorite models in the picker | [#597](https://github.com/pewdiepie-archdaemon/odysseus/pull/597) | Another PR implemented something similar; excluded. |

---

## Dependency graph (upstreaming order)

```
plan-mode (#638) ─────────────┐
                              ├──► code-nav-tools (feat/code-nav-tools)
workspace-confine (#1103) ────┤
                              └──► git-branch-indicator (feat/git-branch-indicator, WIP)

github-copilot (#1480)   ── independent
edit_file (#1239)        ── independent
ci-checks (#1015)        ── independent
```

- The five open PRs are mutually independent and can merge in any order.
- `code-nav-tools` and `git-branch-indicator` reuse the workspace path helper
  (#1103); `code-nav-tools` also reuses the plan-mode read-only set (#638).
  They are functional on the fork today regardless; the dependency only matters
  for a clean upstream cherry-pick.
