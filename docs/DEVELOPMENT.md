# TRK — Development Guide

This document covers how the codebase is structured, how to run it locally, and how to add features.

---

## Requirements

- Node.js >= 20
- pnpm

---

## Setup

```bash
git clone https://github.com/m-mdy-m/trk
cd trk
pnpm install
```

To run without building:

```bash
pnpm dev start "test"
```

To build:

```bash
pnpm build
```

The build output goes to `dist/`. The entry point is `dist/main.js`.

---

## Project Layout

```
src/
  main.ts              # bootstrap: init db, wire services, run CLI
  cli/
    index.ts           # assembles all commands into a Commander program
    commands/          # one file per command group
  core/
    database/          # SQLite init, migrations
    config/            # YAML config loader
    events/            # event type definitions + bus instance
  services/            # one service per domain, each subscribes to events
  common/              # shared base classes, constants
  utils/               # logger, date helpers, exceptions
config/
  default.yml          # shipped defaults (read-only at runtime)
```

---

## How It Works

TRK uses an event-driven architecture. The CLI never calls services directly.

1. `main.ts` initialises the database, then calls `initialServices()` which registers all service listeners on the bus.
2. Each `Command` class calls `this.bus.call(event, payload)`.
3. The matching service listener handles the event and returns a result synchronously.

This means adding a feature is always the same pattern: define the event type, emit it from a command, handle it in a service.

---

## Adding a Feature

### 1. Define the event in `src/core/events/events.ts`

```ts
export type TrkEvents = {
  // ... existing events
  "timer:tag": IOEvent<{ id: string; tag: string }, TimerBlock>;
};
```

`IOEvent<Input, Output>` — Input is the payload type, Output is the return type.

### 2. Add the command

Either extend an existing command file or create a new one in `src/cli/commands/`. All commands extend `BaseCommand`.

```ts
tagCmd.action(this.action((id: string, tag: string) => {
  const block = this.call("timer:tag", { id, tag });
  if (!block) return;
  console.log(`Tagged: ${block.label}`);
}));
```

Register the new command class in `src/cli/index.ts`.

### 3. Handle it in a service

Services extend `BaseService`. In the `init()` method, subscribe to the event:

```ts
init(): void {
  this.on("timer:tag", (p) => this.tag(p));
}

private tag(payload: { id: string; tag: string }): TimerBlock {
  // query / mutate the database, return the result
}
```

Register the new service in `src/services/initial.services.ts`.

---

## Database

All queries go through `BaseService` helpers:

- `this.query<T>(sql, params)` — returns an array of rows.
- `this.get<T>(sql, params)` — returns a single row or null.
- `this.execute(sql, params)` — runs a write statement.
- `this.transaction(fn)` — wraps a function in a SQLite transaction.

Schema is defined in `src/core/database/schema.ts`. All tables are created with `CREATE TABLE IF NOT EXISTS`, so adding a new table just means adding a block there. There is no migration versioning system yet — keep that in mind if you are changing existing columns.

---

## Config

At startup, `loadConfig()` merges `config/default.yml` (shipped) with `~/.trk/config.yaml` (user). The result is cached in memory for the process lifetime.

`setConfigValue(key, value)` writes to `~/.trk/config.yaml` and invalidates the cache.

---

## Logging

TRK uses Winston. The logger writes to `~/.trk/trk.log` at `warn` level by default.

To see debug output while developing:

```bash
TRK_LOG_LEVEL=debug TRK_VERBOSE=1 pnpm dev start "test"
```

`TRK_VERBOSE=1` additionally prints to stdout.

---

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Run from source with tsx (no build step) |
| `pnpm build` | Compile TypeScript to `dist/` |
| `pnpm typecheck` | Type-check without emitting |
| `pnpm format` | Check formatting with Prettier |
| `pnpm format:fix` | Auto-fix formatting |

---

## Commits

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/). Husky enforces this via `commit-msg`.

Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`, `revert`.

```
feat(timer): add tag support
fix(report): handle missing project name
docs: update usage reference
```

---

## Releasing

Releases are managed with [Changesets](https://github.com/changesets/changesets).

```bash
pnpm changeset        # create a changeset describing what changed
pnpm version          # bump versions based on changesets
pnpm release          # build + publish to npm
```

For pre-release tags: `pnpm release:alpha`, `pnpm release:beta`, `pnpm release:next`.