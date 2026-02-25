# Changelog

All notable changes will be documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [0.1.0] — 2026-02-26

First public release.

### Added

**Timer**
- `trk start <label>` — start a new timer block
- `trk stop` — stop and persist to log (blocks under 60s are discarded)
- `trk pause` / `trk resume` — pause and resume with elapsed time preserved
- `trk cancel` — discard the active timer without saving
- `trk status` — show current timer state and elapsed time

**Manual logging**
- `trk log add <label> <hours> [note]` — add a manual log entry
- `trk log` / `trk log --date <YYYY-MM-DD>` — view log entries for a day

**Reports**
- `trk report daily` / `weekly` / `monthly` — time report for any period
- All report commands accept `--date` to target a specific period

**Projects**
- `trk add <name>` — create a project with optional goal and priority
- `trk list` — list all projects
- `trk progress <name>` — show logged time vs goal with a progress bar

**Goals**
- `trk goal set weekly|monthly <label> --hours <n>` — set a time goal
- `trk goal list` — list all goals
- `trk goal progress` — show progress toward each goal in the current period

**Checklists**
- `trk checklist daily` / `weekly` / `monthly` — date-scoped checklists with built-in templates
- `trk checklist custom <name>` — named custom checklist

**Metrics and Trends**
- `trk metrics` — PI (Productivity Index), DR (Daily Rate), CS (Consistency Score)
- `trk trends` — 14-day sparkline with hourly breakdown table

**Export**
- `trk export` — export time logs to Markdown, JSON, or CSV
- Supports `--format`, `--from`, `--to`, and `-o` (output directory)

**Config**
- `trk config set <key> <value>` — update a config value
- `trk config list` — show all current config values
- Shorthand keys: `work-hours`, `pomodoro`, `break`, `timezone`, `date-format`, `week-starts`
- Global defaults in `config/default.yml`, user overrides in `~/.trk/config.yaml`

**Internals**
- Event-driven architecture via `@glandjs/events` — commands publish events, services subscribe
- SQLite persistence via `better-sqlite3` with raw SQL and a migration system
- Structured logging via Winston, writing to `~/.trk/trk.log`
- Full TypeScript strict mode
- Husky + commitlint (Conventional Commits) + lint-staged
- Changesets for version management and publishing
