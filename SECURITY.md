# EchoEarth AI - Security Architecture & Hardening Standards

Security is a primary pillar of **EchoEarth AI**. This document lists the core design practices, middlewares, and sanitization flows used to protect our users and infrastructure.

---

## 1. Zero Direct Client API Keys Principle

To protect sensitive API tokens (such as `GEMINI_API_KEY`), we enforce a strict separation of keys:
1. **No Client exposure**: No client-side code prefix overrides (`VITE_GEMINI_API_KEY`) are utilized within the server runtime.
2. **Proxied Communications**: The client communicates solely via validated REST endpoints `/api/*`.
3. **Lazy Initialization**: Server-side SDK connections verify variable presence prior to calling APIs, preventing startup engine failures in standard container runtimes.

---

## 2. Server Guarding & Middleware Stack

Our Express server leverages standard hardening layers to defend against typical Web Vulnerability Vectors:

- **Strict Content Security Policy (CSP)**: Curated to allow asset loading exclusively from verified domains and trusted styles.
- **Helmet Middleware**: Configured to inject defense headers (HSTS, NoSniff, XSS Protection, Frame-guarding).
- **Rate Limiting**: Throttles incoming client commands (maximum 100 queries per 15 minutes per IP address) to avert resource depletion and DOS exploits.
- **Error Sanitization**: In production modes, internal trace paths, stack traces, and database schemas are stripped from network outputs, returning a standardized client-friendly error statement.

---

## 3. Generative AI Protections

To guarantee safe and consistent output when interacting with large language models, the following defenses are implemented:

1. **Input Sanitization**: Filters user input strings for common prompt injection patterns (e.g. system instruction overrides, `"ignore previous directives"` phrases).
2. **Perfect Output Validation**: Deserializes structure objects, parsing with resilient fallback schemes to prevent bad user input from corrupting system memory.
3. **Structured Context Constraints**: Prompt templates are assembled server-side with strict parameters, reducing model hallucinatory drift.
