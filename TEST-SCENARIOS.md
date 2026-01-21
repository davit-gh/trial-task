# Test Scenarios for Walk-In Bath Form

## All Identified Scenarios

### Form Submission & Happy Path

1. **Complete form submission with valid data** - User enters valid ZIP, selects reason, provides contact info, and successfully submits
2. **Form progression through all steps** - User can navigate forward through each step of the form

### ZIP Code Validation

3. **Empty ZIP code validation** - Form prevents progression without ZIP code entry
4. **Invalid ZIP format validation** - Form rejects non-5-digit ZIP codes (e.g., "1234", "123456", "ABCDE")
5. **Valid ZIP code acceptance** - Form accepts properly formatted 5-digit ZIP codes
6. **Out-of-service-area ZIP handling** - Form shows appropriate message for ZIP codes outside service area
7. **Service area boundary testing** - Form correctly identifies in-area vs out-of-area ZIP codes

### Reason Selection

8. **Reason selection required** - User must select at least one reason before proceeding
9. **Multiple reason selection** - User can select multiple reasons if allowed
10. **Reason selection persistence** - Selected reasons remain when navigating back

### Contact Information Validation

11. **Phone number required** - Form requires phone number before submission
12. **Phone number format validation** - Form validates 10-digit phone number format
13. **Invalid phone number rejection** - Form rejects invalid phone formats (e.g., "123", "abc-def-ghij")
14. **Email address required** - Form requires email address before submission
15. **Email format validation** - Form validates proper email format
16. **Invalid email rejection** - Form rejects invalid email formats (e.g., "invalid", "test@")
17. **First and last name validation** - Form validates name fields if present

### Form Navigation

18. **Next button functionality** - Next button advances to next step when current step is valid
19. **Previous button functionality** - Previous button returns to previous step
20. **Progress indicator accuracy** - Progress indicator shows current step correctly
21. **Form state persistence** - Form data persists when navigating back and forth
22. **Browser back button handling** - Form handles browser back button appropriately

### Error Handling

23. **Clear error messages** - Form displays user-friendly error messages for validation failures
24. **Error message clearing** - Error messages clear when user corrects input
25. **Multiple validation errors** - Form handles and displays multiple errors simultaneously
26. **Required field indicators** - Form clearly indicates which fields are required

### Submission & Confirmation

27. **Successful submission redirect** - Form redirects to thank you page after successful submission
28. **Thank you page content** - Thank you page displays appropriate confirmation message
29. **Duplicate submission prevention** - Form prevents duplicate submissions

### Edge Cases & Error Scenarios

30. **Network error handling** - Form handles network failures gracefully
31. **Session timeout handling** - Form handles session timeouts appropriately
32. **Special characters in inputs** - Form handles special characters in text fields
33. **Form auto-save** - Form saves progress automatically if feature exists
34. **Slow network simulation** - Form works correctly with slow network connections

### Accessibility

35. **Keyboard navigation** - Form is fully navigable using keyboard only
36. **Tab order** - Tab order follows logical flow through form
37. **Focus indicators** - Form shows clear focus indicators
38. **Screen reader compatibility** - Form works with screen readers
39. **ARIA labels** - Form has proper ARIA labels for assistive technology

### Cross-Platform

40. **Mobile viewport** - Form works correctly on mobile screen sizes
41. **Tablet viewport** - Form works correctly on tablet screen sizes
42. **Touch interactions** - Form handles touch events properly
43. **Different browsers** - Form works in Chrome, Firefox, Safari, Edge
44. **Landscape/portrait orientation** - Form adapts to orientation changes

### Asset & Branding

45. **Logo image loading** - Company logo loads successfully without 404 errors
46. **Form icons loading** - All form icons and graphics load correctly
47. **No broken images** - All images display properly (no broken image icons)
48. **CSS stylesheet loading** - Stylesheets load correctly and form is styled properly
49. **Font loading** - Custom fonts load and display correctly
50. **Asset 404 detection** - No 404 errors for any static assets (images, CSS, JS, fonts)

### Performance

51. **Page load time** - Form loads within acceptable time
52. **Interaction responsiveness** - Form responds quickly to user interactions
53. **Large data handling** - Form handles edge cases with maximum input lengths

---

## Top 5 Highest-Priority Scenarios

### 1. **Complete form submission with valid data** - CRITICAL

**Priority Rank**: #1  
**Test File**: `tests/top-5-scenarios.spec.ts`  
**Test Name**: `should complete entire form flow with valid data and reach confirmation`

**Why This is Priority #1**:

- **Business Impact**: This is the core revenue-generating flow. If users can't submit the form, the business loses 100% of potential leads.
- **User Impact**: This is the primary user journey - the entire reason the form exists.
- **Risk**: High - Multi-step forms are complex and prone to breaking during updates.
- **Coverage**: Tests the entire happy path end-to-end, validating all steps work together.

---

### 2. **ZIP code validation (empty and invalid formats)** - CRITICAL

**Priority Rank**: #2  
**Test File**: `tests/top-5-scenarios.spec.ts`  
**Test Name**: `should validate ZIP code is required and properly formatted`

**Why This is Priority #2**:

- **Business Impact**: ZIP code is the first data point and determines service area eligibility. Invalid data wastes sales team effort.
- **User Impact**: First interaction point - sets user expectations for form quality.
- **Risk**: Medium - Simple validation but critical for data quality.
- **Coverage**: Validates both required field and format validation, preventing bad data entry.

---

### 3. **Out-of-service-area ZIP code handling** - CRITICAL

**Priority Rank**: #3  
**Test File**: `tests/top-5-scenarios.spec.ts`  
**Test Name**: `should show appropriate message for out-of-service-area ZIP codes`

**Why This is Priority #3**:

- **Business Impact**: Prevents wasted effort on leads that can't be serviced. Manages user expectations early.
- **User Impact**: Saves user time by informing them upfront if service is unavailable.
- **Risk**: Medium - Requires backend integration to check service areas.
- **Coverage**: Validates business logic for geographic targeting.

---

### 4. **Contact information validation (phone and email)** - HIGH

**Priority Rank**: #4  
**Test File**: `tests/top-5-scenarios.spec.ts`  
**Test Name**: `should have proper contact information validation configured`

**Why This is Priority #4**:

- **Business Impact**: Ensures lead quality. Invalid contact info means sales can't follow up, wasting the entire lead.
- **User Impact**: Prevents user frustration from submitting invalid data.
- **Risk**: Medium - Format validation is common but critical for data quality.
- **Coverage**: Validates the most important contact fields (phone and email).

---

### 5. **Form navigation and state persistence** - HIGH

**Priority Rank**: #5  
**Test File**: `tests/top-5-scenarios.spec.ts`  
**Test Name**: `should maintain form data when navigating between steps`

**Why This is Priority #5**:

- **Business Impact**: Poor navigation leads to user abandonment. Lost form data frustrates users.
- **User Impact**: Users expect to review/edit previous steps without losing data.
- **Risk**: Medium - State management in multi-step forms is complex.
- **Coverage**: Validates UX quality and prevents user frustration that leads to abandonment.

---

## Prioritization Logic

### Criteria Used for Prioritization

1. **Business Impact** (40% weight)
2. **User Impact** (30% weight)
3. **Risk & Complexity** (20% weight)
4. **Coverage** (10% weight)

### Why These 5 Over Others?

**Chosen scenarios cover**:

- Complete happy path (end-to-end)
- Critical validation (ZIP, contact info)
- Business logic (service area)
- User experience (navigation, state)
- Data quality (format validation)
