<div align="center">

# TRK

**Minimal CLI time tracker — event-driven, zero cloud.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node ≥ 20](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)
[![Powered by @glandjs/events](https://img.shields.io/badge/powered%20by-%40glandjs%2Fevents-purple)](https://github.com/glandjs/events)

</div>

---

## Overview

TRK is a command-line time tracker built for engineers who want to **own their time data**. No subscriptions, no accounts, no telemetry. Everything lives in a single SQLite file at `~/.trk/trk.db`.

The entire application is wired together by an **event-driven architecture** using [`@glandjs/events`](https://github.com/glandjs/events). Every CLI command publishes an event; every service is a pure subscriber. No framework, no magic DI container — just a clean message bus.

## Install

```bash
git clone https://github.com/m-mdy-m/trk
cd trk
pnpm install
pnpm run build
pnpm link          # makes `trk` available globally
```

Or run directly without installing:

```bash
node dist/main.js start "My Task"
```

### Requirements

- Node.js ≥ 20
- npm or pnpm

---

## Configuration

TRK merges two YAML files at runtime:

1. `config/default.yml` — shipped defaults (do not edit)
2. `~/.trk/config.yaml` — your personal overrides

```yaml
# ~/.trk/config.yaml
work:
  daily_hours: 10
  pomodoro_minutes: 90
  break_minutes: 15

display:
  week_starts_on: "monday"
```

Changes take effect immediately on the next command run.

## Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md). Issues and PRs are welcome.

Commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) format.

---

## License

MIT — see [LICENSE](./LICENSE).

---

<div align="center">

**Powered by**

[![@glandjs/events](https://img.shields.io/badge/%40glandjs%2Fevents-event--driven%20core-purple?style=flat-square)](https://github.com/glandjs/events)
&nbsp;&nbsp;
[![PSX](https://img.shields.io/badge/PSX-project%20structure%20checker-orange?style=flat-square)](https://github.com/m-mdy-m/psx)

_[@glandjs/events](https://github.com/glandjs/events) — zero-dependency event broker used as the application's internal message bus._

_[PSX](https://github.com/m-mdy-m/psx) — project structure checker that keeps this codebase consistent._

</div>
