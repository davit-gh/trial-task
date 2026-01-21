/**
 * Centralized test data for all test scenarios
 * Single source of truth for test inputs and expected outputs
 */

export const TEST_DATA = {
  zipCodes: {
    valid: '68901',
    outOfArea: '11111',
    invalid: {
      empty: '',
      tooShort: '1234',
      tooLong: '123456',
      nonNumeric: 'ABCDE',
    },
  },

  reasons: {
    buyingNewHome: 'Buying a new home',
    remodeling: 'Remodeling',
    other: 'Other',
  },

  propertyTypes: {
    ownedHouse: 'Owned House / Condo',
    rentedHouse: 'Rented House / Condo',
    mobilePark: 'Mobile / Park Home',
  },

  contactInfo: {
    valid: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      phone: '5551234567',
    },
    invalid: {
      email: 'invalid-email',
      emailEmpty: '',
      phone: '123',
      phoneEmpty: '',
    },
  },

  urls: {
    home: '/',
    thankYou: '/thankyou',
  },

  selectors: {
    formContainer: '#form-container-1',
  },

  messages: {
    outOfArea: /sorry.*unfortunately/i,
    outOfAreaShort: /sorry/i,
    emailRequired: /enter your email address/i,
    emailInvalid: /wrong email/i,
    thankYou: /thank you for your interest/i,
    thankYouShort: /thank you/i,
    reasonQuestion: /why are you interested/i,
    propertyQuestion: /what type of property/i,
  },

  timeouts: {
    short: 500,
    medium: 1000,
    long: 2000,
    visibility: 5000,
    navigation: 10000,
    extended: 15000,
  },
} as const;
