# Contributing to TRK

Thanks for considering contributing to TRK.

## How to contribute

### Reporting bugs

Open an issue with:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version)

### Suggesting features

Open an issue describing:
- What problem it solves
- How it should work
- Why it's useful

Keep it practical. We're building a tool, not a framework.

### Submitting code

1. Fork the repo
2. Create a branch (`git checkout -b fix-something`)
3. Make your changes
4. Write tests
5. Run `npm test` and `npm run lint`
6. Commit using semantic commits (see below)
7. Push and open a PR

### Commit format

We use semantic commits:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, etc)
- `refactor`: Code change that doesn't fix or add feature
- `test`: Adding tests
- `chore`: Tooling, dependencies, etc

Examples:
```
feat(timer): add pause/resume functionality
fix(report): calculate weekly hours correctly
docs: update installation instructions
```

### Code style

- Use TypeScript strict mode
- Follow existing patterns
- Write tests for new features
- Keep functions small and focused
- Use meaningful variable names
- Add comments only when necessary

Run `npm run lint` before committing.

### Testing

- Write unit tests for utilities and services
- Write integration tests for commands
- Keep tests simple and readable
- Don't test implementation details

### Pull requests

- Keep PRs focused on one thing
- Write a clear description
- Reference related issues
- Make sure tests pass
- Update docs if needed

### Questions?

Open an issue or email bitsgenix@gmail.com