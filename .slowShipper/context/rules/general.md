# General Code Rules

Universal rules that apply to any codebase regardless of language or framework. These are the baseline — add project-specific rule files (e.g. `frontend.md`, `backend.md`) for domain-specific conventions.

---

## Correctness

- Handle errors explicitly. Never swallow exceptions or ignore error returns silently.
- Prefer early returns over deeply nested conditionals.
- Avoid boolean parameters that change function behavior. Use separate functions or named options.
- Check boundary conditions: empty collections, null/undefined values, zero, negative numbers, max values.
- String comparisons that affect logic should be case-aware. Decide explicitly whether case matters.

## Security

- Never commit secrets, credentials, API keys, or tokens. Use environment variables or a secrets manager.
- Never trust user input. Validate and sanitize at the boundary, not deep in the call chain.
- Never build SQL queries or shell commands with string concatenation. Use parameterized queries and safe APIs.
- Log errors for debugging, but never log sensitive data (passwords, tokens, PII).
- Default to least privilege. Don't request permissions you don't need.

## Naming and clarity

- Names should describe what, not how. `usersByRole` over `filteredList`. `canEdit` over `isCurrentUserAuthorizedToEditThisResource`.
- Avoid abbreviations unless they're universal in the domain (`id`, `url`, `http` are fine; `usr`, `btn`, `mgr` are not).
- Boolean names should read as yes/no questions: `isVisible`, `hasPermission`, `shouldRetry`.
- Don't encode type in the name (`userArray`, `nameString`). The type system or context handles that.

## Structure

- Functions should do one thing. If you need the word "and" to describe what it does, consider splitting.
- Avoid deep nesting (3+ levels). Extract helper functions or use early returns.
- Keep files focused. A file with 5+ unrelated exports is a grab bag, not a module.
- Prefer composition over inheritance. Favor small, composable pieces over deep class hierarchies.
- Dead code should be deleted, not commented out. Version control is the archive.

## Dependencies and imports

- Pin dependency versions in lock files. Don't rely on floating ranges for production.
- Don't import a large library for one utility function. Check if the language or a lighter alternative covers it.
- Keep imports organized: external dependencies first, then internal modules, then relative paths.
- Before adding a dependency, verify the existing stack doesn't already solve the problem. Check the standard library, then already-installed packages, then consider writing it yourself.
- Check maintenance status before adopting a package: when was the last commit, how many open issues, how many maintainers? A single-maintainer package with no commits in 2 years is a liability.
- Run vulnerability audits (`npm audit`, `composer audit`, or equivalent) after adding or updating packages. Address advisories before merging.
- Prefer standard library and existing utilities over new packages. Every dependency is a trust decision and a maintenance burden.

## Testing

- Test names should describe the scenario and expected outcome, not the implementation: "returns empty list when user has no orders" over "test getOrders."
- Don't test implementation details. Test behavior and outcomes.
- Each test should be independent. No shared mutable state between tests.
- Don't ignore or skip tests without a comment explaining why and a ticket to fix.

## Comments and documentation

- Don't narrate what the code does. Comments should explain *why*, not *what*.
- Remove commented-out code. If it's needed later, git has it.
- Document non-obvious decisions, constraints, and trade-offs. "We use X instead of Y because Z" is a good comment. "Increment counter" is not.
- Public APIs should have documentation. Internal helpers usually shouldn't.

## Lessons learned

<!-- Add project-specific gotchas as you encounter them. Format: what happened, why, what to do instead. -->
