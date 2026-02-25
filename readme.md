# TRK

A minimal CLI time tracker. Start a timer, stop it, see where your time went.

```
trk start "VERO - Feature X"
trk stop
trk report weekly
```

That's the core idea. There's more if you need it.

---

## Install

```bash
git clone https://github.com/m-mdy-m/trk
cd trk
pnpm install
pnpm run build
pnpm link        # makes `trk` available globally
```

Or point your shell at `dist/main.js` directly.

## License

MIT — see [LICENSE](./LICENSE).