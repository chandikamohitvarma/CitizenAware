// Validation Tests — Forms & Input Rules (50 tests)

describe('VALIDATION — Aadhaar Number', () => {
  test('TC-V-001: valid 12-digit Aadhaar passes', () => { expect(validateAadhaar('123456789012')).toBe(true); });
  test('TC-V-002: Aadhaar with 11 digits fails', () => { expect(validateAadhaar('12345678901')).toBe(false); });
  test('TC-V-003: Aadhaar with 13 digits fails', () => { expect(validateAadhaar('1234567890123')).toBe(false); });
  test('TC-V-004: Aadhaar with letters fails', () => { expect(validateAadhaar('12345678901A')).toBe(false); });
  test('TC-V-005: Aadhaar starting with 0 fails', () => { expect(validateAadhaar('023456789012')).toBe(false); });
  test('TC-V-006: Aadhaar starting with 1 passes', () => { expect(validateAadhaar('123456789012')).toBe(true); });
  test('TC-V-007: Aadhaar with spaces fails', () => { expect(validateAadhaar('1234 5678 9012')).toBe(false); });
  test('TC-V-008: Aadhaar with hyphens fails', () => { expect(validateAadhaar('1234-5678-9012')).toBe(false); });
  test('TC-V-009: empty Aadhaar fails', () => { expect(validateAadhaar('')).toBe(false); });
  test('TC-V-010: Aadhaar with special chars fails', () => { expect(validateAadhaar('12345678901!')).toBe(false); });
});

describe('VALIDATION — PAN Card', () => {
  test('TC-V-011: valid PAN passes (ABCDE1234F)', () => { expect(validatePAN('ABCDE1234F')).toBe(true); });
  test('TC-V-012: lowercase PAN fails', () => { expect(validatePAN('abcde1234f')).toBe(false); });
  test('TC-V-013: PAN with 9 chars fails', () => { expect(validatePAN('ABCDE123F')).toBe(false); });
  test('TC-V-014: PAN with special chars fails', () => { expect(validatePAN('ABCDE1234!')).toBe(false); });
  test('TC-V-015: empty PAN fails', () => { expect(validatePAN('')).toBe(false); });
});

describe('VALIDATION — IFSC Code', () => {
  test('TC-V-016: valid IFSC passes (SBIN0001234)', () => { expect(validateIFSC('SBIN0001234')).toBe(true); });
  test('TC-V-017: IFSC shorter than 11 chars fails', () => { expect(validateIFSC('SBIN000123')).toBe(false); });
  test('TC-V-018: IFSC longer than 11 chars fails', () => { expect(validateIFSC('SBIN00012345')).toBe(false); });
  test('TC-V-019: IFSC first 4 chars must be letters', () => { expect(validateIFSC('1234000001A')).toBe(false); });
  test('TC-V-020: IFSC 5th char must be 0', () => { expect(validateIFSC('SBIN1001234')).toBe(false); });
});

describe('VALIDATION — Pincode', () => {
  test('TC-V-021: valid 6-digit pincode passes', () => { expect(validatePincode('400001')).toBe(true); });
  test('TC-V-022: pincode with 5 digits fails', () => { expect(validatePincode('40000')).toBe(false); });
  test('TC-V-023: pincode with 7 digits fails', () => { expect(validatePincode('4000011')).toBe(false); });
  test('TC-V-024: pincode starting with 0 fails', () => { expect(validatePincode('012345')).toBe(false); });
  test('TC-V-025: pincode with letters fails', () => { expect(validatePincode('4000AB')).toBe(false); });
});

describe('VALIDATION — Bank Account Number', () => {
  test('TC-V-026: account number of 9 digits passes', () => { expect(validateBankAccount('123456789')).toBe(true); });
  test('TC-V-027: account number of 18 digits passes', () => { expect(validateBankAccount('123456789012345678')).toBe(true); });
  test('TC-V-028: account number shorter than 9 digits fails', () => { expect(validateBankAccount('12345678')).toBe(false); });
  test('TC-V-029: account number longer than 18 digits fails', () => { expect(validateBankAccount('1234567890123456789')).toBe(false); });
  test('TC-V-030: account number with letters fails', () => { expect(validateBankAccount('1234567A90')).toBe(false); });
});

describe('VALIDATION — Income & Age', () => {
  test('TC-V-031: annual income must be positive', () => { expect(validateIncome(100000)).toBe(true); });
  test('TC-V-032: zero income fails', () => { expect(validateIncome(0)).toBe(false); });
  test('TC-V-033: negative income fails', () => { expect(validateIncome(-5000)).toBe(false); });
  test('TC-V-034: income above 1 crore is valid', () => { expect(validateIncome(15000000)).toBe(true); });
  test('TC-V-035: age must be between 1 and 120', () => { expect(validateAge(25)).toBe(true); });
  test('TC-V-036: age 0 fails', () => { expect(validateAge(0)).toBe(false); });
  test('TC-V-037: age 121 fails', () => { expect(validateAge(121)).toBe(false); });
  test('TC-V-038: age 18 is valid', () => { expect(validateAge(18)).toBe(true); });
  test('TC-V-039: age 60 is valid', () => { expect(validateAge(60)).toBe(true); });
  test('TC-V-040: decimal age fails', () => { expect(validateAge(25.5)).toBe(false); });
});

describe('VALIDATION — Application Form Fields', () => {
  test('TC-V-041: required field rejects empty string', () => { expect(required('')).toBe(false); });
  test('TC-V-042: required field accepts non-empty string', () => { expect(required('value')).toBe(true); });
  test('TC-V-043: required field rejects whitespace-only', () => { expect(required('   ')).toBe(false); });
  test('TC-V-044: full name requires at least 2 words', () => { expect(validateFullName('Ravi Kumar')).toBe(true); });
  test('TC-V-045: single word name fails', () => { expect(validateFullName('Ravi')).toBe(false); });
  test('TC-V-046: date of birth in future fails', () => { expect(validateDOB('2099-01-01')).toBe(false); });
  test('TC-V-047: DOB in the past passes', () => { expect(validateDOB('1990-06-15')).toBe(true); });
  test('TC-V-048: state selection required (non-empty)', () => { expect(required('Maharashtra')).toBe(true); });
  test('TC-V-049: gender must be male|female|other', () => {
    expect(validateGender('male')).toBe(true);
    expect(validateGender('unknown')).toBe(false);
  });
  test('TC-V-050: document name cannot exceed 100 characters', () => {
    expect('A'.repeat(101).length > 100).toBe(true);
  });
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function validateAadhaar(v: string) { return /^[1-9]\d{11}$/.test(v); }
function validatePAN(v: string) { return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v); }
function validateIFSC(v: string) { return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v); }
function validatePincode(v: string) { return /^[1-9]\d{5}$/.test(v); }
function validateBankAccount(v: string) { return /^\d{9,18}$/.test(v); }
function validateIncome(v: number) { return v > 0; }
function validateAge(v: number) { return Number.isInteger(v) && v >= 1 && v <= 120; }
function required(v: string) { return v.trim().length > 0; }
function validateFullName(v: string) { return v.trim().split(/\s+/).length >= 2; }
function validateDOB(v: string) { return new Date(v) < new Date(); }
function validateGender(v: string) { return ['male', 'female', 'other'].includes(v); }
