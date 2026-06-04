# Fork status — vdmkenny/odysseus

Tracks the features carried in this fork, their upstream PRs, and how they
depend on each other. Upstream = `pewdiepie-archdaemon/odysseus`.

This `main` branch is the fork's running build: latest upstream `dev` + the
remaining open-PR branches + fork-only items, combined.

_Last updated: 2026-06-05 (rebased the build onto upstream `dev`; #1103 workspace,
#2570 system-msg-content, #2684 always-available write tools all landed upstream.
Build = dev + ask_user (#2111) + plan-mode (#638) + git-branch-indicator + agents-md
+ git-tools. Workspace-aware code-nav dropped — folded into dev via #1103.)_

## Legend
- **Open PR** — proposed upstream, awaiting review/merge.
- **Merged** — landed upstream.
- **Closed** — not accepted (superseded or rejected).
- **Fork-only** — runs in the fork, not yet proposed upstream.

---

## Open PRs (proposed upstream)

| Feature | Branch | PR | State | Depends on | Notes |
|---|---|---|---|---|---|
| GitHub Copilot provider (device-flow auth) | `feat/github-copilot` | [#1480](https://github.com/pewdiepie-archdaemon/odysseus/pull/1480) | **Merged** | Fixes [#2021](https://github.com/pewdiepie-archdaemon/odysseus/issues/2021) | Modeled on opencode. OpenAI-compatible endpoint at `api.githubcopilot.com`; device-flow OAuth, token used directly as Bearer (encrypted at rest). Verified end-to-end (device flow → chat/completions 200). Slash-setup context leak split out as #2634. |
| edit_file tool + file-change diffs | `file-write-diff` | [#1239](https://github.com/pewdiepie-archdaemon/odysseus/pull/1239) | **Merged** | Fixes [#2022](https://github.com/pewdiepie-archdaemon/odysseus/issues/2022) | Exact-string disk edit + unified diff; `write_file` shows diff too. |
| Workspace: confine agent tools to a folder | `workspace-confine` | [#1103](https://github.com/pewdiepie-archdaemon/odysseus/pull/1103) | **Merged** | issue [#2023](https://github.com/pewdiepie-archdaemon/odysseus/issues/2023) | Hard path confinement for file tools (read/write/edit_file/grep/glob/ls); bash/python `cwd`; editable directory-browser modal; cross-platform (normcase containment). Wired grep/glob/ls/edit_file into workspace confinement, so the workspace-aware code-nav variant is now upstream. |
| Always offer write_file/edit_file (not RAG-only) | `always-available-write-tools` | [#2684](https://github.com/pewdiepie-archdaemon/odysseus/pull/2684) | **Merged** | Fixes [#2683](https://github.com/pewdiepie-archdaemon/odysseus/issues/2683) | Added `write_file`/`edit_file` to `ALWAYS_AVAILABLE` next to `read_file` so an agent with disk access can always write, not just read (RAG retrieval was missing them on bare "edit X"). Admin-gated unchanged. |
| Degrade missing/None system-message content | `fix/keyerror-missing-content-system-messages` | [#2570](https://github.com/pewdiepie-archdaemon/odysseus/pull/2570) | Open (approved) | Fixes [#2350](https://github.com/pewdiepie-archdaemon/odysseus/issues/2350) | Author's PR (Gardner-Programs); reviewed. `_build_anthropic_payload` reads `m.get("content") or ""`; the wrapper paths were already fixed by #2362. Not a fork delta. |
| Plan mode for the chat agent | `plan-mode` | [#638](https://github.com/pewdiepie-archdaemon/odysseus/pull/638) | Open, mergeable | issue [#2024](https://github.com/pewdiepie-archdaemon/odysseus/issues/2024) | Read-only investigate → checklist → approve → execute. Now also: approved plan re-sent + pinned as `## ACTIVE PLAN` (survives context truncation), plan-button "Show plan" menu re-opens the dockable window, and `update_plan` tool for agent write-back (tick/revise, live). Plan mode is now hard read-only: bash/python disabled, investigation via `read_file`/`grep`/`glob`/`ls` (the #1670 tools). |
| CI workflow (syntax + tests) | `ci-checks` | [#1966](https://github.com/pewdiepie-archdaemon/odysseus/pull/1966) | Open (re-filed) | issue [#1965](https://github.com/pewdiepie-archdaemon/odysseus/issues/1965) | Re-opened after #1015 was closed for being tooling-without-an-issue; #1965 is the issue-first discussion. `.github/workflows/ci.yml`. |
| Code-navigation tools (grep, glob, ls) + read_file line ranges | `code-nav-tools` | [#1670](https://github.com/pewdiepie-archdaemon/odysseus/pull/1670) | **Merged** | Fixes [#2025](https://github.com/pewdiepie-archdaemon/odysseus/issues/2025) | Standalone version (confined to the `_resolve_tool_path` allowlist, no workspace dep). ripgrep-backed grep with Python fallback. |
| Round-limit handling — Continue at cap + configurable cap | `feat/continue-on-round-limit` | [#1999](https://github.com/pewdiepie-archdaemon/odysseus/pull/1999) | **Merged** | Fixes [#1997](https://github.com/pewdiepie-archdaemon/odysseus/issues/1997) | `rounds_exhausted` event (via for/else) → Continue pill (bottom, repeatable); admin "Max steps per message" setting (clamped 1..200). Test added; live-verified (cap hit → Continue → resume). |
| `ask_user` — agent-posed multiple-choice questions | `feat/ask-user` | [#2111](https://github.com/pewdiepie-archdaemon/odysseus/pull/2111) | Open | issue [#2110](https://github.com/pewdiepie-archdaemon/odysseus/issues/2110) | `ask_user` tool → `ask_user` SSE event, ends the turn; card with option buttons + free-text Other + dismiss ×, removed once answered. Question streamed as assistant text so it persists/replays (prevents re-ask loop). Independent (clean off upstream `main`). **Screenshots still to be dragged into the PR.** |
| Provider line in the model-info card | `feat/provider-label` | [#2185](https://github.com/pewdiepie-archdaemon/odysseus/pull/2185) | **Merged** | issue [#2184](https://github.com/pewdiepie-archdaemon/odysseus/issues/2184) | Model-info popup gains a **Provider** line from the session endpoint host (GitHub Copilot / OpenRouter / Anthropic / Local / …), distinguishing the same model name served by different routes. `providerLabel()` in `providers.js`, host-suffix anchored. Targeted `dev`. |
| Cleanup: drop unused `UPLOAD_DIR` imports | `chore/rm-unused-upload-dir-import` | [#2214](https://github.com/pewdiepie-archdaemon/odysseus/pull/2214) | Open | issue [#2213](https://github.com/pewdiepie-archdaemon/odysseus/issues/2213) | Pure upstream dead-code removal — 8 unused `from src.constants import UPLOAD_DIR` lines in `routes/document_routes.py`. One file, no behaviour change. Not a fork delta (not carried in the build). Small/focused — the rest of the unused-import findings deliberately left out. |
| Cleanup: drop unused `uuid` import | `chore/rm-unused-uuid-import` | [#2218](https://github.com/pewdiepie-archdaemon/odysseus/pull/2218) | Open | issue [#2217](https://github.com/pewdiepie-archdaemon/odysseus/issues/2217) | Pure dead-code removal — unused `import uuid` in `app.py`. One line, no behaviour change. Sibling of #2214. |
| Cleanup: dedupe `src/search` cache/content/query into shims | `chore/dedup-src-search` | [#2506](https://github.com/pewdiepie-archdaemon/odysseus/pull/2506) | **Merged** | Fixes [#2504](https://github.com/pewdiepie-archdaemon/odysseus/issues/2504) | cache/content/query → `sys.modules` aliases of `services/search/*` (matches core/providers/ranking). ~600 dup LoC removed; src-coupled tests repointed to services; redundant parity-test params dropped. analytics is #2264. |
| Cleanup: dedupe `src/search/analytics.py` into a shim | `chore/dedup-search-analytics` | [#2269](https://github.com/pewdiepie-archdaemon/odysseus/pull/2269) | **Closed (dup)** | issue [#2262](https://github.com/pewdiepie-archdaemon/odysseus/issues/2262) | Closed in favour of #2264 (NubsCarson), opened ~4 min earlier for the same issue #2262 with a cleaner module-alias approach. Issue #2262 stays; #2264 fixes it. **#2264 merged upstream (2026-06-04), #2262 closed** — the analytics shim is now upstream, so the fork no longer needs a local one. #2345 (a third dup) closed in favour of #2264. |
| Live-resume chat stream on session re-entry | `fix/2539-live-resume` | [#2561](https://github.com/pewdiepie-archdaemon/odysseus/pull/2561) | **Merged** | Fixes [#2539](https://github.com/pewdiepie-archdaemon/odysseus/issues/2539) | Frontend gap: re-entering a session while its detached run streamed showed a frozen spinner + poll + reload. New `resumeStream()` in `chat.js` consumes `/api/chat/resume/{id}` (replays buffer then live), renders tokens live, reloads on completion for canonical render; `sessions.js` `_checkServerStream` calls it with the old spinner+poll as fallback. Backend (`agent_runs.subscribe`) was already present. Verified end-to-end in Chrome (hard reload mid-stream → live tokens grew 51k→54k chars while `status=streaming`). Targets `dev`. **Screenshot to be dragged into the PR.** |

**vdmkenny is now an upstream Collaborator; PRs target `dev` (main is maintainer-curated).** All rebased on fresh upstream and use the PR template.

> **Code-nav variants resolved.** #1670 merged the standalone tools and #1103
> wired grep/glob/ls (and edit_file) into workspace confinement — so the
> workspace-aware variant is now fully upstream. The fork no longer carries a
> separate `feat/code-nav-tools` delta.

## Fork-only (not yet upstreamed)

| Feature | Branch | In main build | Depends on (for clean upstream) | Notes |
|---|---|---|---|---|
| Git branch indicator (workspace / data dir) | `feat/git-branch-indicator` | yes | `workspace-confine` (#1103, merged) for the workspace readout | Shows the checked-out branch of the active workspace (else the data dir, only when the dir itself is a repo top level — doesn't climb to a parent repo); reloads on each LLM message. Silent no-op when git is unavailable. Ready to PR (deps now upstream). |
| AGENTS.md / CLAUDE.md project instructions | `feat/agents-md` | yes | `workspace-confine` (#1103, merged) workspace note block | Reads repo-authored instructions (AGENTS.md → CLAUDE.md, workspace root only, 32 KB cap) and prepends them to the system prompt. Mirrors opencode / Claude Code. Ready to PR (deps now upstream). |
| Git + forge (gh/glab) agent tools | `feat/git-tools` | yes | `workspace-confine` (#1103, merged) + `code-nav` (#1670, merged); issue [#2053](https://github.com/pewdiepie-archdaemon/odysseus/issues/2053) | `git` (allowlisted subcommands incl. push, agent commit identity) + `forge` (auto-detects gh/glab, `pr`↔`mr` bridge) + `/git` slash + workspace git-context in the prompt. Admin-gated, workspace-required, excluded from plan mode, all binaries `shutil.which`-resolved (Windows-safe). **Now unblocked** — both deps (#1103, #1670) landed; ready to open + rebase clean onto `dev`. |

## Project notes

- **No JS unit-test runner.** The repo has no `package.json` / jest / vitest /
  playwright. CI (`#1015`) runs `python -m py_compile`, `node --check`, and
  `pytest`. `tests/bombadil-spec.ts` is an external Antithesis harness, not unit
  tests. So JS-only changes are covered by `node --check` + manual/browser
  verification; Python logic gets `pytest` tests.

## Candidate next features (from the Claude Code / opencode gap analysis)

Ranked by leverage × effort. (Code navigation #1670 and AGENTS.md auto-load are
done; AGENTS.md runs in the fork as `feat/agents-md`.)

1. **Edit checkpoint / undo** — snapshot files before `edit_file`/`write_file`
   per turn; expose "revert last agent change". Safety.
2. **Parallel tool execution** — independent tool calls run sequentially today;
   `asyncio.gather` the read-only ones. Latency.

Lower priority: per-action approval prompts, LSP/diagnostics loop.

## Merged upstream

| Feature | PR |
|---|---|
| Fix chat offset/overlap/animation when a docked modal closes | [#1158](https://github.com/pewdiepie-archdaemon/odysseus/pull/1158) |
| Accessibility: ARIA labels and toggle states | [#1010](https://github.com/pewdiepie-archdaemon/odysseus/pull/1010) |
| Cleanup: remove unused imports in calendar_routes | [#2221](https://github.com/pewdiepie-archdaemon/odysseus/pull/2221) |
| Expand `~` in read_file/write_file paths | [#781](https://github.com/pewdiepie-archdaemon/odysseus/pull/781) |
| GitHub Copilot provider | [#1480](https://github.com/pewdiepie-archdaemon/odysseus/pull/1480) |
| edit_file tool + file-change diffs | [#1239](https://github.com/pewdiepie-archdaemon/odysseus/pull/1239) |
| Code-navigation tools (grep/glob/ls) + read_file ranges | [#1670](https://github.com/pewdiepie-archdaemon/odysseus/pull/1670) |
| Round-limit Continue affordance | [#1999](https://github.com/pewdiepie-archdaemon/odysseus/pull/1999) |
| Provider line in model-info card | [#2185](https://github.com/pewdiepie-archdaemon/odysseus/pull/2185) |
| src/search cache/content/query dedupe | [#2506](https://github.com/pewdiepie-archdaemon/odysseus/pull/2506) |
| Live-resume chat stream on re-entry | [#2561](https://github.com/pewdiepie-archdaemon/odysseus/pull/2561) |
| Workspace: confine agent tools to a folder | [#1103](https://github.com/pewdiepie-archdaemon/odysseus/pull/1103) |
| Always offer write_file/edit_file | [#2684](https://github.com/pewdiepie-archdaemon/odysseus/pull/2684) |

## Closed (not accepted)

| Feature | PR | Why |
|---|---|---|
| edit_file (first attempt) | [#1171](https://github.com/pewdiepie-archdaemon/odysseus/pull/1171) | Superseded by the focused #1239. |
| Favorite models in the picker | [#597](https://github.com/pewdiepie-archdaemon/odysseus/pull/597) | Another PR implemented something similar; excluded. |
| CI workflow — first attempt | [#1015](https://github.com/pewdiepie-archdaemon/odysseus/pull/1015) | Closed for being tooling-without-an-issue. Re-filed as #1966 with issue #1965. |
| Text-only emoji streaming fix | [#1692](https://github.com/pewdiepie-archdaemon/odysseus/pull/1692) | Maintainer read it as emoji-rendering (it's a strip-mode bugfix); needs reframe + visual clip. Dropped from build; branch `fix/text-emoji-streaming` parked. |

> **Maintainer is automated + strict on CONTRIBUTING.** Tooling/CI and visual/UI
> changes are gated: open an **issue first** for tooling, and attach a
> **screenshot/clip** for anything touching `static/` (DOM). Frame fixes precisely
> to avoid policy false-positives.

---

## Dependency graph (upstreaming order)

```
Still-open PRs — independent, merge in any order:
  plan-mode (#638)
  ask_user (#2111)
  ci-checks (#1966)        ← re-filed; issue #1965
  cleanups (#2214, #2218)
  fix system-msg content (#2570, author's — approved)

Fork-only deltas — deps (#1103, #1670) now upstream, so all are clean to PR:
  feat/git-branch-indicator   ──needs──► workspace-confine (#1103, merged)
  feat/agents-md              ──needs──► workspace-confine (#1103, merged)
  feat/git-tools              ──needs──► workspace-confine (#1103) + code-nav (#1670), both merged; issue #2053
```

- The build (`main`) is now upstream `dev` + the still-open feature branches
  (plan-mode, ask_user) + the fork-only deltas (git-branch-indicator, agents-md,
  git-tools).
- The fork-only deltas reuse the workspace plumbing (#1103) and code-nav (#1670),
  both now merged — so each is ready to open as a clean PR against `dev`.
