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
| Code-navigation tools (grep, glob, ls) + read_file line ranges | `code-nav-tools` | [#1670](https://github.com/pewdiepie-archdaemon/odysseus/pull/1670) | Open, mergeable | none | Standalone version (confined to the `_resolve_tool_path` allowlist, no workspace dep). ripgrep-backed grep with Python fallback. |

All rebased on fresh upstream `main` and use the upstream PR template.

> **Two code-nav variants.** The PR (`code-nav-tools`, #1670) is standalone —
> confined to the data/tmp allowlist, no workspace/plan dependency. The fork's
> running build instead carries the **workspace-aware** variant
> (`feat/code-nav-tools`): same tools, but confined to the active workspace and
> allowed in plan mode. Once #1670 lands upstream, the fork keeps the
> workspace-aware delta as a small follow-up.

## Fork-only (not yet upstreamed)

| Feature | Branch | In main build | Depends on (for clean upstream) | Notes |
|---|---|---|---|---|
| Code-navigation tools — workspace-aware variant | `feat/code-nav-tools` | yes | `workspace-confine` (#1103) path helper, `plan-mode` (#638) read-only set | Workspace-confined + plan-mode-readonly superset of #1670. Runs in the fork build; folds into #1670 once #1103 + #638 land. |
| Git branch indicator (workspace / data dir) | `feat/git-branch-indicator` | no (WIP) | `workspace-confine` (#1103) for the workspace readout | **WIP / parked.** Shows the checked-out branch of the active workspace (else data dir); reloads on each LLM message. Silent no-op when git is unavailable. |
| Continue on round limit | (in `main`) | yes | none | "Continue" affordance when the agent hits `MAX_AGENT_ROUNDS`. Not yet split into its own branch/PR. |

## Project notes

- **No JS unit-test runner.** The repo has no `package.json` / jest / vitest /
  playwright. CI (`#1015`) runs `python -m py_compile`, `node --check`, and
  `pytest`. `tests/bombadil-spec.ts` is an external Antithesis harness, not unit
  tests. So JS-only changes are covered by `node --check` + manual/browser
  verification; Python logic gets `pytest` tests.

## Candidate next features (from the Claude Code / opencode gap analysis)

Ranked by leverage × effort. (Biggest gap — first-class code navigation — is
done: #1670.)

1. **`AGENTS.md` auto-load** — read a repo/workspace instructions file and
   prepend to the agent system prompt (what `CLAUDE.md` / `AGENTS.md` do
   upstream of us). Cheap, high value. Pairs with workspace (#1103).
2. **Edit checkpoint / undo** — snapshot files before `edit_file`/`write_file`
   per turn; expose "revert last agent change". Safety.
3. **Parallel tool execution** — independent tool calls run sequentially today;
   `asyncio.gather` the read-only ones. Latency.

Lower priority: per-action approval prompts, LSP/diagnostics loop.

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
Open PRs — all independent, merge in any order:
  github-copilot (#1480)
  edit_file (#1239)
  workspace-confine (#1103)
  ci-checks (#1015)
  plan-mode (#638)
  code-nav-tools (#1670)   ← standalone (allowlist-confined)

Fork-only deltas:
  feat/code-nav-tools (workspace-aware) ──needs──► workspace-confine (#1103) + plan-mode (#638)
  git-branch-indicator (WIP)            ──needs──► workspace-confine (#1103)
```

- All six open PRs are mutually independent and can merge in any order.
- The fork-only **workspace-aware** code-nav variant and **git-branch-indicator**
  reuse the workspace path helper (#1103); the workspace-aware code-nav also
  reuses the plan-mode read-only set (#638). Functional on the fork today
  regardless — the dependency only matters for a clean upstream cherry-pick.
