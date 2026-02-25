# Changelog

All notable changes will be documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

> This project is under active development. No stable release yet.

### Added

- Timer engine: `start`, `stop`, `pause`, `resume`, `cancel`, `status`
- Manual time logging: `trk log add`
- Daily log view: `trk log`
- Reports: `daily`, `weekly`, `monthly`
- Project management: `add`, `list`, `progress`
- Goal tracking: `set`, `list`, `progress` (daily/weekly/monthly)
- Checklists: `daily`, `weekly`, `monthly`, `custom`
- Metrics: PI (Productivity Index), DR (Daily Rate), CS (Consistency Score)
- Trends: 14-day sparkline + table
- Export: Markdown, JSON, CSV
- Config management: `set`, `list`
- Global config via `config/default.yaml` + `~/.trk/config.yaml` overrides
- SQLite persistence via raw SQL with migration system
- Structured logging via Winston (debug/verbose modes)
- Full TypeScript strict mode
- Unit, integration, and e2e test suites
- Husky + commitlint + lint-staged tooling

---

[Unreleased]: https://github.com/m-mdy-m/trk/compare/HEAD
