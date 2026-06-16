# EchoEarth AI - Enterprise Software Architecture Document

This document outlines the architectural blueprints, technical standards, and framework design principles utilized throughout **EchoEarth AI**.

---

## 1. Architectural Blueprint Overview

EchoEarth AI is designed using a **decoupled, full-stack monorepo architecture** that enables strict isolation of concerns, modular maintainability, and end-to-end type safety.

### Technology Stack
- **Client Framework**: React 19 (SPA mode) powered by Vite 6.
- **Backend Runtime**: Node.js with Express v4, bundled for production using Esbuild.
- **AI Integration**: Official `@google/genai` SDK over a secured backend proxy.
- **Styling**: Tailwind CSS engine for high contrast, responsive UI paradigms.
- **Gamification & Animation**: Performant declarative layouts using `motion`.

---

## 2. Decoupled AI Pipeline (Zero Client-Side Keys Rule)

An essential architectural requirement in EchoEarth AI is that **components never call Gemini directly**. All AI inquiries proceed through structured modules:

```
[UI Layer / View Components]
           │
           ▼
 [Custom React Hook / State Store]
           │
           ▼
[Client Services API Client / Service Layer]
           │
           ▼ (HTTP Endpoint Post request with Input Validation)
[Express Server Controller Wrapper]
           │
           ▼
   [Prompt Builder / Context Assembler]
           │
           ▼
 [Backend Gemini SDK Wrapper (SDK Connection with program Retry)]
           │
           ▼
 [Structured Response Parser]
           │
           ▼
 [Strict JSON Response Validator]
           │
           ▼
     [Final View State Update]
```

### Purpose of Layers:
1. **Prompt Builder**: Ensures constraints (system directives, output constraints) are programmatically formatted, preventing prompt injection attacks.
2. **Gemini Service**: Handles connectivity, connection cooling, and rapid-failure evaluation.
3. **Parser & Validator**: Deserializes generative text to strict TypeScript structures and ensures perfect schema conformity using standard Fallbacks.

---

## 3. Directory Layout Standards

Every active business feature under `src/features/` enforces an identical architectural contract:

```
src/features/<feature-name>/
├── components/   # Pure visual custom layouts, segmented to remain under 200 lines
├── hooks/        # Reactive hooks handling localized domain state and API trigger effects
├── services/     # Pure API integration methods referencing client client configurations
├── utils/        # Extracted pure calculation logic with zero side-effects
├── constants.ts  # Hardcoded configuration flags and immutable asset references
├── types.ts      # Domain-specific TypeScript interfaces & Enums
└── index.ts      # Explicit barrel-exporter (strictly no circular inclusions)
```

This strict layout prevents monolithic file expansion, simplifies test mocking, and fosters modular feature scaling.
