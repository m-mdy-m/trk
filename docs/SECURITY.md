# Security

TRK runs locally. Your data stays on your machine in `~/.trk/trk.db`. We don't collect or transmit anything.

## Reporting a vulnerability

Found something that could cause harm — even in a local CLI tool? Please don't open a public issue.

Email: [bitsgenix@gmail.com](mailto:bitsgenix@gmail.com)

Include:

- What you found
- Steps to reproduce
- Potential impact

We'll respond within a few days and work on a fix before disclosing publicly.

## Scope

Things worth reporting:

- Shell injection via user input
- Path traversal in file operations
- Unsafe handling of config files

Things not in scope:

- "An attacker with full access to your machine can read your DB" — yes, that's true of everything local
