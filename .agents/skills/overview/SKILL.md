---
name: overview
description: "Build a working understanding of a project's current state before starting on whatever the user asks next — tech stack, architecture, current implementation, and status. Use ONLY when the user explicitly invokes this skill by name or types '/overview'; do not trigger this proactively just because someone asks a general question about the codebase."
---

This skill guides getting properly oriented in a project before doing anything else. It's an internal pass to build an accurate mental model — not a report to hand back.

The user invokes this explicitly, typically when picking up a project (their own, or one they're new to) before asking for changes, fixes, or features.

## Getting Oriented

Verify what's actually there rather than relying on the project's name, README claims, or assumptions:

- **Structure**: view the project root and a couple of levels deep. Monorepo vs. single package, where source and tests live.
- **Tech stack**: read manifests directly — `package.json` + lockfile, `pyproject.toml`/`requirements.txt`, `Cargo.toml`, `go.mod`, `Gemfile`, `pom.xml`/`build.gradle`, `Dockerfile`/`docker-compose.yml`, CI config, `tsconfig.json` — whichever exist.
- **Entry points**: locate main/bootstrap/server-startup files and skim how the pieces wire together.
- **Recent activity**: `git log --oneline -20`, `git status`/`diff`, to see what's actively being worked on.
- **Unfinished work**: TODO/FIXME/XXX comments, skipped or commented-out tests, stub functions, thin test coverage relative to source.

## What to Come Away With

- **Tech stack** — languages, frameworks, key libraries, build tooling, infra signals
- **Architecture** — high-level shape, main components, how they connect, entry points
- **Current implementation** — what's actually built and working, concretely
- **Status** — working / in progress (stubs, TODOs, half-wired) / known gaps or risks

If something can't be confidently determined, say so rather than guessing — an inaccurate mental model is worse than an incomplete one.

## Reporting Back

NEVER produce a file, artifact, or formatted report as part of this skill — the point is understanding, not a deliverable. Summarize briefly in chat, conversationally, just enough for the user to sanity-check the read, then move straight into whatever the user's actual task is.
