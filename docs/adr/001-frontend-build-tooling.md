# ADR 001: Frontend Build Tooling and Node.js 22 Compatibility

**Status:** Accepted  
**Date:** 2026-01-28  
**Decision Makers:** Development Team  
**Related Issue:** [chore: Modernisierung Frontend-Build-Tooling (fs.F_OK Deprecation-Warnung)]

## Context

The frontend application currently uses Create React App (CRA) with `react-scripts` 5.0.1 as its build tooling. When building with Node.js 22, there was a reported deprecation warning:

```
(node) [DEP0176] DeprecationWarning: fs.F_OK is deprecated, use fs.constants.F_OK instead
```

This deprecation warning was introduced in Node.js 22 and typically originates from older versions of webpack or webpack plugins that use the deprecated `fs.F_OK` constant instead of `fs.constants.F_OK`.

## Investigation Findings

1. **Current Setup:**
   - React Scripts: 5.0.1 (latest stable version)
   - Webpack: 5.103.0 (automatically managed by react-scripts)
   - Node.js Support: 20.19.0 or 22.12.0+
   - Build Status: ✅ Successfully builds without deprecation warnings

2. **Root Cause Analysis:**
   - The fs.F_OK deprecation warning was a known issue in older webpack versions (< 5.90.0)
   - Webpack 5.103.0 (released January 2025) has resolved this issue
   - Current builds on Node.js 22.22.0 show no deprecation warnings

3. **Create React App Status:**
   - CRA is no longer actively maintained by the React team
   - Last stable release: 5.0.1 (March 2022)
   - Official recommendation: Migrate to modern alternatives (Vite, Next.js, Remix, etc.)

## Decision

We have decided to:

1. **Short-term (Current):**
   - Keep using `react-scripts` 5.0.1 with the current webpack version
   - Add npm `overrides` to ensure webpack stays at version 5.103.0 or later
   - This resolves the fs.F_OK deprecation warning issue
   - Continue supporting Node.js 20.x and 22.x as specified in package.json

2. **Long-term (Future Migration):**
   - Plan migration away from Create React App to a modern build tool
   - **Recommended Option: Vite**
     - Extremely fast build times (HMR in milliseconds)
     - Native ESM support
     - Smaller bundle sizes
     - Active development and community support
     - Easy migration path from CRA
   - **Alternative Options:**
     - Next.js (if SSR/SSG capabilities are needed)
     - Remix (if full-stack framework is desired)

## Rationale

### Why Not Migrate to Vite Now?

1. **Minimal Changes Principle:** The fs.F_OK warning is already resolved with current dependencies
2. **Working Solution:** The build currently works perfectly on Node 22
3. **Risk vs. Benefit:** Migration to Vite is a significant change that could introduce bugs
4. **Time Investment:** Migration should be a dedicated effort with thorough testing

### Why Vite for Future Migration?

1. **Performance:** Vite offers significantly faster development builds (10-100x faster)
2. **Modern Standards:** Built on modern web standards (ESM, native features)
3. **Community:** Large, active community with excellent ecosystem
4. **Migration Path:** Well-documented migration guides from CRA to Vite
5. **Bundle Size:** Typically produces smaller production bundles

## Implementation

### Current Changes

1. Added npm `overrides` section to package.json:
   ```json
   "overrides": {
     "webpack": ">=5.103.0 <6.0.0"
   }
   ```

2. Verified build succeeds without warnings on:
   - Node.js 20.20.0 ✅ (minimum supported: 20.19.0)
   - Node.js 22.22.0 ✅ (minimum supported: 22.12.0)

### Future Migration Checklist

When ready to migrate to Vite:

- [ ] Audit and document all current build customizations
- [ ] Review environment variables and update for Vite's `VITE_` prefix
- [ ] Update import statements for asset imports
- [ ] Migrate `public/` folder structure
- [ ] Update `index.html` to be in the root directory
- [ ] Test all features thoroughly (routing, API calls, styling, etc.)
- [ ] Update CI/CD pipelines
- [ ] Update documentation
- [ ] Performance comparison (bundle size, build time, HMR speed)

## Consequences

### Positive

- ✅ Builds work without deprecation warnings on Node.js 22
- ✅ No breaking changes to existing functionality
- ✅ Clear migration path documented for future improvements
- ✅ Minimal risk and effort for immediate issue resolution

### Negative

- ⚠️ Still using deprecated/unmaintained CRA
- ⚠️ Missing out on Vite's performance benefits
- ⚠️ Will eventually need migration effort

### Neutral

- ℹ️ Dependencies pinned to safe versions via overrides
- ℹ️ Future migration will require dedicated effort and testing

## References

- [Node.js DEP0176 Documentation](https://nodejs.org/api/deprecations.html#dep0176-fsfok)
- [Webpack 5 Migration Guide](https://webpack.js.org/migrate/5/)
- [Vite Migration from CRA Guide](https://vitejs.dev/guide/migration-from-cra)
- [React Documentation - Start a New React Project](https://react.dev/learn/start-a-new-react-project)

## Monitoring

To ensure this solution remains effective:

1. Monitor Node.js release notes for new deprecation warnings
2. Keep webpack version up-to-date within the 5.x range
3. Periodically review Vite adoption and migration feasibility
4. Track CRA alternatives and community recommendations

## Review Date

This decision should be reviewed by: **Q3 2026**

At that time, consider:
- Has Vite matured further?
- Are there breaking changes in Node.js that require action?
- Is the team ready to invest in migration?
- What is the current state of the CRA ecosystem?
