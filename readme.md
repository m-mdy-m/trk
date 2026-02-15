# TRK

A minimal time tracking and reporting tool for developers who want to focus on building, not managing.

## What it does

- Track time spent on projects
- Generate daily, weekly, and monthly reports
- Analyze productivity with simple metrics
- Keep everything local and private

## Install

```bash
npm install -g @medishn/trk
```

Or run directly:

```bash
npx @medishn/trk start "project-name"
```

## Quick start

```bash
# Start tracking
trk start "my-project"

# Stop tracking
trk stop

# View today's work
trk report daily

# See this week
trk report weekly
```

## Features

- Timer with pause/resume
- Project-based tracking
- Quality ratings (1-5)
- Daily/weekly/monthly reports
- Simple analytics (hours, trends, consistency)
- SQLite storage
- Export to markdown/JSON/CSV

## Commands

```bash
trk start <project>      # Start timer
trk stop                 # Stop and save
trk pause                # Pause timer
trk resume               # Resume timer
trk status               # Current status

trk log add <project> <hours> [description]
trk log list [--today|--week]

trk report daily         # Today's summary
trk report weekly        # This week
trk report monthly       # This month

trk export --format md   # Export as markdown
```

See [COMMANDS.md](docs/COMMANDS.md) for full list.

## Development

```bash
# Clone
git clone https://github.com/m-mdy-m/trk.git
cd trk

# Install
npm install

# Run
npm run dev

# Test
npm test

# Build
npm run build
```

## Requirements

- Node.js >= 18
- npm >= 9

## License

MIT - see [LICENSE](LICENSE)

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting PRs.

## Security

Found a security issue? Email bitsgenix@gmail.com

See [SECURITY.md](SECURITY.md) for details.

## Links

- [Issue tracker](https://github.com/m-mdy-m/trk/issues)
- [Changelog](CHANGELOG.md)
