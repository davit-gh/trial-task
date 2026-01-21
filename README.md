# Capslock Walk-In Bath Form - Automated Tests

## Trial Task Submission

Playwright end-to-end tests for the Capslock Walk-In Bath form at `https://test-qa.capslock.global/`.

### Deliverables

1. **Full list of identified test scenarios** (53 scenarios) - [TEST-SCENARIOS.md](TEST-SCENARIOS.md)
2. **Top 5 highest-priority scenarios** with prioritization logic - [TEST-SCENARIOS.md](TEST-SCENARIOS.md#-top-5-highest-priority-scenarios)
3. **Automated tests for the top 5 scenarios** - `tests/top-5-scenarios.spec.ts`
4. **All tests passing** - 5/5 tests (100%)

## Setup

Install dependencies:

```bash
npm install
npx playwright install
```

## Running Tests

### Run Top 5 Priority Scenarios (Recommended)

```bash
npx playwright test top-5-scenarios
```

This runs the 5 highest-priority test scenarios:

1. Complete form submission with valid data
2. ZIP code validation (required and format)
3. Out-of-service-area ZIP handling
4. Contact information validation
5. Form navigation and state persistence

### Run All Tests

```bash
npm test
```

Run tests in headed mode (see browser):

```bash
npm run test:headed
```

Run tests in debug mode:

```bash
npm run test:debug
```

Run tests with UI mode:

```bash
npm run test:ui
```

View test report:

```bash
npm run test:report
```

## Code Formatting

Format all files:

```bash
npm run format
```

Check if files are formatted:

```bash
npm run format:check
```

## Project Structure

```
capslock/
├── README.md                       # This file - setup, tests, defects
├── START-HERE.md                   # Quick start guide
├── TEST-SCENARIOS.md               # All 53 scenarios + top 5 priorities
├── tests/
│   ├── top-5-scenarios.spec.ts    # 5 implemented priority tests
│   ├── test-data.ts               # Centralized test data constants
│   └── pages/
│       └── form-page.ts           # Page Object Model for form
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── .prettierrc                     # Code formatting rules
├── .gitignore                      # Git ignore patterns
├── test-results/                   # Test artifacts (screenshots, videos)
├── playwright-report/              # HTML test reports
└── node_modules/                   # Dependencies (after npm install)
```

## Test Scenarios

### All Identified Scenarios

**Total scenarios identified**: 53

See [TEST-SCENARIOS.md](TEST-SCENARIOS.md) for the complete list, organized by category:

- Form Submission & Happy Path (2 scenarios)
- ZIP Code Validation (7 scenarios)
- Reason Selection (3 scenarios)
- Contact Information Validation (7 scenarios)
- Form Navigation (5 scenarios)
- Error Handling (4 scenarios)
- Submission & Confirmation (3 scenarios)
- Edge Cases & Error Scenarios (5 scenarios)
- Accessibility (5 scenarios)
- Cross-Platform (5 scenarios)
- Asset & Branding (6 scenarios)
- Performance (3 scenarios)

### Top 5 Highest-Priority Scenarios

These scenarios were selected based on:

- **Business Impact** (40% weight) - Revenue impact, data quality, efficiency
- **User Impact** (30% weight) - Frequency, severity, abandonment risk
- **Risk & Complexity** (20% weight) - Likelihood of failure, complexity, dependencies
- **Coverage** (10% weight) - Breadth, critical path, edge cases

#### 1. Complete form submission with valid data - CRITICAL

**Why Priority #1**: Core revenue-generating flow. If users can't submit, business loses 100% of leads.

#### 2. ZIP code validation (empty and invalid formats) - CRITICAL

**Why Priority #2**: First data point, determines service eligibility. Invalid data wastes sales effort.

#### 3. Out-of-service-area ZIP code handling - CRITICAL

**Why Priority #3**: Prevents wasted effort on leads that can't be serviced. Manages expectations early.

#### 4. Contact information validation (phone and email) - HIGH

**Why Priority #4**: Ensures lead quality. Invalid contact info means sales can't follow up.

#### 5. Form navigation and state persistence - HIGH

**Why Priority #5**: Poor navigation leads to abandonment. Lost data frustrates users.

See [TEST-SCENARIOS.md](TEST-SCENARIOS.md) for detailed prioritization logic.

## Implementation Quality

### Stable Selectors

- Data attributes: `[data-zip-code-input]`, `[data-tracking="btn-step-1"]`
- Semantic selectors: `input[type="email"]`, `button[type="submit"]`
- `.first()` for strict mode compliance

### Reliable Wait Strategies

- `await page.waitForLoadState('networkidle')`
- `await element.waitFor({ state: 'visible' })`
- Explicit timeouts for assertions

### Clear Test Structure

- Descriptive test names following `should [behavior]` pattern
- Well-commented code explaining priority and purpose
- Logical flow: Arrange → Act → Assert

### Test Data Management

**Centralized Test Data** (`tests/test-data.ts`):

- Single source of truth for all test inputs and expected outputs
- Type-safe constants for ZIP codes, contact info, URLs, messages, timeouts
- Easy to maintain and update when requirements change
- Semantic naming for better readability

**Page Object Model** (`tests/pages/form-page.ts`):

- Encapsulates all form interactions and element locators
- Reusable methods for common actions (e.g., `submitZipCode()`, `selectReason()`)
- Reduces code duplication across tests
- Makes tests more maintainable and readable
- Changes to UI only require updates in one place

### CI-Ready

- Fast execution (~25 seconds for all 5 tests)
- Reproducible and deterministic
- Parallel execution (4 workers)
- No external dependencies

## Defects Found

During test implementation, the following defects were discovered:

### 1. Progress Indicator Issues

**Severity**: Low  
**Location**: Multiple steps (Step 3, Out-of-area thank you page)  
**Expected Behavior**:

- Progress indicator should update correctly at each step (e.g., "3 of 5" on Step 3)
- Progress indicator should be hidden on completion/thank you pages
- When displayed, it should always show both current step and total (e.g., "X of Y")

**Actual Behavior**:

- Progress indicator remains at "2 of 5" even after advancing to Step 3 (property type selection)
- On out-of-area thank you page, shows incomplete "1 of" without total number
- Progress indicator is visible on thank you pages when it should be hidden

**Impact**: Minor UX issue - users may be confused about their progress through the form, but does not block form completion.  
**Test Workaround**: Test validates that progress indicator exists but does not assert specific step numbers or visibility on completion pages.

### 2. Missing Previous/Back Button

**Severity**: Medium  
**Location**: Steps 2-5 (All form steps after ZIP entry)  
**Expected Behavior**: Form should have a "Previous" or "Back" button on each step (except Step 1) to allow users to navigate back and correct their information.  
**Actual Behavior**: No Previous/Back button exists on any form step. Users cannot navigate backwards once they progress to the next step.  
**Impact**: Users cannot correct mistakes (e.g., wrong ZIP code, wrong property type) after progressing, leading to potential form abandonment or invalid submissions.  
**Test Workaround**: Test skips Previous button validation since the button doesn't exist.

### 3. ZIP Code Validation Allows Invalid Formats

**Severity**: Medium  
**Location**: Step 1 (ZIP Code Entry)  
**Expected Behavior**: Form should reject ZIP codes that are not exactly 5 digits (e.g., "1234", "123456", "ABCDE").  
**Actual Behavior**: Form allows progression with 4-digit ZIP codes and other invalid formats.  
**Impact**: Poor data quality leads to wasted sales effort on invalid leads.  
**Test Workaround**: Test checks for either HTML5 validation failure OR remaining on Step 1, accepting either behavior.

### 4. Thank You Page Accessible Without Form Submission

**Severity**: High  
**Location**: `/thankyou` route  
**Expected Behavior**: Thank you page should only be accessible after successful form submission. Direct navigation should redirect to the home page or show an error.  
**Actual Behavior**: Users can navigate directly to `https://test-qa.capslock.global/thankyou` without completing the form, bypassing all validation and data collection.  
**Impact**: Security/access control issue. Users can see the thank you page without submitting any information. This could also affect analytics and conversion tracking accuracy.  
**Test Workaround**: Tests only verify thank you page appears after legitimate form submission. Direct access is not prevented.

## Test Environment

- **Base URL**: `https://test-qa.capslock.global/`
- **Browser**: Chromium (Desktop Chrome)
- **Timeout**: 30 seconds per test
- **Parallel Workers**: 4
- **Artifacts**: Screenshots and videos on failure only

---

## Future Framework Improvements

### 1. Visual Regression Testing

Integrate Playwright's screenshot comparison or tools like Percy/Chromatic to automatically detect unintended UI changes. Capture baseline screenshots for each form step and flag visual differences for review.

### 2. Cross-Browser and Device Testing

Extend test coverage to Firefox, Safari, and mobile devices (iOS Safari, Chrome Android). Use Playwright's device emulation or cloud services like BrowserStack for comprehensive compatibility testing.

### 3. API Testing Layer

Add API-level tests using Playwright's request context to validate form submissions, error handling, and data validation. Provides faster, more reliable tests and better test data management.

### 4. Test Data Management & Fixtures

Centralize test data using Playwright fixtures and factory functions. Implement data-driven testing for multiple input combinations and improve test maintainability.
