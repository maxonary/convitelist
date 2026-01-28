# Architecture Decision Records (ADR)

This directory contains Architecture Decision Records (ADRs) for the Convitelist project.

## What is an ADR?

An Architecture Decision Record (ADR) is a document that captures an important architectural decision made along with its context and consequences. ADRs help teams:

- Understand why certain technical decisions were made
- Track the evolution of the system architecture
- Onboard new team members more effectively
- Avoid revisiting already-settled decisions

## ADR Format

Each ADR follows this structure:

1. **Status** - Proposed, Accepted, Deprecated, Superseded
2. **Date** - When the decision was made
3. **Context** - The issue or situation that requires a decision
4. **Decision** - The choice that was made
5. **Consequences** - The positive, negative, and neutral outcomes

## ADR List

- [ADR 001: Frontend Build Tooling and Node.js 22 Compatibility](001-frontend-build-tooling.md)

## Creating a New ADR

When making a significant architectural decision:

1. Create a new file: `XXX-short-title.md` (where XXX is the next sequential number)
2. Follow the template structure used in existing ADRs
3. Get team review before marking status as "Accepted"
4. Update this README with a link to the new ADR

## References

- [Documenting Architecture Decisions by Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ADR GitHub Organization](https://adr.github.io/)
