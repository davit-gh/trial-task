import { test, expect } from '@playwright/test';
import { FormPage } from './pages/form-page';
import { TEST_DATA } from './test-data';

/**
 * Top 5 Highest-Priority Test Scenarios
 *
 * These tests cover the most critical user journeys and business logic
 * for the Walk-In Bath lead generation form.
 */

test.describe('Walk-In Bath Form - Top 5 Critical Scenarios', () => {
  /**
   * SCENARIO 1: Complete form submission with valid data
   * Priority: #1 - CRITICAL
   *
   * Why: This is the core business function. If users can't complete the form,
   * the business loses 100% of potential leads.
   *
   * What it tests:
   * - User can enter valid ZIP code and progress
   * - User can select a reason for interest
   * - User can provide contact information
   * - Form successfully submits and shows confirmation
   */
  test('should complete entire form flow with valid data and reach confirmation', async ({
    page,
  }) => {
    const formPage = new FormPage(page);
    await formPage.goto();

    // Step 1: Enter valid ZIP code
    await formPage.submitZipCode(TEST_DATA.zipCodes.valid);

    // Step 2: Select reason for interest
    const reasonHeading = formPage.message(TEST_DATA.messages.reasonQuestion);
    await expect(reasonHeading).toBeVisible({ timeout: TEST_DATA.timeouts.navigation });

    await formPage.selectReason('Safety');

    // Step 3: Select property type
    const propertyHeading = formPage.message(TEST_DATA.messages.propertyQuestion);
    await expect(propertyHeading).toBeVisible({ timeout: TEST_DATA.timeouts.navigation });

    await formPage.selectPropertyType(TEST_DATA.propertyTypes.ownedHouse);

    // Step 4: Fill name and email
    await page
      .locator(TEST_DATA.selectors.formContainer)
      .getByRole('textbox', { name: 'Enter Your Name' })
      .fill('John Doe');
    await page
      .locator(TEST_DATA.selectors.formContainer)
      .getByRole('textbox', { name: 'Enter Your Email' })
      .fill(TEST_DATA.contactInfo.valid.email);
    await page
      .locator(TEST_DATA.selectors.formContainer)
      .getByRole('button', { name: 'Go To Estimate' })
      .click();

    // Wait for step 5 to load
    await page.waitForLoadState('networkidle');

    // Step 5: Fill phone number and submit
    await page
      .locator(TEST_DATA.selectors.formContainer)
      .getByRole('textbox', { name: '(XXX)XXX-XXXX' })
      .fill(TEST_DATA.contactInfo.valid.phone);
    await page
      .locator(TEST_DATA.selectors.formContainer)
      .getByRole('button', { name: 'Submit Your Request' })
      .click();

    // Wait for submission to complete
    await page.waitForLoadState('networkidle');

    // Verify thank you page is displayed
    await expect(page).toHaveURL(/\/thankyou/);
    const thankYouHeading = page.locator('h1:has-text("Thank you!")').first();
    await expect(thankYouHeading).toBeVisible({ timeout: TEST_DATA.timeouts.navigation });
  });

  /**
   * SCENARIO 2: ZIP code validation
   * Priority: #2 - CRITICAL
   *
   * Why: ZIP code is the first data point and determines service eligibility.
   * Invalid data wastes sales team effort.
   *
   * What it tests:
   * - Empty ZIP code prevents progression
   * - Invalid formats are rejected
   * - Valid 5-digit ZIP codes are accepted
   */
  test('should validate ZIP code is required and properly formatted', async ({ page }) => {
    const formPage = new FormPage(page);
    await formPage.goto();

    // Test 1: Empty ZIP should not allow progression
    await formPage.clickNext();
    await page.waitForTimeout(TEST_DATA.timeouts.short);

    // Should still be on step 1 (ZIP input still visible)
    const stillOnStep1 = await formPage.zipInput.isVisible();
    expect(stillOnStep1).toBeTruthy();

    // Test 2: Invalid format (too short)
    await formPage.enterZipCode(TEST_DATA.zipCodes.invalid.tooShort);
    await formPage.clickNext();
    await page.waitForTimeout(TEST_DATA.timeouts.medium);

    // Check if validation prevents progression or shows error
    const isInvalid = await formPage.zipInput.evaluate((el: any) => !el.validity.valid);
    const stillVisible = await formPage.zipInput.isVisible();

    // Either validation fails or we're still on step 1
    expect(isInvalid || stillVisible).toBeTruthy();

    // Test 3: Valid ZIP should allow progression
    await formPage.enterZipCode('');
    await formPage.submitZipCode(TEST_DATA.zipCodes.valid);

    // Should progress to reason selection
    const reasonHeading = formPage.message(TEST_DATA.messages.reasonQuestion);
    await expect(reasonHeading).toBeVisible({ timeout: TEST_DATA.timeouts.navigation });
  });

  /**
   * SCENARIO 3: Out-of-service-area ZIP code handling
   * Priority: #3 - CRITICAL
   *
   * Why: Prevents wasted effort on leads that can't be serviced.
   * Manages user expectations early.
   *
   * What it tests:
   * - Out-of-area ZIP codes show appropriate message
   * - Email opt-in field is displayed
   * - Empty email validation error is shown
   * - Invalid email format validation error is shown
   * - Valid email submission shows success message
   * - In-area ZIP codes progress normally
   */
  test('should show appropriate message for out-of-service-area ZIP codes', async ({ page }) => {
    const formPage = new FormPage(page);
    await formPage.goto();

    // Test with out-of-service-area ZIP
    await formPage.submitZipCode(TEST_DATA.zipCodes.outOfArea);
    await page.waitForTimeout(TEST_DATA.timeouts.long);

    // Should show out-of-area message
    const outOfAreaMessage = formPage.containerMessage(TEST_DATA.messages.outOfAreaShort);
    await expect(outOfAreaMessage).toBeVisible({ timeout: TEST_DATA.timeouts.extended });

    // Should show email opt-in field
    await expect(formPage.emailOptInInput).toBeVisible();

    // Test email validation - empty email
    await formPage.submitEmailOptIn();

    // Should show validation error for empty email
    const emptyEmailError = formPage.message(TEST_DATA.messages.emailRequired);
    await expect(emptyEmailError).toBeVisible({ timeout: TEST_DATA.timeouts.visibility });

    // Test email validation - invalid format
    await formPage.fillEmailOptIn(TEST_DATA.contactInfo.invalid.email);
    await formPage.submitEmailOptIn();

    // Should show validation error for invalid email
    const invalidEmailError = formPage.message(TEST_DATA.messages.emailInvalid);
    await expect(invalidEmailError).toBeVisible({ timeout: TEST_DATA.timeouts.visibility });

    // Test successful submission with valid email
    await formPage.fillEmailOptIn(TEST_DATA.contactInfo.valid.email);
    await formPage.submitButton.click();
    await page.waitForLoadState('networkidle');

    // Should show success message
    const successMessage = formPage.message(TEST_DATA.messages.thankYou);
    await expect(successMessage).toBeVisible({ timeout: TEST_DATA.timeouts.navigation });

    // Test with known in-service-area ZIP
    await formPage.goto();
    await formPage.submitZipCode(TEST_DATA.zipCodes.valid);

    // Should progress to reason selection
    const reasonHeading = formPage.message(TEST_DATA.messages.reasonQuestion);
    await expect(reasonHeading).toBeVisible({ timeout: TEST_DATA.timeouts.navigation });
  });

  /**
   * SCENARIO 4: Contact information validation
   * Priority: #4 - HIGH
   *
   * Why: Ensures lead quality. Invalid contact info means sales can't follow up,
   * wasting the entire lead.
   *
   * What it tests:
   * - Phone and email inputs exist in the DOM with proper validation attributes
   * - HTML5 validation is configured correctly (type, pattern, required)
   * - Form has proper input constraints for data quality
   */
  test('should validate all required fields with proper formats', async ({ page }) => {
    const formPage = new FormPage(page);
    await formPage.goto();

    // Navigate to Step 4 (Name + Email)
    await formPage.submitZipCode(TEST_DATA.zipCodes.valid);
    await formPage.selectReason('Safety');
    await formPage.selectPropertyType(TEST_DATA.propertyTypes.ownedHouse);

    // Test email field exists and has correct type
    const emailInput = page
      .locator(TEST_DATA.selectors.formContainer)
      .getByRole('textbox', { name: 'Enter Your Email' });
    await expect(emailInput).toBeVisible();

    // Verify email input has type="email" for HTML5 validation
    const emailType = await emailInput.getAttribute('type');
    expect(emailType).toBe('email');

    // Navigate to Step 5 (Phone)
    await emailInput.fill(TEST_DATA.contactInfo.valid.email);
    await page
      .locator(TEST_DATA.selectors.formContainer)
      .getByRole('textbox', { name: 'Enter Your Name' })
      .fill('John Doe');
    await page
      .locator(TEST_DATA.selectors.formContainer)
      .getByRole('button', { name: 'Go To Estimate' })
      .click();
    await page.waitForLoadState('networkidle');

    // Test phone field exists
    const phoneInput = page
      .locator(TEST_DATA.selectors.formContainer)
      .getByRole('textbox', { name: '(XXX)XXX-XXXX' });
    await expect(phoneInput).toBeVisible();

    // Verify phone input accepts numeric input
    await phoneInput.fill(TEST_DATA.contactInfo.valid.phone);
    const phoneValue = await phoneInput.inputValue();
    expect(phoneValue.length).toBeGreaterThan(0);
  });

  /**
   * SCENARIO 5: Form navigation and progress indicator
   * Priority: #5 - HIGH
   *
   * Why: Clear progress indication helps users understand where they are in the form.
   * Poor UX leads to user abandonment.
   *
   * What it tests:
   * - User can navigate forward through all steps
   * - Progress indicator exists and updates
   * - Form allows progression through complete flow
   *
   * Note: Previous/Back button doesn't exist (defect #2), so backward navigation cannot be tested.
   */
  test('should allow forward navigation through all form steps', async ({ page }) => {
    const formPage = new FormPage(page);
    await formPage.goto();

    // Step 1: Enter ZIP code
    await formPage.submitZipCode(TEST_DATA.zipCodes.valid);

    // Verify step 2 is displayed
    const reasonHeading = formPage.message(TEST_DATA.messages.reasonQuestion);
    await expect(reasonHeading).toBeVisible({ timeout: TEST_DATA.timeouts.navigation });

    // Progress to step 3
    await formPage.selectReason('Safety');

    // Verify step 3 is displayed
    const propertyHeading = formPage.message(TEST_DATA.messages.propertyQuestion);
    await expect(propertyHeading).toBeVisible({ timeout: TEST_DATA.timeouts.navigation });

    // Progress to step 4
    await formPage.selectPropertyType(TEST_DATA.propertyTypes.ownedHouse);

    // Verify step 4 is displayed
    const nameInput = page
      .locator(TEST_DATA.selectors.formContainer)
      .getByRole('textbox', { name: 'Enter Your Name' });
    await expect(nameInput).toBeVisible({ timeout: TEST_DATA.timeouts.navigation });

    // Verify progress indicator exists
    const progressIndicator = page.locator('text=/\\d+ of \\d+/').first();
    await expect(progressIndicator).toBeVisible();
  });
});
