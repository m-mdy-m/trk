<div align="center">

# TRK

**Minimal CLI time tracker — event-driven, zero cloud.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node >=20](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)
[![Powered by @glandjs/events](https://img.shields.io/badge/powered%20by-%40glandjs%2Fevents-purple)](https://github.com/glandjs/events)

</div>

TRK is a command-line time tracker built for engineers who want to own their time data. 

The application is wired together by an event-driven architecture using [`@glandjs/events`](https://github.com/glandjs/events). Every CLI command publishes an event; every service is a pure subscriber. No framework, no DI container — just a clean message bus.

## Install

```bash
npm install -g @medishn/trk
```

Or with pnpm:

```bash
pnpm add -g @medishn/trk
```

Run without installing:

```bash
npx @medishn/trk --help
```

### Requirements

- Node.js >= 20
- macOS, Linux, or Windows (WSL recommended)

## Quick start

```bash
trk start "Working on feature X"
trk stop
trk report daily
```

Full command reference: [docs/USAGE.md](./docs/USAGE.md)

## Configuration

TRK merges two YAML files at runtime:

1. `config/default.yml` — shipped defaults, do not edit
2. `~/.trk/config.yaml` — your personal overrides

```yaml
# ~/.trk/config.yaml
work:
  daily_hours: 9
  pomodoro_minutes: 90

display:
  week_starts_on: "monday"
```

Changes take effect on the next command run.

## Development

```bash
git clone https://github.com/m-mdy-m/trk
cd trk
pnpm install
pnpm dev start "test label"
```

See [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) for architecture, how to add features, and the full development workflow.

## Contributing

See [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md). Issues and PRs are welcome.

Commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) format.

## License

MIT — see [LICENSE](./LICENSE).

<div align="center">

**Powered by**

[![@glandjs/events](https://img.shields.io/badge/%40glandjs%2Fevents-event--driven%20core-purple?style=flat-square)](https://github.com/glandjs/events)
&nbsp;&nbsp;
[![PSX](https://img.shields.io/badge/PSX-project%20structure%20checker-orange?style=flat-square)](https://github.com/m-mdy-m/psx)

</div>