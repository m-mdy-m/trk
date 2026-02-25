# TRK — Installation

---

## For Users

### From npm (recommended)

```bash
npm install -g @medishn/trk
```

Or with pnpm:

```bash
pnpm add -g @medishn/trk
```

After that, `trk` is available globally.

```bash
trk --version
trk --help
```

### Run without installing

```bash
npx @medishn/trk start "My task"
```

---

## For Contributors

See [DEVELOPMENT.md](./DEVELOPMENT.md) for setup instructions.

---

## Where data is stored

Everything lives in `~/.trk/`:

```
~/.trk/
  trk.db        # SQLite database (all your time data)
  trk.log       # application log
  config.yaml   # your personal config overrides
```

To reset completely, delete `~/.trk/`. This is destructive and permanent.

---

## Requirements

- Node.js >= 20
- macOS, Linux, or Windows (WSL recommended on Windows)
