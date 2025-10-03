# Implementation Plan: Modern 3D Calculator Web App for Children

**Branch**: `001-build-modern-calculator` | **Date**: 2025-10-03 | **Spec**: [link]
**Input**: Feature specification from `/specs/001-build-modern-calculator/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
A modern 3D calculator web app targeting children aged 5-15 built with Next.js 15, Tailwind CSS, shadcn/ui, Framer Motion, and Three.js. The calculator features basic arithmetic operations, common mathematical functions, interactive 3D elements, animations, and gamification elements. The app stores recent calculations in browser storage and implements WCAG accessibility standards for children.

## Technical Context
**Language/Version**: TypeScript 5.5, JavaScript ES2023  \n**Primary Dependencies**: Next.js 15, Tailwind CSS, shadcn/ui, Framer Motion, Three.js, React 19  \n**Storage**: Browser storage (localStorage/sessionStorage) for recent calculations  \n**Testing**: Jest, React Testing Library, Playwright for end-to-end tests  \n**Target Platform**: Web browsers (mobile and desktop)  \n**Project Type**: Web application  \n**Performance Goals**: PageSpeed Insights score of 90+ for mobile and desktop, Core Web Vitals met, 3 second load time on 3G, bundle size optimization  \n**Constraints**: Accessible to children 5-15 years following WCAG, gamified elements with rewards, minimalistic UI design  \n**Scale/Scope**: Single user calculator with no backend requirements, offline-capable

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on the Web App Tools Constitution:
- User-Centric Design: Calculator interface will be intuitive, accessible and responsive for children aged 5-15
- Progressive Web App (PWA) Standards: App will work offline-first using service workers, support installation on devices, and maintain native app-like performance
- Test-First (NON-NEGOTIABLE): All components will have unit tests, integration tests for the calculation engine, and end-to-end tests for user flows
- Component-Based Architecture: Calculator will be built with reusable, modular components (display, buttons, gamification elements)
- Security-First: No sensitive user data will be stored; all data will use browser storage with appropriate security measures
- Performance Optimization: App will load under 3 seconds on 3G, bundle sizes will be minimized, and lazy loading implemented where appropriate

## Project Structure

### Documentation (this feature)
```
specs/001-build-modern-calculator/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
frontend/
├── src/
│   ├── components/
│   │   ├── calculator/
│   │   │   ├── CalculatorDisplay.tsx
│   │   │   ├── CalculatorButtons.tsx
│   │   │   └── CalculatorContainer.tsx
│   │   ├── ui/
│   │   │   └── (shadcn components)
│   │   ├── 3d/
│   │   │   ├── CalculatorScene.tsx (Three.js scene)
│   │   │   ├── InteractiveElements.tsx
│   │   │   └── AnimationWrapper.tsx (Framer Motion)
│   │   └── gamification/
│   │       ├── RewardSystem.tsx
│   │       └── PointsDisplay.tsx
│   ├── lib/
│   │   ├── calculation-engine.ts
│   │   ├── storage.ts (browser storage utilities)
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useCalculator.ts
│   │   └── useGamification.ts
│   ├── pages/
│   │   ├── index.tsx (main calculator page)
│   │   └── _app.tsx
│   └── styles/
│       └── globals.css (Tailwind)
└── public/
    └── (static assets)

tests/
├── unit/
│   ├── calculation-engine.test.ts
│   └── storage.test.ts
├── integration/
│   └── calculator-flow.test.ts
└── e2e/
    └── calculator-interactions.test.ts
```

**Structure Decision**: Web application with Next.js frontend using TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, and Three.js. The app follows a component-based architecture with reusable UI elements, 3D components, and gamification features. Project structure includes dedicated folders for components (calculator, UI, 3D, gamification), hooks, lib utilities, and tests.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh qwen`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Complex 3D implementation | Required for engaging user experience | 2D animations insufficient for gamified experience |

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*