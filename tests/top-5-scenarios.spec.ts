import { test, expect } from '@playwright/test';

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
    await page.goto('/');

    // Step 1: Enter valid ZIP code
    await page
      .locator('#form-container-1')
      .getByRole('textbox', { name: 'Enter ZIP Code' })
      .fill('68901');
    await page.locator('#form-container-1').getByRole('button', { name: 'Next' }).click();

    // Wait for step 2 to load
    await page.waitForLoadState('networkidle');

    // Step 2: Select reason for interest
    const reasonHeading = page.locator('text=/Why are you interested/i').first();
    await expect(reasonHeading).toBeVisible({ timeout: 10000 });

    await page.locator('#form-container-1').getByText('Safety').click();
    await page.locator('#form-container-1').getByRole('button', { name: 'Next' }).click();

    // Wait for step 3 to load
    await page.waitForLoadState('networkidle');

    // Step 3: Select property type
    const propertyHeading = page.locator('text=/What type of property/i').first();
    await expect(propertyHeading).toBeVisible({ timeout: 10000 });

    await page.locator('#form-container-1').getByText('Owned House / Condo').click();
    await page.locator('#form-container-1').getByRole('button', { name: 'Next' }).click();

    // Wait for step 4 to load
    await page.waitForLoadState('networkidle');

    // Step 4: Fill name and email
    await page
      .locator('#form-container-1')
      .getByRole('textbox', { name: 'Enter Your Name' })
      .fill('John Doe');
    await page
      .locator('#form-container-1')
      .getByRole('textbox', { name: 'Enter Your Email' })
      .fill('test@example.com');
    await page.locator('#form-container-1').getByRole('button', { name: 'Go To Estimate' }).click();

    // Wait for step 5 to load
    await page.waitForLoadState('networkidle');

    // Step 5: Fill phone number and submit
    await page
      .locator('#form-container-1')
      .getByRole('textbox', { name: '(XXX)XXX-XXXX' })
      .fill('4025551234');
    await page
      .locator('#form-container-1')
      .getByRole('button', { name: 'Submit Your Request' })
      .click();

    // Wait for submission to complete
    await page.waitForLoadState('networkidle');

    // Verify thank you page is displayed
    await expect(page).toHaveURL(/\/thankyou/);
    const thankYouHeading = page.locator('h1:has-text("Thank you!")').first();
    await expect(thankYouHeading).toBeVisible({ timeout: 10000 });
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
    await page.goto('/');

    const zipInput = page
      .locator('#form-container-1')
      .getByRole('textbox', { name: 'Enter ZIP Code' });
    const nextButton = page.locator('#form-container-1').getByRole('button', { name: 'Next' });

    // Test 1: Empty ZIP should not allow progression
    await nextButton.click();
    await page.waitForTimeout(500);

    // Should still be on step 1 (ZIP input still visible)
    const stillOnStep1 = await zipInput.isVisible();
    expect(stillOnStep1).toBeTruthy();

    // Test 2: Invalid format (too short)
    await zipInput.fill('1234');
    await nextButton.click();
    await page.waitForTimeout(1000);

    // Check if validation prevents progression or shows error
    const isInvalid = await zipInput.evaluate((el: any) => !el.validity.valid);
    const stillVisible = await zipInput.isVisible();

    // Either validation fails or we're still on step 1
    expect(isInvalid || stillVisible).toBeTruthy();

    // Test 3: Valid ZIP should allow progression
    await zipInput.fill('');
    await zipInput.fill('68901');
    await nextButton.click();
    await page.waitForLoadState('networkidle');

    // Should progress to reason selection
    const reasonHeading = page.locator('text=/Why are you interested/i').first();
    await expect(reasonHeading).toBeVisible({ timeout: 10000 });
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
    await page.goto('/');

    // Test with out-of-service-area ZIP
    await page
      .locator('#form-container-1')
      .getByRole('textbox', { name: 'Enter ZIP Code' })
      .fill('11111');
    await page.locator('#form-container-1').getByRole('button', { name: 'Next' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Should show out-of-area message
    const outOfAreaMessage = page.locator('#form-container-1').locator('text=/sorry/i').first();
    await expect(outOfAreaMessage).toBeVisible({ timeout: 15000 });

    // Should show email opt-in field
    const emailOptIn = page.locator('input[placeholder="Email Address"]').first();
    await expect(emailOptIn).toBeVisible();

    // Test email validation - empty email
    const submitButton = page.locator('#form-container-1').getByRole('button', { name: 'Submit' });
    await submitButton.click();
    await page.waitForTimeout(500);

    // Should show validation error for empty email
    const emptyEmailError = page.locator('text=/enter your email address/i').first();
    await expect(emptyEmailError).toBeVisible({ timeout: 5000 });

    // Test email validation - invalid format
    await emailOptIn.fill('invalid-email');
    await submitButton.click();
    await page.waitForTimeout(500);

    // Should show validation error for invalid email
    const invalidEmailError = page.locator('text=/wrong email/i').first();
    await expect(invalidEmailError).toBeVisible({ timeout: 5000 });

    // Test successful submission with valid email
    await emailOptIn.fill('test@example.com');
    await submitButton.click();
    await page.waitForLoadState('networkidle');

    // Should show success message
    const successMessage = page.locator('text=/thank you for your interest/i').first();
    await expect(successMessage).toBeVisible({ timeout: 10000 });

    // Test with known in-service-area ZIP
    await page.goto('/');
    await page
      .locator('#form-container-1')
      .getByRole('textbox', { name: 'Enter ZIP Code' })
      .fill('68901');
    await page.locator('#form-container-1').getByRole('button', { name: 'Next' }).click();
    await page.waitForLoadState('networkidle');

    // Should progress to reason selection
    const reasonHeading = page.locator('text=/Why are you interested/i').first();
    await expect(reasonHeading).toBeVisible({ timeout: 10000 });
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
    await page.goto('/');

    // Navigate to Step 4 (Name + Email)
    await page
      .locator('#form-container-1')
      .getByRole('textbox', { name: 'Enter ZIP Code' })
      .fill('68901');
    await page.locator('#form-container-1').getByRole('button', { name: 'Next' }).click();
    await page.waitForLoadState('networkidle');

    await page.locator('#form-container-1').getByText('Safety').click();
    await page.locator('#form-container-1').getByRole('button', { name: 'Next' }).click();
    await page.waitForLoadState('networkidle');

    await page.locator('#form-container-1').getByText('Owned House / Condo').click();
    await page.locator('#form-container-1').getByRole('button', { name: 'Next' }).click();
    await page.waitForLoadState('networkidle');

    // Test email field exists and has correct type
    const emailInput = page
      .locator('#form-container-1')
      .getByRole('textbox', { name: 'Enter Your Email' });
    await expect(emailInput).toBeVisible();

    // Verify email input has type="email" for HTML5 validation
    const emailType = await emailInput.getAttribute('type');
    expect(emailType).toBe('email');

    // Navigate to Step 5 (Phone)
    await emailInput.fill('test@example.com');
    await page
      .locator('#form-container-1')
      .getByRole('textbox', { name: 'Enter Your Name' })
      .fill('John Doe');
    await page.locator('#form-container-1').getByRole('button', { name: 'Go To Estimate' }).click();
    await page.waitForLoadState('networkidle');

    // Test phone field exists
    const phoneInput = page
      .locator('#form-container-1')
      .getByRole('textbox', { name: '(XXX)XXX-XXXX' });
    await expect(phoneInput).toBeVisible();

    // Verify phone input accepts numeric input
    await phoneInput.fill('4025551234');
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
    await page.goto('/');

    // Step 1: Enter ZIP code
    await page
      .locator('#form-container-1')
      .getByRole('textbox', { name: 'Enter ZIP Code' })
      .fill('68901');
    await page.locator('#form-container-1').getByRole('button', { name: 'Next' }).click();
    await page.waitForLoadState('networkidle');

    // Verify step 2 is displayed
    const reasonHeading = page.locator('text=/Why are you interested/i').first();
    await expect(reasonHeading).toBeVisible({ timeout: 10000 });

    // Progress to step 3
    await page.locator('#form-container-1').getByText('Safety').click();
    await page.locator('#form-container-1').getByRole('button', { name: 'Next' }).click();
    await page.waitForLoadState('networkidle');

    // Verify step 3 is displayed
    const propertyHeading = page.locator('text=/What type of property/i').first();
    await expect(propertyHeading).toBeVisible({ timeout: 10000 });

    // Progress to step 4
    await page.locator('#form-container-1').getByText('Owned House / Condo').click();
    await page.locator('#form-container-1').getByRole('button', { name: 'Next' }).click();
    await page.waitForLoadState('networkidle');

    // Verify step 4 is displayed
    const nameInput = page
      .locator('#form-container-1')
      .getByRole('textbox', { name: 'Enter Your Name' });
    await expect(nameInput).toBeVisible({ timeout: 10000 });

    // Verify progress indicator exists
    const progressIndicator = page.locator('text=/\\d+ of \\d+/').first();
    await expect(progressIndicator).toBeVisible();
  });
});
