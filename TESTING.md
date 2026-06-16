# EchoEarth AI - Automated Quality Assurance & Testing Strategy

This document describes the validation protocols, testing framework integrations, and quality gates defined for the **EchoEarth AI** platform.

---

## 1. Quality Objectives & Targets

To merit enterprise code marks, we aim for the following test execution criteria across clean builds:
- **Statement & Line Coverage**: $\ge 95\%$ across carbon calculator and recommendation helpers.
- **Fail-Fast Integrity**: Every test must represent actual verification assertions (no vacant placeholders).
- **Execution Speed**: Lightweight mocking of HTTP connection requests to keep CI runs under 2 minutes.

---

## 2. Test Suites Structure

Our testing directory is segregated into three distinct lifecycle horizons:

### A. Unit Testing (`/tests/unit`)
- **Key Modules Validated**:
  - `carbonCalculator.test.ts`: Evaluates emissions projections across varied transportation and household profiles.
  - `recommendationEngine.test.ts`: Assesses the personalized carbon mitigation steps suggested by the AI models.
  - `scoringEngine.test.ts`: Inspects environmental engagement points incrementing consistently.
- **Mocks Strategy**: Pure functions are called natively; state-impure modules utilize standard interface stubs.

### B. Integration Testing (`/tests/integration`)
- **Key Horizons Validated**:
  - `assessment-api.test.ts`, `journal-api.test.ts`, `coach-api.test.ts`
  - Ensures express API controllers validate inputs using strict standards and produce clean JSON outputs.
  - Verifies that Gemini error conditions (e.g. rate-limiting, missing key) are gracefully intercepted without general server failures.

### C. End-to-End Testing (`/tests/e2e`)
- **Framework**: Built for Chrome/Firefox/WebKit runtimes.
- **Critical Paths Tested**:
  1. Onboarding flow from fresh application entry.
  2. Dialog forms for user assessment and interactive ecosystem state change.
  3. Responsive layout viewport adaptability and keyboard focus traps.

---

## 3. Local Test Execution

To execute test suites and verify structural conformity on local developer environments:
```bash
# Run unit and integration tests
npm run test

# Run tests with active coverage reports
npm run test:coverage
```
All system tests are integrated with the automated CI workflows to prevent regress-prone code from reaching production.
