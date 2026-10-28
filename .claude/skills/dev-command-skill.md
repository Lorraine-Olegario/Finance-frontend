# /dev Command — Full Laravel Workflow

## Goal
Execute a complete development workflow automatically from a single command.

---

## Usage

```
/dev Create an endpoint to block user balance with validation and audit log
```

---

## What this command does

### 1. Implementation
- Builds the feature following Laravel best practices
- Uses proper architecture (Controller → Service → etc.)

### 2. Automatic Review
- Runs a deep code review
- Identifies issues by severity:
  - Critical
  - High
  - Medium
  - Low

### 3. Auto Fix
- Fixes all Critical and High issues automatically
- Fixes Medium issues when safe

### 4. Re-Review Loop
- Re-runs review until:
  - No Critical issues
  - No High issues

### 5. Validation
- Ensures:
  - `php artisan test` passes
  - `./vendor/bin/pint` passes
  - No debug code remains

### 6. PR Generation
- Creates PR with:
  - Title (conventional commits)
  - Description (what, why, impact, how to test)
  - Tags (feature, bug, refactor, etc.)

### 7. Review Report (if issues found)
- Generates file:

```
/review/review_YYYY-MM-DD.md
```

- Contains:
  - All issues found
  - Grouped by severity
  - Fix explanations

---

## Rules
- Do not stop until code is production-ready
- Prefer clean and maintainable solutions
- Avoid unnecessary complexity
- Do not change business logic unless required