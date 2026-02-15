# TRK Commands

Complete command reference for TRK.

## Timer commands

### start

Start tracking time for a project.
```bash
trk start <project-name>
```

Example:
```bash
trk start "my-app"
```

### stop

Stop the current timer and save the entry.
```bash
trk stop
```

### status

Show current timer status.
```bash
trk status
```

## Log commands

### log add

Manually add a time entry.
```bash
trk log add <project> <hours> [description]
```

Example:
```bash
trk log add "my-app" 2.5 "Fixed bug in auth"
```

### log list

List recent entries.
```bash
trk log list [options]
```

Options:
- `--today` - Show today's entries
- `--week` - Show this week's entries

## Report commands

### report daily

Generate daily report.
```bash
trk report daily [date]
```

Example:
```bash
trk report daily          # Today
trk report daily 2025-01-15
```

### report weekly

Generate weekly report.
```bash
trk report weekly [week]
```

### report monthly

Generate monthly report.
```bash
trk report monthly [month]
```

## Global options

- `--version, -v` - Show version
- `--help, -h` - Show help
- `--debug` - Enable debug mode
- `--verbose` - Enable verbose logging