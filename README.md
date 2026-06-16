# EchoEarth AI 🌍💚

Welcome to **EchoEarth AI**, an enterprise-grade gamified carbon-accounting, AI coaching, and futures-simulation application designed to model the future of our biosphere.

---

## 🚀 Key Features Modularity

EchoEarth AI is segmented into modular features to foster a highly optimized and performant user experience:
1. **Interactive Biome (Ecosystem Module)**: Visualizes a live animated forest representing the user's ongoing sustainability status and carbon score.
2. **Onboarding & Assessment Engine**: Gathers transportation, dietary, household energy, and shopping choices to compile a comprehensive, precise carbon footprint assessment.
3. **Pledged Interventions & Daily Missions**: Offers dynamic daily missions and persistent home improvements to reduce emissions over time.
4. **Interactive Future Simulator**: Lets users run scenarios to project biosphere conditions up to the year 2050 using historical environmental benchmarks.
5. **Interactive Sustainability Coach**: Context-aware AI coach delivering actionable guidance.

---

## 🏗️ Technical Architecture & Design Layouts

The project strictly follows our custom enterprise layout framework, isolating components, hooks, services, utils, types, and constants within individual feature folders to support robust SOLID properties, high test coverage, and complete decoupled isolation.

Please refer to our separate detailed architectural and strategy documents for closer inspection:
- **Architecture Blueprints**: [/ARCHITECTURE.md](/ARCHITECTURE.md)
- **Safety & Threat Mitigation**: [/SECURITY.md](/SECURITY.md)
- **Accessible Design Standards**: [/ACCESSIBILITY.md](/ACCESSIBILITY.md)
- **Quality Gates & Testing Lifecycle**: [/TESTING.md](/TESTING.md)
- **AI & Prompting Strategy**: [/PROMPT_STRATEGY.md](/PROMPT_STRATEGY.md)

---

## 🛠️ Verification & Building Checklist

To launch EchoEarth AI in a local development environment, make sure to execute the following commands corresponding to standard scripts in `package.json`:

```bash
# Install required developer packages
npm install

# Start the full-stack development proxy server (binds to port 3000)
npm run dev

# Run static and compilation checks (strict type-safety)
npm run lint

# Compile client builds and server bundles
npm run build

# Start our compiled high-performance production server
npm run start
```

---

## 🎨 Visual Identity & Theme Strategy

EchoEarth AI implements a beautifully custom, eye-safe, high-contrast dark theme centered on rich emerald accents (`emerald-500`) and structured slate/offset gray layout canvases. Our layouts utilize:
- Custom Inter (Sans) and JetBrains Mono (Technical readout) typography pairings.
- Seamless CSS outline rules in alignment with **WCAG 2.2 AA Focus indicators**.
- Flexible responsive design grids scaling from desktop layouts down to touch-friendly interfaces.
