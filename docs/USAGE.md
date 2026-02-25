# TRK — Usage Reference

TRK is a local CLI time tracker. All data lives in `~/.trk/trk.db`. No accounts, no cloud.

---

## Table of Contents

- [Timer](#timer)
- [Log](#log)
- [Reports](#reports)
- [Projects](#projects)
- [Goals](#goals)
- [Checklists](#checklists)
- [Metrics and Trends](#metrics-and-trends)
- [Export](#export)
- [Config](#config)

---

## Timer

The timer tracks a single active block at a time. Starting a new timer while one is running will stop the previous one automatically.

```
trk start <label>
trk stop
trk pause
trk resume
trk cancel
trk status
```

**start** — begins a new timer block with a label.

```
trk start "API integration"
```

**stop** — stops the active timer and saves it to the log. Blocks shorter than 60 seconds are discarded.

**pause / resume** — pauses the clock while preserving elapsed time.

**cancel** — discards the current timer without saving anything.

**status** — shows what's currently running, when it started, and how long it has been running.

---

## Log

Manual log entries let you record time that was not tracked with the timer.

```
trk log
trk log --date <YYYY-MM-DD>
trk log add <label> <hours> [note]
trk log add <label> <hours> [note] --date <YYYY-MM-DD>
```

**log** — shows all entries for today (or a specific date).

```
trk log
trk log --date 2026-02-10
```

**log add** — adds a manual entry.

```
trk log add "Code review" 1.5
trk log add "Planning meeting" 0.75 "Q2 kickoff" --date 2026-02-10
```

Hours are decimals. `1.5` means 1 hour 30 minutes.

---

## Reports

```
trk report daily
trk report weekly
trk report monthly
```

Each command accepts an optional `--date` flag to target a different period.

```
trk report daily --date 2026-02-01
trk report weekly --date 2026-02-10
trk report monthly --date 2026-01-15
```

All reports show a table of entries with date, label, project, duration, and any notes, followed by a total.

---

## Projects

Projects let you group log entries and set a time goal.

```
trk add <name>
trk add <name> --goal <hours> --priority <low|medium|high>
trk list
trk progress <name>
```

```
trk add "Website Redesign" --goal 40 --priority high
trk list
trk progress "Website Redesign"
```

`progress` shows logged hours against the goal with a visual bar.

---

## Goals

Goals track a time target over a weekly or monthly period.

```
trk goal set <weekly|monthly> <label> --hours <n>
trk goal set <weekly|monthly> <label> --hours <n> --deadline <YYYY-MM-DD>
trk goal list
trk goal progress
```

```
trk goal set weekly "Deep work" --hours 20
trk goal set monthly "Side project" --hours 40 --deadline 2026-02-28
trk goal list
trk goal progress
```

`goal progress` compares logged time in the current period against each goal.

---

## Checklists

Checklists are date-scoped and auto-populated from built-in templates on first use.

```
trk checklist daily
trk checklist weekly
trk checklist monthly
trk checklist custom <name>
```

Built-in templates are seeded automatically the first time you run each command for a given day/week/month. Custom checklists start empty if the name has no template.

---

## Metrics and Trends

```
trk metrics
trk trends
```

**metrics** shows three values:

- PI (Productivity Index) — today's logged hours as a percentage of your daily target.
- DR (Daily Rate) — total hours logged today.
- CS (Consistency Score) — percentage of the last 14 days where you logged at least 1 hour.

**trends** shows a 14-day sparkline and a table of daily hours.

---

## Export

```
trk export
trk export --format <md|json|csv>
trk export --from <YYYY-MM-DD> --to <YYYY-MM-DD>
trk export --format csv -o ./reports
```

Defaults to Markdown format and the current week if no range is specified. The output file is written to the current directory unless `-o` points elsewhere.

---

## Config

```
trk config set <key> <value>
trk config list
```

Shorthand keys:

| Key | Maps to |
|---|---|
| `work-hours` | `work.daily_hours` |
| `pomodoro` | `work.pomodoro_minutes` |
| `break` | `work.break_minutes` |
| `timezone` | `work.timezone` |
| `date-format` | `display.date_format` |
| `week-starts` | `display.week_starts_on` |

```
trk config set work-hours 9
trk config set week-starts sunday
trk config list
```

Changes are saved to `~/.trk/config.yaml` and take effect immediately.