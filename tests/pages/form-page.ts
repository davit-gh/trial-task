import { Page, Locator } from '@playwright/test';
import { TEST_DATA } from '../test-data';

/**
 * Page Object Model for the Walk-In Bath form
 * Encapsulates all form interactions and element locators
 */
export class FormPage {
  readonly page: Page;
  private readonly container: string;

  constructor(page: Page) {
    this.page = page;
    this.container = TEST_DATA.selectors.formContainer;
  }

  // ==================== Locators ====================

  get zipInput(): Locator {
    return this.page.locator(this.container).getByRole('textbox', { name: 'Enter ZIP Code' });
  }

  get nextButton(): Locator {
    return this.page.locator(this.container).getByRole('button', { name: 'Next' });
  }

  get submitButton(): Locator {
    return this.page.locator(this.container).getByRole('button', { name: 'Submit' });
  }

  reasonOption(reason: string): Locator {
    return this.page.locator(this.container).getByText(reason, { exact: true });
  }

  propertyTypeOption(propertyType: string): Locator {
    return this.page.locator(this.container).getByText(propertyType, { exact: true });
  }

  get firstNameInput(): Locator {
    return this.page.locator('input[name="firstName"]').first();
  }

  get lastNameInput(): Locator {
    return this.page.locator('input[name="lastName"]').first();
  }

  get emailInput(): Locator {
    return this.page.locator('input[name="email"]').first();
  }

  get phoneInput(): Locator {
    return this.page.locator('input[name="phone"]').first();
  }

  get emailOptInInput(): Locator {
    return this.page.locator('input[placeholder="Email Address"]').first();
  }

  message(pattern: RegExp): Locator {
    return this.page.locator(`text=${pattern}`).first();
  }

  containerMessage(pattern: RegExp): Locator {
    return this.page.locator(this.container).locator(`text=${pattern}`).first();
  }

  // ==================== Actions ====================

  async goto(): Promise<void> {
    await this.page.goto(TEST_DATA.urls.home);
  }

  async enterZipCode(zip: string): Promise<void> {
    await this.zipInput.fill(zip);
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async submitZipCode(zip: string): Promise<void> {
    await this.enterZipCode(zip);
    await this.clickNext();
  }

  async selectReason(reason: string): Promise<void> {
    await this.reasonOption(reason).click();
    await this.clickNext();
  }

  async selectPropertyType(propertyType: string): Promise<void> {
    const option = this.propertyTypeOption(propertyType);
    await option.waitFor({ state: 'visible', timeout: TEST_DATA.timeouts.visibility });
    await option.click();
    await this.page.waitForTimeout(TEST_DATA.timeouts.short);
    await this.clickNext();
  }

  async fillContactInfo(
    firstName: string,
    lastName: string,
    email: string,
    phone: string
  ): Promise<void> {
    const firstNameInput = this.firstNameInput;
    if ((await firstNameInput.count()) > 0 && (await firstNameInput.isVisible())) {
      await firstNameInput.fill(firstName);
      await this.lastNameInput.fill(lastName);
    }

    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
  }

  async submitForm(): Promise<void> {
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async completeFullForm(
    zipCode: string,
    reason: string,
    propertyType: string,
    contactInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    }
  ): Promise<void> {
    await this.submitZipCode(zipCode);
    await this.selectReason(reason);
    await this.selectPropertyType(propertyType);
    await this.fillContactInfo(
      contactInfo.firstName,
      contactInfo.lastName,
      contactInfo.email,
      contactInfo.phone
    );
    await this.submitForm();
  }

  async fillEmailOptIn(email: string): Promise<void> {
    await this.emailOptInInput.fill(email);
  }

  async submitEmailOptIn(): Promise<void> {
    await this.submitButton.click();
    await this.page.waitForTimeout(TEST_DATA.timeouts.short);
  }
}
